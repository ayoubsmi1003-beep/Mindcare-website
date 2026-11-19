"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { WordReveal } from "../primitives/WordReveal";
import { GradientOrb } from "../primitives/GradientOrb";
import { CountUp } from "../primitives/CountUp";
import { Magnetic } from "../primitives/Magnetic";
import { DrawUnderline } from "../primitives/DrawUnderline";
import { OliveSprigSvg } from "../primitives/BotanicalMotifs";
import { Calendar, Sparkles, ShieldCheck, Clock, Star, UserCheck, ArrowDown } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface HeroProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

const FROSTED_SQUARES = [
  { top: "14%", right: "5%", size: "w-14 h-14", delay: 0.2 },
  { top: "24%", right: "-4%", size: "w-10 h-10", delay: 0.8 },
  { bottom: "26%", left: "-5%", size: "w-16 h-16", delay: 0.5 },
  { bottom: "14%", left: "6%", size: "w-9 h-9", delay: 1.2 },
];

export function Hero({ onOpenBooking, onOpenChat }: HeroProps) {
  const { t, language } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 56]);
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.04]);
  const textY = useTransform(scrollY, [0, 420], [0, -24]);
  const textOpacity = useTransform(scrollY, [0, 380], [1, 0.45]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      if (archRef.current) {
        const aRect = archRef.current.getBoundingClientRect();
        const nx = (e.clientX - (aRect.left + aRect.width / 2)) / (aRect.width / 2);
        const ny = (e.clientY - (aRect.top + aRect.height / 2)) / (aRect.height / 2);
        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, ny));
        setTilt({
          rx: -clampedY * 4.5,
          ry: clampedX * 5.5,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion]);

  const exploreLabel =
    language === "ar"
      ? "اكتشف فلسفتنا في الرعاية"
      : language === "en"
      ? "Discover our care approach"
      : "Découvrir notre approche";

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96dvh] w-full pt-28 sm:pt-36 pb-16 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FCFAF6] to-[#F4EFE6] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#132421] overflow-hidden flex flex-col justify-between transition-colors duration-300"
    >
      {/* Background Ambient Drifting Orbs */}
      <GradientOrb color="sage" size={680} top="-12%" right="-6%" />
      <GradientOrb color="cream" size={560} bottom="-4%" left="-10%" />

      {/* Subtle Architectural Grid Hairlines (Petalyx-inspired top backdrop geometry) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[48%] opacity-[0.38] dark:opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(78,127,119,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(78,127,119,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Cursor Follow Soft Glow (Desktop only) */}
      <div
        className="pointer-events-none absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(127,181,171,0.14)_0%,transparent_70%)] transition-transform duration-300 ease-out hidden md:block"
        style={{
          transform: `translate(${mousePos.x - 240}px, ${mousePos.y - 240}px)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center my-auto z-10">
        {/* Left Column Text & CTAs */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="lg:col-span-7 space-y-7"
        >
          {/* Clean Unboxed Editorial Eyebrow */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase"
          >
            <span className="h-px w-7 bg-[#C8A46B]" aria-hidden="true" />
            <span>{t.hero.eyebrow}</span>
          </motion.div>

          {/* Headline H1 */}
          <div className="relative">
            <WordReveal
              as="h1"
              immediate
              text={t.hero.headline}
              highlightWord={t.hero.highlight}
              className="font-serif-display text-4xl sm:text-5xl lg:text-[3.55rem] tracking-tight text-[#10201F] dark:text-white font-normal leading-[1.13]"
            />
            {/* Organic Drawn Accent Underline under headline */}
            <div className="mt-3 w-36 sm:w-44 h-3.5 pointer-events-none">
              <DrawUnderline
                always
                variant={1}
                strokeWidth={7}
                className="text-[#C8A46B]/85 dark:text-[#E2C08A]/80"
              />
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed max-w-xl font-normal"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs + Kolibrie-inspired drawn scroll cue */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <Magnetic sheen strength={6}>
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#3D655F] via-[#4E7F77] to-[#365A54] text-white font-semibold text-sm sm:text-base shadow-[0_10px_28px_rgba(61,101,95,0.28)] hover:shadow-[0_14px_34px_rgba(61,101,95,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 group whitespace-nowrap cursor-pointer"
              >
                <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span>{t.hero.bookBtn}</span>
              </button>
            </Magnetic>

            <button
              onClick={onOpenChat}
              className="px-7 py-3.5 rounded-full bg-white/90 dark:bg-[#0E1A18]/90 backdrop-blur-md border border-[#EFE7DA] dark:border-[#1E3530] text-[#10201F] dark:text-[#E3F0EC] hover:bg-[#F2F8F6] dark:hover:bg-[#162825] font-semibold text-sm sm:text-base shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 group whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] group-hover:rotate-12 transition-transform" />
              <span>{t.hero.chatBtn}</span>
            </button>

            <a
              href="#familiar"
              className="group inline-flex items-center gap-2.5 text-sm font-serif-display italic text-[#3D655F] dark:text-[#A5CEC4] hover:text-[#10201F] dark:hover:text-white transition-colors px-2 py-2"
            >
              <span className="relative">
                {exploreLabel}
                <span className="absolute left-0 right-0 -bottom-1.5 h-2">
                  <DrawUnderline always variant={0} strokeWidth={8} className="text-[#7FB5AB]" />
                </span>
              </span>
              <span className="w-6 h-6 rounded-full bg-[#E3F0EC] dark:bg-[#1A302D] border border-[#C7E1DA] dark:border-[#2A423D] flex items-center justify-center overflow-hidden">
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </span>
            </a>
          </motion.div>

          {/* Trust Row */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6 border-t border-[#EFE7DA]/80 dark:border-[#1E3530] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-[#3D5250] dark:text-[#B3CFC8]"
          >
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-[#0E1A18]/70 backdrop-blur-sm border border-[#EFE7DA]/70 dark:border-[#1E3530]">
              <div className="p-1.5 rounded-lg bg-[#F2F8F6] dark:bg-[#142523] text-[#4E7F77] dark:text-[#7FB5AB] shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">{t.hero.doctorTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-[#0E1A18]/70 backdrop-blur-sm border border-[#EFE7DA]/70 dark:border-[#1E3530]">
              <div className="p-1.5 rounded-lg bg-[#F2F8F6] dark:bg-[#142523] text-[#4E7F77] dark:text-[#7FB5AB] shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">{t.hero.hoursTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-[#0E1A18]/70 backdrop-blur-sm border border-[#EFE7DA]/70 dark:border-[#1E3530]">
              <div className="p-1.5 rounded-lg bg-[#F2F8F6] dark:bg-[#142523] text-[#4E7F77] dark:text-[#7FB5AB] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">{t.hero.privacyTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-[#0E1A18]/70 backdrop-blur-sm border border-[#EFE7DA]/70 dark:border-[#1E3530]">
              <div className="p-1.5 rounded-lg bg-[#FFF7E6] dark:bg-[#2A2318] text-[#C8A46B] shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#C8A46B]" />
              </div>
              <span className="tabular-nums leading-snug">
                +<CountUp end={30} /> {t.hero.reviewsTag.replace("+30 ", "")}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column Imagery in Perspective Arch Frame + Petalyx Frosted Squares */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}
          className="lg:col-span-5 relative flex justify-center lg:justify-end"
        >
          <div
            ref={archRef}
            className="relative w-full max-w-sm sm:max-w-md [perspective:1200px]"
          >
            {/* Subtle Sage Glow background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7FB5AB]/30 via-[#E3F0EC]/40 to-[#C8A46B]/20 dark:from-[#4E7F77]/20 dark:to-[#2E4B47]/30 rounded-[120px] filter blur-2xl transform scale-105 pointer-events-none" />

            {/* Petalyx-inspired Shimmering Frosted Glass Architectural Squares */}
            {FROSTED_SQUARES.map((sq, i) => (
              <motion.div
                key={i}
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.45, scale: 1 }
                    : {
                        opacity: [0.3, 0.75, 0.35],
                        scale: [0.96, 1.02, 0.96],
                      }
                }
                transition={{
                  duration: 4.5 + i * 0.7,
                  delay: sq.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  top: sq.top,
                  right: sq.right,
                  bottom: sq.bottom,
                  left: sq.left,
                }}
                className={`hidden sm:block pointer-events-none absolute z-20 ${sq.size} rounded-xl bg-white/30 dark:bg-[#1A302D]/40 backdrop-blur-md border border-white/60 dark:border-[#7FB5AB]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]`}
              />
            ))}

            {/* Floating Botanical Olive Sprig */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute -top-7 -left-7 z-20 pointer-events-none animate-gentle-float"
            >
              <OliveSprigSvg className="w-16 h-16 text-[#4E7F77] dark:text-[#7FB5AB] drop-shadow-sm" />
            </div>

            {/* Arch Frame Container with Smooth 3D Cursor Tilt */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotateX: tilt.rx, rotateY: tilt.ry }
              }
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="relative w-full aspect-[4/5] rounded-t-[140px] rounded-b-[36px] overflow-hidden border-2 border-[#EFE7DA] dark:border-[#2A423D] bg-[#F7F2E9] dark:bg-[#142220] shadow-[0_28px_64px_rgba(46,75,71,0.18)] group [transform-style:preserve-3d]"
            >
              <img
                src="/hero.svg"
                alt="Cadre apaisant et chaleureux du cabinet MindCare Center"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Frosted Glass Quote Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#FCFAF6]/90 dark:bg-[#12201E]/90 backdrop-blur-xl border border-[#A5CEC4]/50 dark:border-[#2A423D] shadow-xl">
                <p className="font-serif-display italic text-sm text-[#10201F] dark:text-[#F2F8F6] text-center leading-relaxed font-medium">
                  {t.hero.floatQuote}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
