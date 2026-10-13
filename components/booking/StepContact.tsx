"use client";

import React, { useState } from "react";
import { BookingFormState } from "@/lib/types";
import { Calendar, Clock, User, Heart, ShieldCheck } from "lucide-react";
import { Magnetic } from "../primitives/Magnetic";
import { useAppContext } from "@/lib/app-context";

interface StepContactProps {
  formState: BookingFormState;
  onChange: (fields: Partial<BookingFormState>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepContact({
  formState,
  onChange,
  onSubmit,
  isSubmitting
}: StepContactProps) {
  const { language, t } = useAppContext();
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (val: string) => {
    const clean = val.replace(/\s+/g, "");
    if (!clean) {
      return language === "ar"
        ? "رقم الهاتف مطلوب لتأكيد الموعد والتواصل معك."
        : language === "en"
        ? "Phone number is required."
        : "Le numéro de téléphone est obligatoire.";
    }
    if (!/^(?:0|\+?213)[567]\d{8}$/.test(clean) && clean.length < 9) {
      return language === "ar"
        ? "رقم هاتف غير صحيح (مثال: 0554 81 39 11)"
        : language === "en"
        ? "Invalid phone number (e.g. 0554 81 39 11)"
        : "Numéro invalide (ex: 0554 81 39 11)";
    }
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ patientPhone: val });
    if (phoneError) {
      setPhoneError(validatePhone(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePhone(formState.patientPhone);
    if (err) {
      setPhoneError(err);
      return;
    }
    onSubmit();
  };

  const title = language === "ar"
    ? "معلومات الاتصال بك"
    : language === "en"
    ? "Your Contact Information"
    : "Vos coordonnées";

  const subtitle = language === "ar"
    ? "لتأكيد الحجز وموافقتك على استلام تذكير بالموعد وتفاصيله بسرية تامة."
    : language === "en"
    ? "To confirm your appointment and send your discreet reminder."
    : "Afin de confirmer et vous envoyer votre rappel de rendez-vous.";

  const recapTitle = language === "ar"
    ? "ملخص موعدك الطبي"
    : language === "en"
    ? "Appointment Summary"
    : "Récapitulatif de votre rendez-vous";

  const consentText = language === "ar"
    ? "أوافق على التواصل معي عبر هذا الرقم لتأكيد الموعد وإرسال التذكير. السرية الطبية مضمونة ومصونة بالكامل."
    : language === "en"
    ? "I agree to be contacted at this number to confirm my appointment. Medical confidentiality strictly guaranteed."
    : "J'accepte d'être contacté(e) sur ce numéro pour la confirmation de mon rendez-vous. Confidentialité médicale garantie.";

  const submitText = isSubmitting
    ? (language === "ar" ? "جارٍ تأكيد الموعد..." : language === "en" ? "Confirming..." : "Confirmation en cours...")
    : (language === "ar" ? "تأكيد حجز الموعد" : language === "en" ? "Confirm My Appointment" : "Confirmer mon rendez-vous");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center sm:text-left rtl:sm:text-right">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F] dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-[#4A605E] dark:text-[#A5CEC4]">
          {subtitle}
        </p>
      </div>

      {/* Recap Card */}
      <div className="p-4 rounded-2xl bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] space-y-2 text-xs text-[#1D3634] dark:text-[#E3F0EC]">
        <div className="font-serif-display font-medium text-sm text-[#10201F] dark:text-white pb-1 border-b border-[#C7E1DA] dark:border-[#2A423D]">
          {recapTitle}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
            <span className="truncate">{formState.motif || (language === "ar" ? "استشارة عامة" : "Consultation")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
            <span>
              {language === "ar" ? `المستفيد: ${formState.forWhom}` : `Pour ${formState.forWhom}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
            <span>{formState.selectedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
            <span>{formState.selectedTime}</span>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#10201F] dark:text-[#E3F0EC] uppercase tracking-wider mb-1.5">
            {t.bookingFlow.nameLabel} *
          </label>
          <input
            type="text"
            required
            value={formState.patientName}
            onChange={(e) => onChange({ patientName: e.target.value })}
            placeholder={t.bookingFlow.namePlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] text-sm text-[#10201F] dark:text-white focus:border-[#4E7F77] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#10201F] dark:text-[#E3F0EC] uppercase tracking-wider mb-1.5">
            {t.bookingFlow.phoneLabel} *
          </label>
          <input
            type="tel"
            required
            value={formState.patientPhone}
            onChange={handlePhoneChange}
            placeholder={t.bookingFlow.phonePlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] text-sm text-[#10201F] dark:text-white focus:border-[#4E7F77] focus:outline-hidden"
          />
          {phoneError && (
            <p className="text-xs text-red-600 mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#10201F] dark:text-[#E3F0EC] uppercase tracking-wider mb-1.5">
            {t.bookingFlow.notesLabel}
          </label>
          <textarea
            rows={2}
            value={formState.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder={t.bookingFlow.notesPlaceholder}
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] text-sm text-[#10201F] dark:text-white focus:border-[#4E7F77] focus:outline-hidden resize-none"
          />
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={formState.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
            className="mt-1 rounded border-[#C7E1DA] text-[#4E7F77] focus:ring-[#4E7F77]"
          />
          <span className="text-xs text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed">
            {consentText}
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <Magnetic sheen strength={4} className="w-full sm:w-auto">
          <button
            type="submit"
            disabled={isSubmitting || !formState.consent || !formState.patientName || !formState.patientPhone}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#4E7F77] to-[#3D655F] text-white text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitText}</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
