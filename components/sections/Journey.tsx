"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { OliveSprigSvg, CalmWaveSvg } from "../primitives/BotanicalMotifs";
import { Calendar, Heart, MessageSquare, Compass } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Journey() {
  const { language, isRTL } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const steps = language === "ar"
    ? [
        {
          number: "01",
          icon: <Calendar className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "حجز موعدك بكل يسر",
          text: "في أقل من دقيقة عبر الموقع، أو عبر مكالمة هاتفية إن فضلت التحدث مباشرة إلى العيادة.",
        },
        {
          number: "02",
          icon: <Heart className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "استقبال دافئ يحفظ كرامتك",
          text: "مساحة هادئة تبتعد عن صخب العيادات الباردة، مع متسع كامل من الوقت للحديث براحة ودون أي استعجال.",
        },
        {
          number: "03",
          icon: <MessageSquare className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "إنصاتٌ خالص يفهم ما وراء الكلمات",
          text: "جلسة كاملة مع الدكتورة العربي نسيبة لفهم قصتك وظروفك، بعيداً عن الأحكام أو التصنيفات الجاهزة.",
        },
        {
          number: "04",
          icon: <Compass className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "مرافقة وعناية مستمرة",
          text: "مسار علاجي مصمم بعناية ليناسب وتيرتك وراحتك، مع سند طبي ومتابعة مستمرة بين الجلسات.",
        },
      ]
    : language === "en"
    ? [
        {
          number: "01",
          icon: <Calendar className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Schedule Your Appointment",
          text: "Online in under a minute, or by phone if you prefer speaking directly with us.",
        },
        {
          number: "02",
          icon: <Heart className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Warm Welcome",
          text: "A serene clinic, genuine hospitality, and as much time as you need without rush.",
        },
        {
          number: "03",
          icon: <MessageSquare className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Empathetic Listening",
          text: "An initial consultation focused on understanding your personal story.",
        },
        {
          number: "04",
          icon: <Compass className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Tailored Care Path",
          text: "A personalized treatment plan with thoughtful ongoing support between visits.",
        },
      ]
    : [
        {
          number: "01",
          icon: <Calendar className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Vous prenez rendez-vous",
          text: "En ligne en moins d'une minute, ou par téléphone si vous préférez entendre une voix.",
        },
        {
          number: "02",
          icon: <Heart className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Vous êtes accueilli(e)",
          text: "Un cabinet calme, un accueil chaleureux, et le temps qu'il faut. Aucune précipitation.",
        },
        {
          number: "03",
          icon: <MessageSquare className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Vous êtes écouté(e)",
          text: "Une première consultation pour comprendre votre histoire, pas pour vous étiqueter.",
        },
        {
          number: "04",
          icon: <Compass className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Vous êtes accompagné(e)",
          text: "Un suivi construit pour vous, avec une présence qui continue entre les séances.",
        },
      ];

  const tagText = language === "ar" ? "خطوات العلاج" : language === "en" ? "How It Works" : "Comment ça se passe";

  const headlineText = language === "ar"
    ? "«الخطوة الأولى هي الأهم والأصعب.. دعنا نجعلها بسيطة وآمنة.»"
    : language === "en"
    ? "“The first step is often the hardest. Let us make it gentle and simple.”"
    : "« Le premier pas est toujours le plus difficile. Rendons-le simple. »";

  const highlightWord = language === "ar" ? "وآمنة.»" : language === "en" ? "simple.”" : "simple.";

  const numeralColors = [
    "text-[#3D655F] dark:text-[#7FB5AB]",
    "text-[#4E7F77] dark:text-[#A5CEC4]",
    "text-[#649C92] dark:text-[#7FB5AB]",
    "text-[#C8A46B] dark:text-[#E2C08A]",
  ];

  return (
    <section className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#FCFAF6] via-[#EBF4F1] to-[#F7F2E9] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden relative transition-colors">
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
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
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />
        </div>

        {/* Desktop Petalyx-inspired Expanding Horizontal Panel Accordion */}
        <div className="hidden lg:flex w-full h-[460px] rounded-3xl border border-[#EFE7DA] dark:border-[#1E3530] bg-[#FCFAF6]/80 dark:bg-[#0E1A18]/80 backdrop-blur-xl overflow-hidden shadow-[0_20px_56px_rgba(46,75,71,0.08)]">
          {steps.map((step, idx) => {
            const isActive = idx === activeIndex;
            const isLast = idx === steps.length - 1;
            const borderSideClass = isLast
              ? ""
              : isRTL
              ? "border-l border-[#EFE7DA] dark:border-[#1E3530]"
              : "border-r border-[#EFE7DA] dark:border-[#1E3530]";

            return (
              <div
                key={step.number}
                role="button"
                tabIndex={0}
                aria-label={`${step.number}: ${step.title}`}
                aria-expanded={isActive}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                style={{
                  flexGrow: isActive ? 3.2 : 0.75,
                  transition: shouldReduceMotion
                    ? "none"
                    : "flex-grow 0.85s cubic-bezier(0.77, 0, 0.18, 1), background-color 0.4s ease",
                }}
                className={`relative flex-1 min-w-[96px] h-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#4E7F77] ${borderSideClass} ${
                  isActive
                    ? "bg-[#F2F8F6]/70 dark:bg-[#132522]/85 cursor-default"
                    : "hover:bg-[#F7F2E9]/70 dark:hover:bg-[#101F1D]"
                }`}
              >
                {/* Floating Botanical Ornament when Active */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-7 ${
                    isRTL ? "left-7" : "right-7"
                  } transition-all duration-700 ${
                    isActive ? "opacity-90 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                >
                  {idx % 2 === 0 ? (
                    <OliveSprigSvg className="w-16 h-16 text-[#4E7F77] dark:text-[#7FB5AB]" />
                  ) : (
                    <CalmWaveSvg className="w-20 h-12 text-[#C8A46B]" />
                  )}
                </div>

                {/* Inner Bottom-Anchored Layout */}
                <div
                  className={`absolute inset-x-6 bottom-8 flex items-end gap-6 ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Giant Editorial Numeral */}
                  <span
                    className={`font-serif-display text-[110px] xl:text-[148px] font-semibold leading-[0.76] tracking-tighter tabular-nums select-none shrink-0 transition-transform duration-700 ${
                      numeralColors[idx]
                    } ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-65"}`}
                  >
                    {step.number}
                  </span>

                  {/* Step Content (Reveals smoothly with blur-to-crisp when active) */}
                  <div
                    style={{
                      transition: shouldReduceMotion
                        ? "none"
                        : isActive
                        ? "opacity 0.6s 0.25s ease, transform 0.7s 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s 0.25s ease"
                        : "opacity 0.25s ease, transform 0.3s ease, filter 0.25s ease",
                    }}
                    className={`pb-2 min-w-[240px] max-w-sm space-y-3 ${
                      isActive
                        ? "opacity-100 translate-x-0 blur-0 pointer-events-auto"
                        : `opacity-0 ${isRTL ? "translate-x-5" : "-translate-x-5"} blur-[6px] pointer-events-none`
                    }`}
                  >
                    <div className="inline-flex p-2.5 rounded-xl bg-white/90 dark:bg-[#0E1A18]/90 border border-[#EFE7DA] dark:border-[#243B37] shadow-2xs">
                      {step.icon}
                    </div>

                    <h3 className="font-serif-display text-2xl text-[#10201F] dark:text-white font-medium leading-snug">
                      {step.title}
                    </h3>

                    <p className="font-sans-body text-sm text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Clean Stacked Layout */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="relative p-7 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#10201F]/5 dark:border-white/5 flex items-center justify-center text-[#3D655F] dark:text-[#7FB5AB]">
                    {step.icon}
                  </div>
                  <span className={`font-serif-display text-4xl font-semibold tabular-nums ${numeralColors[idx]}`}>
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif-display text-xl text-[#10201F] dark:text-white font-medium">
                  {step.title}
                </h3>

                <p className="font-sans-body text-sm text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
