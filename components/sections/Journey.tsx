"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { Calendar, Heart, MessageSquare, Compass } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Journey() {
  const { language, t } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

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

  return (
    <section ref={containerRef} className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#FCFAF6] via-[#EBF4F1] to-[#F7F2E9] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden relative transition-colors">
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header - Centered */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              {tagText}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />
        </div>

        {/* 4 Steps Grid with Self-Drawing Connecting Line */}
        <div className="relative pt-6">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-28 left-12 right-12 h-[2px] bg-[#EFE7DA] dark:bg-[#1E3530] pointer-events-none z-0">
            <motion.div
              style={{ scaleX: pathLength }}
              className="h-full bg-gradient-to-r from-[#7FB5AB] via-[#4E7F77] to-[#C8A46B] origin-left shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="relative p-7 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300 group">
                  {/* Huge Numeral in Background */}
                  <span className="absolute top-4 right-6 font-serif-display text-5xl font-light text-[#A5CEC4]/25 dark:text-[#2A423D]/50 select-none group-hover:text-[#7FB5AB]/50 transition-colors">
                    {step.number}
                  </span>

                  <div className="w-11 h-11 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#10201F]/5 dark:border-white/5 flex items-center justify-center mb-5 text-[#3D655F] dark:text-[#7FB5AB] group-hover:bg-[#E3F0EC] dark:group-hover:bg-[#1C3330] transition-colors relative z-10">
                    {step.icon}
                  </div>

                  <h3 className="font-serif-display text-xl text-[#10201F] dark:text-white font-medium mb-3 relative z-10 group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                    {step.title}
                  </h3>

                  <p className="font-sans-body text-sm text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed relative z-10">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
