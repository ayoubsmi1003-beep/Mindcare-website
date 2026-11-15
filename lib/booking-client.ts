"use client";
import {publicBookingInput,sanitizePublicResult,errorCode,type PublicBookingInput} from './booking-protocol';
export async function publicBookingApi(raw:PublicBookingInput){
 const input=publicBookingInput.parse(raw);
 const response=await fetch(input.op==='chat'?'/api/chat':'/api/booking',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify(input),signal:AbortSignal.timeout(50000)});
 const body=await response.json();
 if(!response.ok)throw new Error(errorCode.safeParse(body.error).success?body.error:'UNAVAILABLE');
 return sanitizePublicResult(input,body.data);
}
export function newReceipt(){const bytes=crypto.getRandomValues(new Uint8Array(32));return {submissionId:crypto.randomUUID(),token:Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')};}
export function clinicDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Algiers',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function slotLabel(value:string,locale:string){return new Intl.DateTimeFormat(locale,{timeZone:'Africa/Algiers',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
