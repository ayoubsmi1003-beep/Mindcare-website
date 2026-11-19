"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { BotanicalSealSvg, CalmWaveSvg } from "../primitives/BotanicalMotifs";
import { Award, GraduationCap, Stethoscope, Building2, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Doctor() {
  const { language, t } = useAppContext();
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const sealRotate = useTransform(scrollYProgress, [0, 1], [0, 75]);

  const timelineNodes = language === "ar"
    ? [
        { year: "التكوين", title: "جامعة الجزائر", subtitle: "دكتوراه في الطب العام", icon: <GraduationCap className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "التخصص", title: "مستشفى دريد حسين", subtitle: "تخصص في الأمراض النفسية", icon: <Stethoscope className="w-4 h-4 text-[#4E7F77]" /> },
        { year: "الخبرة", title: "ورقلة والجامعة", subtitle: "ممارسة طبية وتدريس جامعي", icon: <Award className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "اليوم", title: "مركز MindCare Center", subtitle: "المعالمة، الجزائر العاصمة", icon: <Building2 className="w-4 h-4 text-[#4E7F77]" /> },
      ]
    : language === "en"
    ? [
        { year: "Education", title: "University of Algiers", subtitle: "Doctorate in Medicine", icon: <GraduationCap className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "Specialty", title: "Drid Hocine Hospital", subtitle: "Psychiatry Specialization", icon: <Stethoscope className="w-4 h-4 text-[#4E7F77]" /> },
        { year: "Experience", title: "Ouargla & University", subtitle: "Clinical practice & teaching", icon: <Award className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "Present", title: "MindCare Center", subtitle: "Mahelma, Algiers", icon: <Building2 className="w-4 h-4 text-[#4E7F77]" /> },
      ]
    : [
        { year: "Formation", title: "Université d'Alger", subtitle: "Doctorat en médecine", icon: <GraduationCap className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "Spécialité", title: "Hôpital Drid Hocine", subtitle: "Spécialisation en psychiatrie", icon: <Stethoscope className="w-4 h-4 text-[#4E7F77]" /> },
        { year: "Expérience", title: "Ouargla & Université", subtitle: "Pratique & enseignement", icon: <Award className="w-4 h-4 text-[#C8A46B]" /> },
        { year: "Aujourd'hui", title: "MindCare Center", subtitle: "Mahelma, Alger", icon: <Building2 className="w-4 h-4 text-[#4E7F77]" /> },
      ];

  const tagText = language === "ar" ? "طبيبتكم المعالجة" : language === "en" ? "Your Physician" : "Votre Médecin";
  const doctorTitle = language === "ar" ? "الدكتورة العربي نسيبة" : "Dr. Larbi Nassiba";

  return (
    <section
      id="doctor"
      ref={sectionRef}
      className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#EBF4F1] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden relative transition-colors"
    >
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Top 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Parallax Image with Gold Offset Frame & Rotating Botanical Seal */}
          <Reveal className="lg:col-span-5 flex justify-center">
            <motion.div
              style={shouldReduceMotion ? undefined : { y: portraitY }}
              className="relative w-full max-w-md"
            >
              {/* Antique Gold Offset Hairline Frame */}
              <div
                aria-hidden="true"
                className="absolute -inset-3.5 rounded-t-[140px] rounded-b-[40px] border border-[#C8A46B]/55 transform translate-x-3.5 translate-y-3.5 pointer-events-none"
              />

              <div className="relative w-full aspect-[4/5] rounded-t-[130px] rounded-b-[32px] overflow-hidden border border-[#EFE7DA] dark:border-[#2A423D] bg-[#F7F2E9] dark:bg-[#142220] shadow-2xl group">
                <img
                  src="/doctor.svg"
                  alt="Dr. Larbi Nassiba, médecin psychiatre à Mahelma"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10201F]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Rotating Botanical Seal */}
              <motion.div
                style={shouldReduceMotion ? undefined : { rotate: sealRotate }}
                aria-hidden="true"
                className="hidden sm:block absolute -bottom-8 -right-6 z-20 pointer-events-none drop-shadow-xl"
              >
                <BotanicalSealSvg
                  className="w-28 h-28"
                  label="PSYCHIATRIE · CBT · BIENVEILLANCE · "
                />
              </motion.div>
            </motion.div>
          </Reveal>

          {/* Right Column: Bio */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
                <span className="w-6 h-px bg-[#C8A46B]" aria-hidden="true" />
                <span>{tagText}</span>
              </span>
            </Reveal>

            <WordReveal
              as="h2"
              text={doctorTitle}
              highlightWord={language === "ar" ? "نسيبة" : "Nassiba"}
              className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal"
            />

            <Reveal delay={0.15}>
              <p className="text-sm uppercase tracking-wider text-[#3D655F] dark:text-[#7FB5AB] font-semibold">
                {t.doctor.subtitle}
              </p>
            </Reveal>

            <div className="space-y-4 text-sm sm:text-base text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed pt-2 font-normal">
              <Reveal delay={0.2}>
                <p>{t.doctor.bio}</p>
              </Reveal>
            </div>

            {/* Qualifications list */}
            {t.doctor.qualifications && t.doctor.qualifications.length > 0 && (
              <Reveal delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {t.doctor.qualifications.map((qual, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#10201F] dark:text-[#E3F0EC]">
                      <CheckCircle2 className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0 mt-0.5" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Pull Quote - Clean Frosted Editorial Block (no thick left stripe) */}
            <Reveal delay={0.35} className="pt-4">
              <blockquote className="p-6 sm:p-7 rounded-2xl bg-[#FCFAF6]/90 dark:bg-[#12201E]/90 backdrop-blur-md border border-[#EFE7DA] dark:border-[#243B37] shadow-xs space-y-3">
                <CalmWaveSvg className="w-14 h-7 text-[#C8A46B]" />
                <p className="font-serif-display italic text-lg sm:text-xl text-[#3D655F] dark:text-[#A5CEC4] font-medium leading-relaxed">
                  {t.doctor.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Horizontal Timeline with Connecting Hairline */}
        <div className="pt-10 border-t border-[#EFE7DA] dark:border-[#243B37]">
          <Reveal>
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] font-semibold mb-8">
              {language === "ar" ? "المسار والالتزام الطبي" : language === "en" ? "Medical Path & Commitment" : "Parcours & Engagement Médical"}
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineNodes.map((node, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="relative h-full p-6 rounded-2xl bg-[#FCFAF6]/90 dark:bg-[#0E1A18]/90 backdrop-blur-sm border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C8A46B] uppercase tracking-wider tabular-nums">
                      0{idx + 1} · {node.year}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#F2F8F6] dark:bg-[#142523] text-[#4E7F77] dark:text-[#7FB5AB]">
                      {node.icon}
                    </div>
                  </div>
                  <h4 className="font-serif-display text-base text-[#10201F] dark:text-white font-medium">
                    {node.title}
                  </h4>
                  <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8]">
                    {node.subtitle}
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
