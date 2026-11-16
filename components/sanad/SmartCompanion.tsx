'use client';

import {ArrowRight,Compass,Download,FileText} from 'lucide-react';
import {weekFacts,nextStep} from '@/lib/sanad/insights';
import {dateLabel,day,useSanad} from './core';

export function SmartCompanion({compact=false}:{compact?:boolean}={}) {
  const {state,locale,t,go,openResource}=useSanad();
  const today=day(),facts=weekFacts(state.records,today),step=nextStep(state.records,today);
  const reasons={checkin:'smartReasonCheckin',prepare:'smartReasonPrepare',continue:'smartReasonContinue',activity:'smartReasonActivity',pause:'smartReasonPause'} as const;
  const titles={checkin:'smartNextCheckin',prepare:'smartNextPrepare',continue:'smartNextContinue',activity:'smartNextActivity',pause:'smartNextPause'} as const;
  const number=new Intl.NumberFormat(locale,{maximumFractionDigits:1});
  const sleep=facts.averageSleep===null?t('noData'):`${number.format(facts.averageSleep)} ${t('hoursShort')}`;
  const recap=[t('smartRecapTitle'),`${dateLabel(facts.days[0]!,locale)} — ${dateLabel(today,locale)}`,
    '',`${t('smartRecordedDays')} : ${number.format(facts.recordedDays)} / 7`,
    `${t('smartAverageSleep')} : ${sleep}`,`${t('smartSleepSamples')} : ${number.format(facts.sleepSamples)}`,
    `${t('smartPending')} : ${number.format(facts.pendingRequests)}`,'',t('smartNoInference'),t('smartRecapPrivacy'),t('demoNote')].join('\n');
  function download() {
    const url=URL.createObjectURL(new Blob([recap],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`sanad-${today}.txt`;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className="sn-intelligence" aria-labelledby={compact?undefined:'sn-smart-heading'} aria-label={compact?t('smartRecapTitle'):undefined}>
    {!compact&&<>
    <header><span className="sn-eyebrow">{t('smartEyebrow')}</span><h2 id="sn-smart-heading">{t('smartHeading')}</h2><p>{t('smartIntro')}</p></header>
    <div className="sn-intelligence-grid">
      <article className="sn-next-step"><Compass aria-hidden="true"/><span className="sn-eyebrow">{t('smartNext')}</span><h3>{t(titles[step.kind])}</h3><p>{t(reasons[step.kind])}</p><button type="button" className="sn-button" onClick={()=>{if(step.kind==='continue'&&openResource)openResource(step.resourceId);else go(step.screen);}}>{t('smartOpen')}<ArrowRight size={18}/></button><small className="sn-smart-note">{t('smartRuleNote')}</small></article>
      <article className="sn-insight-card"><span className="sn-eyebrow">{t('smartWeek')}</span><h3>{t('smartWeekTitle')}</h3><ol className="sn-week-strip">{facts.days.map(date=>{const observed=facts.observations.some(item=>item.date===date);return <li key={date}><time dateTime={date}>{new Intl.DateTimeFormat(locale,{weekday:'short',timeZone:'Africa/Algiers'}).format(new Date(`${date}T12:00:00+01:00`))}</time><span className="sn-week-point" data-recorded={observed} aria-label={`${dateLabel(date,locale)} · ${t(observed?'smartObserved':'noData')}`}>{observed?'·':'—'}</span></li>;})}</ol><dl className="sn-insight-stats"><div><dt>{t('smartRecordedDays')}</dt><dd>{number.format(facts.recordedDays)}<small> / 7</small></dd></div><div><dt>{t('smartAverageSleep')}</dt><dd>{sleep}</dd></div></dl><p className="sn-smart-note">{t('smartSleepSamples')} : {number.format(facts.sleepSamples)}. {t('smartNoInference')}</p></article>
    </div>
    </>}
    <details className="sn-summary-panel"><summary><FileText aria-hidden="true"/><span>{t('smartRecapTitle')}</span></summary><div className="sn-summary-copy"><p>{t('smartRecapPrivacy')}</p><pre dir="auto">{recap}</pre><div className="sn-actions"><button type="button" className="sn-button" onClick={download}><Download size={18}/>{t('smartDownload')}</button><button type="button" className="sn-text-button" onClick={()=>go('appointments')}>{t('smartAddQuestions')}</button></div></div></details>
  </section>;
}
