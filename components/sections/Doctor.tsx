"use client";

import React from "react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { Award, GraduationCap, Stethoscope, Building2, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Doctor() {
  const { language, t } = useAppContext();

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
    <section id="doctor" className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#EBF4F1] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden relative transition-colors">
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Top 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Gold Offset Frame */}
          <Reveal className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Antique Gold Offset Hairline Frame */}
              <div aria-hidden="true" className="absolute -inset-3.5 rounded-t-[140px] rounded-b-[40px] border-2 border-[#C8A46B]/50 transform translate-x-4 translate-y-4 pointer-events-none" />

              <div className="relative w-full aspect-[4/5] rounded-t-[130px] rounded-b-[32px] overflow-hidden border-2 border-[#EFE7DA] dark:border-[#2A423D] bg-[#F7F2E9] dark:bg-[#142220] shadow-2xl group">
                <img
                  src="/doctor.svg"
                  alt="Dr. Larbi Nassiba, médecin psychiatre à Mahelma"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10201F]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Reveal>

          {/* Right Column: Bio */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
                {tagText}
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

            {/* Qualifications bullet list */}
            {t.doctor.qualifications && t.doctor.qualifications.length > 0 && (
              <Reveal delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {t.doctor.qualifications.map((qual, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#10201F] dark:text-[#E3F0EC]">
                      <CheckCircle2 className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Pull Quote */}
            <Reveal delay={0.35} className="pt-4">
              <blockquote className="pl-6 border-l-4 border-[#C8A46B] py-3 bg-[#FCFAF6] dark:bg-[#12201E] rounded-r-2xl border-y border-r border-[#EFE7DA] dark:border-[#243B37]">
                <p className="font-serif-display italic text-lg sm:text-xl text-[#3D655F] dark:text-[#A5CEC4] font-medium">
                  {t.doctor.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Horizontal Timeline */}
        <div className="pt-10 border-t border-[#EFE7DA] dark:border-[#243B37]">
          <Reveal>
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] font-semibold mb-8">
              {language === "ar" ? "المسار والالتزام الطبي" : language === "en" ? "Medical Path & Commitment" : "Parcours & Engagement Médical"}
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineNodes.map((node, idx) => (
              <Reveal key={idx} delay={idx * 0.12}>
                <div className="relative p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C8A46B] uppercase tracking-wider">
                      {node.year}
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
