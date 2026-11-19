"use client";

import React, { useState, useEffect } from "react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { LocationMap } from "@/components/ui/expand-map";
import { clinic } from "@/content/clinic";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Location() {
  const { language } = useAppContext();
  const [isOpenNow, setIsOpenNow] = useState<boolean>(false);
  const [statusLabel, setStatusLabel] = useState<string>("");

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeInMin = currentHour * 60 + currentMinute;

      const openMin = 8 * 60 + 30; // 08:30
      const closeMin = 16 * 60;    // 16:00 (last appointment at 15:30)

      const isMonday = currentDay === 1;
      const isFriday = currentDay === 5;

      if (language === "ar") {
        if (isMonday) {
          setIsOpenNow(false);
          setStatusLabel("مغلق يوم الإثنين (عطلة) — يفتح الثلاثاء 8:30 صباحاً");
        } else if (isFriday) {
          setIsOpenNow(false);
          setStatusLabel("مغلق يوم الجمعة (عطلة) — يفتح السبت 8:30 صباحاً");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("مفتوح الآن — آخر موعد 3:30 م (يغلق 4:00 م)");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("مغلق — يفتح اليوم 8:30 صباحاً");
        } else {
          setIsOpenNow(false);
          const nextDayText = currentDay === 4 ? "السبت" : currentDay === 0 ? "الثلاثاء" : "غداً";
          setStatusLabel(`مغلق — يفتح ${nextDayText} 8:30 صباحاً`);
        }
      } else if (language === "en") {
        if (isMonday) {
          setIsOpenNow(false);
          setStatusLabel("Closed Mondays — opens Tuesday at 8:30 AM");
        } else if (isFriday) {
          setIsOpenNow(false);
          setStatusLabel("Closed Fridays — opens Saturday at 8:30 AM");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("Open now — last slot 3:30 PM (closes 4:00 PM)");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("Closed — opens today at 8:30 AM");
        } else {
          setIsOpenNow(false);
          const nextDayText = currentDay === 4 ? "Saturday" : currentDay === 0 ? "Tuesday" : "tomorrow";
          setStatusLabel(`Closed — opens ${nextDayText} at 8:30 AM`);
        }
      } else {
        if (isMonday) {
          setIsOpenNow(false);
          setStatusLabel("Fermé le lundi — ouvre mardi à 8h30");
        } else if (isFriday) {
          setIsOpenNow(false);
          setStatusLabel("Fermé le vendredi — ouvre samedi à 8h30");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("Ouvert maintenant — dernier créneau 15h30 (ferme 16h00)");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("Fermé — ouvre aujourd'hui à 8h30");
        } else {
          setIsOpenNow(false);
          const nextDayText = currentDay === 4 ? "samedi" : currentDay === 0 ? "mardi" : "demain";
          setStatusLabel(`Fermé — ouvre ${nextDayText} à 8h30`);
        }
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [language]);

  const tagText = language === "ar" ? "عنوان وموقع العيادة" : language === "en" ? "Visit the Clinic" : "Venir au Cabinet";
  const headlineText = language === "ar"
    ? "«مكان هادئ ومريح ومصمم لراحتك.»"
    : language === "en"
    ? "“A peaceful space designed for comfort.”"
    : "« Un lieu de calme et d'apaisement. »";

  const routeBtnText = language === "ar" ? "الاتجاهات على الخريطة" : language === "en" ? "Get Directions" : "Voir l'itinéraire";

  return (
    <section
      id="location"
      className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#FCFAF6] via-[#F4EFE6] to-[#F2F8F6] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden transition-colors"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header - Centered */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
              <span>{tagText}</span>
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={language === "ar" ? "هادئ" : language === "en" ? "peaceful" : "calme"}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />
        </div>

        {/* Balanced Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Expandable Map */}
          <Reveal className="lg:col-span-6 flex flex-col items-center justify-center min-h-[380px] py-4">
            <LocationMap
              location={
                language === "ar"
                  ? "المعالمة، الجزائر العاصمة"
                  : language === "en"
                  ? "Mahelma, Algiers"
                  : "Mahelma, Alger"
              }
              coordinates="36.6713° N, 2.8797° E"
              mapsUrl={clinic.mapsUrl}
              expandLabel={
                language === "ar"
                  ? "انقر لتوسيع الخريطة"
                  : language === "en"
                  ? "Click to expand"
                  : "Cliquer pour agrandir"
              }
              openMapsLabel={
                language === "ar"
                  ? "فتح خرائط Google"
                  : language === "en"
                  ? "Open Google Maps"
                  : "Ouvrir Google Maps"
              }
            />
          </Reveal>

          {/* Right: Contact & Hours */}
          <Reveal delay={0.15} className="lg:col-span-6 flex flex-col justify-between">
            <div className="h-full p-7 sm:p-8 rounded-3xl bg-[#FCFAF6]/90 dark:bg-[#0E1A18]/90 backdrop-blur-md border border-[#EFE7DA] dark:border-[#1E3530] shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Real-Time Clinic Status */}
                <div className="inline-flex items-center gap-2.5 text-xs font-medium text-[#3D655F] dark:text-[#A5CEC4]">
                  <Clock className="w-3.5 h-3.5 text-[#C8A46B] shrink-0" />
                  <span>{statusLabel}</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif-display text-2xl text-[#10201F] dark:text-white font-medium">
                    {language === "ar" ? "معلومات التواصل" : language === "en" ? "Clinic Contact Details" : "Coordonnées du Cabinet"}
                  </h3>

                  <div className="space-y-4 text-sm text-[#4A605E] dark:text-[#B3CFC8]">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#10201F]/5 dark:border-white/5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10201F] dark:text-white">{language === "ar" ? "العنوان" : language === "en" ? "Address" : "Adresse"}</p>
                        <p className="text-[#3D5250] dark:text-[#B3CFC8]">{clinic.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#10201F]/5 dark:border-white/5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10201F] dark:text-white">{language === "ar" ? "الهاتف" : language === "en" ? "Phone" : "Téléphone"}</p>
                        <a href={clinic.phoneHref} className="text-[#3D655F] dark:text-[#7FB5AB] hover:underline font-semibold tabular-nums">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#10201F]/5 dark:border-white/5">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10201F] dark:text-white">WhatsApp</p>
                        <a href={clinic.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#3D655F] dark:text-[#7FB5AB] hover:underline font-medium">
                          {language === "ar" ? "تواصل معنا مباشرة عبر واتساب" : language === "en" ? "Chat directly on WhatsApp" : "Discuter directement sur WhatsApp"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#10201F]/5 dark:border-white/5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10201F] dark:text-white">{language === "ar" ? "أوقات الاستقبال" : language === "en" ? "Opening Hours" : "Horaires de Consultation"}</p>
                        <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8] mt-0.5">
                          {language === "ar"
                            ? "السبت، الأحد، الثلاثاء، الأربعاء، الخميس: 8:30 ص – 4:00 م (آخر موعد 3:30 م) · مغلق الإثنين والجمعة"
                            : language === "en"
                            ? "Sat, Sun, Tue, Wed, Thu: 8:30 AM – 4:00 PM (last slot 3:30 PM) · Closed Mon & Fri"
                            : "Sam, Dim, Mar, Mer, Jeu : 8h30 – 16h00 (dernier créneau 15h30) · Fermé lundi & vendredi"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={clinic.phoneHref}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3D655F] to-[#2E4B47] text-white text-xs font-semibold text-center hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "اتصال بالعيادة" : language === "en" ? "Call Clinic" : "Appeler le cabinet"}</span>
                </a>
                <a
                  href={clinic.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl border border-[#EFE7DA] dark:border-[#1E3530] bg-white dark:bg-[#12201E] text-[#10201F] dark:text-white text-xs font-semibold text-center hover:bg-[#F2F8F6] dark:hover:bg-[#162825] active:scale-98 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{routeBtnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#3D655F] dark:text-[#7FB5AB]" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
