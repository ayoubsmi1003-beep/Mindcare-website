"use client";

import React from "react";
import { motion } from "motion/react";
import { BookingConfirmation } from "@/lib/types";
import { clinic } from "@/content/clinic";
import { Calendar, Phone, CheckCircle2, Download, MapPin } from "lucide-react";

interface BookingSuccessProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

function downloadIcsFile(conf: BookingConfirmation) {
  const title = `Rendez-vous Psychiatrie - Dr. Larbi Nassiba (${conf.motif})`;
  const description = `Consultation médicale au cabinet MindCare Center, Mahelma, Alger. Réf: ${conf.referenceId}`;
  const location = clinic.address;

  // Format date time e.g. 20260730T090000Z
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
  return (
    <div className="space-y-6 text-center py-4">
      {/* Animated Checkmark */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#E3F0EC] border-2 border-[#7FB5AB]">
          <motion.svg
            className="w-10 h-10 text-[#4E7F77]"
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
          Réf : {confirmation.referenceId}
        </span>
        <h3 className="font-serif-display text-3xl font-medium text-[#10201F]">
          C'est confirmé.
        </h3>
        <p className="text-sm text-[#4A605E] max-w-sm mx-auto">
          Votre rendez-vous a bien été enregistré. Nous avons hâte de vous accueillir.
        </p>
      </div>

      {/* Details Box */}
      <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#EFE7DA] text-left space-y-3 text-sm text-[#1D3634]">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60">
          <span className="text-xs text-[#718684]">Patient</span>
          <span className="font-medium">{confirmation.patientName}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60">
          <span className="text-xs text-[#718684]">Motif</span>
          <span className="font-medium">{confirmation.motif}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA]/60">
          <span className="text-xs text-[#718684]">Date & Heure</span>
          <span className="font-medium font-mono text-[#3D655F]">
            {confirmation.date} à {confirmation.time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#718684]">Lieu</span>
          <span className="font-medium flex items-center gap-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#4E7F77]" />
            Mahelma, Alger
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F2F8F6] border border-[#C7E1DA] text-xs text-[#3D655F] flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#4E7F77] shrink-0" />
        <span>Vous recevrez une confirmation sur WhatsApp / SMS au {confirmation.patientPhone}.</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => downloadIcsFile(confirmation)}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FCFAF6] border border-[#C7E1DA] text-[#3D655F] text-xs font-semibold hover:bg-[#E3F0EC] transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Ajouter à mon calendrier (.ics)</span>
        </button>

        <a
          href={clinic.phoneHref}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#10201F] text-white text-xs font-semibold hover:bg-[#2E4B47] transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>Nous appeler</span>
        </a>
      </div>
    </div>
  );
}
