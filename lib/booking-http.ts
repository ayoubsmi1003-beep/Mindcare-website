import {z} from 'zod';
import {createHash} from 'node:crypto';
import {BookingBroker} from './booking-broker';
import {RedisRelay} from './booking-redis';
import {verifyBridge} from './clinic-bridge-auth';
import {publicBookingInput,errorCode} from './booking-protocol';

declare global {var clinicBookingBroker:BookingBroker|undefined;var clinicBookingRedis:RedisRelay|undefined;var clinicBookingNonces:Map<string,number>|undefined;var clinicBookingLimits:Map<string,{count:number;until:number}>|undefined;}
function settings(){
  const cloud=process.env.MINDCARE_BOOKING_HOSTING_MODE==='vercel';
  const origin=process.env.MINDCARE_PUBLIC_ORIGIN??(cloud&&process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:undefined),secret=process.env.MINDCARE_CLINIC_BRIDGE_SECRET;
  if((cloud?process.env.MINDCARE_CLOUD_RELAY_APPROVED!=='1':process.env.MINDCARE_EDGE_RESIDENCY_APPROVED!=='1')||process.env.VERCEL==='1'&&!cloud||!origin||!secret||secret.length<32) throw new Error('UNAVAILABLE');
  const url=new URL(origin);
  if(url.origin!==origin||url.protocol!=='https:'&&!(process.env.NODE_ENV!=='production'&&['localhost','127.0.0.1'].includes(url.hostname)&&url.protocol==='http:')) throw new Error('UNAVAILABLE');
  return {origin,secret,cloud};
}
function broker(){const config=settings();return config.cloud?(globalThis.clinicBookingRedis??=new RedisRelay({url:process.env.KV_REST_API_URL??process.env.UPSTASH_REDIS_REST_URL??'',token:process.env.KV_REST_API_TOKEN??process.env.UPSTASH_REDIS_REST_TOKEN??'',secret:config.secret})):(globalThis.clinicBookingBroker??=new BookingBroker());}
function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});}
export async function boundedBody(request:Request,max=4096):Promise<string>{
  if(!request.body) throw new Error('INVALID_INPUT');
  const reader=request.body.getReader();let size=0;const pieces:Uint8Array[]=[];
  while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>max){await reader.cancel();throw new Error('INVALID_INPUT');}pieces.push(part.value);}
  return Buffer.concat(pieces).toString('utf8');
}
async function limited(key:string,max:number){
  const relay=broker();if(relay instanceof RedisRelay)return relay.limited(key,max);
  const entries=globalThis.clinicBookingLimits??=new Map(),now=Date.now();
  for(const [id,row] of entries)if(row.until<now)entries.delete(id);
  const row=entries.get(key)??{count:0,until:now+60_000};
  if(entries.size>=2048&&!entries.has(key)||++row.count>max)throw new Error('CAPACITY');entries.set(key,row);
}
export async function handlePublicBooking(request:Request,chatOnly=false):Promise<Response>{
  try{
    const config=settings();
    if(request.headers.get('origin')!==config.origin||request.headers.get('host')!==new URL(config.origin).host) return json({error:'INVALID_INPUT'},403);
    if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'INVALID_INPUT'},415);
    await limited('public-total',120);
    if(config.cloud){const ip=request.headers.get('x-vercel-forwarded-for');if(!ip)return json({error:'UNAVAILABLE'},503);await limited('ip:'+createHash('sha256').update(ip).digest('hex'),30);}
    if(!config.cloud&&process.env.MINDCARE_TRUST_EDGE_PROXY==='1'){const ip=request.headers.get('x-clinic-client-ip');if(!ip)return json({error:'UNAVAILABLE'},503);await limited('ip:'+createHash('sha256').update(ip).digest('hex'),30);}
    const parsed=publicBookingInput.safeParse(JSON.parse(await boundedBody(request)));
    if(!parsed.success||chatOnly&&parsed.data.op!=='chat'||!chatOnly&&parsed.data.op==='chat')return json({error:'INVALID_INPUT'},422);
    if(parsed.data.op==='submit'||parsed.data.op==='chat')await limited('op:'+parsed.data.op,20);
    const data=await broker().request(parsed.data);
    return json({data});
  }catch(error){const code=error instanceof Error?errorCode.safeParse(error.message):null;return json({error:code?.success?code.data:'UNAVAILABLE'},code?.success&&code.data==='CAPACITY'?429:503);}
}
const bridgeInput=z.discriminatedUnion('op',[
  z.object({op:z.literal('poll')}).strict(),
  z.object({op:z.literal('result'),id:z.uuid(),result:z.object({ok:z.boolean(),data:z.unknown().optional(),error:errorCode.optional()}).strict()}).strict(),
]);
export async function handleClinicBridge(request:Request):Promise<Response>{
  try{
    const config=settings(),body=await boundedBody(request,64*1024);
    const nonceStore=config.cloud?new Map<string,number>():(globalThis.clinicBookingNonces??=new Map());
    const headers=Object.fromEntries(request.headers.entries());
    if(!verifyBridge(config.secret,body,headers,nonceStore))return json({error:'UNAVAILABLE'},401);
    const relay=broker();
    if(relay instanceof RedisRelay&&!await relay.nonce(headers['x-clinic-nonce']!))return json({error:'UNAVAILABLE'},401);
    await limited('bridge',360);
    const input=bridgeInput.parse(JSON.parse(body));
    return input.op==='poll'?json({jobs:await relay.poll()}):json({accepted:await relay.complete(input.id,input.result)});
  }catch{return json({error:'UNAVAILABLE'},503);}
}
