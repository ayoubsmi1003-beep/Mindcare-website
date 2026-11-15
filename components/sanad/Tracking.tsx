'use client';

import {useEffect,useState,type FormEvent} from 'react';
import {ArrowRight,BookHeart,CalendarDays,Check,CheckCircle2,Clock,Flower2,Heart,Leaf,Pill,Plus,Sprout,Target} from 'lucide-react';
import {dateLabel,day,Empty,Field,num,Options,ShareControl,str,Submit,Title,useRecords,useSanad,yes,type Body,type SanadRecord} from './core';
import type {CopyKey} from '@/lib/sanad/i18n';
import {adherenceBody,type AdherenceStatus} from './adherence';

export function Checkin() {
  const {state,t,save,locale}=useSanad();
  const existing=state.records.find(record=>record.kind==='checkin' && str(record.body,'date')===day());
  const [body,setBody]=useState<Body>(existing?.body || {date:day()});
  const change=(key:string,value:unknown)=>setBody(previous=>({...previous,[key]:value === '' ? undefined : value}));
  async function submit(event: FormEvent) {event.preventDefault();await save('checkin',body,existing);}
  return <div className="sn-narrow"><Title eyebrow={dateLabel(day(),locale,true)} description={t('checkinIntro')}>{t('checkinTitle')}</Title><form className="sn-form sn-checkin-form" onSubmit={submit}><Options label={t('mood')} options={[{value:'difficult',label:t('difficult'),symbol:'☁'},{value:'mixed',label:t('mixed'),symbol:'◒'},{value:'calm',label:t('calm'),symbol:'☀'}]} value={str(body,'mood')} onChange={value=>change('mood',value)}/><Options label={t('anxiety')} options={['low','medium','high'].map(value=>({value,label:t(value as CopyKey)}))} value={str(body,'anxiety')} onChange={value=>change('anxiety',value)}/><Field label={t('sleep')} optional><input type="number" min="0" max="24" step="0.5" inputMode="decimal" value={num(body,'sleepHours') ?? ''} onChange={event=>change('sleepHours',event.target.value===''?undefined:Number(event.target.value))}/></Field><Options label={t('energy')} options={['low','medium','high'].map(value=>({value,label:t(value as CopyKey)}))} value={str(body,'energy')} onChange={value=>change('energy',value)}/><Field label={t('effects')} optional><textarea maxLength={4000} rows={3} value={str(body,'effects')} onChange={event=>change('effects',event.target.value)}/></Field><p className="sn-small">{t('optional')} · {t('checkinPrivacy')}</p><Submit disabled={!Object.entries(body).some(([key,value])=>key!=='date'&&value!==undefined&&value!=='')}/></form></div>;
}

export function Followup() {
  const {t,go}=useSanad();const [section,setSection]=useState('overview');
  return <><Title eyebrow="SANAD" description={t('weeklyIntro')}>{t('followup')}</Title><div className="sn-section-tabs" role="group" aria-label={t('followup')}>{(['overview','journal','weekly'] as const).map(value=><button type="button" key={value} aria-pressed={section===value} onClick={()=>setSection(value)}>{t(value==='overview'?'trends':value)}</button>)}</div>{section==='overview' && <><div className="sn-tracking-actions"><button type="button" onClick={()=>go('checkin')}><Heart/><span>{t('doCheckin')}</span><ArrowRight/></button><button type="button" onClick={()=>go('treatment')}><Pill/><span>{t('treatment')}</span><ArrowRight/></button></div><Trends/><div className="sn-followup-links"><button type="button" onClick={()=>setSection('journal')}><BookHeart size={28}/><h2>{t('journal')}</h2><p>{t('journalIntro')}</p><ArrowRight/></button><button type="button" onClick={()=>setSection('weekly')}><Sprout size={28}/><h2>{t('weekly')}</h2><p>{t('weeklyIntro')}</p><ArrowRight/></button></div></>}{section==='journal' && <Journal/>}{section==='weekly' && <Weekly/>}</>;
}
function Trends() {
  const {t,locale}=useSanad();const records=useRecords('checkin');
  const days=Array.from({length:7},(_,index)=>{const date=new Date(`${day()}T12:00:00+01:00`);date.setUTCDate(date.getUTCDate()-6+index);return date.toISOString().slice(0,10);});
  const symbols:Record<string,string>={difficult:'☁',mixed:'◒',calm:'☀'};
  return <section className="sn-trends"><header><span className="sn-eyebrow">{t('trends')}</span><p>{t('trendsIntro')}</p></header><div className="sn-week-dots">{days.map(date=>{const record=records.find(record=>str(record.body,'date')===date);const mood=record && str(record.body,'mood');return <div key={date}><span>{new Intl.DateTimeFormat(locale,{weekday:'short',timeZone:'Africa/Algiers'}).format(new Date(`${date}T12:00:00+01:00`))}</span><span className={`sn-mood-dot ${record?'sn-has-data':''}`} title={mood ? t(mood as CopyKey) : t('noData')}>{mood ? symbols[mood] : '·'}</span><small>{date.slice(8)}</small></div>;})}</div><div className="sn-trend-table" role="table" aria-label={t('trends')}><div role="row" className="sn-trend-head"><span role="columnheader">{t('date')}</span><span role="columnheader">{t('mood')}</span><span role="columnheader">{t('anxiety')}</span><span role="columnheader">{t('sleep')}</span></div>{days.slice().reverse().map(date=>{const record=records.find(record=>str(record.body,'date')===date);return <div key={date} role="row"><span role="cell">{dateLabel(date,locale)}</span><span role="cell">{record && str(record.body,'mood') ? t(str(record.body,'mood') as CopyKey) : '—'}</span><span role="cell">{record && str(record.body,'anxiety') ? t(str(record.body,'anxiety') as CopyKey) : '—'}</span><span role="cell">{record ? num(record.body,'sleepHours') ?? '—' : '—'}</span></div>;})}</div></section>;
}
function Journal() {
  const {t,save,locale,busy}=useSanad();const records=useRecords('journal');const [editing,setEditing]=useState<SanadRecord|null>(null);const [writing,setWriting]=useState(false);const [body,setBody]=useState<Body>({});
  const fields=['situation','emotion','need','helped'] as const;
  function open(record?:SanadRecord){setEditing(record||null);setBody(record?.body||{situation:'',emotion:'',need:'',helped:''});setWriting(true);}
  async function submit(event:FormEvent){event.preventDefault();if(await save('journal',body,editing||undefined)){setWriting(false);setBody({});}}
  return <section className="sn-journal"><div className="sn-section-heading"><div><BookHeart size={28}/><h2>{t('journal')}</h2><p>{t('journalIntro')}</p></div><button type="button" className="sn-button" disabled={busy} onClick={()=>open()}><Plus size={18}/>{t('newEntry')}</button></div>{writing && <form className="sn-form sn-journal-paper" onSubmit={submit}>{fields.map((key,index)=><Field key={key} label={t(key)} optional={index>0}><textarea rows={index===0?4:2} required={index===0} maxLength={4000} value={str(body,key)} onChange={event=>setBody({...body,[key]:event.target.value})}/></Field>)}<span className="sn-tag">{t('private')}</span><div className="sn-actions"><Submit/><button type="button" className="sn-button sn-secondary" disabled={busy} onClick={()=>setWriting(false)}>{t('cancel')}</button></div></form>}{records.length===0 && !writing && <Empty>{t('emptyJournal')}</Empty>}<div className="sn-journal-entries">{records.map(record=><article key={record.id} className="sn-journal-entry"><header><time dateTime={record.createdAt}>{dateLabel(record.createdAt,locale)}</time><button type="button" className="sn-text-button" disabled={busy} onClick={()=>open(record)}>{t('edit')}</button></header>{fields.map(key=>str(record.body,key) && <div key={key}><h3>{t(key)}</h3><p dir="auto">{str(record.body,key)}</p></div>)}<ShareControl record={record}/></article>)}</div></section>;
}
function Weekly() {
  const {t,save,busy}=useSanad();const goals=useRecords('goal');const prescribed=useRecords('prescribedGoal');const activities=useRecords('activity');const reviews=useRecords('weeklyReview');
  const [goal,setGoal]=useState('');const [target,setTarget]=useState('');const [activity,setActivity]=useState('');const [activityDate,setActivityDate]=useState(day());
  const weekStart=new Date(`${day()}T12:00:00+01:00`);weekStart.setUTCDate(weekStart.getUTCDate()-((weekStart.getUTCDay()+6)%7));const week=weekStart.toISOString().slice(0,10);
  const review=reviews.find(record=>str(record.body,'week')===week);const [helped,setHelped]=useState(review?str(review.body,'helped'):'');const [nextStep,setNextStep]=useState(review?str(review.body,'nextStep'):'');
  async function addGoal(event:FormEvent){event.preventDefault();if(await save('goal',{title:goal,origin:'personal',...(target?{targetDate:target}:{}),completed:false})){setGoal('');setTarget('');}}
  async function addActivity(event:FormEvent){event.preventDefault();if(await save('activity',{title:activity,date:activityDate,status:'planned',origin:'personal'}))setActivity('');}
  return <section className="sn-weekly"><div className="sn-section-heading"><div><Sprout size={28}/><h2>{t('weekly')}</h2><p>{t('weeklyIntro')}</p></div></div><div className="sn-two-columns"><section className="sn-goals"><h3><Target size={21}/>{t('goals')}</h3>{goals.length+prescribed.length===0 && <Empty>{t('noGoals')}</Empty>}{prescribed.map(record=><article className="sn-goal" key={record.id}><Leaf size={21}/><div><strong dir="auto">{str(record.body,'title')}</strong><span className="sn-tag">{t('doctor')}</span></div></article>)}{goals.map(record=><article className="sn-goal" key={record.id}><button type="button" className={`sn-check-button ${yes(record.body,'completed')?'sn-checked':''}`} aria-label={t(yes(record.body,'completed')?'reopen':'complete')} disabled={busy} onClick={()=>save('goal',{...record.body,completed:!yes(record.body,'completed')},record)}>{yes(record.body,'completed') && <Check size={18}/>}</button><div><strong className={yes(record.body,'completed')?'sn-crossed':''} dir="auto">{str(record.body,'title')}</strong><span className="sn-small">{t('personal')}{str(record.body,'targetDate') && ` · ${str(record.body,'targetDate')}`}</span></div></article>)}<form onSubmit={addGoal} className="sn-form sn-inline-form"><Field label={t('addGoal')}><input required maxLength={200} value={goal} onChange={event=>setGoal(event.target.value)}/></Field><Field label={t('targetDate')} optional><input type="date" value={target} onChange={event=>setTarget(event.target.value)}/></Field><Submit><Plus size={18}/>{t('addGoal')}</Submit></form></section><section className="sn-activities"><h3><CalendarDays size={21}/>{t('activities')}</h3>{activities.length===0 && <Empty>{t('noActivities')}</Empty>}{activities.sort((a,b)=>str(a.body,'date').localeCompare(str(b.body,'date'))).map(record=><Activity key={record.id} record={record}/>)}<form className="sn-form sn-inline-form" onSubmit={addActivity}><Field label={t('addActivity')}><input required maxLength={200} value={activity} onChange={event=>setActivity(event.target.value)}/></Field><Field label={t('date')}><input required type="date" value={activityDate} onChange={event=>setActivityDate(event.target.value)}/></Field><Submit><Plus size={18}/>{t('addActivity')}</Submit></form></section></div><form className="sn-form sn-week-review" onSubmit={async event=>{event.preventDefault();await save('weeklyReview',{week,helped,nextStep},review);}}><Flower2 size={30}/><h2>{t('weeklyReview')}</h2><Field label={t('helped')}><textarea required rows={3} maxLength={4000} value={helped} onChange={event=>setHelped(event.target.value)}/></Field><Field label={t('nextStep')}><textarea required rows={2} maxLength={4000} value={nextStep} onChange={event=>setNextStep(event.target.value)}/></Field><Submit/></form></section>;
}
function Activity({record}:{record:SanadRecord}) {
  const {t,save,busy,locale}=useSanad();const [deferring,setDeferring]=useState(false);const [date,setDate]=useState(str(record.body,'date'));const status=str(record.body,'status');
  return <article className="sn-activity"><span className="sn-activity-date">{dateLabel(str(record.body,'date'),locale)}</span><strong dir="auto">{str(record.body,'title')}</strong><span className="sn-tag">{t(status as CopyKey)}</span><div className="sn-actions"><button type="button" className="sn-text-button" disabled={busy} onClick={()=>save('activity',{...record.body,status:status==='completed'?'planned':'completed'},record)}><CheckCircle2 size={17}/>{t(status==='completed'?'reopen':'complete')}</button><button type="button" className="sn-text-button" disabled={busy} onClick={()=>setDeferring(!deferring)}><Clock size={17}/>{t('defer')}</button></div>{deferring && <form className="sn-form" onSubmit={async event=>{event.preventDefault();if(await save('activity',{...record.body,date,status:'deferred'},record))setDeferring(false);}}><Field label={t('date')}><input type="date" value={date} required onChange={event=>setDate(event.target.value)}/></Field><Submit>{t('defer')}</Submit></form>}</article>;
}

export function Treatment() {
  const {t}=useSanad();
  const records=useRecords('treatment').filter(record=>yes(record.body,'shared') && str(record.body,'status')==='active');
  return <>
    <Title eyebrow={t('followup')} description={t('treatmentHint')}>{t('treatment')}</Title>
    {records.length===0 && <Empty>{t('noTreatment')}</Empty>}
    <div className="sn-treatment-list">{records.map(record=><TreatmentItem key={record.id} record={record}/>)}</div>
    <TreatmentHistory/>
    <p className="sn-small">{t('declarationNote')}</p>
  </>;
}
const declarationChoices = [
  {value:'taken',key:'taken',Icon:CheckCircle2},
  {value:'forgotten',key:'forgotten',Icon:CalendarDays},
  {value:'not_taken',key:'notTaken',Icon:Clock},
] as const;
function TreatmentItem({record}:{record:SanadRecord}) {
  const {t,save,busy,locale}=useSanad();
  const declarations=useRecords('adherence').filter(item=>str(item.body,'treatmentId')===record.id);
  const adverse=useRecords('adverse').filter(item=>str(item.body,'treatmentId')===record.id);
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),10000);return()=>clearInterval(timer);},[]);
  const schedule=Array.isArray(record.body.schedule)?record.body.schedule.filter((value):value is string=>typeof value==='string'):[];
  const [time,setTime]=useState(schedule[0]||'');
  const [reason,setReason]=useState<string|null>(null);
  const [effect,setEffect]=useState('');
  const scheduledAt=time ? `${day()}T${time}:00+01:00` : undefined;
  const existing=scheduledAt ? declarations.find(item=>str(item.body,'scheduledAt')===scheduledAt) : undefined;
  const validFrom=Date.parse(str(record.body,'validFrom'));
  const validUntil=str(record.body,'validUntil');
  const valid=Number.isFinite(validFrom) && validFrom<=now && (!validUntil || Date.parse(validUntil)>=now);
  const remindersUntil=Date.parse(str(record.body,'remindersAuthorizedUntil'));
  const reminders=valid && Number.isFinite(remindersUntil) && remindersUntil>now;
  async function declare(status:AdherenceStatus) {
    if(await save('adherence',adherenceBody(record,status,reason??(existing?str(existing.body,'reason'):''),scheduledAt,existing),existing))setReason(null);
  }
  return <article className="sn-treatment">
    <div className="sn-prescription">
      <span className="sn-tag">{t('source')}</span>
      <h2><Pill size={26}/>{str(record.body,'name')}</h2>
      <dl>
        {(['dose','route'] as const).map(key=>str(record.body,key) && <div key={key}><dt>{t(key)}</dt><dd>{str(record.body,key)}</dd></div>)}
        <div><dt>{t('schedule')}</dt><dd dir="ltr">{yes(record.body,'asNeeded')?t('asNeeded'):schedule.length?schedule.join(' · '):'—'}</dd></div>
        {str(record.body,'instructions') && <div><dt>{t('instructions')}</dt><dd dir="auto">{str(record.body,'instructions')}</dd></div>}
      </dl>
      <p className="sn-small">{t('synchronized')} : {dateLabel(str(record.body,'lastSyncedAt'),locale)}</p>
      <p className={`sn-small ${!valid?'sn-warning-text':''}`}>{t(!valid?'validityUncertain':reminders?'remindersReady':'remindersPaused')}</p>
    </div>
    <div className="sn-declaration-form">
      {existing && <span className="sn-tag">{t('edit')} · {t('version')} {existing.version}</span>}
      {schedule.length>1 && <Field label={t('schedule')}><select value={time} onChange={event=>{setTime(event.target.value);setReason(null);}}>{schedule.map(time=><option key={time}>{time}</option>)}</select></Field>}
      <Field label={t('reason')} optional><input maxLength={2000} value={reason??(existing?str(existing.body,'reason'):'')} onChange={event=>setReason(event.target.value)}/></Field>
      <div className="sn-dose-actions">{declarationChoices.map(({value,key,Icon})=><button type="button" key={value} disabled={busy||!valid} className={value==='taken'?'sn-button':'sn-button sn-secondary'} onClick={()=>declare(value)}><Icon size={20}/>{t(key)}</button>)}</div>
    </div>
    <form className="sn-form sn-adverse" onSubmit={async event=>{event.preventDefault();if(await save('adverse',{text:effect,treatmentId:record.id}))setEffect('');}}>
      <Field label={t('adverse')}><textarea rows={2} maxLength={4000} required value={effect} onChange={event=>setEffect(event.target.value)}/></Field><Submit/>
    </form>
    {adverse.map(item=><p className="sn-small" key={item.id}>{dateLabel(item.createdAt,locale)} · {str(item.body,'text')}</p>)}
    <button type="button" className="sn-button sn-secondary" disabled={busy} onClick={()=>save('request',{category:'renewal',text:`${t('renewal')} : ${str(record.body,'name')}`,status:'pending',simulation:true})}>{t('renewal')}</button>
    <p className="sn-small">{t('pending')} · {t('demoNote')}</p>
  </article>;
}
function TreatmentHistory() {
  const {t,locale,busy}=useSanad();
  const declarations=useRecords('adherence');
  const treatments=useRecords('treatment');
  const [editing,setEditing]=useState<string|null>(null);
  return <section className="sn-declarations">
    <h2>{t('declarations')}</h2>
    <p className="sn-small">{t('historicalDeclaration')}</p>
    {declarations.length===0 && <Empty>{t('noDeclarations')}</Empty>}
    {declarations.map(item=>{
      const treatmentId=str(item.body,'treatmentId');
      const treatment=treatments.find(record=>record.id===treatmentId && yes(record.body,'shared'));
      const choice=declarationChoices.find(choice=>choice.value===str(item.body,'status'));
      return <article key={item.id}>
        <div className="sn-history-row">
          <span>
            <strong>{treatment ? str(treatment.body,'name') : t('historicalTreatment')}</strong>
            <small>{t('treatmentReference')} : <bdi>{treatmentId}</bdi></small>
            <small>{choice ? t(choice.key) : '—'} · {dateLabel(item.createdAt,locale)}{str(item.body,'scheduledAt') && ` · ${new Date(str(item.body,'scheduledAt')).toLocaleTimeString(locale,{timeZone:'Africa/Algiers',hour:'2-digit',minute:'2-digit'})}`} · {t('version')} {item.version}</small>
            {str(item.body,'reason') && <p dir="auto">{str(item.body,'reason')}</p>}
          </span>
          <button type="button" className="sn-text-button" disabled={busy} onClick={()=>setEditing(editing===item.id?null:item.id)}>{t(editing===item.id?'cancel':'edit')}</button>
        </div>
        {editing===item.id && <HistoricalCorrection key={`${item.id}-${item.version}`} record={item} onSaved={()=>setEditing(null)}/>}
      </article>;
    })}
  </section>;
}
export function HistoricalCorrection({record,onSaved}:{record:SanadRecord;onSaved:()=>void}) {
  const {t,save,busy}=useSanad();
  const [reason,setReason]=useState(str(record.body,'reason'));
  const treatmentVersion=num(record.body,'treatmentVersion');
  if(!Number.isInteger(treatmentVersion) || !treatmentVersion || treatmentVersion<1) return <p className="sn-small">{t('historicalVersionMissing')}</p>;
  async function correct(status:AdherenceStatus) {
    if(await save('adherence',adherenceBody({id:str(record.body,'treatmentId'),version:treatmentVersion!},status,reason,undefined,record),record))onSaved();
  }
  return <div className="sn-form sn-declaration-form">
    <Field label={t('reason')} optional><input maxLength={2000} value={reason} onChange={event=>setReason(event.target.value)}/></Field>
    <div className="sn-dose-actions">{declarationChoices.map(({value,key,Icon})=><button type="button" key={value} disabled={busy} className={value==='taken'?'sn-button':'sn-button sn-secondary'} onClick={()=>correct(value)}><Icon size={20}/>{t(key)}</button>)}</div>
  </div>;
}
