"use client";

import React from "react";
import { Marquee } from "../primitives/Marquee";
import { useAppContext } from "@/lib/app-context";

export function Reassurance() {
  const { language, t } = useAppContext();

  const reassuranceItems = language === "ar"
    ? [
        "إنصات دافئ بدون أحكام",
        "استشارات لكافة الأعمار",
        "علاج سلوكي معرفي (CBT)",
        "متابعة مستمرة بين الجلسات",
        "سرية طبية تامة ومطلقة",
        "الأدوية عند الضرورة فقط",
      ]
    : language === "en"
    ? [
        "Non-judgmental listening",
        "Care for all age groups",
        "Cognitive Behavioral Therapy (CBT)",
        "Ongoing care between sessions",
        "Absolute medical privacy",
        "Medication only when needed",
      ]
    : [
        "Écoute sans jugement",
        "Consultations tous âges",
        "Thérapie cognitivo-comportementale (TCC)",
        "Suivi entre les séances",
        "Confidentialité absolue",
        "Médicaments uniquement si nécessaire",
      ];

  return (
    <section aria-label="Engagements et garanties du cabinet" className="w-full bg-[#F7F2E9] dark:bg-[#111E1C] py-4 border-y border-[#EFE7DA] dark:border-[#243B37] overflow-hidden transition-colors">
      <Marquee items={reassuranceItems} direction={language === "ar" ? "right" : "left"} speed={38} />
    </section>
  );
}
