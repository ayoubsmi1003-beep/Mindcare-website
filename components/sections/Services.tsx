"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { Waves, Moon, Baby, HeartHandshake, Brain, Sunrise, ChevronDown, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

const getIconForCategory = (id: string): React.ReactNode => {
  if (id.includes("anxiet") || id.includes("anxiety")) return <Waves className="w-5 h-5" />;
  if (id.includes("sommeil") || id.includes("sleep")) return <Moon className="w-5 h-5" />;
  if (id.includes("enfant") || id.includes("child") || id.includes("ado")) return <Baby className="w-5 h-5" />;
  if (id.includes("therapie") || id.includes("therapy")) return <HeartHandshake className="w-5 h-5" />;
  if (id.includes("psychiatr") || id.includes("neuro")) return <Brain className="w-5 h-5" />;
  return <Sunrise className="w-5 h-5" />;
};

export function Services() {
  const { language, t } = useAppContext();
  const serviceCategories = t.services.categories;

  const [activeCategoryId, setActiveCategoryId] = useState(serviceCategories[0].id);
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState<string | null>(serviceCategories[0].id);

  const activeCategory = serviceCategories.find((cat) => cat.id === activeCategoryId) || serviceCategories[0];

  const tagText = language === "ar" ? "مجالات الرعاية والمتابعة" : language === "en" ? "Areas of Care" : "Nos Domaines d'Accompagnement";

  const headlineText = language === "ar"
    ? "«مهما كان الثقل الذي تحمله، هناك مساحة هادئة تتسع لك هنا.»"
    : language === "en"
    ? "“Whatever you are going through, there is a safe space for you here.”"
    : "« Quel que soit ce que vous traversez, il y a une place pour vous ici. »";

  const highlightWord = language === "ar" ? "هنا.»" : language === "en" ? "here.”" : "place";

  return (
    <section id="services" className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#F7F2E9] via-[#F2F8F6] to-[#FCFAF6] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] border-y border-[#EFE7DA] dark:border-[#243B37] transition-colors">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:to-[#1F3834] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
              {tagText}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight"
          />
        </div>

        {/* Desktop Split View */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* Category Vertical Tab List */}
          <div className="col-span-5 space-y-2.5 bg-[#FCFAF6]/90 dark:bg-[#12201E]/90 backdrop-blur-md p-4 rounded-3xl border border-[#A5CEC4]/40 dark:border-[#2A423D] shadow-sm">
            {serviceCategories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#FCFAF6] dark:from-[#172927] dark:via-[#1F3834] dark:to-[#12201E] border-l-4 border-[#3D655F] dark:border-[#7FB5AB] text-[#10201F] dark:text-white shadow-sm font-semibold"
                      : "hover:bg-[#F2F8F6] dark:hover:bg-[#1A2D2A] text-[#4A605E] dark:text-[#B3CFC8]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`p-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-[#4E7F77] to-[#3D655F] text-white shadow-md scale-105"
                          : "bg-[#EFE7DA]/70 dark:bg-[#1C2E2B] text-[#4A605E] dark:text-[#B3CFC8] group-hover:bg-[#E3F0EC] dark:group-hover:bg-[#223B37] group-hover:text-[#3D655F]"
                      }`}
                    >
                      {getIconForCategory(cat.id)}
                    </span>
                    <span className="font-serif-display text-base">
                      {cat.title}
                    </span>
                  </div>

                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8A46B] shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Category Cards Display */}
          <div className="col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#162825] dark:to-[#12201E] border border-[#A5CEC4]/50 dark:border-[#243B37] shadow-md space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#EFE7DA] dark:border-[#243B37]">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] text-[#3D655F] dark:text-[#A5CEC4]">
                      {getIconForCategory(activeCategory.id)}
                    </div>
                    <h3 className="font-serif-display text-2xl text-[#10201F] dark:text-white font-medium">
                      {activeCategory.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeCategory.services.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-[#FCFAF6]/80 dark:bg-[#172927]/80 border border-[#A5CEC4]/30 dark:border-[#2A423D] hover:border-[#7FB5AB] transition-all duration-300 space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-serif-display text-lg text-[#10201F] dark:text-white font-medium group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                            {item.title}
                          </h4>
                          <CheckCircle2 className="w-4 h-4 text-[#7FB5AB] shrink-0 mt-1" />
                        </div>
                        <p className="font-sans-body text-sm text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-4">
          {serviceCategories.map((cat) => {
            const isOpen = openMobileCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                className="rounded-2xl bg-gradient-to-r from-[#FFFFFF] to-[#FCFAF6] dark:from-[#12201E] dark:to-[#162825] border border-[#A5CEC4]/50 dark:border-[#243B37] overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenMobileCategoryId(isOpen ? null : cat.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-[#E3F0EC] dark:bg-[#1F3834] text-[#3D655F] dark:text-[#A5CEC4]">
                      {getIconForCategory(cat.id)}
                    </span>
                    <span className="font-serif-display text-lg text-[#10201F] dark:text-white font-medium">
                      {cat.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#3D655F] dark:text-[#A5CEC4] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 pt-0 space-y-3 border-t border-[#EFE7DA] dark:border-[#243B37]"
                    >
                      {cat.services.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl bg-[#FCFAF6] dark:bg-[#172927] border border-[#EFE7DA] dark:border-[#2A423D] space-y-1.5"
                        >
                          <h4 className="font-serif-display text-base text-[#10201F] dark:text-white font-medium">
                            {item.title}
                          </h4>
                          <p className="font-sans-body text-xs text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Closing Footnote Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#10201F] via-[#1A2E2C] to-[#2E4B47] text-white space-y-3 shadow-xl">
          <h3 className="font-serif-display text-xl sm:text-2xl font-medium text-[#7FB5AB]">
            {t.services.closingTitle}
          </h3>
          <p className="font-sans-body text-sm sm:text-base text-[#C7E1DA] leading-relaxed max-w-4xl">
            {t.services.closingText}
          </p>
        </div>
      </div>
    </section>
  );
}
