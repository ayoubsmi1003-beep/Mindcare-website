import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CommandSchema, PasswordSchema, SignInSchema } from './commands';
import { readJson, requireSameOrigin } from './request';
import * as database from './server';
import { scenarioReply } from './contracts/provider';

const cookieName = 'sanad_session';
const privateHeaders = { 'Cache-Control':'private, no-store, max-age=0', 'Pragma':'no-cache', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer' };
const statuses: Record<string,number> = {UNAUTHENTICATED:401,FORBIDDEN:403,INVALID_INPUT:400,CONFLICT:409,RATE_LIMITED:429,UNAVAILABLE:503,UNSUPPORTED_PROVIDER:503};
function json(value: unknown, status=200) { return NextResponse.json(value,{status,headers:privateHeaders}); }
function token(request:NextRequest) { const value=request.cookies.get(cookieName)?.value; if (!value || !/^[A-Za-z0-9_-]{43}$/.test(value)) throw new Error('UNAUTHENTICATED'); return value; }
function errorResponse(error:unknown) {
  const code = error instanceof z.ZodError ? 'INVALID_INPUT' : error instanceof Error && Object.hasOwn(statuses,error.message) ? error.message : 'UNAVAILABLE';
  const response = json({error:code},statuses[code]);
  if (code==='RATE_LIMITED') response.headers.set('Retry-After','900');
  if (code==='UNAUTHENTICATED') response.cookies.set(cookieName,'',{httpOnly:true,sameSite:'strict',path:'/',maxAge:0});
  return response;
}
async function safe(work:()=>Promise<NextResponse>) { try { return await work(); } catch(error) { return errorResponse(error); } }

export function state(request:NextRequest) { return safe(async()=>json(await database.getState(token(request)))); }
export function signIn(request:NextRequest) { return safe(async()=>{
  requireSameOrigin(request,process.env.NODE_ENV==='development');
  const input=SignInSchema.parse(await readJson(request,2048));
  const ip=process.env.VERCEL ? (request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown') : 'local-development';
  const session=await database.signIn(input.phone,input.password,ip);
  const response=json({ok:true});
  response.cookies.set(cookieName,session.token,{httpOnly:true,secure:new URL(request.url).protocol==='https:',sameSite:'strict',path:'/',expires:new Date(session.expiresAt)});
  return response;
}); }
export function signOut(request:NextRequest) { return safe(async()=>{
  requireSameOrigin(request,process.env.NODE_ENV==='development');
  const current=request.cookies.get(cookieName)?.value;
  if (current) await database.signOut(current);
  const response=json({ok:true});
  response.cookies.set(cookieName,'',{httpOnly:true,secure:new URL(request.url).protocol==='https:',sameSite:'strict',path:'/',maxAge:0});
  return response;
}); }
export function password(request:NextRequest) { return safe(async()=>{
  requireSameOrigin(request,process.env.NODE_ENV==='development');
  const input=PasswordSchema.parse(await readJson(request,2048));
  await database.changePassword(token(request),input.currentPassword,input.newPassword);
  const response=json({ok:true});
  response.cookies.set(cookieName,'',{httpOnly:true,sameSite:'strict',path:'/',maxAge:0});
  return response;
}); }
export function command(request:NextRequest) { return safe(async()=>{
  requireSameOrigin(request,process.env.NODE_ENV==='development');
  const current=token(request);
  const input=CommandSchema.parse(await readJson(request));
  if (input.action==='revokeOtherSessions') return json(await database.revokeOtherSessions(current,input.idempotencyKey));
  if (input.action==='share') return json({share:await database.setShare(current,input)});
  if (input.action==='save') return json({record:await database.saveRecord(current,input)});
  // Patient data never reaches an SDK or network provider. The environment cannot enable one.
  if (process.env.SANAD_PATIENT_PROVIDER && process.env.SANAD_PATIENT_PROVIDER!=='scenario') throw new Error('UNSUPPORTED_PROVIDER');
  const prior=await database.getReceipt(current,input.idempotencyKey);
  if (prior) {
    const messages=Array.isArray(prior.body.messages)?prior.body.messages:[];
    const previous=messages.at(-2);
    if(prior.kind!=='conversation' || previous?.role!=='user' || previous.text!==input.text || (input.locale!==undefined && previous.locale!==input.locale) ||
      (input.conversationId ? input.conversationId!==prior.id || prior.version===1 : prior.version!==1)) throw new Error('CONFLICT');
    return json({record:prior});
  }
  const snapshot=await database.getState(current);
  const conversation=input.conversationId ? snapshot.records.find(record=>record.id===input.conversationId && record.kind==='conversation') : undefined;
  if (input.conversationId && !conversation) throw new Error('FORBIDDEN');
  const history=Array.isArray(conversation?.body.messages) ? conversation.body.messages : [];
  if (history.length>=100) throw new Error('RATE_LIMITED');
  const reply=await scenarioReply(input.text,{signal:request.signal,locale:input.locale ?? snapshot.profile.locale,timeoutMs:5000});
  const at=new Date().toISOString();
  const body={scenario:true,messages:[...history,{role:'user',text:input.text,at,locale:input.locale ?? snapshot.profile.locale},{role:'assistant',text:reply.text,at}],origin:reply.origin};
  const record=await database.saveRecord(current,{kind:'conversation',id:conversation?.id,expectedVersion:conversation?.version,idempotencyKey:input.idempotencyKey,body});
  return json({record});
}); }

const documentCopy={
  fr:'SANAD — Document fictif de démonstration\n\nCe document vérifie uniquement l’accès privé et le téléchargement. Il ne contient aucune prescription ni donnée de patient réel.\n\nLe raccordement au cabinet et les documents médicaux restent à valider.',
  ar:'سند — وثيقة تجريبية خيالية\n\nتختبر هذه الوثيقة الوصول الخاص والتنزيل فقط. لا تحتوي على وصفة أو بيانات مريض حقيقي.\n\nلم يتم بعد التحقق من الربط بالعيادة أو الوثائق الطبية.',
  en:'SANAD — Fictional demonstration document\n\nThis document only tests private access and download. It contains no prescription or real patient information.\n\nClinic integration and medical documents remain subject to validation.',
};
export function document(request:NextRequest,id:string) { return safe(async()=>{
  if (!z.uuid().safeParse(id).success) throw new Error('FORBIDDEN');
  const snapshot=await database.getState(token(request));
  const record=snapshot.records.find(record=>record.id===id && record.kind==='document' && record.body.shared===true && record.body.contentKey==='welcome');
  if(!record) throw new Error('FORBIDDEN');
  return new NextResponse(documentCopy[snapshot.profile.locale],{headers:{...privateHeaders,'Content-Type':'text/plain; charset=utf-8','Content-Disposition':'attachment; filename="sanad-demo.txt"','Content-Security-Policy':"default-src 'none'; sandbox"}});
}); }
