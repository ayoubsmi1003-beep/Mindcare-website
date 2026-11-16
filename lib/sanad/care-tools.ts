export type CareRecord={id:string;kind:string;version:number;body:Record<string,unknown>;createdAt:string;updatedAt:string};
export type SourceRevision={recordId:string;version:number};
export const preparationKinds=['journal','checkin','weeklyReview','thoughtRecord'] as const;
export function mondayOf(day:string){
  const date=new Date(`${day}T12:00:00Z`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==day)throw new RangeError('Invalid calendar date');
  date.setUTCDate(date.getUTCDate()-((date.getUTCDay()+6)%7));return date.toISOString().slice(0,10);
}
export function resolvePreparationSources(records:readonly CareRecord[],selected:readonly SourceRevision[]):CareRecord[]|null{
  if(selected.length>20||new Set(selected.map(item=>item.recordId)).size!==selected.length)return null;
  const sources=selected.map(item=>records.find(record=>record.id===item.recordId&&record.version===item.version&&(preparationKinds as readonly string[]).includes(record.kind)));
  return sources.some(item=>!item)?null:sources as CareRecord[];
}
export function preparationBody(questions:string,summary:string,appointment:CareRecord|undefined,sources:readonly CareRecord[]){
  if(appointment&&(appointment.kind!=='appointment'||appointment.body.shared!==true||appointment.body.status!=='confirmed'))return null;
  return {questions,summary,...(appointment?{appointmentId:appointment.id,appointmentVersion:appointment.version}:{}),selectedSources:sources.map(record=>({recordId:record.id,version:record.version}))};
}
export function downloadOwnJson(value:unknown,filename:string){
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
