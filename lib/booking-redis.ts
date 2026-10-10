import {createCipheriv,createDecipheriv,createHash,randomBytes,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {publicBookingInput,errorCode,sanitizePublicResult,type PublicBookingInput} from './booking-protocol';
import type {BookingJob} from './booking-broker';

const key=(secret:string)=>createHash('sha256').update('mindcare-relay-encryption-v1\0'+secret).digest();
export function sealRelay(secret:string,data:unknown,context='unit-test'):string {
 const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(secret),iv);
 cipher.setAAD(Buffer.from(context,'utf8'));
 const ciphertext=Buffer.concat([cipher.update(JSON.stringify(data),'utf8'),cipher.final()]);
 return [iv,cipher.getAuthTag(),ciphertext].map(part=>part.toString('hex')).join('.');
}
export function openRelay(secret:string,sealed:string,context='unit-test'):unknown {
 const parts=sealed.split('.');
 if(parts.length!==3||!/^[a-f0-9]{24}$/.test(parts[0]!)||!/^[a-f0-9]{32}$/.test(parts[1]!)||!/^([a-f0-9]{2})+$/.test(parts[2]!)||parts[2]!.length>131072)throw new Error('UNAVAILABLE');
 const decipher=createDecipheriv('aes-256-gcm',key(secret),Buffer.from(parts[0]!,'hex'));decipher.setAuthTag(Buffer.from(parts[1]!,'hex'));
 decipher.setAAD(Buffer.from(context,'utf8'));
 return JSON.parse(Buffer.concat([decipher.update(Buffer.from(parts[2]!,'hex')),decipher.final()]).toString('utf8'));
}
const jobSchema=z.object({id:z.uuid(),expiresAt:z.iso.datetime(),operation:publicBookingInput}).strict();
const replySchema=z.discriminatedUnion('ok',[z.object({ok:z.literal(true),data:z.unknown()}).strict(),z.object({ok:z.literal(false),error:errorCode}).strict()]);
const enqueue=`
if redis.call('EXISTS',KEYS[1])==0 then return -1 end
redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',ARGV[1])
redis.call('ZREMRANGEBYSCORE',KEYS[3],'-inf',ARGV[1])
if redis.call('ZCARD',KEYS[2])>=64 then return -2 end
redis.call('SET',KEYS[4],ARGV[4],'PX',ARGV[3])
redis.call('ZADD',KEYS[2],ARGV[2],ARGV[5]);redis.call('PEXPIRE',KEYS[2],50000)
redis.call('ZADD',KEYS[3],ARGV[2],ARGV[5]);redis.call('PEXPIRE',KEYS[3],50000)
return 1`;
const poll=`
redis.call('SET',KEYS[1],'1','PX',45000)
redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',ARGV[1])
local item=redis.call('ZPOPMIN',KEYS[2])
if #item==0 then return false end
local value=redis.call('GET',ARGV[2]..'job:'..item[1])
if not value then return false end
local ttl=tonumber(item[2])-tonumber(ARGV[1])
if ttl<=0 then return false end
redis.call('SET',ARGV[2]..'sent:'..item[1],'1','PX',ttl)
return {item[1],value}`;
const complete=`
local ttl=redis.call('PTTL',KEYS[1])
if ttl<=0 or redis.call('EXISTS',KEYS[2])==0 then return 0 end
if not redis.call('SET',KEYS[3],ARGV[1],'PX',ttl,'NX') then return 0 end
redis.call('DEL',KEYS[1],KEYS[2]);redis.call('ZREM',KEYS[4],ARGV[2])
return 1`;
/** Shared temporary transport; the clinic database alone determines booking status. */
export class RedisRelay {
 private readonly prefix:string;
 constructor(private readonly options:{url:string;token:string;secret:string;timeoutMs?:number}){
  const url=new URL(options.url);
  if(url.protocol!=='https:'||url.origin!==options.url||url.username||url.password||!url.hostname.endsWith('.upstash.io')||!options.token||options.secret.length<32)throw new Error('UNAVAILABLE');
  this.prefix='mc:relay:v1:'+createHash('sha256').update(options.secret).digest('hex').slice(0,32)+':';
 }
 async command(command:readonly (string|number)[]):Promise<unknown>{
  const response=await fetch(this.options.url,{method:'POST',headers:{Authorization:'Bearer '+this.options.token,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(2000)});
  if(!response.ok||!response.body)throw new Error('UNAVAILABLE');
  const reader=response.body.getReader(),parts:Uint8Array[]=[];let length=0;
  while(true){const part=await reader.read();if(part.done)break;length+=part.value.length;if(length>160*1024){await reader.cancel();throw new Error('UNAVAILABLE');}parts.push(part.value);}
  const body=z.object({result:z.unknown().optional(),error:z.string().optional()}).parse(JSON.parse(Buffer.concat(parts).toString('utf8')));
  if(body.error)throw new Error('UNAVAILABLE');return body.result;
 }
 async nonce(value:string):Promise<boolean>{return await this.command(['SET',this.prefix+'nonce:'+value,'1','PX',30000,'NX'])==='OK';}
 async limited(value:string,max:number):Promise<void>{
  const count=await this.command(['EVAL',"local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('PEXPIRE',KEYS[1],60000) end;return n",1,this.prefix+'rate:'+value]);
  if(typeof count!=='number'||count>max)throw new Error('CAPACITY');
 }
 async request(operation:PublicBookingInput):Promise<unknown>{
  const input=publicBookingInput.parse(operation),now=Date.now(),timeout=this.options.timeoutMs??45000,id=randomUUID();
  const job:BookingJob={id,expiresAt:new Date(now+timeout).toISOString(),operation:input};
  const accepted=await this.command(['EVAL',enqueue,4,this.prefix+'heartbeat',this.prefix+'active',this.prefix+'waiting',this.prefix+'job:'+id,now,now+timeout,timeout,sealRelay(this.options.secret,job,'job:'+id),id]);
  if(accepted===-2)throw new Error('CAPACITY');if(accepted!==1)throw new Error('UNAVAILABLE');
  while(Date.now()<now+timeout){
   const sealed=await this.command(['GET',this.prefix+'reply:'+id]);
   if(typeof sealed==='string'){
    const reply=replySchema.parse(openRelay(this.options.secret,sealed,'reply:'+id));
    if(!reply.ok)throw new Error(reply.error);return sanitizePublicResult(input,reply.data);
   }
   await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error('UNAVAILABLE');
 }
 async poll():Promise<BookingJob[]>{
  const item=await this.command(['EVAL',poll,2,this.prefix+'heartbeat',this.prefix+'waiting',Date.now(),this.prefix]);
  if(item===null||item===false)return [];
  const [id,sealed]=z.tuple([z.uuid(),z.string()]).parse(item);
  const job=jobSchema.parse(openRelay(this.options.secret,sealed,'job:'+id));
  if(job.id!==id)throw new Error('UNAVAILABLE');
  // Local ingest retains its existing short deadline, independently of cloud waiting.
  job.expiresAt=new Date(Math.min(new Date(job.expiresAt).getTime(),Date.now()+8000)).toISOString();
  return [job];
 }
 async complete(id:string,result:{ok:boolean;data?:unknown;error?:unknown}):Promise<boolean>{
  z.uuid().parse(id);
  const sealed=await this.command(['GET',this.prefix+'job:'+id]);if(typeof sealed!=='string')return false;
  const job=jobSchema.parse(openRelay(this.options.secret,sealed,'job:'+id));
  if(job.id!==id)throw new Error('UNAVAILABLE');
  const reply=result.ok?{ok:true,data:sanitizePublicResult(job.operation,result.data)}:{ok:false,error:errorCode.parse(result.error)};
  return await this.command(['EVAL',complete,4,this.prefix+'job:'+id,this.prefix+'sent:'+id,this.prefix+'reply:'+id,this.prefix+'active',sealRelay(this.options.secret,reply,'reply:'+id),id])===1;
 }
}
