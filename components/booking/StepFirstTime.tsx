"use client";

import React from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface StepFirstTimeProps {
  firstTime: boolean;
  onSelect: (firstTime: boolean) => void;
}

export function StepFirstTime({ firstTime, onSelect }: StepFirstTimeProps) {
  const { language, t } = useAppContext();

  const title = language === "ar"
    ? "هل سبق لك زيارة عيادتنا من قبل؟"
    : language === "en"
    ? "Is this your first visit?"
    : "Est-ce votre première consultation ?";

  const subtitle = language === "ar"
    ? "يساعدنا ذلك على تخصيص الوقت الأمثل لاستقبالك والإنصات إليك بكل هدوء."
    : language === "en"
    ? "This allows us to allocate the best amount of time for your consultation."
    : "Cela nous permet de prévoir la durée optimale pour votre accueil.";

  const opt1Title = language === "ar"
    ? "نعم، هذه زيارتي الأولى"
    : language === "en"
    ? "Yes, this is my first time"
    : "Oui, c'est la première fois";

  const opt1Desc = language === "ar"
    ? "هذا أول موعد لك في مركز مايند كير، ونحن بانتظارك بكل دفء واحتواء."
    : language === "en"
    ? "This is your very first appointment at MindCare Center."
    : "Il s'agit de votre tout premier rendez-vous au cabinet MindCare Center.";

  const opt2Title = language === "ar"
    ? "لا، بل متابعة لاستشارة سابقة"
    : language === "en"
    ? "No, this is a follow-up"
    : "Non, c'est un suivi";

  const opt2Desc = language === "ar"
    ? "سبق لك استشارة الدكتورة العربي نسيبة في العيادة."
    : language === "en"
    ? "You have already consulted with Dr. Larbi Nassiba."
    : "Vous avez déjà consulté le Dr. Larbi Nassiba au cabinet.";

  const quote = language === "ar"
    ? "«الخطوة الأولى هي دائماً الأكثر تردداً.. سنمنحك كل الوقت اللازم لتشعر بالراحة والأمان.»"
    : language === "en"
    ? "“The first step is often the most hesitant. We will take all the time you need.”"
    : "« La première fois est toujours la plus difficile. Nous prendrons le temps qu'il faut. »";

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F] dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-[#4A605E] dark:text-[#A5CEC4]">
          {subtitle}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onSelect(true)}
          className={`w-full p-5 rounded-2xl border text-left rtl:text-right flex items-start gap-4 transition-all ${
            firstTime
              ? "bg-[#E3F0EC] dark:bg-[#1A2D2A] border-[#4E7F77] dark:border-[#7FB5AB] shadow-xs"
              : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#A5CEC4]"
          }`}
        >
          <div className="p-3 rounded-xl bg-white dark:bg-[#142523] shadow-2xs shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6 text-[#4E7F77] dark:text-[#7FB5AB]" />
          </div>
          <div>
            <h4 className="font-serif-display text-base font-medium text-[#10201F] dark:text-white">
              {opt1Title}
            </h4>
            <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8] mt-1 leading-relaxed">
              {opt1Desc}
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect(false)}
          className={`w-full p-5 rounded-2xl border text-left rtl:text-right flex items-start gap-4 transition-all ${
            !firstTime
              ? "bg-[#E3F0EC] dark:bg-[#1A2D2A] border-[#4E7F77] dark:border-[#7FB5AB] shadow-xs"
              : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#A5CEC4]"
          }`}
        >
          <div className="p-3 rounded-xl bg-white dark:bg-[#142523] shadow-2xs shrink-0 mt-0.5">
            <RefreshCw className="w-6 h-6 text-[#4E7F77] dark:text-[#7FB5AB]" />
          </div>
          <div>
            <h4 className="font-serif-display text-base font-medium text-[#10201F] dark:text-white">
              {opt2Title}
            </h4>
            <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8] mt-1 leading-relaxed">
              {opt2Desc}
            </p>
          </div>
        </button>
      </div>

      {firstTime && (
        <div className="p-4 rounded-2xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#C7E1DA] dark:border-[#2A423D] text-xs text-[#3D655F] dark:text-[#A5CEC4] flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#7FB5AB] shrink-0" />
          <p className="font-serif-display italic">
            {quote}
          </p>
        </div>
      )}
    </div>
  );
}
