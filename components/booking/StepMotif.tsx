"use client";

import React from "react";
import { serviceCategories } from "@/content/services";
import { Waves, Moon, Baby, HeartHandshake, Brain, Sunrise, HelpCircle } from "lucide-react";

interface StepMotifProps {
  selectedMotif: string;
  onSelect: (motif: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Waves: <Waves className="w-5 h-5 text-[#4E7F77]" />,
  Moon: <Moon className="w-5 h-5 text-[#4E7F77]" />,
  Baby: <Baby className="w-5 h-5 text-[#4E7F77]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#4E7F77]" />,
  Brain: <Brain className="w-5 h-5 text-[#4E7F77]" />,
  Sunrise: <Sunrise className="w-5 h-5 text-[#4E7F77]" />
};

export function StepMotif({ selectedMotif, onSelect }: StepMotifProps) {
  const options = [
    ...serviceCategories.map((cat) => ({
      id: cat.title,
      label: cat.title,
      icon: CATEGORY_ICONS[cat.iconName]
    })),
    {
      id: "Autre / je ne sais pas encore",
      label: "Autre / je ne sais pas encore",
      icon: <HelpCircle className="w-5 h-5 text-[#C8A46B]" />
    }
  ];

  const handleChoose = (motif: string) => {
    onSelect(motif);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F]">
          Qu'est-ce qui vous amène ?
        </h3>
        <p className="text-sm text-[#4A605E]">
          Sélectionnez le motif principal qui correspond à votre situation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((opt) => {
          const isSelected = selectedMotif === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleChoose(opt.id)}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                isSelected
                  ? "bg-[#E3F0EC] border-[#4E7F77] text-[#10201F] shadow-xs"
                  : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#A5CEC4] text-[#1D3634]"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-2xs shrink-0">
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
