"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Aftercare() {
  const { language, t } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const aftercarePhases = language === "ar"
    ? [
        {
          number: "01",
          title: "دعم دائم متواصل",
          text: "الرعاية والمتابعة لا تنتهي بمجرد خروجك من باب العيادة. نحن متواجدون للإجابة عن تساؤلاتك ومرافقتك.",
        },
        {
          number: "02",
          title: "تتبع منتظم للتقدم",
          text: "ملاحظة وتوثيق التحسن التدريجي بين الجلسات لتعديل الخطة العلاجية بما يناسب راحتك واستقرارك.",
        },
        {
          number: "03",
          title: "مساعدة ذكية فورية",
          text: "يساعدك مساعد الحجز على معرفة المواعيد المتاحة عندما تكون العيادة متصلة. لا يستقبل معلومات طبية.",
        },
        {
          number: "04",
          title: "استقلالية واستقرار طويل الأمد",
          text: "تمكينك من أدوات علاجية واضحة ومجربة تساعدك على استعادة التوازن والثقة بنفسك بشكل مستدام.",
        },
      ]
    : language === "en"
    ? [
        {
          number: "01",
          title: "Continuous Presence",
          text: "Care does not stop at the clinic doors. We remain available for questions and steady support.",
        },
        {
          number: "02",
          title: "Regular Progress Tracking",
          text: "Monitoring your gradual well-being between sessions to adapt your personalized therapy plan.",
        },
        {
          number: "03",
          title: "Intelligent AI Guidance",
          text: "Our booking assistant shows current availability while the clinic is connected. It does not collect medical information.",
        },
        {
          number: "04",
          title: "Long-Term Autonomy",
          text: "Empowering you with concrete mental tools to build lasting resilience and confidence.",
        },
      ]
    : [
        {
          number: "01",
          title: "Présence continue",
          text: "Le soin ne s'arrête pas à la porte du cabinet. Nous restons disponibles pour répondre à vos doutes et vous rassurer.",
        },
        {
          number: "02",
          title: "Suivi régulier du bien-être",
          text: "Une observation attentive de vos progrès entre les séances pour adapter le plan thérapeutique à votre rythme.",
        },
        {
          number: "03",
          title: "Assistance IA attentive",
          text: "Notre assistante de réservation affiche les disponibilités lorsque le cabinet est connecté. Elle ne recueille pas d’informations médicales.",
        },
        {
          number: "04",
          title: "Autonomie et stabilité à long terme",
          text: "Vous transmettre des outils concrets pour vous sentir capable de traverser les tempêtes en toute confiance.",
        },
      ];

  const privacyNote = language === "ar"
    ? "جميع البيانات والملاحظات الطبية محمية ومحاطة بالسرية التامة"
    : language === "en"
    ? "All medical records and communications are strictly confidential"
    : "Toutes vos données et échanges restent strictement confidentiels";

  const headlineText = language === "ar"
    ? "«العناية بالصحة النفسية لا تنتهي عند مغادرة باب العيادة.»"
    : language === "en"
    ? "“Care does not stop at the door of the clinic.”"
    : "« Le soin ne s'arrête pas à la porte du cabinet. »";

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollRatio = Math.max(0, Math.min(1, (-top) / (height - viewportHeight)));
      const newIndex = Math.min(3, Math.floor(scrollRatio * 4));
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="aftercare"
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-[#10201F] via-[#1A2E2C] to-[#2E4B47] text-[#FCFAF6] py-28 sm:py-36 px-4 sm:px-8 overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="pointer-events-none absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(127,181,171,0.18)_0%,transparent_70%)] top-1/4 left-1/4 filter blur-[120px] animate-orb" aria-hidden="true" />
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(200,164,107,0.12)_0%,transparent_70%)] bottom-1/4 right-1/4 filter blur-[100px]" aria-hidden="true" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-medium tracking-[0.22em] text-[#7FB5AB] uppercase">
            MindCare Aftercare
          </span>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            {headlineText}
          </h2>
        </div>

        {/* Desktop Sticky Split Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start relative min-h-[1600px]">
          {/* Left Sticky Indicator Column */}
          <div className="col-span-5 sticky top-32 h-[450px] flex flex-col justify-between p-8 rounded-3xl bg-[#10201F]/70 backdrop-blur-md border border-[#7FB5AB]/20 shadow-2xl">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#7FB5AB]">
                {language === "ar" ? "المتابعة المستمرة" : language === "en" ? "Continuous Care" : "Accompagnement Continu"}
              </span>

              <div className="flex items-baseline gap-2">
                <span className="font-serif-display text-7xl font-extralight text-[#7FB5AB]">
                  {aftercarePhases[activeIndex].number}
                </span>
                <span className="text-xl text-[#718684] font-serif-display">/ 04</span>
              </div>

              <h3 className="font-serif-display text-2xl font-medium text-white transition-all duration-300">
                {aftercarePhases[activeIndex].title}
              </h3>
            </div>

            {/* Abstract SVG Visual Element for Current Phase */}
            <div className="w-full h-32 flex items-center justify-center bg-[#1D3634]/60 rounded-2xl border border-[#7FB5AB]/15 p-4 overflow-hidden">
              {activeIndex === 0 && (
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[#7FB5AB] animate-ping opacity-40" />
                  <div className="w-10 h-10 rounded-full bg-[#7FB5AB]/30 border border-[#7FB5AB] flex items-center justify-center text-xs font-semibold text-white">
                    Presence
                  </div>
                </div>
              )}

              {activeIndex === 1 && (
                <div className="flex items-end gap-2.5 h-16">
                  {[40, 65, 50, 80, 95, 70, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="w-3 rounded-t-sm bg-gradient-to-t from-[#4E7F77] to-[#7FB5AB]"
                    />
                  ))}
                </div>
              )}

              {activeIndex === 2 && (
                <div className="relative w-full flex items-center justify-between px-8">
                  <div className="w-6 h-6 rounded-full bg-[#7FB5AB] flex items-center justify-center text-[10px] text-[#10201F] font-bold">
                    IA
                  </div>
                  <div className="flex-1 mx-4 h-[2px] bg-gradient-to-r from-[#7FB5AB] via-[#C8A46B] to-[#7FB5AB] relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C8A46B] animate-pulse" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#C8A46B] flex items-center justify-center text-[10px] text-[#10201F] font-bold">
                    Dr
                  </div>
                </div>
              )}

              {activeIndex === 3 && (
                <svg className="w-full h-20" viewBox="0 0 200 60">
                  <motion.path
                    d="M 10 50 Q 50 45, 90 30 T 190 10"
                    fill="none"
                    stroke="#7FB5AB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2 }}
                  />
                  <circle cx="190" cy="10" r="4" fill="#C8A46B" />
                </svg>
              )}
            </div>

            {/* 4 Phase Progress Dots */}
            <div className="flex items-center gap-3">
              {aftercarePhases.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-10 bg-[#7FB5AB]" : "w-3 bg-[#1D3634]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Scrolling Phases Column */}
          <div className="col-span-7 space-y-36 pt-12">
            {aftercarePhases.map((phase, idx) => (
              <div
                key={idx}
                className="p-10 rounded-3xl bg-[#10201F]/60 border border-[#7FB5AB]/20 space-y-4 hover:border-[#7FB5AB]/40 transition-colors backdrop-blur-sm"
              >
                <span className="font-serif-display text-4xl text-[#7FB5AB] font-light">
                  {phase.number}
                </span>

                <h3 className="font-serif-display text-2xl text-white font-medium">
                  {phase.title}
                </h3>

                <p className="font-sans-body text-base text-[#C7E1DA] leading-relaxed">
                  {phase.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Stack Layout */}
        <div className="lg:hidden space-y-6">
          {aftercarePhases.map((phase, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#10201F]/80 border border-[#7FB5AB]/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif-display text-3xl font-light text-[#7FB5AB]">
                  {phase.number}
                </span>
                <span className="w-3 h-3 rounded-full bg-[#7FB5AB]/50" />
              </div>

              <h3 className="font-serif-display text-xl text-white font-medium">
                {phase.title}
              </h3>

              <p className="font-sans-body text-sm text-[#C7E1DA] leading-relaxed">
                {phase.text}
              </p>
            </div>
          ))}
        </div>

        {/* Privacy Reassurance Chip */}
        <div className="pt-8 flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#10201F]/90 border border-[#7FB5AB]/30 text-xs font-medium text-[#C7E1DA]">
            <Lock className="w-3.5 h-3.5 text-[#7FB5AB]" />
            <span>{privacyNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
