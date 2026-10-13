"use client";

import React from "react";
import { motion } from "motion/react";
import { BookingConfirmation } from "@/lib/types";
import { clinic } from "@/content/clinic";
import { Calendar, Phone, CheckCircle2, Download, MapPin } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface BookingSuccessProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

function downloadIcsFile(conf: BookingConfirmation, lang: string) {
  const title = lang === "ar"
    ? `موعد استشارة نفسية - الدكتورة العربي نسيبة (${conf.motif})`
    : `Rendez-vous Psychiatrie - Dr. Larbi Nassiba (${conf.motif})`;
  const description = lang === "ar"
    ? `استشارة طبية في عيادة MindCare Center، المعالمة، الجزائر العاصمة. رقم المرجع: ${conf.referenceId}`
    : `Consultation médicale au cabinet MindCare Center, Mahelma, Alger. Réf: ${conf.referenceId}`;
  const location = clinic.address;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MindCare Center//FR",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `STATUS:CONFIRMED`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `RDV-MindCare-${conf.referenceId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function BookingSuccess({ confirmation, onClose }: BookingSuccessProps) {
  const { language } = useAppContext();

  const successTitle = language === "ar"
    ? "تم تأكيد موعدك ونحن بانتظارك بكل ترحيب"
    : language === "en"
    ? "Your appointment is confirmed"
    : "C'est confirmé.";

  const successDesc = language === "ar"
    ? "تم تسجيل موعدك بنجاح في العيادة. خذ نفساً عميقاً، وأنت في أيدٍ أمينة تحرص على راحتك."
    : language === "en"
    ? "Your appointment has been successfully booked. We look forward to welcoming you."
    : "Votre rendez-vous a bien été enregistré. Nous avons hâte de vous accueillir.";

  const refLabel = language === "ar" ? "رقم المرجع :" : language === "en" ? "Ref :" : "Réf :";
  const patientLabel = language === "ar" ? "المعني بالاستشارة" : language === "en" ? "Patient" : "Patient";
  const motifLabel = language === "ar" ? "سبب الزيارة" : language === "en" ? "Reason" : "Motif";
  const dateTimeLabel = language === "ar" ? "الموعد المحدد" : language === "en" ? "Date & Time" : "Date & Heure";
  const locationLabel = language === "ar" ? "مقر العيادة" : language === "en" ? "Location" : "Lieu";
  const locationText = language === "ar" ? "المعالمة، الجزائر العاصمة" : "Mahelma, Alger";

  const messageNote = language === "ar"
    ? `ستصلك رسالة تأكيد وتذكير عبر واتساب / SMS على الرقم ${confirmation.patientPhone}.`
    : language === "en"
    ? `You will receive a confirmation on WhatsApp / SMS at ${confirmation.patientPhone}.`
    : `Vous recevrez une confirmation sur WhatsApp / SMS au ${confirmation.patientPhone}.`;

  const icsBtnText = language === "ar" ? "إضافة إلى تقويمي (.ics)" : language === "en" ? "Add to calendar (.ics)" : "Ajouter à mon calendrier (.ics)";
  const callBtnText = language === "ar" ? "الاتصال بالعيادة" : language === "en" ? "Call the clinic" : "Nous appeler";

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
            {confirmation.date} · {confirmation.time}
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => downloadIcsFile(confirmation, language)}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4] text-xs font-semibold hover:bg-[#E3F0EC] dark:hover:bg-[#1A2D2A] transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
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
