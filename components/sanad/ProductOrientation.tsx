'use client';
import {useState} from 'react';
import {ArrowRight,Bell,LockKeyhole,Check} from 'lucide-react';
import {useSanad} from './core';
import {productText} from '@/lib/sanad/i18n/product';
import {ProductDialog} from './ProductDialog';
import {JourneyLandscape} from './ProductArt';
export function ProductOrientation({onClose}:{onClose:()=>void}){
 const {state,locale,save,busy}=useSanad(),[step,setStep]=useState(0),[ack,setAck]=useState(false),[reminders,setReminders]=useState(false);
 const p=(key:Parameters<typeof productText>[1])=>productText(locale,key);
 async function finish(){
  const prior=state.records.find(r=>r.kind==='consent'&&r.body.purpose==='privacy-notice');
  if(!await save('consent',{purpose:'privacy-notice',noticeVersion:1,accepted:true},prior))return;
  const reminderConsent=state.records.find(r=>r.kind==='consent'&&r.body.purpose==='in-app-reminders');
  if(!await save('consent',{purpose:'in-app-reminders',noticeVersion:1,accepted:reminders},reminderConsent))return;
  const preferences=state.records.find(r=>r.kind==='preferences');
  if(await save('preferences',{...preferences?.body,onboardingVersion:1,notifications:reminders,reminderDays:reminders?[1,2,3,4,5,6,7]:[]},preferences))onClose();
 }
 return <ProductDialog title={p(step===0?'onboardingTitle':step===1?'privacyTitle':'remindersTitle')} locale={locale} onClose={onClose}><div className="mc-orientation"><div className="mc-orientation-art">{step===0?<JourneyLandscape/>:step===1?<LockKeyhole size={58}/>:<Bell size={58}/>}</div><p>{p(step===0?'onboardingIntro':step===1?'privacyBody':'remindersBody')}</p><div className="mc-step-dots" aria-label={`${step+1} / 3`}>{[0,1,2].map(n=><span key={n} data-current={n===step}/>)}</div>{step===1&&<label className="sn-toggle"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/><span>{p('acknowledge')}</span></label>}{step===2&&<label className="sn-toggle"><input type="checkbox" checked={reminders} onChange={e=>setReminders(e.target.checked)}/><span>{p('dailyReminder')}</span></label>}<div className="sn-actions"><button type="button" className="sn-button" disabled={busy||(step===1&&!ack)} onClick={()=>{if(step<2)setStep(step+1);else void finish();}}>{p(step===2?'finish':'next')}{step===2?<Check size={18}/>:<ArrowRight size={18}/>}</button><button type="button" className="sn-text-button" disabled={busy} onClick={onClose}>{p('later')}</button></div></div></ProductDialog>;
}
