"use client";

import React, { useState } from "react";
import { BookingFormState } from "@/lib/types";
import { Calendar, Clock, User, Heart, ShieldCheck } from "lucide-react";
import { Magnetic } from "../primitives/Magnetic";

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
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (val: string) => {
    // Basic Algerian phone regex (05, 06, 07 or +213...)
    const clean = val.replace(/\s+/g, "");
    if (!clean) return "Le numéro de téléphone est obligatoire.";
    if (!/^(?:0|\+?213)[567]\d{8}$/.test(clean) && clean.length < 9) {
      return "Numéro invalide (ex: 0554 81 39 11)";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F]">
          Vos coordonnées
        </h3>
        <p className="text-sm text-[#4A605E]">
          Afin de confirmer et vous envoyer votre rappel de rendez-vous.
        </p>
      </div>

      {/* Recap Card */}
      <div className="p-4 rounded-2xl bg-[#E3F0EC] border border-[#C7E1DA] space-y-2 text-xs text-[#1D3634]">
        <div className="font-serif-display font-medium text-sm text-[#10201F] pb-1 border-b border-[#C7E1DA]">
          Récapitulatif de votre rendez-vous
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#4E7F77]" />
            <span className="truncate">{formState.motif || "Consultation"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#4E7F77]" />
            <span>Pour {formState.forWhom}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#4E7F77]" />
            <span>{formState.selectedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#4E7F77]" />
            <span>{formState.selectedTime}</span>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#10201F] uppercase tracking-wider mb-1.5">
            Nom et Prénom *
          </label>
          <input
            type="text"
            required
            value={formState.patientName}
            onChange={(e) => onChange({ patientName: e.target.value })}
            placeholder="Ex: Amine Benali"
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] border border-[#EFE7DA] text-sm text-[#10201F] focus:border-[#4E7F77] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#10201F] uppercase tracking-wider mb-1.5">
            Numéro de Téléphone *
          </label>
          <input
            type="tel"
            required
            value={formState.patientPhone}
            onChange={handlePhoneChange}
            placeholder="Ex: 0554 81 39 11"
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] border border-[#EFE7DA] text-sm text-[#10201F] focus:border-[#4E7F77] focus:outline-hidden"
          />
          {phoneError && (
            <p className="text-xs text-red-600 mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#10201F] uppercase tracking-wider mb-1.5">
            Message ou note pour le médecin (Optionnel)
          </label>
          <textarea
            rows={2}
            value={formState.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Si vous voulez nous dire un mot avant de venir (optionnel)"
            className="w-full px-4 py-3 rounded-xl bg-[#FCFAF6] border border-[#EFE7DA] text-sm text-[#10201F] focus:border-[#4E7F77] focus:outline-hidden resize-none"
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
          <span className="text-xs text-[#4A605E] leading-relaxed">
            J'accepte d'être contacté(e) sur ce numéro pour la confirmation de mon rendez-vous. Confidentialité médicale garantie.
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
            <span>{isSubmitting ? "Confirmation en cours..." : "Confirmer mon rendez-vous"}</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
