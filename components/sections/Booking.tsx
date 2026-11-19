"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { HorizonLandscapeSvg } from "../primitives/BotanicalMotifs";
import { Calendar, Sparkles, Phone } from "lucide-react";
import { clinic } from "@/content/clinic";
import { Magnetic } from "../primitives/Magnetic";
import { useAppContext } from "@/lib/app-context";

interface BookingSectionProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

const SAGE_PETALS = [
  { left: "8%", duration: "13s", delay: "-2s", dx: "45px", size: "w-2.5 h-2" },
  { left: "22%", duration: "16s", delay: "-7s", dx: "-35px", size: "w-3 h-2" },
  { left: "38%", duration: "14s", delay: "-4s", dx: "55px", size: "w-2 h-1.5" },
  { left: "56%", duration: "17s", delay: "-9s", dx: "-45px", size: "w-3 h-2" },
  { left: "74%", duration: "15s", delay: "-3s", dx: "30px", size: "w-2.5 h-2" },
  { left: "88%", duration: "18s", delay: "-11s", dx: "-50px", size: "w-2 h-1.5" },
];

export function BookingSection({ onOpenBooking, onOpenChat }: BookingSectionProps) {
  const { language, t } = useAppContext();
  const shouldReduceMotion = useReducedMotion();

  const tagText = language === "ar" ? "خطوتك الأولى نحو الراحة" : language === "en" ? "Take Care of Yourself" : "Prendre Soin De Vous";
  const headlineText = language === "ar"
    ? "«مساحة آمنة وأذن صاغية بانتظارك.»"
    : language === "en"
    ? "“A warm space of listening and dialogue awaits you in Mahelma.”"
    : "« Un espace de parole et d'écoute vous attend à Mahelma. »";

  const subtitleText = language === "ar"
    ? "لست مضطراً لحمل هذا الثقل وحدك بعد الآن.. احجز موعدك بهدوء وسرية تامة في أقل من دقيقة، أو استشر مساعدتنا الذكية."
    : language === "en"
    ? "Book your appointment online in under a minute or talk to our AI assistant."
    : "Prenez rendez-vous en ligne en moins d'une minute ou échangez avec notre assistante pour trouver le bon moment.";

  return (
    <section className="relative w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#F2F8F6] via-[#E3F0EC] to-[#F7F2E9] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] border-t border-[#A5CEC4]/50 dark:border-[#243B37] overflow-hidden transition-colors">
      {/* Petalyx-inspired Layered Botanical Horizon Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_32%)]"
      >
        <HorizonLandscapeSvg className="w-full h-full opacity-60 dark:opacity-80" />
      </div>

      {/* Drifting Sage Leaf Particles */}
      {!shouldReduceMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
          {SAGE_PETALS.map((petal, idx) => (
            <span
              key={idx}
              style={
                {
                  left: petal.left,
                  animationDuration: petal.duration,
                  animationDelay: petal.delay,
                  "--dx": petal.dx,
                } as React.CSSProperties
              }
              className={`absolute -top-4 ${petal.size} rounded-[80%_0_80%_0] bg-[#7FB5AB]/55 dark:bg-[#A5CEC4]/45 animate-leaf-fall`}
            />
          ))}
        </div>
      )}

      {/* Petalyx-inspired Frosted Glass Portal Card */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto rounded-[32px] p-8 sm:p-14 bg-[#FCFAF6]/88 dark:bg-[#0E1A18]/86 backdrop-blur-xl border border-white/80 dark:border-[#2A423D] shadow-[0_32px_70px_rgba(16,32,31,0.14)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.55)] text-center space-y-8"
      >
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
          highlightWord={language === "ar" ? "صاغية" : language === "en" ? "listening" : "écoute"}
          className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight max-w-3xl mx-auto text-center"
        />

        <Reveal delay={0.15}>
          <p className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] max-w-xl mx-auto leading-relaxed font-normal text-center">
            {subtitleText}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Magnetic sheen strength={6}>
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#3D655F] via-[#4E7F77] to-[#365A54] text-white font-semibold text-base shadow-[0_10px_30px_rgba(61,101,95,0.32)] hover:shadow-[0_14px_38px_rgba(61,101,95,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 group whitespace-nowrap cursor-pointer"
            >
              <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span>{t.hero.bookBtn}</span>
            </button>
          </Magnetic>

          <button
            onClick={onOpenChat}
            className="px-7 py-4 rounded-full bg-white dark:bg-[#12201E] border border-[#EFE7DA] dark:border-[#243B37] text-[#10201F] dark:text-white hover:bg-[#F2F8F6] dark:hover:bg-[#172927] font-semibold text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 group whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB] group-hover:rotate-12 transition-transform" />
            <span>{t.hero.chatBtn}</span>
          </button>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="pt-4 border-t border-[#EFE7DA]/80 dark:border-[#243B37] flex items-center justify-center gap-2 text-xs text-[#4A605E] dark:text-[#B3CFC8]">
            <Phone className="w-3.5 h-3.5 text-[#3D655F] dark:text-[#7FB5AB]" />
            <span>{language === "ar" ? "أو اتصل بنا مباشرة :" : language === "en" ? "Or call us directly:" : "Ou appelez-nous directement :"}</span>
            <a href={clinic.phoneHref} className="font-semibold text-[#10201F] dark:text-white hover:underline tabular-nums">
              {clinic.phone}
            </a>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
