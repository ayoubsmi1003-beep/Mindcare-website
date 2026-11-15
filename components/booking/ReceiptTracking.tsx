"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {RefreshCw,Phone,ArrowLeft} from 'lucide-react';
import {publicBookingApi} from '@/lib/booking-client';
import {preferenceReceiptSchema,receiptToken,type PreferenceReceipt} from '@/lib/booking-protocol';
import {useAppContext} from '@/lib/app-context';
import {clinic} from '@/content/clinic';
const labels={fr:{QUEUED:'Demande en file d’attente',RECEIVED:'Demande reçue par le cabinet',PENDING:'En attente de confirmation',CONFIRMED:'Rendez-vous confirmé par le cabinet',REJECTED:'Demande refusée',CANCELLED:'Rendez-vous annulé',EXPIRED:'Demande expirée',FAILED:'Demande non transmise',WITHDRAWN:'Demande retirée'},en:{QUEUED:'Request queued',RECEIVED:'Request received by the clinic',PENDING:'Awaiting clinic confirmation',CONFIRMED:'Appointment confirmed by the clinic',REJECTED:'Request declined',CANCELLED:'Appointment cancelled',EXPIRED:'Request expired',FAILED:'Delivery failed',WITHDRAWN:'Request withdrawn'},ar:{QUEUED:'الطلب في انتظار الإرسال للعيادة',RECEIVED:'استلمت العيادة الطلب',PENDING:'في انتظار تأكيد العيادة',CONFIRMED:'أكدت العيادة الموعد',REJECTED:'تم رفض الطلب',CANCELLED:'تم إلغاء الموعد',EXPIRED:'انتهت صلاحية الطلب',FAILED:'تعذر إرسال الطلب',WITHDRAWN:'تم سحب الطلب'}};
export function ReceiptTracking({token}:{token:string}){
 const {language}=useAppContext();
 const [receipt,setReceipt]=useState<PreferenceReceipt|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState('');
 const failure=language==='ar'?'تعذر التحقق أو تنفيذ الطلب. لا نفترض تأكيد الموعد أو سحب الطلب؛ اتصلوا بالعيادة.':language==='en'?'Unable to verify or perform this request. No confirmation or withdrawal is assumed; please call the clinic.':'Vérification ou action indisponible. Aucun rendez-vous confirmé ni retrait n’est présumé ; appelez le cabinet.';
 useEffect(()=>{
  let active=true;
  if(!receiptToken.safeParse(token).success)return;
  publicBookingApi({protocolVersion:2,op:'status',token}).then(data=>{if(active){setReceipt(preferenceReceiptSchema.parse(data));setError('');}}).catch(()=>{if(active)setError(failure);}).finally(()=>{if(active)setBusy(false);});
  return()=>{active=false;};
 },[token,failure]);
 const run=async(op:'status'|'cancel')=>{setBusy(true);setError('');try{setReceipt(preferenceReceiptSchema.parse(await publicBookingApi({protocolVersion:2,op,token})));}catch{setError(failure);}finally{setBusy(false);}};
 const state=receipt?.booking?.state??receipt?.delivery.state;
 const canWithdraw=state==='QUEUED'||state==='RECEIVED'||state==='PENDING';
 const invalid=!receiptToken.safeParse(token).success;
 return <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-[#10201F]/70 backdrop-blur-md">
  <section className="w-full max-w-xl bg-[#FCFAF6] dark:bg-[#12201E] rounded-3xl border border-[#EFE7DA] dark:border-[#243B37] shadow-2xl p-6 sm:p-8 space-y-6" aria-live="polite">
   <div><span className="text-xs uppercase tracking-[0.2em] text-[#4E7F77] dark:text-[#7FB5AB]">MindCare Center</span><h1 className="font-serif-display text-2xl text-[#10201F] dark:text-white">{language==='ar'?'متابعة طلبي':language==='en'?'Track my request':'Suivre ma demande'}</h1></div>
   <p className="text-sm text-[#4A605E] dark:text-[#B3CFC8]">{invalid?(language==='ar'?'رابط إيصال غير صالح':language==='en'?'Invalid receipt link':'Lien de reçu invalide'):state?labels[language][state]:busy?(language==='ar'?'جارٍ التحقق...':language==='en'?'Checking...':'Vérification en cours...'):failure}</p>
   {receipt&&<div className="p-5 rounded-2xl border border-[#EFE7DA] dark:border-[#243B37] bg-[#F7F2E9] dark:bg-[#172927] space-y-3 text-sm text-[#10201F] dark:text-white"><p className="break-all font-mono text-xs">{receipt.submissionId}</p>{receipt.booking?.state==='CONFIRMED'&&receipt.booking.startsAt?<p>{new Intl.DateTimeFormat(language,{timeZone:'Africa/Algiers',dateStyle:'medium',timeStyle:'short'}).format(new Date(receipt.booking.startsAt))}</p>:<p>{language==='ar'?'الوقت يؤكد عبر مكالمة من العيادة.':language==='en'?'The clinic calls to confirm the actual time.':'Le cabinet appelle pour confirmer l’horaire réel.'}</p>}{receipt.booking?.cancellationRequested&&<p>{language==='ar'?'استلمت العيادة طلب السحب.':language==='en'?'Withdrawal requested from the clinic.':'Retrait demandé au cabinet.'}</p>}</div>}
   {error&&<p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
   <div className="flex flex-wrap gap-3"><button disabled={busy||invalid} onClick={()=>run('status')} className="px-5 py-3 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] text-[#3D655F] dark:text-[#A5CEC4] text-xs font-semibold flex items-center gap-2 disabled:opacity-40"><RefreshCw className="w-4 h-4"/>{language==='ar'?'تحديث':language==='en'?'Refresh':'Actualiser'}</button>{canWithdraw&&<button disabled={busy||invalid} onClick={()=>run('cancel')} className="px-5 py-3 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] text-xs font-semibold disabled:opacity-40">{language==='ar'?'سحب طلبي':language==='en'?'Withdraw my request':'Retirer ma demande'}</button>}<a href={clinic.phoneHref} className="px-5 py-3 rounded-full bg-[#10201F] text-white text-xs font-semibold flex items-center gap-2"><Phone className="w-4 h-4"/>{language==='ar'?'الاتصال بالعيادة':language==='en'?'Call the clinic':'Appeler le cabinet'}</a></div>
   <Link href="/" className="text-xs text-[#4E7F77] dark:text-[#7FB5AB] flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>{language==='ar'?'العودة':language==='en'?'Back to home':'Retour à l’accueil'}</Link>
  </section>
 </div>;
}
