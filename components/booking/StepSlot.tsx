"use client";

import React, { useState } from "react";
import { getUpcomingDays } from "@/lib/availability";
import { DayAvailability, Slot } from "@/lib/types";
import { Clock } from "lucide-react";

interface StepSlotProps {
  selectedDate: string;
  selectedTime: string;
  onSelectSlot: (date: string, time: string) => void;
}

export function StepSlot({ selectedDate, selectedTime, onSelectSlot }: StepSlotProps) {
  const [days] = useState<DayAvailability[]>(() => getUpcomingDays(10));
  const [internalDate, setInternalDate] = useState<string>(() => {
    if (selectedDate) return selectedDate;
    const initialDays = getUpcomingDays(10);
    const firstOpen = initialDays.find((d) => !d.isClosed);
    return firstOpen ? firstOpen.date : (initialDays[0]?.date || "");
  });

  const activeDateStr = selectedDate || internalDate;
  const activeDayObj = days.find((d) => d.date === activeDateStr);
  const availableSlotsCount = activeDayObj ? activeDayObj.slots.filter((s) => s.available).length : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F]">
          Choisissez un créneau
        </h3>
        <p className="text-sm text-[#4A605E]">
          Sélectionnez la date puis l'heure de votre consultation.
        </p>
      </div>

      {/* Horizontal Scrollable Date Strip */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {days.map((day) => {
          const isSelected = activeDateStr === day.date;
          return (
            <button
              key={day.date}
              disabled={day.isClosed}
              onClick={() => setInternalDate(day.date)}
              className={`flex-1 min-w-[76px] p-3 rounded-2xl border text-center transition-all ${
                day.isClosed
                  ? "opacity-50 bg-[#F7F2E9] border-[#EFE7DA] cursor-not-allowed"
                  : isSelected
                  ? "bg-[#4E7F77] border-[#4E7F77] text-white shadow-sm"
                  : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#A5CEC4] text-[#1D3634]"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider font-medium">
                {day.dayName}
              </div>
              <div className="font-serif-display text-lg font-bold my-0.5">
                {day.dayNumber}
              </div>
              <div className="text-[10px] opacity-80">
                {day.isClosed ? "Fermé" : day.monthName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Available Counter */}
      {activeDayObj && !activeDayObj.isClosed && (
        <div className="flex items-center justify-between text-xs text-[#4A605E] px-1 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#4E7F77]" />
            Créneaux disponibles le {activeDayObj.dayNumber} {activeDayObj.monthName}
          </span>
          <span className="font-semibold text-[#3D655F]">
            {availableSlotsCount} créneaux libres
          </span>
        </div>
      )}

      {/* Time Slots Grid */}
      {activeDayObj?.isClosed ? (
        <div className="p-8 rounded-2xl bg-[#F7F2E9] border border-[#EFE7DA] text-center text-sm text-[#718684]">
          Le cabinet est fermé le lundi. Veuillez choisir un autre jour.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {activeDayObj?.slots.map((slot: Slot) => {
            const isSelected = activeDateStr === selectedDate && selectedTime === slot.time;

            return (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => onSelectSlot(activeDateStr, slot.time)}
                className={`py-3 px-2 rounded-xl border text-center font-mono text-sm font-medium transition-all ${
                  !slot.available
                    ? "line-through opacity-40 bg-[#F7F2E9] border-transparent cursor-not-allowed text-[#718684]"
                    : isSelected
                    ? "bg-[#3D655F] border-[#3D655F] text-white shadow-xs scale-98"
                    : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#4E7F77] text-[#10201F]"
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
