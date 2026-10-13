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
        "«إرهاقٌ صامت من قلقٍ داخلي لا يهدأ، وكأن عقلك في حالة طوارئ دائمة.»",
        "«تستلقي في فراشك متعباً، لكن الأفكار تتسابق وتمنعك من النوم والراحة.»",
        "«ثقل التظاهر الدائم بالصلابة أمام الجميع، بينما تتألم وحدك في صمت.»",
        "«أيامٌ يكون فيها مجرد النهوض من السرير عبئاً يثقل كاهلك ويسلب طاقتك.»",
        "«إحساسٌ غريب بأن بهجة الحياة انطفأت، وأنك لم تعد تشبه نفسك القديمة.»",
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
    ? "«ما تشعر به ليس عيباً، ولست وحدك في هذا العبء.»"
    : language === "en"
    ? "“You are not alone in feeling this way.”"
    : "« Vous n'êtes pas seul(e) à ressentir cela. »";

  const subtitlePart1 = language === "ar"
    ? "هل مرت بك إحدى هذه اللحظات من قبل؟"
    : language === "en"
    ? "Does any of this sound familiar?"
    : "Est-ce que cela vous parle ?";

  const tagPart1 = language === "ar" ? "رسالة من القلب" : language === "en" ? "Before we begin" : "Avant de commencer";

  const tagPart2 = language === "ar" ? "الأمل في التعافي" : language === "en" ? "The good news" : "La bonne nouvelle";

  const titlePart2 = language === "ar"
    ? "«يمكن لقلبك وعقلك أن يستعيدا الهدوء من جديد.»"
    : language === "en"
    ? "“You can start feeling better.”"
    : "« Vous pouvez aller mieux. »";

  const subtitlePart2 = language === "ar"
    ? "ليس بين عشية وضحاها.. بل بخطوات علمية حانية، ويدٍ طبية تسندك دون أن تكون وحدك."
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
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              <Sparkles className="w-3 h-3 text-[#4E7F77] dark:text-[#7FB5AB]" />
              {tagPart1}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={titlePart1}
            highlightWord={language === "ar" ? "وحدك" : language === "en" ? "alone" : "seul(e)"}
            className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />

          <Reveal delay={0.15}>
            <p className="font-serif-display italic text-lg sm:text-xl text-[#3D655F] dark:text-[#B3CFC8] font-medium text-center">
              {subtitlePart1}
            </p>
          </Reveal>
        </div>

        {/* 5 Cards Revealed */}
        <div className="space-y-3 py-4 max-w-3xl mx-auto">
          {painPoints.map((line, idx) => (
            <Reveal key={idx} delay={0.1 + idx * 0.1} yOffset={20}>
              <div className="group p-5 sm:p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4">
                <span className="w-2 h-2 rounded-full bg-[#7FB5AB] group-hover:bg-[#4E7F77] transition-all shrink-0" />
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

        <SectionDivider variant="rule" />

        {/* Part 2: Reassurance Message */}
        <div className="space-y-5 pt-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
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
