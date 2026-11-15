"use client";

import React from "react";
import { motion } from "motion/react";
import { BookingConfirmation } from "@/lib/types";
import { clinic } from "@/content/clinic";
import { Phone, CheckCircle2, RefreshCw, MapPin } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface BookingSuccessProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  token: string;
}

export function BookingSuccess({ confirmation, onRefresh, isRefreshing, token }: BookingSuccessProps) {
  const { language } = useAppContext();

  const receipt=confirmation.receipt;
  const state=receipt.booking?.state ?? receipt.delivery.state;
  const labels={
    fr:{QUEUED:'Demande en file d’attente',RECEIVED:'Demande reçue par le cabinet',PENDING:'Demande en attente de confirmation',CONFIRMED:'Rendez-vous confirmé par le cabinet',REJECTED:'Demande refusée',CANCELLED:'Rendez-vous annulé',EXPIRED:'Demande expirée',FAILED:'Demande non transmise',WITHDRAWN:'Demande retirée'},
    en:{QUEUED:'Request queued for delivery',RECEIVED:'Request received by the clinic',PENDING:'Awaiting clinic confirmation',CONFIRMED:'Appointment confirmed by the clinic',REJECTED:'Request declined',CANCELLED:'Appointment cancelled',EXPIRED:'Request expired',FAILED:'Request delivery failed',WITHDRAWN:'Request withdrawn'},
    ar:{QUEUED:'الطلب في انتظار الإرسال للعيادة',RECEIVED:'استلمت العيادة الطلب',PENDING:'الطلب في انتظار تأكيد العيادة',CONFIRMED:'أكدت العيادة الموعد',REJECTED:'تم رفض الطلب',CANCELLED:'تم إلغاء الموعد',EXPIRED:'انتهت صلاحية الطلب',FAILED:'تعذر إرسال الطلب',WITHDRAWN:'تم سحب الطلب'},
  };
  const successTitle=labels[language][state];
  const successDesc=state==='CONFIRMED'
    ? (language==='ar'?'أكدت العيادة الموعد بعد التحقق.':language==='en'?'The clinic has verified and confirmed this appointment.':'Le cabinet a vérifié et confirmé ce rendez-vous.')
    : (language==='ar'?'هذا الطلب لا يؤكد أي موعد. اتصلوا بالعيادة إذا لم تتلقوا مكالمة التأكيد.':language==='en'?'This request does not confirm a time slot. Please call if you have not received the clinic’s confirmation call.':'Cette demande ne confirme aucun créneau. Appelez le cabinet si vous n’avez pas reçu son appel de confirmation.');
  const refLabel=language==='ar'?'مرجع الطلب':language==='en'?'Request reference':'Référence de demande';
  const patientLabel=language==='ar'?'الاسم':'Nom / Name';
  const motifLabel=language==='ar'?'السبب (غير مرسل)':language==='en'?'Reason (not sent)':'Motif (non transmis)';
  const dateTimeLabel=language==='ar'?'الوقت المفضل':language==='en'?'Preferred date & time':'Jour et horaire souhaités';
  const locationLabel=language==='ar'?'العيادة':language==='en'?'Clinic':'Cabinet';
  const locationText=language==='ar'?'المعالمة، الجزائر العاصمة':'Mahelma, Alger';
  const messageNote=language==='ar'?'التأكيد عبر مكالمة من العيادة؛ لا يوجد وعد برسائل أو تذكيرات.':language==='en'?'The clinic calls to confirm. Messages or reminders are not promised.':'Le cabinet appelle pour confirmer. Aucun message ni rappel n’est promis.';
  const icsBtnText=language==='ar'?'تحديث حالة الطلب':language==='en'?'Refresh request status':'Actualiser la demande';
  const callBtnText=language==='ar'?'الاتصال بالعيادة':language==='en'?'Call the clinic':'Appeler le cabinet';
  const dateDisplay=state==='CONFIRMED'&&receipt.booking?.startsAt
    ? new Intl.DateTimeFormat(language,{timeZone:'Africa/Algiers',dateStyle:'medium',timeStyle:'short'}).format(new Date(receipt.booking.startsAt))
    : `${confirmation.date} · ${confirmation.time}`;

  return (
    <div className="space-y-6 text-center py-4">
      {/* Animated Checkmark */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border-2 border-[#7FB5AB]">
          <motion.svg
            className="w-10 h-10 text-[#4E7F77] dark:text-[#7FB5AB]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.svg>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold tracking-wider text-[#C8A46B] uppercase">
          {refLabel} {confirmation.referenceId}
        </span>
        <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#10201F] dark:text-white">
          {successTitle}
        </h3>
        <p className="text-sm text-[#4A605E] dark:text-[#A5CEC4] max-w-sm mx-auto leading-relaxed">
          {successDesc}
        </p>
      </div>

      {/* Details Box */}
      <div className="p-5 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] text-left rtl:text-right space-y-3 text-sm text-[#1D3634] dark:text-[#E3F0EC]">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60 dark:border-[#1E3530]">
          <span className="text-xs text-[#718684] dark:text-[#A5CEC4]">{patientLabel}</span>
          <span className="font-medium">{confirmation.patientName}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60 dark:border-[#1E3530]">
          <span className="text-xs text-[#718684] dark:text-[#A5CEC4]">{motifLabel}</span>
          <span className="font-medium">{confirmation.motif}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60 dark:border-[#1E3530]">
          <span className="text-xs text-[#718684] dark:text-[#A5CEC4]">{dateTimeLabel}</span>
          <span className="font-medium font-mono text-[#3D655F] dark:text-[#7FB5AB]">
            {dateDisplay}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#718684] dark:text-[#A5CEC4]">{locationLabel}</span>
          <span className="font-medium flex items-center gap-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
            {locationText}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#C7E1DA] dark:border-[#2A423D] text-xs text-[#3D655F] dark:text-[#A5CEC4] flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
        <span>{messageNote}</span>
      </div>

      <a href={`/booking#receipt=${token}`} referrerPolicy="no-referrer" className="inline-flex px-5 py-3 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] text-xs font-semibold">{language==='ar'?'متابعة طلبي':language==='en'?'Track my request':'Suivre ma demande'}</a>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] text-xs font-semibold hover:bg-[#E3F0EC] dark:hover:bg-[#1A2D2A] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{icsBtnText}</span>
        </button>

        <a
          href={clinic.phoneHref}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#10201F] text-white text-xs font-semibold hover:bg-[#2E4B47] transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>{callBtnText}</span>
        </a>
      </div>
    </div>
  );
}
