"use client";

import React from "react";
import { AlertTriangle, PhoneCall } from "lucide-react";
import { clinic } from "@/content/clinic";

export function CrisisBanner() {
  return (
    <aside aria-label="Consignes d'urgence médicale" className="w-full bg-[#F7F2E9] border-y border-[#EFE7DA] py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-full bg-[#C8A46B]/15 text-[#C8A46B] shrink-0 mt-0.5 md:mt-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-[#10201F] flex items-center gap-2">
              En cas d'urgence médicale ou psychiatrique
            </h3>
            <p className="text-xs sm:text-sm text-[#4A605E] mt-1 leading-relaxed max-w-3xl">
              Si vous êtes en danger immédiat, ou si vous avez des pensées de vous faire du mal, n'attendez pas votre rendez-vous. Appelez immédiatement les secours (SAMU 115, Police 17) ou rendez-vous au service d'urgence le plus proche. Vous n'êtes pas seul(e), et votre vie compte.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <a
            href="tel:115"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10201F] text-xs font-medium text-white hover:bg-[#2E4B47] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            SAMU 115
          </a>
          <a
            href={clinic.phoneHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#7FB5AB] text-xs font-medium text-[#3D655F] hover:bg-[#E3F0EC] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Cabinet 0554 81 39 11
          </a>
        </div>
      </div>
    </aside>
  );
}
