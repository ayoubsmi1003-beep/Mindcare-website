"use client";

import React from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface StepFirstTimeProps {
  firstTime: boolean;
  onSelect: (firstTime: boolean) => void;
}

export function StepFirstTime({ firstTime, onSelect }: StepFirstTimeProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-serif-display text-2xl font-medium text-[#10201F]">
          Est-ce votre première consultation ?
        </h3>
        <p className="text-sm text-[#4A605E]">
          Cela nous permet de prévoir la durée optimale pour votre accueil.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onSelect(true)}
          className={`w-full p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
            firstTime
              ? "bg-[#E3F0EC] border-[#4E7F77] shadow-xs"
              : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#A5CEC4]"
          }`}
        >
          <div className="p-3 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
            <Sparkles className="w-6 h-6 text-[#4E7F77]" />
          </div>
          <div>
            <h4 className="font-serif-display text-base font-medium text-[#10201F]">
              Oui, c'est la première fois
            </h4>
            <p className="text-xs text-[#4A605E] mt-1 leading-relaxed">
              Il s'agit de votre tout premier rendez-vous au cabinet MindCare Center.
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect(false)}
          className={`w-full p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
            !firstTime
              ? "bg-[#E3F0EC] border-[#4E7F77] shadow-xs"
              : "bg-[#FCFAF6] border-[#EFE7DA] hover:border-[#A5CEC4]"
          }`}
        >
          <div className="p-3 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
            <RefreshCw className="w-6 h-6 text-[#4E7F77]" />
          </div>
          <div>
            <h4 className="font-serif-display text-base font-medium text-[#10201F]">
              Non, c'est un suivi
            </h4>
            <p className="text-xs text-[#4A605E] mt-1 leading-relaxed">
              Vous avez déjà consulté le Dr. Larbi Nassiba au cabinet.
            </p>
          </div>
        </button>
      </div>

      {firstTime && (
        <div className="p-4 rounded-2xl bg-[#F2F8F6] border border-[#C7E1DA] text-xs text-[#3D655F] flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#7FB5AB] shrink-0" />
          <p className="font-serif-display italic">
            « La première fois est toujours la plus difficile. Nous prendrons le temps qu'il faut. »
          </p>
        </div>
      )}
    </div>
  );
}
