type Row={id:string;kind:string;body:Record<string,unknown>;version:number;createdAt:string;updatedAt:string};
export type Notice={key:string;kind:'appointment'|'message'|'activity'|'checkin';date:string;screen:'appointments'|'messages'|'followup'|'checkin'};
export function isQuiet(now:string,start:string,end:string){return start!==end&&(start<end?now>=start&&now<end:now>=start||now<end);}
export function buildNotices(records:readonly Row[],today:string,time:string,preferences:Record<string,unknown>):Notice[]{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(today)||!Number.isFinite(Date.parse(today)))return [];
 const end=new Date(Date.parse(today+'T12:00:00Z')+7*86400000).toISOString().slice(0,10);
 const notices:Notice[]=[];
 for(const row of records){
  const {body}=row;
  if(row.kind==='clinicMessage')notices.push({key:`message:${row.id}:${row.version}`,kind:'message',date:row.updatedAt,screen:'messages'});
  if(row.kind==='appointment'&&body.shared===true&&body.status==='confirmed'&&typeof body.date==='string'&&body.date>=today&&body.date<=end)notices.push({key:`appointment:${row.id}:${row.version}`,kind:'appointment',date:body.date,screen:'appointments'});
 }
 const quiet=isQuiet(time,typeof preferences.quietStart==='string'?preferences.quietStart:'22:00',typeof preferences.quietEnd==='string'?preferences.quietEnd:'08:00');
 const weekday=new Date(today+'T12:00:00Z').getUTCDay()||7;
 const days=Array.isArray(preferences.reminderDays)?preferences.reminderDays:[];
 const consent=records.filter(row=>row.kind==='consent'&&row.body.purpose==='in-app-reminders').sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||b.version-a.version)[0];
 if(preferences.notifications===true&&consent?.body.accepted===true&&!quiet){
  if(days.includes(weekday)&&!records.some(r=>r.kind==='checkin'&&r.body.date===today))notices.push({key:`checkin:${today}`,kind:'checkin',date:today,screen:'checkin'});
  for(const row of records)if(row.kind==='activity'&&typeof row.body.date==='string'&&row.body.date<=today&&['planned','deferred'].includes(String(row.body.status)))notices.push({key:`activity:${row.id}:${row.version}`,kind:'activity',date:row.body.date,screen:'followup'});
 }
 return notices.sort((a,b)=>b.date.localeCompare(a.date));
}
