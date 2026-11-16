'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {motion} from 'motion/react';
import {ArrowRight,Pause,Play,Square} from 'lucide-react';
import {translate,type Locale} from '@/lib/sanad/i18n';
import {useMotionPreference} from './motionPreference';

const duration=30;

export function HealingPresence({onExplore,locale}:{onExplore?:()=>void;locale:Locale}) {
  const reduced=useMotionPreference();
  const gradient=useId();
  const elapsedMs=useRef(0);
  const [elapsed,setElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const [finished,setFinished]=useState(false);
  const t=(key:Parameters<typeof translate>[1])=>translate(locale,key);

  useEffect(()=>{
    if(!running)return;
    let previous=performance.now();
    function advance() {
      if(document.hidden){setRunning(false);return;}
      const now=performance.now();
      elapsedMs.current=Math.min(duration*1000,elapsedMs.current+now-previous);
      previous=now;
      setElapsed(Math.floor(elapsedMs.current/1000));
      if(elapsedMs.current>=duration*1000){setRunning(false);setFinished(true);}
    }
    const timer=window.setInterval(advance,100);
    function visibility(){if(document.hidden){advance();setRunning(false);}}
    document.addEventListener('visibilitychange',visibility);
    return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',visibility);};
  },[running]);

  function toggle() {
    if(running){setRunning(false);return;}
    if(finished){elapsedMs.current=0;setElapsed(0);setFinished(false);}
    setRunning(true);
  }
  const cycle=elapsed%10;
  const phase=running?(cycle<4?'healingInhale':'healingExhale'):finished?'healingFinish':'healingRest';
  const expansion=cycle<4?cycle/4:(10-cycle)/6;
  const scale=reduced||!running?1:.95+expansion*.1;

  return <section className="sn-healing-presence" aria-label={t('healingTitle')} data-running={running} data-reduced={reduced}>
    <div className="sn-healing-copy"><h2>{t('healingTitle')}</h2><p>{t('healingIntro')}</p></div>
    <div className="sn-healing-scene">
      <motion.svg viewBox="0 0 360 290" aria-hidden="true" focusable="false" animate={{scale}} transition={{duration:reduced?0:running?1:.35,ease:'linear'}}>
        <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--sn-healing-start)"/><stop offset="48%" stopColor="var(--sn-healing-mid)"/><stop offset="100%" stopColor="var(--sn-healing-end)"/></linearGradient></defs>
        <path className="sn-healing-heart-shadow" d="M180 245C128 211 73 176 73 123C73 89 95 65 124 65C150 65 169 83 180 103C191 83 210 65 236 65C265 65 287 89 287 123C287 176 232 211 180 245Z"/>
        <path className="sn-healing-heart" stroke={`url(#${gradient})`} d="M180 245C128 211 73 176 73 123C73 89 95 65 124 65C150 65 169 83 180 103C191 83 210 65 236 65C265 65 287 89 287 123C287 176 232 211 180 245Z"/>
        <path className="sn-healing-heart-light" d="M180 234C132 203 85 169 85 123C85 96 101 77 124 77C147 77 166 99 180 121"/>
        <path className="sn-healing-wave" d="M112 151C128 132 144 132 160 151S192 170 208 151S240 132 256 151"/>
      </motion.svg>
      <span className="sn-healing-phase" role="status" aria-live="polite" aria-atomic="true">{t(phase)}</span>
    </div>
    <progress className="sn-healing-progress" max={duration} value={elapsed} aria-label={t('healingTitle')}/>
    <div className="sn-healing-controls">
      <button type="button" className="sn-healing-toggle" onClick={toggle}>{running?<Pause size={15} aria-hidden="true"/>:<Play size={15} aria-hidden="true"/>}{t(running?'healingPause':elapsed>0&&!finished?'resume':'healingBegin')}</button>
      <button type="button" className="sn-healing-end" disabled={finished||(!running&&elapsed===0)} onClick={()=>{setRunning(false);setFinished(true);}}><Square size={13} aria-hidden="true"/>{t('stop')}</button>
    </div>
    {onExplore&&<button type="button" className="sn-healing-explore" onClick={onExplore}>{t('healingResource')}<ArrowRight size={15} aria-hidden="true"/></button>}
    <p className="sn-healing-disclaimer">{t('healingDisclaimer')}</p>
  </section>;
}
