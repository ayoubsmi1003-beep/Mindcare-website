export type JourneyRecord = {id:string;kind:string;body:Record<string,unknown>;version:number;createdAt:string;updatedAt:string};
export const emotions = ['happy','calm','excited','tired','sad','anxious'] as const;
export const contextTags = ['work','family','health','social','rest','other'] as const;
export const levels = ['low','medium','high'] as const;
const algiers=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Algiers',year:'numeric',month:'2-digit',day:'2-digit'});
export function isCalendarDay(value:unknown):value is string {
  return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10)===value;
}
export function algiersDay(value:string|Date=new Date()):string {
  if(typeof value==='string'&&!isCalendarDay(value.slice(0,10)))return '';
  const date=new Date(value);
  return Number.isFinite(date.getTime())?algiers.format(date):'';
}
export function journeyDays(today:string,count:7|30|90):string[] {
  if(!isCalendarDay(today))throw new RangeError('Expected an ISO calendar date');
  return Array.from({length:count},(_,index)=>new Date(Date.parse(`${today}T12:00:00Z`)+(index-count+1)*86400000).toISOString().slice(0,10));
}
function compare(a:JourneyRecord,b:JourneyRecord) {
  return Date.parse(a.updatedAt)-Date.parse(b.updatedAt)||a.version-b.version||a.id.localeCompare(b.id);
}
export function latestRecords(records:readonly JourneyRecord[]):JourneyRecord[] {
  const current=new Map<string,JourneyRecord>();
  for(const record of records){
    if(!algiersDay(record.updatedAt)||!algiersDay(record.createdAt)||!Number.isInteger(record.version)||record.version<1)continue;
    const previous=current.get(record.id);
    if(!previous||compare(record,previous)>0)current.set(record.id,record);
  }
  return [...current.values()].sort((a,b)=>compare(b,a));
}
export function dailyCheckins(records:readonly JourneyRecord[],today:string,count:7|30|90) {
  const days=journeyDays(today,count);
  const current=new Map<string,JourneyRecord>();
  for(const record of latestRecords(records)){
    const date=record.body.date;
    if(record.kind==='checkin'&&isCalendarDay(date)&&date>=days[0]&&date<=today&&algiersDay(record.updatedAt)<=today&&algiersDay(record.createdAt)<=today&&!current.has(date))current.set(date,record);
  }
  return days.map(date=>({date,record:current.get(date)}));
}
export function hasCheckinObservation(body:Record<string,unknown>):boolean {
  return ['mood','emotion','anxiety','stress','energy','sleepQuality'].some(key=>typeof body[key]==='string'&&!!(body[key] as string).trim())
    ||['note','effects'].some(key=>typeof body[key]==='string'&&!!(body[key] as string).trim())
    ||typeof body.sleepHours==='number'&&Number.isFinite(body.sleepHours)&&body.sleepHours>=0&&body.sleepHours<=24
    ||typeof body.intensity==='number'&&Number.isInteger(body.intensity)&&body.intensity>=1&&body.intensity<=5
    ||Array.isArray(body.contextTags)&&body.contextTags.some(value=>contextTags.includes(value));
}
export function journalHasContent(body:Record<string,unknown>):boolean {
  const keys=body.format==='free'?['text']:['situation','emotion','need','helped'];
  return keys.some(key=>typeof body[key]==='string'&&!!(body[key] as string).trim());
}
export function journalMatches(record:JourneyRecord,query:string,from:string,to:string):boolean {
  const date=algiersDay(record.createdAt);
  const text=['text','situation','emotion','need','helped'].map(key=>typeof record.body[key]==='string'?record.body[key]:'').join(' ').toLocaleLowerCase();
  return record.kind==='journal'&&(!from||date>=from)&&(!to||date<=to)&&text.includes(query.trim().toLocaleLowerCase());
}
