"use client";

import React from "react";
import { ForWhom } from "@/lib/types";
import { User, Baby, Users } from "lucide-react";

interface StepForProps {
  selectedFor: ForWhom;
  onSelect: (forWhom: ForWhom) => void;
}

export function StepFor({ selectedFor, onSelect }: StepForProps) {
  const options: { id: ForWhom; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "moi",
      title: "Pour moi",
      desc: "Je souhaite effectuer une consultation pour moi-même.",
      icon: <User className="w-6 h-6 text-[#4E7F77]" />
    },
    {
      id: "mon enfant",
      title: "Pour mon enfant",
      desc: "Je souhaite prendre rendez-vous pour mon enfant ou adolescent.",
      icon: <Baby className="w-6 h-6 text-[#4E7F77]" />
    },
    {
      id: "un proche",
      title: "Pour un proche",
      desc: "Je souhaite effectuer la démarche pour un membre de ma famille ou un proche.",
      icon: <Users className="w-6 h-6 text-[#4E7F77]" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F]">
          Pour qui est ce rendez-vous ?
        </h3>
        <p className="text-sm text-[#4A605E]">
          Indiquez le bénéficiaire de la consultation.
        </p>
      </div>

      <div className="space-y-3.5">
        {options.map((opt) => {
          const isSelected = selectedFor === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                isSelected
                  ? "bg-[#E3F0EC] border-[#4E7F77] shadow-xs"
                  : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#A5CEC4]"
              }`}
            >
              <div className="p-3 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                {opt.icon}
              </div>
              <div>
                <h4 className="font-serif-display text-base font-medium text-[#10201F]">
                  {opt.title}
                </h4>
                <p className="text-xs text-[#4A605E] mt-1 leading-relaxed">
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
