"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Faq() {
  const { language, t } = useAppContext();
  const faqs = t.faq.items;

  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || "1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const tagText = language === "ar" ? "الأسئلة الشائعة" : language === "en" ? "Frequently Asked Questions" : "Questions Fréquentes";
  const headlineText = language === "ar"
    ? "«إجابات طبية واضحة لتبديد كل شكوكك.»"
    : language === "en"
    ? "“Clear answers to comfort your mind.”"
    : "« Des réponses claires pour lever vos doutes. »";

  const subtitleText = language === "ar" ? "كل ما تود معرفته قبل زيارتك الأولى للعيادة." : language === "en" ? "Everything you need to know before your visit." : "Demander de l'aide suscite des interrogations légitimes. Voici tout ce que vous devez savoir avant votre venue.";

  return (
    <section id="faq" className="w-full py-28 sm:py-36 px-4 sm:px-8 bg-gradient-to-b from-[#EBF4F1] via-[#F7F2E9] to-[#FCFAF6] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] border-y border-[#EFE7DA] dark:border-[#243B37] transition-colors">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
              {tagText}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={language === "ar" ? "واضحة" : language === "en" ? "Clear" : "claires"}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />

          <Reveal delay={0.15}>
            <p className="font-sans-body text-sm sm:text-base text-[#3D5250] dark:text-[#B3CFC8] font-normal text-center">
              {subtitleText}
            </p>
          </Reveal>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <Reveal key={faq.id} delay={idx * 0.05}>
                <div className="rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group focus:outline-hidden cursor-pointer"
                  >
                    <span className="font-serif-display text-lg sm:text-xl text-[#10201F] dark:text-white font-medium leading-snug group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                      {faq.question}
                    </span>
                    <span className={`p-2 rounded-xl shrink-0 transition-all duration-300 ${isOpen ? "bg-[#3D655F] text-white rotate-180" : "bg-[#F2F8F6] dark:bg-[#162825] text-[#3D655F] dark:text-[#A5CEC4]"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="p-6 pt-0 border-t border-[#EFE7DA]/70 dark:border-[#243B37] font-sans-body text-sm sm:text-base text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
