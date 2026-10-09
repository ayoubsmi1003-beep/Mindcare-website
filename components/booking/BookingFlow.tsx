"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookingFormState, BookingConfirmation, ForWhom } from "@/lib/types";
import { StepMotif } from "./StepMotif";
import { StepFor } from "./StepFor";
import { StepFirstTime } from "./StepFirstTime";
import { StepSlot } from "./StepSlot";
import { StepContact } from "./StepContact";
import { BookingSuccess } from "./BookingSuccess";
import { X, ArrowLeft } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialMotif?: string;
}

export function BookingFlow({ isOpen, onClose, initialMotif = "" }: BookingFlowProps) {
  const { language, t } = useAppContext();
  const [step, setStep] = useState<number>(1);
  const [formState, setFormState] = useState<BookingFormState>({
    motif: initialMotif,
    forWhom: "moi",
    firstTime: true,
    selectedDate: "",
    selectedTime: "",
    patientName: "",
    patientPhone: "",
    notes: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  if (!isOpen) return null;

  const updateForm = (fields: Partial<BookingFormState>) => {
    setFormState((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const refId = `MC-${Math.floor(10000 + Math.random() * 90000)}`;
      const conf: BookingConfirmation = {
        referenceId: refId,
        patientName: formState.patientName,
        patientPhone: formState.patientPhone,
        motif: formState.motif || (language === "ar" ? "استشارة عامة" : "Consultation générale"),
        date: formState.selectedDate || (language === "ar" ? "غداً" : "Demain"),
        time: formState.selectedTime || "10:00",
      };

      await new Promise((res) => setTimeout(res, 800));
      setConfirmation(conf);
      setStep(6);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = language === "ar"
    ? ["السبب", "المستفيد", "نوع الاستشارة", "الموعد", "المعلومات"]
    : language === "en"
    ? ["Reason", "Beneficiary", "Type", "Slot", "Details"]
    : ["Motif", "Bénéficiaire", "Type", "Créneau", "Coordonnées"];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-[#10201F]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#FCFAF6] dark:bg-[#12201E] rounded-3xl border border-[#EFE7DA] dark:border-[#243B37] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 px-6 border-b border-[#EFE7DA] dark:border-[#243B37] flex items-center justify-between bg-[#F7F2E9] dark:bg-[#172927]">
          <div className="flex items-center gap-3">
            {step > 1 && step < 6 && (
              <button
                onClick={handleBack}
                className="p-1.5 rounded-full hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] text-[#4E7F77] dark:text-[#7FB5AB] transition-colors"
                aria-label="Étape précédente"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#4E7F77] dark:text-[#7FB5AB]">
                MindCare Center
              </span>
              <h2 className="font-serif-display text-lg font-medium text-[#10201F] dark:text-white">
                {step === 6
                  ? (language === "ar" ? "تأكيد الحجز" : "Confirmation")
                  : t.hero.bookBtn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] text-[#4A605E] dark:text-[#B3CFC8] transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Progress Indicator Bar */}
        {step < 6 && (
          <div className="px-6 pt-4 pb-2 bg-[#FCFAF6] dark:bg-[#12201E]">
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-medium text-[#718684] dark:text-[#B3CFC8]">
              <span>
                {language === "ar" ? `الخطوة ${step} من 5` : language === "en" ? `Step ${step} of 5` : `Étape ${step} sur 5`}
              </span>
              <span>{stepLabels[step - 1]}</span>
            </div>
            <div className="flex items-center gap-1.5 h-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    s <= step ? "bg-[#4E7F77] dark:bg-[#7FB5AB]" : "bg-[#EFE7DA] dark:bg-[#243B37]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 1 && (
                <StepMotif
                  selectedMotif={formState.motif}
                  onSelect={(motif) => {
                    updateForm({ motif });
                    handleNext();
                  }}
                />
              )}

              {step === 2 && (
                <StepFor
                  selectedFor={formState.forWhom}
                  onSelect={(forWhom: ForWhom) => {
                    updateForm({ forWhom });
                    handleNext();
                  }}
                />
              )}

              {step === 3 && (
                <StepFirstTime
                  firstTime={formState.firstTime}
                  onSelect={(firstTime) => {
                    updateForm({ firstTime });
                    handleNext();
                  }}
                />
              )}

              {step === 4 && (
                <StepSlot
                  selectedDate={formState.selectedDate}
                  selectedTime={formState.selectedTime}
                  onSelectSlot={(date, time) => {
                    updateForm({ selectedDate: date, selectedTime: time });
                    handleNext();
                  }}
                />
              )}

              {step === 5 && (
                <StepContact
                  formState={formState}
                  onChange={updateForm}
                  onSubmit={handleConfirmBooking}
                  isSubmitting={isSubmitting}
                />
              )}

              {step === 6 && confirmation && (
                <BookingSuccess confirmation={confirmation} onClose={onClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
