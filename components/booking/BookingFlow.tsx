"use client";
import {useCallback,useEffect,useRef,useState,type FormEvent} from 'react';
import {useAppContext} from '@/lib/app-context';
import {publicBookingApi,newReceipt,clinicDate,slotLabel} from '@/lib/booking-client';
import {bookingText} from '@/lib/i18n/booking';
import {availabilitySchema,statusSchema,publicBookingInput,type Availability,type BookingStatus,type PublicBookingInput} from '@/lib/booking-protocol';
const key='mindcare-booking-receipt-v1';
const button='rounded-xl border px-4 py-3 hover:bg-emerald-100 dark:hover:bg-emerald-950 disabled:opacity-50';
const field='w-full rounded-xl border p-3 bg-transparent';
export function BookingFlow({isOpen,onClose}:{isOpen:boolean;onClose:()=>void;initialMotif?:string}){
 const {language}=useAppContext(),t=bookingText[language];
 const [date,setDate]=useState(clinicDate),[slots,setSlots]=useState<Availability|null>(null),[selected,setSelected]=useState(''),[status,setStatus]=useState<BookingStatus|null>(null);
 const [receipt,setReceipt]=useState<ReturnType<typeof newReceipt>|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [payload,setPayload]=useState<PublicBookingInput|null>(null),[canRestart,setCanRestart]=useState(false);const dialog=useRef<HTMLDivElement>(null),notFoundSince=useRef(0),generation=useRef(0),checking=useRef(false);
 const check=useCallback(async(token:string)=>{
  if(checking.current)return;checking.current=true;
  const observedGeneration=generation.current;
  try{const data=statusSchema.parse(await publicBookingApi({op:'status',token}));if(observedGeneration!==generation.current)return;setStatus(data);setError('');setCanRestart(false);notFoundSince.current=0;}
  catch(error){
   if(observedGeneration!==generation.current)return;
   if(error instanceof Error&&error.message==='NOT_FOUND'){
    if(!notFoundSince.current)notFoundSince.current=Date.now();
    // Wait beyond the server's maximum ingress deadline, then verify absence again.
    if(Date.now()-notFoundSince.current>=60000){setCanRestart(true);setError(t.notFound);return;}
   }
   setError(t.unknown);
  }finally{checking.current=false;}
 },[t]);
 useEffect(()=>{
  if(!isOpen)return;
  const previous=document.activeElement as HTMLElement|null;dialog.current?.focus();let stopped=false;
  void Promise.resolve().then(()=>{if(stopped)return;try{const saved=sessionStorage.getItem(key);if(saved){const r=JSON.parse(saved);if(/^[a-f0-9]{64}$/.test(r.token)&&typeof r.submissionId==='string'){setReceipt(r);void check(r.token);}}}catch{/* storage unavailable; capability remains in memory */}});
  const keyboard=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const items=dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]');if(items?.length){const first=items[0]!,last=items[items.length-1]!;if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}};
  document.addEventListener('keydown',keyboard);return()=>{stopped=true;document.removeEventListener('keydown',keyboard);previous?.focus();};
 },[isOpen,onClose,check]);
 useEffect(()=>{if(!isOpen||!receipt)return;const timer=setInterval(()=>void check(receipt.token),15000);return()=>clearInterval(timer);},[isOpen,receipt,check]);
 async function availability(){setBusy(true);setError('');setSelected('');try{setSlots(availabilitySchema.parse(await publicBookingApi({op:'availability',date})));}catch{setSlots(null);setError(t.unavailable);}finally{setBusy(false);}}
 async function send(input:PublicBookingInput){generation.current++;setCanRestart(false);notFoundSince.current=0;setBusy(true);setError('');try{setStatus(statusSchema.parse(await publicBookingApi(input)));}catch{setError(t.unknown);if(input.op==='submit')void check(input.token);}finally{setBusy(false);}}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!slots||new Date(slots.expiresAt).getTime()<=Date.now()){setError(t.unavailable);setSlots(null);return;}
  const values=new FormData(e.currentTarget),r=newReceipt();
  const input:PublicBookingInput={op:'submit',...r,slotToken:selected,firstName:String(values.get('firstName')),lastName:String(values.get('lastName')),phone:String(values.get('phone')),consent:true,locale:language};
  const parsed=publicBookingInput.safeParse(input);if(!parsed.success){setError(t.first+' / '+t.last+' / '+t.phone);return;}
  setPayload(parsed.data);setReceipt(r);try{sessionStorage.setItem(key,JSON.stringify(r));}catch{}await send(parsed.data);
 }
 if(!isOpen)return null;
 return <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
  <div ref={dialog} role="dialog" aria-modal="true" aria-label={t.title} tabIndex={-1} dir={language==='ar'?'rtl':'ltr'} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FCFAF6] dark:bg-[#12201E] text-[#10201F] dark:text-white p-6 space-y-5">
   <div className="flex items-center justify-between gap-4"><h2 className="text-2xl">{t.title}</h2><button className={button} onClick={onClose}>{t.close}</button></div>
   <p>{t.privacy}</p>
   {error&&<p role="alert">{error}</p>}
   {receipt?<section aria-live="polite" className="space-y-4">
    {status?<><p data-testid="booking-state" className="text-lg font-semibold">{t[status.state]}</p><p>{t.reference}: {status.reference}</p>{status.startsAt&&<p>{slotLabel(status.startsAt,language)}</p>}{status.proposedStartsAt&&<p>{t.proposal}: {slotLabel(status.proposedStartsAt,language)}</p>}{status.cancellationRequested&&<p>{t.cancelRequested}</p>}</>:<p>{t.unknown}</p>}
    <button className={button} disabled={busy} onClick={()=>void check(receipt.token)}>{t.check}</button>
    {!status&&payload&&<button className={button} disabled={busy} onClick={()=>void send(payload)}>{t.retry}</button>}
    {status&&['PENDING','CONFIRMED'].includes(status.state)&&<button className={button} disabled={busy||status.cancellationRequested} onClick={()=>void send({op:'cancel',token:receipt.token})}>{t.cancel}</button>}
    {(canRestart||status&&['REJECTED','CANCELLED','EXPIRED'].includes(status.state))&&<button className={button} disabled={busy} onClick={()=>{generation.current++;try{sessionStorage.removeItem(key);}catch{}setReceipt(null);setStatus(null);setPayload(null);setSlots(null);setSelected('');setCanRestart(false);notFoundSince.current=0;setError('');}}>{t.new}</button>}
   </section>:<>
    <label className="block">{t.date}<input className={field} type="date" value={date} min={clinicDate()} onChange={e=>{setDate(e.target.value);setSlots(null);setSelected('');}}/></label>
    <button className={button} disabled={busy||!date} onClick={()=>void availability()}>{busy?t.busy:t.load}</button>
    {slots&&<div className="space-y-4"><p>{slots.slots.length?t.date:t.empty}</p><div className="flex flex-wrap gap-2">{slots.slots.map(s=><button key={s.token} className={button} aria-pressed={selected===s.token} onClick={()=>setSelected(s.token)}>{slotLabel(s.startsAt,language)}</button>)}</div></div>}
    {selected&&<form onSubmit={submit} className="space-y-4">
     <label className="block">{t.first}<input className={field} name="firstName" autoComplete="given-name" maxLength={80} required/></label>
     <label className="block">{t.last}<input className={field} name="lastName" autoComplete="family-name" maxLength={80} required/></label>
     <label className="block">{t.phone}<input className={field} name="phone" type="tel" autoComplete="tel" maxLength={24} required/></label>
     <label className="flex gap-3"><input name="consent" type="checkbox" required/>{t.consent}</label>
     <button className={button} type="submit" disabled={busy}>{busy?t.busy:t.submit}</button>
    </form>}
   </>}
  </div>
 </div>;
}
