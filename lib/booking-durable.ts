import {createHash,randomBytes} from 'node:crypto';
import {z} from 'zod';
import {preferenceBookingInput,preferenceReceiptSchema,errorCode,type PreferenceBookingInput,type PreferenceReceipt} from './booking-protocol';
import type {BookingJob} from './booking-broker';
type Command=(args:readonly (string|number)[])=>Promise<unknown>;
type Codec=(data:unknown,context:string)=>string;
const retention=72*3600_000,receiptRetention=30*86400_000;
const metadata=z.object({id:z.uuid(),tokenHash:z.string(),payloadHash:z.string(),acceptedAt:z.number(),expiresAt:z.number(),receiptUntil:z.number(),state:z.enum(['QUEUED','LEASED','RECEIVED','FAILED','EXPIRED','WITHDRAWN']),attempts:z.number(),leaseToken:z.string().optional(),leaseUntil:z.number().optional(),failure:errorCode.optional()}).strict();
type Metadata=z.infer<typeof metadata>;
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
// Indexes hold opaque UUIDs only. Payloads are encrypted; receipt metadata expires absolutely.
const prelude=`
local now=tonumber(ARGV[1]);local prefix=ARGV[2]
local function save(m) redis.call('SET',prefix..'meta:'..m.id,cjson.encode(m),'PX',math.max(1,m.receiptUntil-now)) end
local function expire(id)
 local raw=redis.call('GET',prefix..'meta:'..id)
 if raw then local m=cjson.decode(raw);if m.state=='LEASED' and m.leaseUntil>now then return end;m.state='EXPIRED';m.failure='EXPIRED';save(m) end
 redis.call('DEL',prefix..'payload:'..id);redis.call('ZREM',KEYS[1],id);redis.call('ZREM',KEYS[2],id);redis.call('ZREM',KEYS[3],id)
end
for _,id in ipairs(redis.call('ZRANGEBYSCORE',KEYS[1],'-inf',now,'LIMIT',0,64)) do expire(id) end
for _,id in ipairs(redis.call('ZRANGEBYSCORE',KEYS[3],'-inf',now,'LIMIT',0,64)) do
 local raw=redis.call('GET',prefix..'meta:'..id)
 if raw then local m=cjson.decode(raw);if m.state=='LEASED' and m.expiresAt>now then m.state='QUEUED';save(m);redis.call('ZADD',KEYS[2],m.acceptedAt,id) else expire(id) end end
 redis.call('ZREM',KEYS[3],id)
end
redis.call('ZREMRANGEBYSCORE',KEYS[4],'-inf',now)
`;
const enqueue=prelude+`
local m=cjson.decode(ARGV[3]);local raw=redis.call('GET',prefix..'meta:'..m.id)
if raw then local previous=cjson.decode(raw);if previous.payloadHash~=m.payloadHash or previous.tokenHash~=m.tokenHash then return -1 end;return raw end
local mapped=redis.call('GET',prefix..'token:'..m.tokenHash);if mapped and mapped~=m.id then return -1 end
if redis.call('ZCARD',KEYS[1])>=64 or redis.call('ZCARD',KEYS[4])>=2048 then return -2 end
-- Receipt metadata is written last: a partial OOM write cannot acknowledge acceptance.
redis.call('SET',prefix..'payload:'..m.id,ARGV[4],'PX',m.expiresAt-now)
redis.call('SET',prefix..'token:'..m.tokenHash,m.id,'PX',m.receiptUntil-now)
redis.call('ZADD',KEYS[1],m.expiresAt,m.id);redis.call('ZADD',KEYS[2],m.acceptedAt,m.id);redis.call('ZADD',KEYS[4],m.receiptUntil,m.id)
save(m);return cjson.encode(m)
`;
const claim=prelude+`
local next=redis.call('ZRANGE',KEYS[2],0,0);if #next==0 then return false end
local id=next[1];local raw=redis.call('GET',prefix..'meta:'..id);local payload=redis.call('GET',prefix..'payload:'..id)
if not raw or not payload then expire(id);return false end
local m=cjson.decode(raw);if m.state~='QUEUED' or m.expiresAt<=now then expire(id);return false end
m.state='LEASED';m.attempts=m.attempts+1;m.leaseToken=ARGV[3];m.leaseUntil=now+30000
-- Allow an already-issued lease to finish at the retention boundary.
redis.call('PEXPIRE',prefix..'payload:'..id,math.max(m.expiresAt-now,35000))
redis.call('ZADD',KEYS[3],m.leaseUntil,id);save(m);redis.call('ZREM',KEYS[2],id)
return {cjson.encode(m),payload}
`;
const acknowledge=`
local now=tonumber(ARGV[1]);local prefix=ARGV[2];local raw=redis.call('GET',prefix..'meta:'..ARGV[3]);if not raw then return 0 end
local m=cjson.decode(raw)
if m.leaseToken~=ARGV[4] then return 0 end
if m.state=='RECEIVED' or m.state=='FAILED' then return 1 end
if m.state~='LEASED' or m.leaseUntil<=now then return 0 end
m.state=ARGV[5];if ARGV[6]~='' then m.failure=ARGV[6] end
redis.call('SET',prefix..'meta:'..m.id,cjson.encode(m),'PX',math.max(1,m.receiptUntil-now))
redis.call('DEL',prefix..'payload:'..m.id);redis.call('ZREM',KEYS[1],m.id);redis.call('ZREM',KEYS[2],m.id);redis.call('ZREM',KEYS[3],m.id)
return 1
`;
const status=prelude+`
local id=redis.call('GET',prefix..'token:'..ARGV[3]);if not id then return false end
local raw=redis.call('GET',prefix..'meta:'..id);if not raw then return false end
local m=cjson.decode(raw)
if ARGV[4]=='cancel' then
 -- A previously leased request might already have committed. Only the clinic can cancel it.
 if m.state~='QUEUED' or m.attempts>0 then return -1 end
 m.state='WITHDRAWN';save(m);redis.call('DEL',prefix..'payload:'..id);redis.call('ZREM',KEYS[1],id);redis.call('ZREM',KEYS[2],id)
end
return cjson.encode(m)
`;
export class DurableRelay {
 constructor(private readonly prefix:string,private readonly command:Command,private readonly seal:Codec,private readonly open:(value:string,context:string)=>unknown){}
 private keys(){return [this.prefix+'active',this.prefix+'waiting',this.prefix+'leases',this.prefix+'receipts'];}
 private receipt(m:Metadata):PreferenceReceipt{return preferenceReceiptSchema.parse({submissionId:m.id,delivery:{state:m.state==='LEASED'?'QUEUED':m.state,acceptedAt:new Date(m.acceptedAt).toISOString(),expiresAt:new Date(m.expiresAt).toISOString(),...(m.failure?{failure:m.failure}:{})},booking:null});}
 async accept(input:Extract<PreferenceBookingInput,{op:'submit'}>){
  const now=Date.now(),m:Metadata={id:input.submissionId,tokenHash:hash(input.token),payloadHash:hash(JSON.stringify(input)),acceptedAt:now,expiresAt:now+retention,receiptUntil:now+receiptRetention,state:'QUEUED',attempts:0};
  const raw=await this.command(['EVAL',enqueue,4,...this.keys(),now,this.prefix,JSON.stringify(m),this.seal(input,'durable:'+m.id)]);
  if(raw===-1)throw new Error('CONFLICT');if(raw===-2)throw new Error('CAPACITY');if(typeof raw!=='string')throw new Error('UNAVAILABLE');return this.receipt(metadata.parse(JSON.parse(raw)));
 }
 async status(token:string,cancel=false){
  const raw=await this.command(['EVAL',status,4,...this.keys(),Date.now(),this.prefix,hash(token),cancel?'cancel':'status']);
  if(raw===-1)throw new Error('CONFLICT');if(typeof raw!=='string')throw new Error('NOT_FOUND');return this.receipt(metadata.parse(JSON.parse(raw)));
 }
 async poll():Promise<BookingJob[]>{
  const raw=await this.command(['EVAL',claim,4,...this.keys(),Date.now(),this.prefix,randomBytes(32).toString('hex')]);
  if(raw===null||raw===false)return [];
  const [info,payload]=z.tuple([z.string(),z.string()]).parse(raw),m=metadata.parse(JSON.parse(info)),operation=preferenceBookingInput.parse(this.open(payload,'durable:'+m.id));
  if(operation.op!=='submit'||operation.submissionId!==m.id||hash(JSON.stringify(operation))!==m.payloadHash||hash(operation.token)!==m.tokenHash)throw new Error('UNAVAILABLE');
  return [{id:m.id,operation,expiresAt:new Date(Date.now()+8000).toISOString(),leaseToken:m.leaseToken!,leaseExpiresAt:new Date(m.leaseUntil!).toISOString(),submittedAt:new Date(m.acceptedAt).toISOString(),deliveryExpiresAt:new Date(m.expiresAt).toISOString()}];
 }
 async complete(id:string,result:{ok:boolean;data?:unknown;error?:unknown},leaseToken:string){
  z.uuid().parse(id);z.string().regex(/^[a-f0-9]{64}$/).parse(leaseToken);
  let failure='';
  if(result.ok){const receipt=preferenceReceiptSchema.parse(result.data);if(receipt.submissionId!==id||receipt.delivery.state!=='RECEIVED'||receipt.booking===null)throw new Error('UNAVAILABLE');}
  else {failure=errorCode.parse(result.error);if(['UNAVAILABLE','CAPACITY','EXPIRED'].includes(failure))return false;}
  return await this.command(['EVAL',acknowledge,4,...this.keys(),Date.now(),this.prefix,id,leaseToken,result.ok?'RECEIVED':'FAILED',failure])===1;
 }
}
