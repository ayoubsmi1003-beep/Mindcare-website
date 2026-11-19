"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Reveal } from "../primitives/Reveal";
import { WordReveal } from "../primitives/WordReveal";
import { BotanicalSealSvg, SpecialtyCrestSvg } from "../primitives/BotanicalMotifs";
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
  const shouldReduceMotion = useReducedMotion();

  const outerPinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState<string | null>(serviceCategories[0].id);
  const [stackTilt, setStackTilt] = useState({ rx: 0, ry: 0 });

  const { scrollYProgress } = useScroll({
    target: outerPinRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (shouldReduceMotion || manualOverride) return;
    const count = serviceCategories.length;
    const mapped = Math.min(count - 1, Math.max(0, Math.floor(latest * count * 0.99)));
    if (mapped !== activeIndex) {
      setActiveIndex(mapped);
    }
  });

  // Reset manual override once user scrolls significantly
  useEffect(() => {
    if (!manualOverride) return;
    const timer = setTimeout(() => setManualOverride(false), 3500);
    return () => clearTimeout(timer);
  }, [manualOverride, activeIndex]);

  const handleCategoryClick = (idx: number) => {
    setManualOverride(true);
    setActiveIndex(idx);
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setStackTilt({
      rx: -ny * 5.5,
      ry: nx * 8.5,
    });
  };

  const tagText = language === "ar" ? "مجالات الرعاية والمتابعة" : language === "en" ? "Areas of Care" : "Nos Domaines d'Accompagnement";

  const headlineText = language === "ar"
    ? "«مهما كان الثقل الذي تحمله، هناك مساحة هادئة تتسع لك هنا.»"
    : language === "en"
    ? "“Whatever you are going through, there is a safe space for you here.”"
    : "« Quel que soit ce que vous traversez, il y a une place pour vous ici. »";

  const highlightWord = language === "ar" ? "هنا.»" : language === "en" ? "here.”" : "place";

  return (
    <section
      id="services"
      className="w-full bg-gradient-to-b from-[#F7F2E9] via-[#F2F8F6] to-[#FCFAF6] dark:from-[#111E1C] dark:via-[#0E1A18] dark:to-[#12201E] border-y border-[#EFE7DA] dark:border-[#243B37] transition-colors"
    >
      {/* Desktop Kolibrie-inspired Pinned 3D Peeling Card Stack */}
      <div
        ref={outerPinRef}
        className={`hidden lg:block relative ${shouldReduceMotion ? "py-28" : "h-[240vh]"}`}
      >
        <div
          className={`${
            shouldReduceMotion ? "" : "sticky top-0 h-[100dvh]"
          } w-full flex items-center px-6 xl:px-10 overflow-hidden`}
        >
          <div className="max-w-6xl mx-auto w-full grid grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Interactive Category Selector */}
            <div className="col-span-5 space-y-6">
              <div className="space-y-3">
                <Reveal>
                  <span className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
                    <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
                    <span>{tagText}</span>
                  </span>
                </Reveal>

                <WordReveal
                  as="h2"
                  text={headlineText}
                  highlightWord={highlightWord}
                  className="font-serif-display text-3xl xl:text-4xl text-[#10201F] dark:text-white font-normal leading-tight"
                />
              </div>

              {/* Direct Click Category Selector (Never Trapped) */}
              <div className="space-y-1.5 bg-[#FCFAF6]/85 dark:bg-[#12201E]/85 backdrop-blur-xl p-3 rounded-3xl border border-[#A5CEC4]/40 dark:border-[#2A423D] shadow-sm">
                {serviceCategories.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? "bg-[#E3F0EC] dark:bg-[#1D3531] text-[#10201F] dark:text-white shadow-2xs font-semibold"
                          : "hover:bg-[#F2F8F6] dark:hover:bg-[#182B28] text-[#4A605E] dark:text-[#B3CFC8]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`p-1.5 rounded-xl shrink-0 transition-colors ${
                            isActive
                              ? "bg-[#3D655F] text-white"
                              : "bg-[#F2F8F6] dark:bg-[#162825] text-[#4A605E] dark:text-[#B3CFC8]"
                          }`}
                        >
                          {getIconForCategory(cat.id)}
                        </span>
                        <span className="font-serif-display text-sm xl:text-base truncate">
                          {cat.title}
                        </span>
                      </div>
                      <span className="font-serif-display text-xs text-[#C8A46B] tabular-nums shrink-0">
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: 3D Perspective Peeling Card Stack Stage */}
            <div
              ref={stageRef}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={() => setStackTilt({ rx: 0, ry: 0 })}
              className="col-span-7 relative h-[540px] flex items-center justify-center [perspective:1400px]"
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { rotateX: stackTilt.rx, rotateY: stackTilt.ry }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
              >
                {serviceCategories.map((cat, idx) => {
                  const depth = idx - activeIndex;
                  const isPeeled = depth < 0;
                  const isVisible = depth >= -1 && depth <= 3;

                  const translateZ = isPeeled ? 60 : -depth * 65;
                  const translateY = isPeeled ? 380 : -depth * 24;
                  const scale = isPeeled ? 0.96 : 1 - depth * 0.045;
                  const opacity = isPeeled ? 0 : isVisible ? Math.max(0.25, 1 - depth * 0.24) : 0;

                  return (
                    <motion.div
                      key={cat.id}
                      animate={{
                        z: translateZ,
                        y: translateY,
                        scale,
                        opacity,
                        rotateX: isPeeled ? -8 : 0,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        zIndex: serviceCategories.length - idx,
                        pointerEvents: depth === 0 ? "auto" : "none",
                      }}
                      className="absolute w-full max-w-2xl rounded-3xl bg-[#FCFAF6]/95 dark:bg-[#0E1A18]/95 backdrop-blur-xl border border-[#EFE7DA] dark:border-[#243B37] shadow-[0_24px_60px_rgba(46,75,71,0.14)] dark:shadow-[0_28px_70px_rgba(0,0,0,0.5)] p-8 space-y-6"
                    >
                      {/* Card Header with Custom Organic Botanical Crest */}
                      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#EFE7DA] dark:border-[#1E3530]">
                        <div className="flex items-center gap-3.5">
                          <div className="p-2.5 rounded-xl bg-[#F2F8F6] dark:bg-[#162825] text-[#3D655F] dark:text-[#7FB5AB] border border-[#10201F]/5 dark:border-white/5">
                            {getIconForCategory(cat.id)}
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8A46B] tabular-nums">
                              0{idx + 1} / 0{serviceCategories.length}
                            </span>
                            <h3 className="font-serif-display text-2xl text-[#10201F] dark:text-white font-medium">
                              {cat.title}
                            </h3>
                          </div>
                        </div>

                        <SpecialtyCrestSvg
                          categoryId={cat.id}
                          className="w-16 h-16 shrink-0 opacity-85"
                        />
                      </div>

                      {/* Category Services List */}
                      <div className="grid grid-cols-1 gap-3.5">
                        {cat.services.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-[#F7F2E9]/70 dark:bg-[#162725]/80 border border-[#EFE7DA] dark:border-[#243B37] space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-serif-display text-base xl:text-lg text-[#10201F] dark:text-white font-medium">
                                {item.title}
                              </h4>
                              <CheckCircle2 className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] shrink-0 mt-1" />
                            </div>
                            <p className="font-sans-body text-xs xl:text-sm text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Rotating Botanical Seal (Kolibrie Badge) */}
              <motion.div
                animate={{ rotate: activeIndex * 45 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -right-4 z-30 drop-shadow-lg"
              >
                <BotanicalSealSvg className="w-24 h-24" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Clean Accordion */}
      <div className="lg:hidden py-24 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <Reveal>
            <span className="inline-flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
              <span>{tagText}</span>
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headlineText}
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />
        </div>

        <div className="space-y-4">
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
      </div>

      {/* Closing Footnote Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-24 lg:pb-28">
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
