export interface BookingDraft { date?:string;time?:string;forWhom?:'moi'|'mon enfant'|'un proche';firstTime?:boolean; }
const topics=[
 ['booking',/r[eé]serv|rendez.vous|\brdv\b|book|appointment|حجز|موعد/iu],
 ['hours',/horair|ouvert|ferm[eé]|working.hours|opening|schedule|أوقات|ساعات|مواعيد|وقتاش|تفتحو|teft7|wa9tach/iu],
 ['price',/tarif|prix|co[uû]t|price|cost|fee|سعر|أسعار|ثمن|شحال|ch7al/iu],
 ['privacy',/confident|privac|secret|سرية|خصوصية/iu],
 ['location',/adresse|situ[eé]|o[uù]|venir|transport|parking|address|location|where|directions|موقع|عنوان|أين|وين/iu],
 ['first_visit',/premi[eè]re|s[eé]ance|consultation|first.visit|session|أول|جلسة|استشارة/iu],
 ['doctor',/m[eé]decin|docteur|doctor|psychiatr|psychoth[eé]rap|[ée]quipe|دكتور|طبيب|فريق/iu],
 ['greeting',/bonjour|salut|merci|hello|hi\b|thanks|who.are.you|bonsoir|سلام|مرحبا|شكرا/iu],
] as const;
const privateText=/(?:@|https?:\/\/|\+?\d[\d\s().-]{7,}\d|m['’ ]appelle|mon.nom|my.name|my.email|my.phone|patient|dossier|ordonnance|m[eé]dicament|traitement|diagnostic|sympt[oô]me|sertraline|antid[eé]press|suicid|automutil|me.faire.du.mal|\b(?:je.suis|j['’ ]ai|je.prends|je.souffre|i.have|i.am|i.take)\b|اسمي|هاتفي|عندي|أعاني|اكتئاب|انتحار|دواء|علاج|تشخيص)/iu;
export function normalizePublicChat(text:string):{kind:'private'|'unknown'|'public';topic?:string;draft:BookingDraft;modelText:string}{
 // Only normalized public topics and validated scheduling preferences leave the server.
 const withoutSchedule=text.replace(/20\d{2}-\d{2}-\d{2}|\b\d{2}:\d{2}\b/g,'');
 if(privateText.test(withoutSchedule))return {kind:'private',draft:{},modelText:''};
 const matchedTopic=topics.find(([,pattern])=>pattern.test(text))?.[0];
 const topic=matchedTopic??(/\b20\d{2}-\d{2}-\d{2}\b|\b(?:0[89]|1[0-5]):(?:00|30)\b/.test(text)?'booking':undefined);
 if(!topic)return {kind:'unknown',draft:{},modelText:''};
 const draft:BookingDraft={};const date=text.match(/\b20\d{2}-\d{2}-\d{2}\b/)?.[0];
 if(date){const parsed=new Date(date+'T00:00:00Z');if(Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===date)draft.date=date;}
 const time=text.match(/\b(?:0[89]|1[0-5]):(?:00|30)\b/)?.[0];if(time&&time>='08:30'&&time<='15:30')draft.time=time;
 if(!matchedTopic&&!draft.date&&!draft.time)return {kind:'unknown',draft:{},modelText:''};
 if(/enfant|child|طفل|ابني|ابنتي/iu.test(text))draft.forWhom='mon enfant';else if(/proche|relative|قريب/iu.test(text))draft.forWhom='un proche';else if(/pour.moi|myself|لنفسي/iu.test(text))draft.forWhom='moi';
 if(/premi[eè]re|first|أول/iu.test(text))draft.firstTime=true;else if(/suivi|follow.up|متابعة/iu.test(text))draft.firstTime=false;
 return {kind:'public',topic,draft,modelText:JSON.stringify({publicQuestion:topic,schedulingPreferences:draft})};
}
export function conversationBookingDraft(history:string[],text:string):BookingDraft{
 const current=normalizePublicChat(text);
 if(current.kind!=='public'||current.topic!=='booking')return {};
 let draft:BookingDraft={};
 for(const previous of history.slice(-6)){
  const normalized=normalizePublicChat(previous);
  if(normalized.kind!=='public'||normalized.topic!=='booking'){draft={};continue;}
  draft={...draft,...normalized.draft};
 }
 return {...draft,...current.draft};
}
export function allowChatRequest(request:Request,rates:Map<string,{count:number;until:number}>,now=Date.now(),configuredOrigin?:string):number{
 const url=new URL(request.url),origin=configuredOrigin??'https://www.mindcare-centre.com';
 if(request.headers.get('origin')!==origin||request.headers.get('host')!==new URL(origin).host||url.origin!==origin)return 403;
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return 415;
 for(const [key,row] of rates)if(row.until<=now)rates.delete(key);
 const key='public-chat',row=rates.get(key)??{count:0,until:now+60_000};
 if(++row.count>20)return 429;rates.set(key,row);return 0;
}
