"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { OliveSprigSvg, CalmWaveSvg, BotanicalSealSvg } from "../primitives/BotanicalMotifs";
import { useAppContext } from "@/lib/app-context";

export function ManifestoRibbon() {
  const { language, isRTL } = useAppContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Gentle horizontal travel driven by vertical scroll
  const xDesktop = useTransform(
    scrollYProgress,
    [0, 1],
    isRTL ? ["-38%", "12%"] : ["8%", "-48%"]
  );

  const phrases =
    language === "ar"
      ? {
          lead: "إنصاتٌ صادق",
          mid1: "بلا أحكام",
          token1: "سرية تامة",
          mid2: "علاج سلوكي معرفي",
          token2: "وتيرة تحترمك",
          end: "حضور إنساني دافئ.",
        }
      : language === "en"
      ? {
          lead: "Gentle listening",
          mid1: "without judgment",
          token1: "Medical privacy",
          mid2: "evidence-based care",
          token2: "at your own pace",
          end: "and steady human presence.",
        }
      : {
          lead: "Une écoute sincère",
          mid1: "sans jugement",
          token1: "Confidentialité absolue",
          mid2: "soin rigoureux",
          token2: "à votre rythme",
          end: "avec une présence humaine.",
        };

  if (shouldReduceMotion) {
    return (
      <section
        aria-label="Manifeste MindCare"
        className="w-full py-16 px-4 bg-[#10201F] text-[#FCFAF6] overflow-hidden"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 text-center font-serif-display text-2xl sm:text-3xl">
          <span>{phrases.lead}</span>
          <span className="text-[#7FB5AB] italic">{phrases.mid1}</span>
          <span className="text-[#C8A46B]">·</span>
          <span>{phrases.token1}</span>
          <span className="text-[#C8A46B]">·</span>
          <span className="text-[#A5CEC4] italic">{phrases.end}</span>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Manifeste MindCare"
      className="relative w-full h-auto lg:h-[190vh] bg-[#10201F] dark:bg-[#081211] text-[#FCFAF6] transition-colors"
    >
      {/* Desktop Sticky Horizontal Tidewell Manifesto Track */}
      <div className="hidden lg:flex sticky top-0 h-[100dvh] w-full overflow-hidden items-center">
        {/* Soft Ambient Aurora in Deep Forest */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,181,171,0.14)_0%,transparent_65%)]"
        />

        <motion.div
          style={{ x: xDesktop }}
          className="flex items-center gap-10 whitespace-nowrap px-12 will-change-transform"
        >
          <span className="font-serif-display text-6xl xl:text-7xl font-normal tracking-tight text-white">
            {phrases.lead}
          </span>

          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            className="shrink-0 p-4 rounded-2xl bg-[#1D3634]/80 border border-[#7FB5AB]/30 shadow-lg -rotate-6"
          >
            <OliveSprigSvg className="w-12 h-12 text-[#7FB5AB]" />
          </motion.div>

          <span className="font-serif-display italic text-6xl xl:text-7xl font-light text-[#A5CEC4]">
            {phrases.mid1}
          </span>

          <span className="px-6 py-3 rounded-2xl bg-[#E3F0EC] text-[#10201F] font-serif-display text-2xl font-medium shadow-xl rotate-3">
            {phrases.token1}
          </span>

          <CalmWaveSvg className="w-24 h-12 text-[#C8A46B] shrink-0" />

          <span className="font-serif-display text-6xl xl:text-7xl font-normal text-white">
            {phrases.mid2}
          </span>

          <span className="px-6 py-3 rounded-2xl bg-[#C8A46B] text-[#10201F] font-serif-display text-2xl font-medium shadow-xl -rotate-3">
            {phrases.token2}
          </span>

          <BotanicalSealSvg
            className="w-24 h-24 shrink-0 animate-[spin_28s_linear_infinite]"
            label="MINDCARE · ÉCOUTE · SOIN · SÉRÉNITÉ · "
          />

          <span className="font-serif-display italic text-6xl xl:text-7xl font-light text-[#7FB5AB]">
            {phrases.end}
          </span>
        </motion.div>
      </div>

      {/* Mobile Calm Editorial Manifesto Strip */}
      <div className="lg:hidden py-16 px-6 space-y-6 text-center">
        <div className="flex justify-center">
          <OliveSprigSvg className="w-12 h-12 text-[#7FB5AB]" />
        </div>
        <p className="font-serif-display text-3xl text-white leading-snug [text-wrap:balance]">
          {phrases.lead}{" "}
          <span className="italic text-[#A5CEC4]">{phrases.mid1}</span> —{" "}
          <span className="text-[#E2C08A]">{phrases.mid2}</span>, {phrases.end}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#C7E1DA]">
          <span>{phrases.token1}</span>
          <span aria-hidden="true" className="text-[#C8A46B]">·</span>
          <span>{phrases.token2}</span>
        </div>
      </div>
    </section>
  );
}
