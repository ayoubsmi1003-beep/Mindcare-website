"use client";

import React from "react";
import { motion } from "motion/react";
import { WordReveal } from "../primitives/WordReveal";
import { Reveal } from "../primitives/Reveal";
import { testimonials } from "@/content/testimonials";
import { Star, Quote } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

function getInitials(name: string): string {
  const clean = name.trim().replace(/[^\w\s\u0600-\u06FF]/gi, "");
  const parts = clean.split(" ").filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export function Testimonials() {
  const { language, t } = useAppContext();

  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  const columns = [
    { items: [...col1, ...col1], speed: 32 },
    { items: [...col2, ...col2], speed: 42 },
    { items: [...col3, ...col3], speed: 36 },
  ];

  const tagText = language === "ar" ? "شهادات المرضى" : language === "en" ? "Patient Stories" : "Ils sont venus avant vous";
  const headlineText = language === "ar"
    ? "«شهادات حقيقية وكلمات من القلب.»"
    : language === "en"
    ? "“Real words from people we cared for.”"
    : "« Ce que nos patients racontent. »";

  const subtitleText = language === "ar"
    ? "كلمات صادقة نعتز بها ولم نقم بصياغتها."
    : language === "en"
    ? "Words written by patients, untouched by us."
    : "Des mots que nous n'avons pas écrits.";

  const googleText = language === "ar" ? "تقييمات مراجعة على جوجل" : language === "en" ? "Verified Google Reviews" : "Avis Google vérifiés";

  return (
    <section id="temoignages" className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#F7F2E9] via-[#FCFAF6] to-[#EBF4F1] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:to-[#1F3834] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
                {tagText}
              </span>
            </Reveal>

            <WordReveal
              as="h2"
              text={headlineText}
              highlightWord={language === "ar" ? "القلب.»" : language === "en" ? "cared" : "patients"}
              className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight"
            />

            <Reveal delay={0.15}>
              <p className="font-serif-display italic text-lg sm:text-xl text-[#3D655F] dark:text-[#B3CFC8] font-medium">
                {subtitleText}
              </p>
            </Reveal>
          </div>

          {/* Verified Google Badge */}
          <Reveal delay={0.2} className="shrink-0">
            <div className="inline-flex items-center gap-3.5 p-4 px-6 rounded-2xl bg-gradient-to-r from-[#FFFFFF] to-[#FCFAF6] dark:from-[#12201E] dark:to-[#162825] border border-[#A5CEC4]/60 dark:border-[#2A423D] shadow-md">
              <div className="flex items-center gap-1 text-[#C8A46B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#10201F] dark:text-white">
                  4,9 {language === "ar" ? "من 5" : "sur 5"}
                </span>
                <span className="text-[11px] font-medium text-[#4A605E] dark:text-[#B3CFC8]">
                  {googleText}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 3 Vertical Marquee Columns */}
        <div className="relative max-h-[740px] overflow-hidden group [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              className={`overflow-hidden ${
                colIdx === 1 ? "hidden md:block" : colIdx === 2 ? "hidden lg:block" : "block"
              }`}
            >
              <motion.div
                className="space-y-6 flex flex-col"
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: col.speed,
                }}
                whileHover={{ animationPlayState: "paused" }}
              >
                {col.items.map((tItem, idx) => {
                  const isRtl = isArabicText(tItem.text);
                  const initials = getInitials(tItem.name);

                  return (
                    <div
                      key={idx}
                      className="rounded-3xl border border-[#A5CEC4]/40 dark:border-[#243B37] bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF6] to-[#F7F2E9] dark:from-[#12201E] dark:via-[#162825] dark:to-[#12201E] p-7 shadow-sm hover:shadow-[0_12px_36px_rgba(46,75,71,0.12)] space-y-5 hover:border-[#7FB5AB] transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Quote className="w-7 h-7 text-[#7FB5AB]/60 rotate-180" />

                      <p
                        dir={isRtl ? "rtl" : "ltr"}
                        className={`font-sans-body text-sm text-[#1D3634] dark:text-[#F2F8F6] leading-relaxed ${
                          isRtl ? "text-right font-medium" : "text-left font-normal"
                        }`}
                      >
                        {tItem.text}
                      </p>

                      <div className="flex items-center gap-3 pt-3 border-t border-[#EFE7DA] dark:border-[#243B37]">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E3F0EC] to-[#C7E1DA] dark:from-[#1C2D2A] dark:to-[#223B37] border border-[#A5CEC4] dark:border-[#2A423D] flex items-center justify-center font-serif-display text-xs font-bold text-[#3D655F] dark:text-[#A5CEC4]">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#10201F] dark:text-white">
                            {tItem.name}
                          </span>
                          <span className="text-[10px] font-medium text-[#4A605E] dark:text-[#B3CFC8]">
                            {language === "ar" ? "مريض(ة) · تقييم جوجل" : language === "en" ? "Patient · Google Review" : "Patient(e) · Avis Google"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
