"use client";

import React, { useState, useEffect } from "react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { clinic } from "@/content/clinic";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Location() {
  const { language, t } = useAppContext();
  const [isOpenNow, setIsOpenNow] = useState<boolean>(false);
  const [statusLabel, setStatusLabel] = useState<string>("");

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeInMin = currentHour * 60 + currentMinute;

      const openMin = 8 * 60;
      const closeMin = 17 * 60;

      if (language === "ar") {
        if (currentDay === clinic.hours.closedDay) {
          setIsOpenNow(false);
          setStatusLabel("مغلق الإثنين — يفتح الثلاثاء 8:00 صباحاً");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("مفتوح الآن — يغلق 5:00 مساءً");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("مغلق — يفتح اليوم 8:00 صباحاً");
        } else {
          setIsOpenNow(false);
          setStatusLabel("مغلق — يفتح غداً 8:00 صباحاً");
        }
      } else if (language === "en") {
        if (currentDay === clinic.hours.closedDay) {
          setIsOpenNow(false);
          setStatusLabel("Closed Mondays — opens Tuesday at 8:00 AM");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("Open now — closes at 5:00 PM");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("Closed — opens today at 8:00 AM");
        } else {
          setIsOpenNow(false);
          setStatusLabel("Closed — opens tomorrow at 8:00 AM");
        }
      } else {
        if (currentDay === clinic.hours.closedDay) {
          setIsOpenNow(false);
          setStatusLabel("Fermé le lundi — ouvre mardi à 8h00");
        } else if (timeInMin >= openMin && timeInMin < closeMin) {
          setIsOpenNow(true);
          setStatusLabel("Ouvert maintenant — ferme à 17h00");
        } else if (timeInMin < openMin) {
          setIsOpenNow(false);
          setStatusLabel("Fermé — ouvre aujourd'hui à 8h00");
        } else {
          setIsOpenNow(false);
          setStatusLabel("Fermé — ouvre demain à 8h00");
        }
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [language]);

  const tagText = language === "ar" ? "عنوان وموقع العيادة" : language === "en" ? "Visit the Clinic" : "Venir au Cabinet";
  const headlineText = language === "ar"
    ? "«مكان هادئ ومريح ومصمم لراحتك بالمعالمة.»"
    : language === "en"
    ? "“A peaceful space designed for comfort in Mahelma.”"
    : "« Un lieu de calme et d'apaisement à Mahelma. »";

  const routeBtnText = language === "ar" ? "الاتجاهات على الخريطة" : language === "en" ? "Get Directions" : "Voir l'itinéraire";

  return (
    <section id="location" className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#FCFAF6] via-[#F4EFE6] to-[#F2F8F6] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:to-[#1F3834] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
              {tagText}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={language === "ar" ? "هادئ" : language === "en" ? "peaceful" : "calme"}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight"
          />
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Map Card */}
          <Reveal className="lg:col-span-7 h-full min-h-[400px]">
            <a
              href={clinic.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Voir l'itinéraire vers MindCare Center sur Google Maps"
              className="group relative block w-full h-full min-h-[400px] rounded-3xl overflow-hidden border-2 border-[#A5CEC4]/40 dark:border-[#2A423D] shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Map Image Surface */}
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                alt="Carte de localisation du cabinet MindCare Center à Mahelma Alger"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10201F]/85 via-[#10201F]/35 to-transparent" />

              {/* Pulsing Pin Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#7FB5AB]/50 animate-ping absolute" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4E7F77] to-[#3D655F] border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-2.5 px-4 py-1.5 rounded-full bg-[#10201F]/95 backdrop-blur-md border border-[#7FB5AB]/40 text-xs font-bold text-white shadow-xl">
                  MindCare Center
                </div>
              </div>

              {/* Bottom Overlay Bar */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <p className="font-serif-display text-xl font-medium">{language === "ar" ? "المعالمة، الجزائر العاصمة" : "Mahelma, Alger"}</p>
                  <p className="text-xs text-[#C7E1DA] font-medium">{language === "ar" ? "الجزائر" : "Algérie"}</p>
                </div>

                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-xs font-bold text-[#10201F] shadow-lg group-hover:bg-[#E3F0EC] group-hover:text-[#3D655F] transition-all duration-300">
                  <span>{routeBtnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#3D655F]" />
                </span>
              </div>
            </a>
          </Reveal>

          {/* Right: Contact & Hours */}
          <Reveal delay={0.15} className="lg:col-span-5 flex flex-col justify-between">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#162825] dark:to-[#12201E] border border-[#A5CEC4]/50 dark:border-[#243B37] shadow-sm space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                {/* Live Open Status Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E3F0EC] dark:bg-[#1C2D2A] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-xs font-semibold text-[#10201F] dark:text-[#E3F0EC]">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? "bg-[#3D655F] animate-pulse" : "bg-[#C8A46B]"}`} />
                  <span>{statusLabel}</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif-display text-2xl text-[#10201F] dark:text-white font-medium">
                    {language === "ar" ? "معلومات التواصل" : language === "en" ? "Clinic Contact Details" : "Coordonnées du Cabinet"}
                  </h3>

                  <div className="space-y-4 text-sm text-[#4A605E] dark:text-[#B3CFC8]">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#A5CEC4]/40 dark:border-[#2A423D]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#10201F] dark:text-white">{language === "ar" ? "العنوان" : language === "en" ? "Address" : "Adresse"}</p>
                        <p className="text-[#3D5250] dark:text-[#B3CFC8]">{clinic.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#A5CEC4]/40 dark:border-[#2A423D]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#10201F] dark:text-white">{language === "ar" ? "الهاتف" : language === "en" ? "Phone" : "Téléphone"}</p>
                        <a href={clinic.phoneHref} className="text-[#3D655F] dark:text-[#7FB5AB] hover:underline font-bold">
                          {clinic.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#A5CEC4]/40 dark:border-[#2A423D]">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#10201F] dark:text-white">WhatsApp</p>
                        <a href={clinic.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#3D655F] dark:text-[#7FB5AB] hover:underline font-semibold">
                          {language === "ar" ? "تواصل معنا مباشرة عبر واتساب" : language === "en" ? "Chat directly on WhatsApp" : "Discuter directement sur WhatsApp"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] text-[#3D655F] dark:text-[#7FB5AB] shrink-0 border border-[#A5CEC4]/40 dark:border-[#2A423D]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#10201F] dark:text-white">{language === "ar" ? "أوقات الاستقبال" : language === "en" ? "Opening Hours" : "Horaires de Consultation"}</p>
                        <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8] mt-0.5 font-medium">
                          {language === "ar" ? "من السبت إلى الخميس، من 8:00 صباحاً حتى 5:00 مساءً (المغلق: الجمعة واللإثنين)" : language === "en" ? "Sat–Thu: 8:00 AM – 5:00 PM (Closed Mon & Fri)" : clinic.hours.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Call Button */}
              <a
                href={clinic.phoneHref}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#3D655F] via-[#4E7F77] to-[#365A54] text-white text-sm font-semibold text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 mt-4"
              >
                <Phone className="w-4 h-4" />
                <span>{language === "ar" ? "الاتصال بالعيادة مباشرة" : language === "en" ? "Call Clinic Now" : "Appeler le cabinet"}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
