"use client";

import React from "react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { Calendar, Sparkles, Phone } from "lucide-react";
import { clinic } from "@/content/clinic";
import { Magnetic } from "../primitives/Magnetic";
import { useAppContext } from "@/lib/app-context";

interface BookingSectionProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export function BookingSection({ onOpenBooking, onOpenChat }: BookingSectionProps) {
  const { language, t } = useAppContext();

  const tagText = language === "ar" ? "العناية بنفسك وصحتك" : language === "en" ? "Take Care of Yourself" : "Prendre Soin De Vous";
  const headlineText = language === "ar"
    ? "«مساحة حوار وإنصات دافئة بانتظارك في المعالمة.»"
    : language === "en"
    ? "“A warm space of listening and dialogue awaits you in Mahelma.”"
    : "« Un espace de parole et d'écoute vous attend à Mahelma. »";

  const subtitleText = language === "ar"
    ? "احجز موعدك بسهولة في أقل من دقيقة، أو تحدث مع مساعدتنا للوصول إلى الموعد الأنسب لك."
    : language === "en"
    ? "Book your appointment online in under a minute or talk to our AI assistant."
    : "Prenez rendez-vous en ligne en moins d'une minute ou échangez avec notre assistante pour trouver le bon moment.";

  return (
    <section className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#F2F8F6] via-[#E3F0EC] to-[#F7F2E9] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] border-t border-[#A5CEC4]/50 dark:border-[#243B37] overflow-hidden relative transition-colors">
      <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:to-[#1F3834] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
            {tagText}
          </span>
        </Reveal>

        <WordReveal
          as="h2"
          text={headlineText}
          highlightWord={language === "ar" ? "وإنصات" : language === "en" ? "listening" : "écoute"}
          className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight max-w-3xl mx-auto"
        />

        <Reveal delay={0.15}>
          <p className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] max-w-xl mx-auto leading-relaxed font-normal">
            {subtitleText}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Magnetic sheen strength={6}>
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#3D655F] via-[#4E7F77] to-[#365A54] text-white font-semibold text-base shadow-[0_10px_30px_rgba(61,101,95,0.32)] hover:shadow-[0_14px_38px_rgba(61,101,95,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 group"
            >
              <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span>{t.hero.bookBtn}</span>
            </button>
          </Magnetic>

          <button
            onClick={onOpenChat}
            className="px-7 py-4 rounded-full bg-gradient-to-r from-[#FCFAF6] to-[#E3F0EC] dark:from-[#12201E] dark:to-[#1A2D2A] border-2 border-[#A5CEC4] dark:border-[#2A423D] text-[#2E4B47] dark:text-white hover:border-[#4E7F77] hover:bg-[#E3F0EC] font-semibold text-base shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB] group-hover:rotate-12 transition-transform" />
            <span>{t.hero.chatBtn}</span>
          </button>

          <a
            href={clinic.phoneHref}
            className="px-7 py-4 rounded-full bg-[#FCFAF6]/90 dark:bg-[#12201E]/90 border border-[#EFE7DA] dark:border-[#2A423D] text-[#10201F] dark:text-white hover:bg-[#FFFFFF] font-semibold text-base hover:shadow-md transition-all duration-300 flex items-center gap-2.5"
          >
            <Phone className="w-4 h-4 text-[#3D655F] dark:text-[#7FB5AB]" />
            <span>{clinic.phone}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
