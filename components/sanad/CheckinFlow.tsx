'use client';

import {useEffect,useState,type FormEvent} from 'react';
import {Check,ChevronLeft,ChevronRight} from 'lucide-react';
import {contextTags,emotions,hasCheckinObservation,latestRecords,levels} from '@/lib/sanad/journey';
import {journeyCopy,type JourneyCopyKey} from '@/lib/sanad/i18n/journey';
import type {CopyKey} from '@/lib/sanad/i18n';
import {dateLabel,day,Field,num,Options,str,Submit,Title,useSanad,type Body,type SanadRecord} from './core';

export function EmotionFace({emotion}:{emotion:typeof emotions[number]}) {
  const mouth={happy:'M20 32 Q30 43 40 32',calm:'M23 34 Q30 38 37 34',excited:'M21 31 Q30 47 39 31 Z',tired:'M25 37 L35 37',sad:'M22 39 Q30 29 38 39',anxious:'M23 36 Q27 32 30 36 Q34 40 38 36'}[emotion];
  return <svg className={`mc-emotion-face mc-emotion-${emotion}`} width="64" height="64" viewBox="0 0 60 60" aria-hidden="true"><path d="M13 15 Q27 3 42 13 Q55 24 46 44 Q37 56 19 48 Q5 40 10 26Z" fill="currentColor" opacity=".14"/><path d="M13 15 Q27 3 42 13 Q55 24 46 44 Q37 56 19 48 Q5 40 10 26Z" fill="none" stroke="currentColor" strokeWidth="1.5"/><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{emotion==='calm'||emotion==='tired'?<><path d="M19 25 Q23 28 26 25 M34 25 Q38 28 41 25"/>{emotion==='tired'&&<path d="M18 20 L25 22 M35 22 L42 20"/>}</>:<><path d="M23 25 L23 28 M37 25 L37 28"/>{emotion==='anxious'&&<path d="M19 20 L26 18 M34 18 L41 20"/>}{emotion==='sad'&&<path d="M19 21 L26 19 M34 19 L41 21"/>}</>}<path d={mouth}/></g>{emotion==='excited'&&<path d="M5 8 L6 3 M1 6 L10 6 M49 8 L53 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}</svg>;
}

export function CheckinFlow() {
  const {state,t,save,locale,busy,go}=useSanad();
  const c=(key:JourneyCopyKey)=>journeyCopy(locale,key);
  const [date]=useState(day);
  const [editing,setEditing]=useState<SanadRecord|undefined>(()=>latestRecords(state.records).find(record=>record.kind==='checkin'&&record.body.date===date));
  const [body,setBody]=useState<Body>(()=>({...editing?.body,date}));
  const [step,setStep]=useState(0);
  const [dirty,setDirty]=useState(false);
  const [result,setResult]=useState<'saved'|'failed'|null>(null);
  useEffect(()=>{window.dispatchEvent(new CustomEvent('sanad-dirty',{detail:dirty}));return()=>{window.dispatchEvent(new CustomEvent('sanad-dirty',{detail:false}));};},[dirty]);
  function change(key:string,value:unknown){setBody(previous=>{const next={...previous};if(value===''||value===undefined)delete next[key];else next[key]=value;return next;});setDirty(true);setResult(null);}
  async function submit(event:FormEvent){event.preventDefault();if(step<2){setStep(step+1);return;}if(!hasCheckinObservation(body))return;const saved=await save('checkin',body,editing);if(saved){setEditing(saved);setBody(saved.body);setDirty(false);setResult('saved');}else setResult('failed');}
  const stepKeys=['stepEmotion','stepDay','stepRest'] as const;
  const tags=Array.isArray(body.contextTags)?body.contextTags.filter((tag):tag is string=>typeof tag==='string'):[];
  return <div className="sn-narrow mc-checkin" dir={locale==='ar'?'rtl':'ltr'}><Title eyebrow={dateLabel(date,locale,true)} description={c('checkinIntro')}>{c('checkinTitle')}</Title>
    <ol className="mc-checkin-steps" aria-label={c('step')}>{stepKeys.map((key,index)=><li key={key} aria-current={index===step?'step':undefined}><span aria-hidden="true">{index+1}</span>{c(key)}</li>)}</ol>
    <form className="sn-form sn-checkin-form" onSubmit={submit}>
      <p className="sn-eyebrow">{c('step')} {step+1} / 3 · {c(stepKeys[step])}</p>
      {step===0&&<><fieldset className="mc-emotions" disabled={busy}><legend>{c('emotion')} <small>{t('optional')}</small></legend><div>{emotions.map(emotion=><button type="button" key={emotion} aria-pressed={body.emotion===emotion} onClick={()=>change('emotion',body.emotion===emotion?undefined:emotion)}><EmotionFace emotion={emotion}/><span>{c(emotion)}</span></button>)}</div></fieldset>
        <Options label={t('mood')} options={['difficult','mixed','calm'].map(value=>({value,label:t(value as CopyKey)}))} value={str(body,'mood')} onChange={value=>change('mood',value)}/>
        <fieldset className="sn-options mc-intensity" disabled={busy}><legend>{c('intensity')}</legend><p className="sn-small">{c('intensityHint')}</p><div>{[1,2,3,4,5].map(value=><button type="button" key={value} aria-label={`${c('intensity')} ${value} / 5`} aria-pressed={body.intensity===value} onClick={()=>change('intensity',body.intensity===value?undefined:value)}>{value}</button>)}</div></fieldset></>}
      {step===1&&<>{(['anxiety','stress','energy'] as const).map(key=><Options key={key} label={key==='stress'?c('stress'):t(key)} options={levels.map(value=>({value,label:t(value)}))} value={str(body,key)} onChange={value=>change(key,value)}/>)}</>}
      {step===2&&<><Field label={t('sleep')} optional><input type="number" min="0" max="24" step="any" inputMode="decimal" value={num(body,'sleepHours')??''} onChange={event=>change('sleepHours',event.target.value===''?undefined:Number(event.target.value))}/></Field>
        <Options label={c('sleepQuality')} options={(['poor','fair','restful'] as const).map(value=>({value,label:c(value)}))} value={str(body,'sleepQuality')} onChange={value=>change('sleepQuality',value)}/>
        <fieldset className="sn-options" disabled={busy}><legend>{c('context')}</legend><div>{contextTags.map(tag=><button type="button" key={tag} aria-pressed={tags.includes(tag)} onClick={()=>change('contextTags',tags.includes(tag)?tags.filter(value=>value!==tag):[...tags,tag])}>{c(tag)}</button>)}</div></fieldset>
        <Field label={c('note')} optional><textarea rows={3} maxLength={6000} value={str(body,'note')} onChange={event=>change('note',event.target.value)} dir="auto"/></Field>
        <Field label={t('effects')} optional><textarea rows={2} maxLength={6000} value={str(body,'effects')} onChange={event=>change('effects',event.target.value)} dir="auto"/></Field>
        <p className="sn-small">{t('checkinPrivacy')}</p></>}
      <div className="sn-actions">{step>0&&<button type="button" className="sn-button sn-secondary" disabled={busy} onClick={()=>setStep(step-1)}><ChevronLeft aria-hidden="true" size={18}/>{c('back')}</button>}{step<2?<><button type="submit" className="sn-button" disabled={busy}>{c('next')}<ChevronRight aria-hidden="true" size={18}/></button><button type="button" className="sn-text-button" disabled={busy} onClick={()=>setStep(step+1)}>{c('skip')}</button></>:<Submit disabled={!hasCheckinObservation(body)}><Check size={18} aria-hidden="true"/>{t('save')}</Submit>}</div>
      {result&&<p role={result==='failed'?'alert':'status'} className={result==='failed'?'sn-error':'sn-success'}>{c(result==='failed'?'saveFailed':'saved')}</p>}
      {result==='saved'&&<button type="button" className="sn-text-button" onClick={()=>go('followup')}>{c('journey')}</button>}
    </form></div>;
}
