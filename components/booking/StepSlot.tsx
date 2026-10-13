"use client";

import React, { useState, useMemo } from "react";
import { getUpcomingDays } from "@/lib/availability";
import { DayAvailability, Slot } from "@/lib/types";
import { Clock, Info } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface StepSlotProps {
  selectedDate: string;
  selectedTime: string;
  onSelectSlot: (date: string, time: string) => void;
}

export function StepSlot({ selectedDate, selectedTime, onSelectSlot }: StepSlotProps) {
  const { language } = useAppContext();

  const days: DayAvailability[] = useMemo(() => {
    return getUpcomingDays(12, language);
  }, [language]);

  const [internalDate, setInternalDate] = useState<string>(() => {
    if (selectedDate) return selectedDate;
    const initialDays = getUpcomingDays(12, language);
    const firstOpen = initialDays.find((d) => !d.isClosed);
    return firstOpen ? firstOpen.date : (initialDays[0]?.date || "");
  });

  const activeDateStr = selectedDate || internalDate;
  const activeDayObj = days.find((d) => d.date === activeDateStr) || days[0];
  const availableSlotsCount = activeDayObj ? activeDayObj.slots.filter((s) => s.available).length : 0;

  const titleText =
    language === "ar"
      ? "اختر موعدك المناسب"
      : language === "en"
      ? "Select a Time Slot"
      : "Choisissez un créneau";

  const subtitleText =
    language === "ar"
      ? "المواعيد من 08:30 صباحاً حتى 03:30 مساءً (30 دقيقة لكل استشارة) · العطلة: الإثنين والجمعة"
      : language === "en"
      ? "Slots from 8:30 AM to 3:30 PM (30 min per consultation) · Closed Mon & Fri"
      : "Séances de 8h30 à 15h30 (30 min par consultation) · Fermé lundi & vendredi";

  const closedPillText =
    language === "ar" ? "عطلة" : language === "en" ? "Closed" : "Fermé";

  const slotsAvailableText =
    language === "ar"
      ? `${availableSlotsCount} موعد متاح`
      : language === "en"
      ? `${availableSlotsCount} available slots`
      : `${availableSlotsCount} créneaux libres`;

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F] dark:text-white">
          {titleText}
        </h3>
        <p className="text-xs sm:text-sm text-[#4A605E] dark:text-[#B3CFC8] flex items-center justify-center sm:justify-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#3D655F] dark:text-[#7FB5AB] shrink-0" />
          <span>{subtitleText}</span>
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
              onClick={() => {
                setInternalDate(day.date);
              }}
              className={`flex-1 min-w-[76px] p-3 rounded-2xl border text-center transition-all ${
                day.isClosed
                  ? "opacity-50 bg-[#F7F2E9] dark:bg-[#152523] border-[#EFE7DA] dark:border-[#243B37] cursor-not-allowed"
                  : isSelected
                  ? "bg-[#3D655F] dark:bg-[#4E7F77] border-[#3D655F] dark:border-[#4E7F77] text-white shadow-sm"
                  : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] text-[#1D3634] dark:text-white"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider font-medium">
                {day.dayName}
              </div>
              <div className="font-serif-display text-lg font-bold my-0.5">
                {day.dayNumber}
              </div>
              <div className="text-[10px] opacity-80">
                {day.isClosed ? closedPillText : day.monthName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Available Counter */}
      {activeDayObj && !activeDayObj.isClosed && (
        <div className="flex items-center justify-between text-xs text-[#4A605E] dark:text-[#B3CFC8] px-1 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3D655F] dark:text-[#7FB5AB]" />
            {language === "ar"
              ? `المواعيد المتاحة ليوم ${activeDayObj.dayName} ${activeDayObj.dayNumber} ${activeDayObj.monthName}`
              : language === "en"
              ? `Slots for ${activeDayObj.dayName} ${activeDayObj.dayNumber} ${activeDayObj.monthName}`
              : `Créneaux disponibles le ${activeDayObj.dayName} ${activeDayObj.dayNumber} ${activeDayObj.monthName}`}
          </span>
          <span className="font-semibold text-[#3D655F] dark:text-[#7FB5AB]">
            {slotsAvailableText}
          </span>
        </div>
      )}

      {/* Time Slots Grid */}
      {activeDayObj?.isClosed ? (
        <div className="p-8 rounded-2xl bg-[#F7F2E9] dark:bg-[#152523] border border-[#EFE7DA] dark:border-[#243B37] text-center text-sm text-[#718684] dark:text-[#B3CFC8] space-y-2">
          <p className="font-medium text-[#10201F] dark:text-white">
            {activeDayObj.reason ||
              (language === "ar"
                ? "العيادة مغلقة في هذا اليوم (عطلة الإثنين والجمعة)."
                : language === "en"
                ? "The clinic is closed on this day (closed Mon & Fri)."
                : "Le cabinet est fermé ce jour-là (fermé lundi et vendredi).")}
          </p>
          <p className="text-xs">
            {language === "ar"
              ? "يرجى اختيار يوم عمل آخر من الشريط أعلاه."
              : language === "en"
              ? "Please select another consultation day above."
              : "Veuillez choisir un autre jour d'ouverture ci-dessus."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {activeDayObj?.slots.map((slot: Slot) => {
              const isSelected = activeDateStr === selectedDate && selectedTime === slot.time;

              return (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => onSelectSlot(activeDateStr, slot.time)}
                  className={`py-3 px-2 rounded-xl border text-center font-mono text-sm font-medium transition-all ${
                    !slot.available
                      ? "line-through opacity-40 bg-[#F7F2E9] dark:bg-[#152523] border-transparent cursor-not-allowed text-[#718684]"
                      : isSelected
                      ? "bg-[#3D655F] dark:bg-[#4E7F77] border-[#3D655F] dark:border-[#4E7F77] text-white shadow-xs scale-98"
                      : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#3D655F] dark:hover:border-[#7FB5AB] text-[#10201F] dark:text-white"
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#718684] dark:text-[#8EAAA4] text-center pt-1 font-mono">
            {language === "ar"
              ? "⏱ مدة كل موعد: 30 دقيقة · المواعيد: من 08:30 إلى 15:30"
              : language === "en"
              ? "⏱ 30 minutes per appointment · From 08:30 to 15:30"
              : "⏱ 30 minutes par consultation · De 08h30 à 15h30"}
          </p>
        </div>
      )}
    </div>
  );
}
