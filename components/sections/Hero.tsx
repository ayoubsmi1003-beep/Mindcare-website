"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { WordReveal } from "../primitives/WordReveal";
import { GradientOrb } from "../primitives/GradientOrb";
import { CountUp } from "../primitives/CountUp";
import { Magnetic } from "../primitives/Magnetic";
import { Calendar, Sparkles, ShieldCheck, Clock, Star, UserCheck } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

interface HeroProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export function Hero({ onOpenBooking, onOpenChat }: HeroProps) {
  const { t } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 50]);
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.04]);
  const textY = useTransform(scrollY, [0, 400], [0, -20]);
  const textOpacity = useTransform(scrollY, [0, 350], [1, 0.5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92dvh] w-full pt-28 sm:pt-36 pb-16 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FCFAF6] to-[#F4EFE6] dark:from-[#0A1312] dark:via-[#0E1A18] dark:to-[#132421] overflow-hidden flex flex-col justify-between transition-colors duration-300"
    >
      {/* Background Ambient Drifting Orbs */}
      <GradientOrb color="sage" size={650} top="-10%" right="-5%" />
      <GradientOrb color="cream" size={550} bottom="0%" left="-10%" />

      {/* Cursor Follow Soft Glow (Desktop only) */}
      <div
        className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(127,181,171,0.12)_0%,transparent_70%)] transition-transform duration-300 ease-out hidden md:block"
        style={{
          transform: `translate(${mousePos.x - 225}px, ${mousePos.y - 225}px)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto z-10">
        {/* Left Column Text & CTAs */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#E3F0EC] via-[#D5EADF] to-[#E3F0EC] dark:from-[#172927] dark:via-[#1F3834] dark:to-[#172927] border border-[#A5CEC4]/60 dark:border-[#2A423D] text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4E7F77] dark:bg-[#7FB5AB] animate-pulse" />
            <span>{t.hero.eyebrow}</span>
          </div>

          {/* Headline H1 */}
          <WordReveal
            as="h1"
            text={t.hero.headline}
            highlightWord={t.hero.highlight}
            className="font-serif-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#10201F] dark:text-white font-normal leading-[1.14]"
          />

          {/* Subtitle */}
          <p className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed max-w-xl font-normal">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic sheen strength={6}>
              <button
                onClick={onOpenBooking}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#3D655F] via-[#4E7F77] to-[#365A54] text-white font-semibold text-sm sm:text-base shadow-[0_10px_30px_rgba(61,101,95,0.32)] hover:shadow-[0_14px_38px_rgba(61,101,95,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 group"
              >
                <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span>{t.hero.bookBtn}</span>
              </button>
            </Magnetic>

            <button
              onClick={onOpenChat}
              className="px-7 py-4 rounded-full bg-gradient-to-r from-[#FCFAF6] to-[#E3F0EC] dark:from-[#12201E] dark:to-[#1A2D2A] border-2 border-[#A5CEC4] dark:border-[#2A423D] text-[#2E4B47] dark:text-[#E3F0EC] hover:border-[#4E7F77] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] font-semibold text-sm sm:text-base shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 group"
            >
              <Sparkles className="w-4 h-4 text-[#4E7F77] dark:text-[#7FB5AB] group-hover:rotate-12 transition-transform" />
              <span>{t.hero.chatBtn}</span>
            </button>
          </div>

          {/* Trust Row */}
          <div className="pt-6 border-t border-[#EFE7DA]/80 dark:border-[#243B37] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-[#3D5250] dark:text-[#B3CFC8]">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 dark:bg-[#12201E]/50 border border-[#EFE7DA]/60 dark:border-[#243B37]">
              <div className="p-1.5 rounded-lg bg-[#E3F0EC] dark:bg-[#1C2D2A] text-[#4E7F77] dark:text-[#7FB5AB]">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span>{t.hero.doctorTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 dark:bg-[#12201E]/50 border border-[#EFE7DA]/60 dark:border-[#243B37]">
              <div className="p-1.5 rounded-lg bg-[#E3F0EC] dark:bg-[#1C2D2A] text-[#4E7F77] dark:text-[#7FB5AB]">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span>{t.hero.hoursTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 dark:bg-[#12201E]/50 border border-[#EFE7DA]/60 dark:border-[#243B37]">
              <div className="p-1.5 rounded-lg bg-[#E3F0EC] dark:bg-[#1C2D2A] text-[#4E7F77] dark:text-[#7FB5AB]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>{t.hero.privacyTag}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 dark:bg-[#12201E]/50 border border-[#EFE7DA]/60 dark:border-[#243B37]">
              <div className="p-1.5 rounded-lg bg-[#FFF7E6] dark:bg-[#2A2318] text-[#C8A46B]">
                <Star className="w-3.5 h-3.5 fill-[#C8A46B]" />
              </div>
              <span>
                +<CountUp end={30} /> {t.hero.reviewsTag.replace('+30 ', '')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column Imagery in Arch Frame */}
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="lg:col-span-5 relative flex justify-center lg:justify-end"
        >
          {/* Subtle Sage Glow background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7FB5AB]/30 via-[#E3F0EC]/40 to-[#C8A46B]/20 dark:from-[#4E7F77]/20 dark:to-[#2E4B47]/30 rounded-[120px] filter blur-2xl transform scale-105" />

          {/* Arch Frame Container */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-t-[140px] rounded-b-[36px] overflow-hidden border-2 border-[#EFE7DA] dark:border-[#2A423D] bg-[#F7F2E9] dark:bg-[#142220] shadow-[0_24px_60px_rgba(46,75,71,0.16)] group">
            <img
              src="/hero.svg"
              alt="Cadre apaisant et chaleureux du cabinet MindCare Center"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Floating Glass Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FCFAF6]/95 dark:bg-[#12201E]/95 backdrop-blur-md border border-[#A5CEC4]/50 dark:border-[#2A423D] shadow-xl">
              <p className="font-serif-display italic text-sm text-[#10201F] dark:text-[#F2F8F6] text-center leading-relaxed font-medium">
                {t.hero.floatQuote}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
