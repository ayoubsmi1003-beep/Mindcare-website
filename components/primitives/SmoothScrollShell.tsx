"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion, useReducedMotion } from "motion/react";

interface SmoothScrollShellProps {
  children: React.ReactNode;
  isModalOpen?: boolean;
}

export function SmoothScrollShell({ children, isModalOpen = false }: SmoothScrollShellProps) {
  const shouldReduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const isIntroFinished = Boolean(shouldReduceMotion) || introDone;

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 1050);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1.0,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -24, duration: 1.25 });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isModalOpen]);

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[100dvh] w-full">
      {/* Soft Sage-Cream Atmospheric Intro Backdrop (removed once scale-out settles) */}
      {!isIntroFinished && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_30%_25%,rgba(127,181,171,0.35),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(200,164,107,0.22),transparent_55%)] bg-[#EFE7DA] dark:bg-[#0B1615] pointer-events-none"
        />
      )}

      {/* Petalyx-inspired viewport scale-out shell; clears transform after completion so sticky positioning works */}
      <motion.div
        initial={{ scale: 0.945, borderRadius: "28px", opacity: 0.92 }}
        animate={{ scale: 1, borderRadius: "0px", opacity: 1 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        style={isIntroFinished ? { transform: "none", borderRadius: 0 } : { transformOrigin: "50% 42vh", overflow: "clip" }}
        className="relative z-10 w-full min-h-[100dvh] bg-[#FCFAF6] dark:bg-[#07100F]"
      >
        {children}
      </motion.div>
    </div>
  );
}
