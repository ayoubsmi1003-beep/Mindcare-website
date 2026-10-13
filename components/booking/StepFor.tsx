"use client";

import React from "react";
import { ForWhom } from "@/lib/types";
import { User, Baby, Users } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface StepForProps {
  selectedFor: ForWhom;
  onSelect: (forWhom: ForWhom) => void;
}

export function StepFor({ selectedFor, onSelect }: StepForProps) {
  const { language } = useAppContext();

  const title = language === "ar"
    ? "لمن ترغب في حجز هذا الموعد؟"
    : language === "en"
    ? "Who is this appointment for?"
    : "Pour qui est ce rendez-vous ?";

  const subtitle = language === "ar"
    ? "حدد من سيستفيد من الاستشارة الطبية لنعد الاستقبال المناسب له."
    : language === "en"
    ? "Indicate who the consultation is for so we can prepare accordingly."
    : "Indiquez le bénéficiaire de la consultation.";

  const options: { id: ForWhom; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "moi",
      title: language === "ar" ? "لنفسي" : language === "en" ? "For myself" : "Pour moi",
      desc: language === "ar"
        ? "أرغب في حجز استشارة شخصية لنفسي في العيادة."
        : language === "en"
        ? "I want to schedule a personal consultation for myself."
        : "Je souhaite effectuer une consultation pour moi-même.",
      icon: <User className="w-6 h-6 text-[#4E7F77] dark:text-[#7FB5AB]" />
    },
    {
      id: "mon enfant",
      title: language === "ar" ? "لطفلي أو مراهق" : language === "en" ? "For my child / teen" : "Pour mon enfant",
      desc: language === "ar"
        ? "أرغب في حجز موعد لطفلي أو ابني المراهق برعاية دافئة وخاصة."
        : language === "en"
        ? "I want to book an appointment for my child or teenager."
        : "Je souhaite prendre rendez-vous pour mon enfant ou adolescent.",
      icon: <Baby className="w-6 h-6 text-[#4E7F77] dark:text-[#7FB5AB]" />
    },
    {
      id: "un proche",
      title: language === "ar" ? "لأحد المقربين / العائلة" : language === "en" ? "For a loved one" : "Pour un proche",
      desc: language === "ar"
        ? "أقوم بالحجز لمساندة أحد أفراد عائلتي أو شخص عزيز عليّ."
        : language === "en"
        ? "I am booking to support a family member or close friend."
        : "Je souhaite effectuer la démarche pour un membre de ma famille ou un proche.",
      icon: <Users className="w-6 h-6 text-[#4E7F77] dark:text-[#7FB5AB]" />
    }
  ];

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

      <div className="space-y-3.5">
        {options.map((opt) => {
          const isSelected = selectedFor === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full p-5 rounded-2xl border text-left rtl:text-right flex items-start gap-4 transition-all ${
                isSelected
                  ? "bg-[#E3F0EC] dark:bg-[#1A2D2A] border-[#4E7F77] dark:border-[#7FB5AB] shadow-xs"
                  : "bg-[#FCFAF6] dark:bg-[#0E1A18] border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#A5CEC4]"
              }`}
            >
              <div className="p-3 rounded-xl bg-white dark:bg-[#142523] shadow-2xs shrink-0 mt-0.5">
                {opt.icon}
              </div>
              <div>
                <h4 className="font-serif-display text-base font-medium text-[#10201F] dark:text-white">
                  {opt.title}
                </h4>
                <p className="text-xs text-[#4A605E] dark:text-[#B3CFC8] mt-1 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
