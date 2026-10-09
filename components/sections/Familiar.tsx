"use client";

import React from "react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { SectionDivider } from "../primitives/SectionDivider";
import { GradientOrb } from "../primitives/GradientOrb";
import { Sparkles, HeartHandshake } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Familiar() {
  const { language, t } = useAppContext();

  const painPoints = language === "ar"
    ? [
        "«مرهقٌ من قلقٍ مستمرٍ يرفض الأُفولَ والهدوء.»",
        "«مستلقٍ في الليل، تعيد حوارات وتفاصيل الأمس بلا طائل.»",
        "«الشعور الدائم بضرورة إظهار القوة والصمود لأجل الجميع.»",
        "«أيامٌ يكون فيها مجرد النهوض من الفراش جهداً مضنياً.»",
        "«إحساسٌ غريبٌ بأنك لم تعد تعرف نفسك كما كنت.»",
      ]
    : language === "en"
    ? [
        "“Exhausted by persistent worry that never quietens down.”",
        "“Lying awake at night, replaying the same thoughts endlessly.”",
        "“The heavy feeling of always having to be strong for everyone else.”",
        "“Days when even getting out of bed feels like an overwhelming mountain.”",
        "“The quiet feeling that you no longer fully recognize yourself.”",
      ]
    : [
        "« Épuisé(e) par une inquiétude qui ne s'arrête jamais. »",
        "« Allongé(e) la nuit, à rejouer les mêmes conversations. »",
        "« Le sentiment d'avoir à être fort(e) pour tout le monde. »",
        "« Des journées où même se lever demande un effort immense. »",
        "« L'impression de ne plus vraiment se reconnaître. »",
      ];

  const titlePart1 = language === "ar"
    ? "«لست وحدك من يشعر بهذا الثقل.»"
    : language === "en"
    ? "“You are not alone in feeling this way.”"
    : "« Vous n'êtes pas seul(e) à ressentir cela. »";

  const subtitlePart1 = language === "ar"
    ? "هل يبدو لك هذا الكلام مألوفاً؟"
    : language === "en"
    ? "Does any of this sound familiar?"
    : "Est-ce que cela vous parle ?";

  const tagPart1 = language === "ar" ? "قبل أن نبدأ" : language === "en" ? "Before we begin" : "Avant de commencer";

  const tagPart2 = language === "ar" ? "الخبر السار" : language === "en" ? "The good news" : "La bonne nouvelle";

  const titlePart2 = language === "ar"
    ? "«يمكنك استعادة عافيتك وراحة بالك.»"
    : language === "en"
    ? "“You can start feeling better.”"
    : "« Vous pouvez aller mieux. »";

  const subtitlePart2 = language === "ar"
    ? "ليس بين عشية وضحاها.. بل خطوة بخطوة، ودون أن تكون وحدك أبداً."
    : language === "en"
    ? "Not overnight. But step by step, and never alone."
    : "Pas du jour au lendemain. Mais pas à pas, et jamais seul(e).";

  return (
    <section id="familiar" className="relative w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#F4EFE6] via-[#FCFAF6] to-[#F2F8F6] dark:from-[#132421] dark:via-[#0E1A18] dark:to-[#111E1C] overflow-hidden transition-colors">
      <GradientOrb color="sage" size={600} top="15%" left="50%" className="-translate-x-1/2" />
      <GradientOrb color="cream" size={450} bottom="10%" right="10%" />

      <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
        {/* Part 1: Pain Points */}
        <div className="space-y-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:to-[#1F3834] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
              <Sparkles className="w-3 h-3 text-[#4E7F77] dark:text-[#7FB5AB]" />
              {tagPart1}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={titlePart1}
            highlightWord={language === "ar" ? "وحدك" : language === "en" ? "alone" : "seul(e)"}
            className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#10201F] dark:text-white font-normal leading-tight"
          />

          <Reveal delay={0.15}>
            <p className="font-serif-display italic text-lg sm:text-xl text-[#3D655F] dark:text-[#B3CFC8] font-medium">
              {subtitlePart1}
            </p>
          </Reveal>
        </div>

        {/* 5 Cards Revealed */}
        <div className="space-y-4 py-4 max-w-3xl mx-auto">
          {painPoints.map((line, idx) => (
            <Reveal key={idx} delay={0.1 + idx * 0.1} yOffset={20}>
              <div className="group p-6 rounded-2xl bg-gradient-to-r from-[#FCFAF6] via-[#FFFFFF] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#162825] dark:to-[#12201E] border border-[#EFE7DA] dark:border-[#243B37] hover:border-[#7FB5AB] shadow-xs hover:shadow-[0_10px_30px_rgba(46,75,71,0.08)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between gap-4">
                <span className="w-2 h-2 rounded-full bg-[#7FB5AB] group-hover:scale-150 group-hover:bg-[#4E7F77] transition-all shrink-0" />
                <p className="font-serif-display text-lg sm:text-xl text-[#1D3634] dark:text-[#F2F8F6] font-medium leading-relaxed flex-1 text-center">
                  {line}
                </p>
                <span className="text-xs font-serif-display text-[#C8A46B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  ✦
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionDivider variant="gradient" fromBg="#FCFAF6" toBg="#F2F8F6" />

        {/* Part 2: Reassurance Message */}
        <div className="space-y-5 pt-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] to-[#C7E1DA] dark:from-[#172927] dark:to-[#223B37] border border-[#A5CEC4] dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
              {tagPart2}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={titlePart2}
            highlightWord={language === "ar" ? "عافيتك" : language === "en" ? "better" : "mieux"}
            className="font-serif-display text-4xl sm:text-5xl md:text-6xl text-[#10201F] dark:text-white font-normal"
          />

          <Reveal delay={0.15}>
            <p className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] max-w-md mx-auto font-medium">
              {subtitlePart2}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
