"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { LogoMark } from "./LogoMark";
import { Calendar, Phone, Sparkles, Sun, Moon, Globe, Stethoscope } from "lucide-react";
import { clinic } from "@/content/clinic";
import { Magnetic } from "../primitives/Magnetic";
import { DrawUnderline } from "../primitives/DrawUnderline";
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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages: Array<{ code: Language; label: string }> = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ar", label: "العربية" },
  ];

  const navLinks = [
    { href: "#familiar", label: t.nav.about, variant: 0 },
    { href: "#services", label: t.nav.care, variant: 1 },
    { href: "#aftercare", label: t.nav.aftercare, variant: 2 },
    { href: "#temoignages", label: t.nav.reviews, variant: 3 },
    { href: "#faq", label: t.nav.faq, variant: 0 },
  ];

  return (
    <>
      {/* Scroll Progress Hairline */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7FB5AB] via-[#4E7F77] to-[#C8A46B] z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Desktop Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[90] justify-center px-4 pt-4 sm:pt-5 pointer-events-none hidden md:flex">
        <motion.div
          animate={{
            width: isScrolled ? "980px" : "100%",
            maxWidth: "1240px",
            borderRadius: isScrolled ? "9999px" : "0px",
            paddingLeft: isScrolled ? "22px" : "16px",
            paddingRight: isScrolled ? "22px" : "16px",
            backgroundColor: isScrolled
              ? theme === "dark"
                ? "rgba(18, 32, 30, 0.86)"
                : "rgba(252, 250, 246, 0.86)"
              : "rgba(252, 250, 246, 0)",
            boxShadow: isScrolled ? "0 12px 32px -12px rgba(46, 75, 71, 0.16)" : "none",
            borderColor: isScrolled
              ? theme === "dark"
                ? "rgba(127, 181, 171, 0.2)"
                : "rgba(239, 231, 218, 0.9)"
              : "transparent",
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between gap-6 py-2.5 backdrop-blur-xl border transition-colors"
        >
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <LogoMark className="w-8 h-8 text-[#4E7F77] dark:text-[#7FB5AB] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" />
            <div className="flex flex-col">
              <span className="font-serif-display text-lg tracking-tight font-medium text-[#10201F] dark:text-white whitespace-nowrap">
                {t.nav.brandName}
              </span>
              <span className="text-[10px] tracking-[0.16em] uppercase text-[#4E7F77] dark:text-[#7FB5AB] font-medium -mt-0.5 whitespace-nowrap">
                {t.nav.doctorSubtitle}
              </span>
            </div>
          </a>

          {/* Nav Links with Kolibrie-inspired Drawn SVG Underlines */}
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-6 text-xs sm:text-sm font-medium text-[#4A605E] dark:text-[#B3CFC8]"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative py-1 hover:text-[#10201F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <span>{link.label}</span>
                <span className="absolute left-0 right-0 -bottom-1 h-2.5 pointer-events-none">
                  <DrawUnderline
                    variant={link.variant}
                    active={hoveredLink === link.href}
                    strokeWidth={10}
                    className="text-[#4E7F77] dark:text-[#7FB5AB]"
                  />
                </span>
              </a>
            ))}
          </nav>

          {/* Action CTAs, Language & Dark Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-2.5 py-1.5 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6]/90 dark:bg-[#172927]/90 text-xs font-semibold text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
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
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
              className="p-2 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6]/90 dark:bg-[#172927]/90 text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all cursor-pointer shrink-0"
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
              className="px-3.5 py-2 rounded-full border border-[#C7E1DA] dark:border-[#2A423D] bg-[#F2F8F6]/90 dark:bg-[#172927]/90 text-xs font-medium text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC] dark:hover:bg-[#223B37] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4E7F77] dark:text-[#7FB5AB]" />
              <span>{t.nav.ctaChat}</span>
            </button>

            {/* Book RDV Button */}
            <Magnetic sheen strength={4}>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4E7F77] to-[#3D655F] text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.nav.ctaBook}</span>
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </header>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-[90] px-4 py-2.5 bg-[#FCFAF6]/90 dark:bg-[#0A1312]/90 backdrop-blur-xl border-b border-[#EFE7DA] dark:border-[#2A423D] flex items-center justify-between md:hidden">
        <a href="#" className="flex items-center gap-2 shrink-0">
          <LogoMark className="w-7 h-7 text-[#4E7F77] dark:text-[#7FB5AB]" />
          <span className="font-serif-display text-sm font-medium text-[#10201F] dark:text-white whitespace-nowrap">
            MindCare
          </span>
        </a>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              const next: Record<Language, Language> = { fr: "en", en: "ar", ar: "fr" };
              setLanguage(next[language]);
            }}
            className="px-2.5 py-1 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[10px] font-bold text-[#3D655F] dark:text-[#A5CEC4] whitespace-nowrap"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-[#3D655F] dark:text-[#A5CEC4]"
            aria-label="Basculer le thème"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#E2C08A]" /> : <Moon className="w-3.5 h-3.5 text-[#4E7F77]" />}
          </button>

          <button
            onClick={onOpenChat}
            className="px-2.5 py-1 rounded-full bg-[#E3F0EC] dark:bg-[#1A2D2A] border border-[#C7E1DA] dark:border-[#2A423D] text-xs font-medium text-[#3D655F] dark:text-[#A5CEC4] flex items-center gap-1 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 text-[#4E7F77] dark:text-[#7FB5AB]" />
            <span>AI</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Anchored 4-Item Nav Pill */}
      <nav aria-label="Navigation mobile" className="fixed bottom-3 left-3 right-3 z-[90] md:hidden pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-sm bg-[#FCFAF6]/95 dark:bg-[#0E1A18]/95 backdrop-blur-xl border border-[#EFE7DA] dark:border-[#1E3530] rounded-2xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)] grid grid-cols-4 gap-1 items-center">
          <button
            onClick={onOpenChat}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC]/60 dark:hover:bg-[#162825] active:scale-95 transition-all"
            aria-label="Assistant IA"
          >
            <div className="p-1 rounded-lg bg-[#E3F0EC] dark:bg-[#1A2D2A] text-[#3D655F] dark:text-[#A5CEC4] mb-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="truncate max-w-full">
              {language === "ar" ? "المساعد" : "Assistant"}
            </span>
          </button>

          <a
            href={clinic.phoneHref}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC]/60 dark:hover:bg-[#162825] active:scale-95 transition-all"
            aria-label="Appeler la clinique"
          >
            <div className="p-1 rounded-lg bg-[#E3F0EC] dark:bg-[#1A2D2A] text-[#3D655F] dark:text-[#A5CEC4] mb-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <span className="truncate max-w-full">
              {language === "ar" ? "اتصل" : language === "en" ? "Call" : "Appeler"}
            </span>
          </a>

          <button
            onClick={onOpenBooking}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold text-white bg-gradient-to-b from-[#4E7F77] to-[#365A54] shadow-xs active:scale-95 transition-all"
            aria-label="Prendre rendez-vous"
          >
            <div className="p-1 text-white mb-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="truncate max-w-full">
              {language === "ar" ? "موعد" : language === "en" ? "Booking" : "Rendez-vous"}
            </span>
          </button>

          <a
            href="#doctor"
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium text-[#3D655F] dark:text-[#A5CEC4] hover:bg-[#E3F0EC]/60 dark:hover:bg-[#162825] active:scale-95 transition-all"
            aria-label="Dr. Larbi Nassiba"
          >
            <div className="p-1 rounded-lg bg-[#E3F0EC] dark:bg-[#1A2D2A] text-[#3D655F] dark:text-[#A5CEC4] mb-0.5">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="truncate max-w-full">
              {language === "ar" ? "د. العربي ن." : "Dr. Larbi N."}
            </span>
          </a>
        </div>
      </nav>
    </>
  );
}
