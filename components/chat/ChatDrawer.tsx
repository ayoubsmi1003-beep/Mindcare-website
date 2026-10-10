"use client";
import {useState} from 'react';
import {useAppContext} from '@/lib/app-context';
import {bookingText} from '@/lib/i18n/booking';
import {publicBookingApi,clinicDate,slotLabel} from '@/lib/booking-client';
import {genericChatResult,type ChatIntent} from '@/lib/booking-protocol';
export function ChatDrawer({isOpen,onClose,onOpenBooking}:{isOpen:boolean;onClose:()=>void;onOpenBooking:()=>void}){
 const {language}=useAppContext(),t=bookingText[language];const [date,setDate]=useState(clinicDate),[reply,setReply]=useState<ReturnType<typeof genericChatResult.parse>|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function ask(intent:ChatIntent){setBusy(true);setError('');try{setReply(genericChatResult.parse(await publicBookingApi({op:'chat',intent,locale:language,...(intent==='availability'?{date}:{})})));}catch{setReply(null);setError(t.unavailable);}finally{setBusy(false);}}
 if(!isOpen)return null;
 return <div className="fixed inset-0 z-[100] bg-black/50 flex justify-end" dir={language==='ar'?'rtl':'ltr'}>
  <section role="dialog" aria-modal="true" aria-label={t.chat} className="w-full sm:max-w-md h-full overflow-y-auto bg-[#FCFAF6] dark:bg-[#12201E] text-[#10201F] dark:text-white p-6 space-y-5">
   <header className="flex justify-between gap-4"><h2 className="text-xl">{t.chat}</h2><button onClick={onClose}>{t.close}</button></header>
   <p>{t.privacy}</p><label className="block">{t.date}<input className="w-full border rounded-xl p-3 bg-transparent" type="date" value={date} min={clinicDate()} onChange={e=>setDate(e.target.value)}/></label>
   <div className="flex flex-wrap gap-3">{(['availability','booking','privacy'] as const).map(intent=><button className="border rounded-xl p-3 disabled:opacity-50" disabled={busy||intent==='availability'&&!date} key={intent} onClick={()=>void ask(intent)}>{intent==='privacy'?t.privacyButton:t[intent]}</button>)}</div>
   {error&&<p role="alert">{error}</p>}
   {reply&&<div aria-live="polite" className="space-y-3"><p>{reply.aiAvailable?t.aiOnline:t.aiOffline}</p><p>{reply.code==='PRIVACY_GUIDANCE'?t.privacyGuidance:t.guidance}</p>{reply.availability&&<><p>{reply.availability.slots.length?t.availability:t.empty}</p><ul>{reply.availability.slots.map(s=><li key={s.token}>{slotLabel(s.startsAt,language)}</li>)}</ul></>}</div>}
   <button className="border rounded-xl p-3" onClick={onOpenBooking}>{t.openBooking}</button>
  </section>
 </div>;
}
