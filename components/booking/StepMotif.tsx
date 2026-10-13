"use client";

import React from "react";
import { Waves, Moon, Baby, HeartHandshake, Brain, Sunrise, HelpCircle } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface StepMotifProps {
  selectedMotif: string;
  onSelect: (motif: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  waves: <Waves className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  moon: <Moon className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  baby: <Baby className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  heart: <HeartHandshake className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  brain: <Brain className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  sunrise: <Sunrise className="w-5 h-5 text-[#4E7F77] dark:text-[#7FB5AB]" />,
  help: <HelpCircle className="w-5 h-5 text-[#C8A46B]" />,
};

export function StepMotif({ selectedMotif, onSelect }: StepMotifProps) {
  const { language } = useAppContext();

  const title = language === "ar"
    ? "ما هو السبب الرئيسي لزيارتك؟"
    : language === "en"
    ? "What brings you to our clinic?"
    : "Qu'est-ce qui vous amène ?";

  const subtitle = language === "ar"
    ? "اختر ما يقارب حالتك لنتمكن من توجيه وتخصيص الاستقبال بأفضل شكل."
    : language === "en"
    ? "Select the primary concern that corresponds to your situation."
    : "Sélectionnez le motif principal qui correspond à votre situation.";

  const options = [
    {
      id: "anxiete",
      label: language === "ar" ? "اضطرابات القلق ونوبات الهلع والمزاج" : language === "en" ? "Anxiety, Panic & Mood" : "Anxiété, panique & humeur",
      icon: CATEGORY_ICONS.waves,
    },
    {
      id: "sommeil",
      label: language === "ar" ? "الضغوط، النوم والإنهاك النفسي (Burnout)" : language === "en" ? "Stress, Sleep & Burnout" : "Stress, sommeil & épuisement",
      icon: CATEGORY_ICONS.moon,
    },
    {
      id: "enfance",
      label: language === "ar" ? "صحة الأطفال والمراهقين (TDAH / توحد)" : language === "en" ? "Children & Adolescents" : "Enfance & adolescence",
      icon: CATEGORY_ICONS.baby,
    },
    {
      id: "relations",
      label: language === "ar" ? "العلاقات، الأسرة وتحديات الحياة" : language === "en" ? "Relationships & Family" : "Relations & difficultés familiales",
      icon: CATEGORY_ICONS.heart,
    },
    {
      id: "troubles",
      label: language === "ar" ? "استشارات نفسية تخصصية" : language === "en" ? "Specialized Psychiatric Care" : "Consultations psychiatriques spécialisées",
      icon: CATEGORY_ICONS.brain,
    },
    {
      id: "deuil",
      label: language === "ar" ? "مرافقة الفقدان والأزمات الانتقالية" : language === "en" ? "Grief & Life Transitions" : "Deuil & transitions difficiles",
      icon: CATEGORY_ICONS.sunrise,
    },
    {
      id: "autre",
      label: language === "ar" ? "أمر آخر / استشارة عامة وتوجيه" : language === "en" ? "Other / General consultation" : "Autre / je ne sais pas encore",
      icon: CATEGORY_ICONS.help,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left rtl:sm:text-right">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F] dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-[#4A605E] dark:text-[#A5CEC4]">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((opt) => {
          const isSelected = selectedMotif === opt.label || selectedMotif === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.label)}
              className={`p-4 rounded-2xl border text-left rtl:text-right flex items-center gap-3.5 transition-all ${
                isSelected
                  ? "bg-[#E3F0EC] dark:bg-[#1A2D2A] border-[#4E7F77] dark:border-[#7FB5AB] text-[#10201F] dark:text-white shadow-xs"
                  : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#A5CEC4] text-[#1D3634] dark:text-[#E3F0EC]"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#142523] shadow-2xs shrink-0">
                {opt.icon}
              </div>
              <span className="font-serif-display text-sm font-medium leading-snug">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
