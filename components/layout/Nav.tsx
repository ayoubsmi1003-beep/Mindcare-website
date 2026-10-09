"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { LogoMark } from "./LogoMark";
import { Calendar, Heart, Phone, Sparkles, Sun, Moon, Globe } from "lucide-react";
import { clinic } from "@/content/clinic";
import { Magnetic } from "../primitives/Magnetic";
import { useAppContext } from "@/lib/app-context";
import { Language } from "@/lib/i18n/translations";

interface NavProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export function Nav({ onOpenBooking, onOpenChat }: NavProps) {
  const { language, setLanguage, theme, toggleTheme, t, isRTL } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages: Array<{ code: Language; label: string }> = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ar", label: "العربية" },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7FB5AB] via-[#4E7F77] to-[#C8A46B] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Desktop Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[90] flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none hidden md:flex">
        <motion.div
          animate={{
            width: isScrolled ? "920px" : "100%",
            maxWidth: "1240px",
            borderRadius: isScrolled ? "9999px" : "0px",
            paddingLeft: isScrolled ? "24px" : "16px",
            paddingRight: isScrolled ? "24px" : "16px",
            backgroundColor: isScrolled
              ? theme === "dark"
                ? "rgba(18, 32, 30, 0.88)"
                : "rgba(252, 250, 246, 0.85)"
              : "rgba(252, 250, 246, 0)",
            boxShadow: isScrolled ? "0 10px 30px -10px rgba(46, 75, 71, 0.16)" : "none",
            borderColor: isScrolled
              ? theme === "dark"
                ? "#243B37"
                : "#EFE7DA"
              : "transparent",
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="pointer-events-auto flex items-center justify-between py-3 backdrop-blur-md border transition-colors"
        >
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <LogoMark className="w-9 h-9 text-[#4E7F77] transition-transform duration-500 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-serif-display text-lg tracking-wide font-medium text-[#10201F] dark:text-white">
                {t.nav.brandName}
              </span>
              <span className="text-[10px] tracking-[0.18em] uppercase text-[#4E7F77] dark:text-[#7FB5AB] font-medium -mt-1">
                {t.nav.doctorSubtitle}
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-6 text-xs sm:text-sm font-medium text-[#4A605E] dark:text-[#B3CFC8]"
          >
            <a href="#familiar" className="hover:text-[#10201F] dark:hover:text-white transition-colors">
              {t.nav.about}
            </a>
            <a href="#services" className="hover:text-[#10201F] dark:hover:text-white transition-colors">
              {t.nav.care}
            </a>
            <a href="#aftercare" className="hover:text-[#10201F] dark:hover:text-white transition-colors">
              {t.nav.aftercare}
            </a>
            <a href="#temoignages" className="hover:text-[#10201F] dark:hover:text-white transition-colors">
              {t.nav.reviews}
            </a>
            <a href="#faq" className="hover:text-[#10201F] dark:hover:text-white transition-colors">
              {t.nav.faq}
            </a>
          </nav>

          {/* Action CTAs, Language & Dark Mode Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-2.5 py-1.5 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6] dark:bg-[#172927] text-xs font-semibold text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all flex items-center gap-1.5"
                title="Changer de langue / Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
                <span>{language.toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <div
                  className={`absolute top-full mt-2 ${
                    isRTL ? "left-0" : "right-0"
                  } w-28 bg-[#FCFAF6] dark:bg-[#12201E] border border-[#EFE7DA] dark:border-[#2A423D] rounded-xl shadow-lg p-1 z-50 flex flex-col gap-0.5`}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        language === l.code
                          ? "bg-[#E3F0EC] dark:bg-[#223B37] text-[#2E4B47] dark:text-white font-bold"
                          : "text-[#4A605E] dark:text-[#B3CFC8] hover:bg-[#F2F8F6] dark:hover:bg-[#1A2D2A]"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6] dark:bg-[#172927] text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all"
              title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              aria-label="Basculer le mode sombre"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-[#E2C08A]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#4E7F77]" />
                )}
              </motion.div>
            </button>

            {/* AI Assistant */}
            <button
              onClick={onOpenChat}
              className="px-3.5 py-2 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6] dark:bg-[#172927] text-xs font-medium text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
              <span>{t.nav.ctaChat}</span>
            </button>

            {/* Book RDV Button */}
            <Magnetic sheen strength={4}>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#4E7F77] to-[#3D655F] text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.nav.ctaBook}</span>
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </header>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-[90] px-4 py-3 bg-[#FCFAF6]/90 dark:bg-[#0A1312]/90 backdrop-blur-md border-b border-[#EFE7DA] dark:border-[#2A423D] flex items-center justify-between md:hidden">
        <a href="#" className="flex items-center gap-2">
          <LogoMark className="w-7 h-7 text-[#4E7F77]" />
          <span className="font-serif-display text-sm font-medium text-[#10201F] dark:text-white">
            MindCare
          </span>
        </a>

        <div className="flex items-center gap-1.5">
          {/* Mobile Language Pill */}
          <button
            onClick={() => {
              const next: Record<Language, Language> = { fr: "en", en: "ar", ar: "fr" };
              setLanguage(next[language]);
            }}
            className="px-2 py-1 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[10px] font-bold text-[#3D655F] dark:text-[#A5CEC4]"
          >
            {language.toUpperCase()}
          </button>

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4]"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#E2C08A]" /> : <Moon className="w-3.5 h-3.5 text-[#4E7F77]" />}
          </button>

          {/* Mobile AI Chat */}
          <button
            onClick={onOpenChat}
            className="px-2.5 py-1.5 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-xs font-medium text-[#3D655F] dark:text-[#A5CEC4] flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#4E7F77]" />
            <span>AI</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Anchored Nav Pill */}
      <nav aria-label="Navigation mobile" className="fixed bottom-4 left-4 right-4 z-[90] md:hidden pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-sm bg-[#FCFAF6]/95 dark:bg-[#12201E]/95 backdrop-blur-xl border border-[#EFE7DA] dark:border-[#2A423D] rounded-full p-2 shadow-[0_12px_36px_rgba(0,0,0,0.25)] flex items-center justify-between gap-1">
          <a
            href="#familiar"
            className="flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-medium text-[#4A605E] dark:text-[#B3CFC8] hover:text-[#10201F]"
          >
            <Heart className="w-4 h-4 mb-0.5 text-[#4E7F77]" />
            {t.nav.mobileHome}
          </a>
          <a
            href="#services"
            className="flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-medium text-[#4A605E] dark:text-[#B3CFC8] hover:text-[#10201F]"
          >
            <Sparkles className="w-4 h-4 mb-0.5 text-[#4E7F77]" />
            {t.nav.mobileCare}
          </a>
          <a
            href={clinic.phoneHref}
            className="flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-medium text-[#4A605E] dark:text-[#B3CFC8] hover:text-[#10201F]"
          >
            <Phone className="w-4 h-4 mb-0.5 text-[#4E7F77]" />
            {t.nav.mobileCall}
          </a>
          <button
            onClick={onOpenBooking}
            className="flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#4E7F77] to-[#3D655F] text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.nav.ctaBook}
          </button>
        </div>
      </nav>
    </>
  );
}
