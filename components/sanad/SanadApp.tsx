'use client';

import {useCallback,useEffect,useRef,useState, type FormEvent} from 'react';
import Link from 'next/link';
import {ArrowRight,BookOpen,CalendarDays,ChevronLeft,ClipboardList,HelpCircle,Home,Leaf,LogOut,MessageCircle,Pill,ShieldCheck,Sprout,UserRound,Wind} from 'lucide-react';
import {languageNames,locales,translate,type CopyKey,type Locale} from '@/lib/sanad/i18n';
import {Context,day,dateLabel,str,useSanad,type Body,type PatientState,type SanadRecord,type Screen} from './core';
import {Checkin,Followup,Treatment} from './Tracking';
import {Resources} from './Resources';
import {Appointments,Chat,Help,Messages,Settings} from './Spaces';

const tabs = [{key:'today',Icon:Home},{key:'followup',Icon:ClipboardList},{key:'chat',Icon:Sprout},{key:'resources',Icon:BookOpen},{key:'space',Icon:UserRound}] as const;
class ApiError extends Error { constructor(public status: number, public code: string) { super(code); } }
async function api(path: string, body?: Body, signal?: AbortSignal) {
  const controller=new AbortController();
  const abort=()=>controller.abort();
  if(signal?.aborted)controller.abort();else signal?.addEventListener('abort',abort,{once:true});
  const timeout=setTimeout(abort,20000);
  try {
  const response = await fetch(`/api/sanad/${path}`, {method:body ? 'POST' : 'GET',credentials:'same-origin',cache:'no-store',headers:body ? {'Content-Type':'application/json'} : undefined,body:body ? JSON.stringify(body) : undefined,signal:controller.signal});
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, data.error || 'error');
  return data;
  } finally {clearTimeout(timeout);signal?.removeEventListener('abort',abort);}
}
export function SanadApp() {
  const [state,setState] = useState<PatientState | null>(null);
  const [locale,setLocale] = useState<Locale>('fr');
  const [screen,setScreen] = useState<Screen>('today');
  const [auth,setAuth] = useState(false);
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState<CopyKey | null>(null);
  const [error,setError] = useState<CopyKey | null>(null);
  const [offline,setOffline] = useState(false);
  const main = useRef<HTMLElement>(null);
  const requestLock = useRef(false);
  const pendingKeys = useRef(new Map<string,string>());
  const commandAbort = useRef<AbortController | null>(null);
  const t = useCallback((key: CopyKey) => translate(locale,key),[locale]);
  function handleError(error: unknown) {
    setNotice(null);
    if (error instanceof ApiError) {
      if (error.status === 401) {pendingKeys.current.clear();setState(null);setAuth(false);setError('sessionExpired');}
      else setError(error.status === 403 ? 'denied' : error.status === 409 ? 'conflict' : error.status === 429 ? 'rateLimited' : error.status === 503 ? 'unavailable' : 'error');
    } else setError(navigator.onLine ? 'error' : 'offline');
  }
  const load = useCallback(async () => {
    try { const data = await api('state') as PatientState; setState(data);setAuth(true); return data; }
    catch(error) { handleError(error); return null; }
  },[]);
  useEffect(() => { let active = true; api('state').then((data: PatientState) => {if(active){setState(data);setAuth(true);setLocale(locales.includes(data.profile.locale) ? data.profile.locale : 'fr');}}).catch(error => {if(active && !(error instanceof ApiError && error.status === 401)) handleError(error);}).finally(() => {if(active) setLoading(false);}); return () => {active = false;}; },[]);
  useEffect(() => { const update = () => setOffline(!navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);return () => {window.removeEventListener('online',update);window.removeEventListener('offline',update);}; },[]);
  useEffect(() => {if('serviceWorker' in navigator) void navigator.serviceWorker.register('/sanad/sw.js',{scope:'/sanad'}).catch(()=>{/* The app remains usable without offline installation. */});},[]);
  function go(next: Screen) {setScreen(next);setNotice(null);setError(null);window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(() => main.current?.focus({preventScroll:true}));}
  async function command(body: Body) {
    if (requestLock.current) return null;
    if(!navigator.onLine){setError('offline');return null;}
    requestLock.current = true;setBusy(true);setError(null);setNotice(null);
    const signature=JSON.stringify(body);
    const key=pendingKeys.current.get(signature)||crypto.randomUUID();
    pendingKeys.current.set(signature,key);
    commandAbort.current=new AbortController();
    try {const data = await api('command',{...body,idempotencyKey:key},commandAbort.current.signal);commandAbort.current=null;pendingKeys.current.delete(signature);const fresh = await load();if(fresh) setNotice('saved');return data as Body;}
    catch(error) {handleError(error);return null;} finally {commandAbort.current=null;requestLock.current=false;setBusy(false);}
  }
  async function save(kind: string,body: Body,record?: SanadRecord) { const result = await command({action:'save',kind,body,...(record ? {id:record.id,expectedVersion:record.version} : {})});return result?.record as SanadRecord | undefined || null; }
  async function password(currentPassword: string,newPassword: string) {if(requestLock.current)return false;requestLock.current=true;setBusy(true);setError(null);try {await api('password',{currentPassword,newPassword});pendingKeys.current.clear();setState(null);setAuth(false);setScreen('today');setNotice('passwordChanged');return true;}catch(error){handleError(error);return false;}finally{requestLock.current=false;setBusy(false);}}
  async function signOut() {if(requestLock.current)return;requestLock.current=true;setBusy(true);try{await api('sign-out',{});pendingKeys.current.clear();setState(null);setAuth(false);setScreen('today');setError(null);setNotice(null);}catch(error){handleError(error);}finally{requestLock.current=false;setBusy(false);}}
  async function login(event: FormEvent<HTMLFormElement>) {event.preventDefault();if(requestLock.current)return;requestLock.current=true;setBusy(true);setError(null);const fields = new FormData(event.currentTarget);try{await api('sign-in',{phone:fields.get('phone'),password:fields.get('password')});const fresh = await load();if(fresh){setScreen('today');setLocale(locales.includes(fresh.profile.locale) ? fresh.profile.locale : 'fr');}}catch(error){if(error instanceof ApiError&&error.status===401)setError('authError');else handleError(error);}finally{requestLock.current=false;setBusy(false);}}
  const localePicker = <label className="sn-language"><span className="sn-sr-only">{t('language')}</span><select value={locale} onChange={event => setLocale(event.target.value as Locale)}>{locales.map(value => <option key={value} value={value}>{languageNames[value]}</option>)}</select></label>;
  const status = <>{offline && <div className="sn-banner sn-warning" role="status">{t('offline')}</div>}{error && <div className="sn-banner sn-error" role="alert">{t(error)}{auth && <button type="button" onClick={() => {setError(null);void load();}}>{t('reload')}</button>}</div>}{notice && <div className="sn-banner sn-success" role="status">{t(notice)}</div>}</>;
  if(loading) return <div className="sn-app sn-loading" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><Sprout size={42} aria-hidden="true"/><p role="status">{t('loading')}</p></div>;
  if(!auth || !state) return <div className="sn-app sn-login" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><section className="sn-login-art" aria-hidden="true"><div className="sn-wordmark"><Sprout/>sanad</div><img src="/sanad/garden.webp" alt=""/><p>{t('oneStep')}</p></section><main className="sn-login-main"><div className="sn-login-top"><Link href="/" className="sn-wordmark"><Sprout/>sanad</Link>{localePicker}</div><span className="sn-tag">{t('demo')}</span><h1>{t('welcome')}</h1><p className="sn-lead">{t('loginIntro')}</p>{status}<form onSubmit={login} className="sn-form"><label className="sn-field"><span>{t('phone')}</span><input dir="ltr" name="phone" type="tel" autoComplete="username" required maxLength={30}/></label><label className="sn-field"><span>{t('password')}</span><input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label><button type="submit" className="sn-button" disabled={busy || offline}>{busy ? t('loading') : t('signIn')}<ArrowRight size={19}/></button></form><p className="sn-small sn-login-help"><ShieldCheck size={20}/>{t('loginHelp')}</p><p className="sn-small">{t('demoNote')}</p></main></div>;
  const activeTab = ['checkin','treatment'].includes(screen) ? 'followup' : ['messages','appointments','help'].includes(screen) ? '' : screen;
  return <Context.Provider value={{state,locale,setLocale,t,go,busy,save,command,cancelCommand:()=>commandAbort.current?.abort(),password,signOut,reload:async()=>{await load();}}}><div className="sn-app" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><aside className="sn-sidebar"><a href="/sanad" className="sn-wordmark"><Sprout/>sanad</a><span className="sn-tag">{t('demo')}</span><nav aria-label={t('space')}>{tabs.map(({key,Icon})=><button key={key} type="button" aria-current={activeTab===key?'page':undefined} onClick={()=>go(key)}><Icon size={21}/>{t(key)}</button>)}</nav><div className="sn-sidebar-bottom"><button type="button" onClick={()=>go('help')}><HelpCircle size={19}/>{t('help')}</button><button type="button" disabled={busy} onClick={signOut}><LogOut size={19}/>{t('signOut')}</button><p>{t('demoNote')}</p></div></aside><div className="sn-workspace"><header className="sn-topbar"><a href="/sanad" className="sn-wordmark sn-mobile-brand"><Sprout/>sanad</a><span className="sn-mobile-demo">{t('demo')}</span><span className="sn-desktop-label">{t('demo')}</span><div className="sn-top-actions">{localePicker}<button type="button" className="sn-icon-button" onClick={()=>go('appointments')} aria-label={t('appointments')}><CalendarDays size={21}/></button><button type="button" className="sn-icon-button sn-help-button" onClick={()=>go('help')} aria-label={t('help')}><HelpCircle size={21}/><span>{t('help')}</span></button></div></header><main ref={main} tabIndex={-1} className={`sn-main sn-screen-${screen}`}><div className="sn-status">{status}</div>{!tabs.some(tab=>tab.key===screen) && <button type="button" className="sn-back" onClick={()=>go(screen==='checkin'||screen==='treatment'?'followup':'today')}><ChevronLeft size={18}/>{t('back')}</button>}{screen==='today' && <Today/>}{screen==='followup' && <Followup/>}{screen==='checkin' && <Checkin/>}{screen==='treatment' && <Treatment/>}{screen==='resources' && <Resources/>}{screen==='chat' && <Chat/>}{screen==='appointments' && <Appointments/>}{screen==='messages' && <Messages/>}{screen==='help' && <Help/>}{screen==='space' && <Settings/>}</main></div><nav className="sn-bottom-nav" aria-label={t('space')}>{tabs.map(({key,Icon})=><button key={key} type="button" aria-current={activeTab===key?'page':undefined} onClick={()=>go(key)}><Icon size={22}/><span>{t(key)}</span></button>)}</nav></div></Context.Provider>;
}
function Today() {
  const {state,t,go,locale}=useSanad();
  const checkin=state.records.find(record=>record.kind==='checkin' && str(record.body,'date')===day());
  const next=state.records.filter(record=>record.kind==='appointment' && str(record.body,'date')>=day() && str(record.body,'status')==='confirmed').sort((a,b)=>str(a.body,'date').localeCompare(str(b.body,'date')))[0];
  const preferences=state.records.find(record=>record.kind==='preferences');
  const name=(preferences && str(preferences.body,'displayName')) || state.profile.displayName;
  return <><section className="sn-today-hero"><div className="sn-hero-copy"><span className="sn-eyebrow">{t('greeting')}, {name}</span><p className="sn-date">{dateLabel(day(),locale,true)}</p><h1>{t('oneStep')}</h1><p>{t('todayIntro')}</p></div><img className="sn-hero-garden" src="/sanad/garden.webp" alt="" fetchPriority="high"/><span className="sn-hero-mark" aria-hidden="true"><Leaf/></span></section><div className="sn-today-grid"><section className="sn-checkin-prompt"><div className="sn-flower" aria-hidden="true"><Sprout size={82}/></div><div><span className="sn-eyebrow">{t('today')}</span><h2>{t('checkinTitle')}</h2><p>{t(checkin?'checkinDone':'checkinIntro')}</p><button type="button" className="sn-button" onClick={()=>go('checkin')}>{t(checkin?'editCheckin':'doCheckin')}<ArrowRight size={18}/></button></div></section><section className="sn-quick-links"><button type="button" onClick={()=>go('treatment')}><span className="sn-link-icon"><Pill/></span><span><strong>{t('treatment')}</strong><small>{t('treatmentHint')}</small></span><ArrowRight size={20}/></button><button type="button" onClick={()=>go('appointments')}><span className="sn-link-icon"><CalendarDays/></span><span><strong>{t('appointmentNext')}</strong><small>{next ? `${dateLabel(str(next.body,'date'),locale)} · ${str(next.body,'startTime')}` : t('noAppointment')}</small></span><ArrowRight size={20}/></button><button type="button" className="sn-coral-link" onClick={()=>go('resources')}><span className="sn-link-icon"><Wind/></span><span><strong>{t('breatheMoment')}</strong></span><ArrowRight size={20}/></button></section></div><section className="sn-chat-invite"><span className="sn-orbit" aria-hidden="true"><Sprout/></span><div><span className="sn-eyebrow">{t('scenario')}</span><h2>{t('talk')}</h2></div><button type="button" className="sn-round-arrow" aria-label={t('chat')} onClick={()=>go('chat')}><ArrowRight/></button></section><button type="button" className="sn-text-button sn-cabinet-link" onClick={()=>go('messages')}><MessageCircle size={18}/>{t('messages')}</button></>;
}
