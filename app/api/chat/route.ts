import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';
import { BOOKING_FUNCTION_DECLARATIONS, checkAvailabilityHandler, proposeBookingHandler } from '@/lib/booking-tool';
import { boundedBody } from '@/lib/booking-http';
import { allowChatRequest, normalizePublicChat, conversationBookingDraft } from '@/lib/public-chat';
import { generateGeminiReply, safeGeminiFailure } from '@/lib/gemini-reply';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=40;
const inputSchema=z.object({message:z.string().trim().min(1).max(1200),history:z.array(z.object({role:z.enum(['user','model']),text:z.string().max(1600)}).strict()).max(12).default([]),language:z.enum(['fr','ar','en']).default('fr')}).strict();
const rates=new Map<string,{count:number;until:number}>();
const guidance={fr:'Pour protéger votre confidentialité, ne partagez ici ni nom, coordonnées, ni informations de santé. Je peux répondre aux questions pratiques sur le cabinet. Pour une question personnelle ou médicale, appelez le 0554 81 39 11. En cas de danger immédiat, contactez les secours locaux ou les urgences les plus proches.',en:'Please keep names, contact details and health information out of this chat. I can answer practical questions about the clinic. For personal or medical questions, call 0554 81 39 11. In immediate danger, contact local emergency services or the nearest emergency department.',ar:'لحماية خصوصيتكم، لا تشاركوا الاسم أو بيانات الاتصال أو المعلومات الصحية هنا. أجيب عن الأسئلة العملية حول العيادة. للأسئلة الشخصية أو الطبية اتصلوا بالرقم 0554 81 39 11. في خطر فوري، اتصلوا بالإسعاف المحلي أو توجهوا إلى أقرب قسم استعجالات.'};
const unknown={fr:'Je peux vous renseigner sur les horaires, tarifs, accès, confidentialité, première consultation ou demande de rendez-vous. Quel point souhaitez-vous connaître ?',en:'I can help with clinic hours, fees, location, privacy, first visits or appointment requests. What would you like to know?',ar:'يمكنني المساعدة بشأن أوقات العمل والأسعار والعنوان والخصوصية والاستشارة الأولى وطلب موعد. ما الذي تودون معرفته؟'};
const unavailable={fr:'L’assistante est momentanément indisponible. Vous pouvez appeler le cabinet au 0554 81 39 11.',en:'The assistant is temporarily unavailable. Please call the clinic at 0554 81 39 11.',ar:'المساعدة غير متاحة مؤقتاً. يمكنكم الاتصال بالعيادة على 0554 81 39 11.'};
function json(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});}
export async function POST(request:Request){
 let language:'fr'|'ar'|'en'='fr';
 let phase:'input'|'provider'|'tools'='input';
 try{
  const local=process.env.NODE_ENV!=='production'&&['localhost','127.0.0.1'].includes(new URL(request.url).hostname);
  const denied=allowChatRequest(request,rates,Date.now(),local?new URL(request.url).origin:process.env.MINDCARE_PUBLIC_ORIGIN);
  if(denied)return json({error:'INVALID_REQUEST'},denied);
  const parsed=inputSchema.safeParse(JSON.parse(await boundedBody(request,24*1024)));
  if(!parsed.success)return json({error:'INVALID_INPUT'},422);
  language=parsed.data.language;
  const current=normalizePublicChat(parsed.data.message);
  if(current.kind!=='public')return json({reply:current.kind==='private'?guidance[language]:unknown[language],toolCalls:[],aiAvailable:false});
  // Only normalized public topics reach Gemini, including history; raw messages stay local.
  const history=parsed.data.history.filter(h=>h.role==='user').map(h=>normalizePublicChat(h.text)).filter(h=>h.kind==='public').slice(-6).map(h=>h.modelText);
  const draft=conversationBookingDraft(parsed.data.history.filter(h=>h.role==='user').map(h=>h.text),parsed.data.message);
  const apiKey=process.env.GEMINI_API_KEY;
  if(!apiKey)return json({error:unavailable[language],code:'GEMINI_NOT_CONFIGURED',providerStatus:null},503);
  phase='provider';
  const {response,model}=await generateGeminiReply((model,timeoutMs)=>new GoogleGenAI({apiKey,httpOptions:{timeout:timeoutMs}}).models.generateContent({model,contents:[{role:'user',parts:[{text:JSON.stringify({language,previousPublicTopics:history,currentPublicQuestion:current.modelText,schedulingPreferences:draft})}]}],config:{systemInstruction:SYSTEM_PROMPT,tools:[{functionDeclarations:BOOKING_FUNCTION_DECLARATIONS}],temperature:0.4,maxOutputTokens:600}}));
  if(!response.text&&!response.functionCalls?.length)return json({error:unavailable[language],code:'GEMINI_EMPTY_RESPONSE',providerStatus:null},503);
  phase='tools';
  const toolCalls=[];
  for(const call of (response.functionCalls??[]).slice(0,2)){
   if(call.name==='check_availability'){const result=checkAvailabilityHandler((call.args as {date?:string})?.date);toolCalls.push({name:call.name,result});}
   if(call.name==='propose_booking'&&draft.date&&draft.time){const result=proposeBookingHandler(draft);if(result)toolCalls.push({name:call.name,result});}
  }
  return json({reply:response.text?.slice(0,4000)||unknown[language],toolCalls,aiAvailable:true,model});
 }catch(error){return json({error:unavailable[language],...(phase==='provider'?safeGeminiFailure(error):{code:phase==='tools'?'PUBLIC_TOOL_FAILURE':'PUBLIC_INPUT_FAILURE',providerStatus:null})},503);}
}
