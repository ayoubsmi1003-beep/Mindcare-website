import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
export function signBridge(secret:string,body:string,now=Date.now(),nonce=randomBytes(16).toString('hex')):Record<string,string> {
  if(secret.length<32) throw new Error('UNAVAILABLE');
  const time=String(now);
  const signature=createHmac('sha256',secret).update(`POST\n/api/clinic-bridge\n${time}\n${nonce}\n${body}`).digest('hex');
  return {'x-clinic-time':time,'x-clinic-nonce':nonce,'x-clinic-signature':signature};
}
export function verifyBridge(secret:string,body:string,headers:Record<string,string>,seen:Map<string,number>,now=Date.now()):boolean {
  const time=headers['x-clinic-time']??'',nonce=headers['x-clinic-nonce']??'',signature=headers['x-clinic-signature']??'';
  if(secret.length<32||!/^\d{1,16}$/.test(time)||!Number.isSafeInteger(Number(time))||Math.abs(now-Number(time))>15_000||!/^[a-f0-9]{32}$/.test(nonce)||!/^[a-f0-9]{64}$/.test(signature)) return false;
  const expected=signBridge(secret,body,Number(time),nonce)['x-clinic-signature']!;
  if(!timingSafeEqual(Buffer.from(signature,'hex'),Buffer.from(expected,'hex'))) return false;
  for(const [key,expires] of seen) if(expires<now) seen.delete(key);
  if(seen.has(nonce)||seen.size>=2048) return false;
  seen.set(nonce,now+30_000);return true;
}
