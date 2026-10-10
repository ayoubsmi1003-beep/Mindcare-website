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
          title: "حجز موعدك الأول",
          text: "أرسل طلبًا عبر الإنترنت. تتصل بك العيادة لمراجعته وتأكيد الموعد. يمكنك أيضًا الاتصال مباشرة.",
        },
        {
          number: "02",
          icon: <Heart className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "استقبال دافئ وهادئ",
          text: "عيادة هادئة، ترحيب إنساني، وجميع الوقت اللازم للحديث دون أي استعجال.",
        },
        {
          number: "03",
          icon: <MessageSquare className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "أنصات طبي عميق",
          text: "جلسة أولى لفهم قصتك وظروفك، وليس لإلقاء أحكام وتسميات سريعة.",
        },
        {
          number: "04",
          icon: <Compass className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "مرافقة وعناية مستمرة",
          text: "مسار علاجي مصمم خصيصاً لك، مع دعم طبي ومتابعة متواصلة بين الجلسات.",
        },
      ]
    : language === "en"
    ? [
        {
          number: "01",
          icon: <Calendar className="w-5 h-5 text-[#3D655F] dark:text-[#7FB5AB]" />,
          title: "Schedule Your Appointment",
          text: "Send an online request. The clinic calls to review and confirm your appointment. You can also call directly.",
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
          text: "Envoyez une demande en ligne. Le cabinet vous appelle pour la vérifier et confirmer le rendez-vous. Vous pouvez aussi téléphoner directement.",
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
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight"
          />
        </div>

        {/* 4 Steps Grid with Self-Drawing Connecting Line */}
        <div className="relative pt-6">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-28 left-12 right-12 h-[3px] bg-[#EFE7DA] dark:bg-[#243B37] pointer-events-none z-0">
            <motion.div
              style={{ scaleX: pathLength }}
              className="h-full bg-gradient-to-r from-[#7FB5AB] via-[#4E7F77] to-[#C8A46B] origin-left shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#162825] dark:to-[#12201E] border border-[#A5CEC4]/40 dark:border-[#243B37] hover:border-[#7FB5AB] shadow-sm hover:shadow-[0_16px_40px_rgba(46,75,71,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 group">
                  {/* Huge Numeral in Background */}
                  <span className="absolute top-4 right-6 font-serif-display text-6xl font-light text-[#A5CEC4]/30 dark:text-[#2A423D] select-none group-hover:text-[#7FB5AB]/50 transition-colors">
                    {step.number}
                  </span>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E3F0EC] via-[#D5EADF] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] border border-[#A5CEC4]/60 dark:border-[#2A423D] group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-inner mb-6 relative z-10">
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
