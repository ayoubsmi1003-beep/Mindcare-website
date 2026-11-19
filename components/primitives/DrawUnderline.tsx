"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

const STROKE_VARIANTS = [
  "M5 21C26.8 16.2 49.6 11.6 71.8 14.7C85 16.5 97 21.8 110 24.4C116.4 25.7 123 25.5 129 22.6C136 19.3 142.6 15.1 150.1 13.3C156.8 11.7 161.7 14.6 167.9 16.8C181.6 21.7 195 22.6 209.3 21.4C224.7 20.1 239.9 18 255.4 18.3C272 18.6 288.4 18.9 305 18",
  "M5 24.3C26.2 20.3 47.7 17 69.1 13.8C98 9.6 128.4 4 158.1 5.1C172.6 5.7 187.7 8.7 201.6 12C215.4 15 245.5 10.4 305 13",
  "M5 21C65.6 17.5 126.3 13.8 187.2 12.9C226.5 12.3 265.8 13.3 305 14",
  "M5 29.8C52.3 26.9 99.4 21.7 146.5 17.2C185 13.5 245 8.5 305 11.5",
];

interface DrawUnderlineProps {
  variant?: number;
  always?: boolean;
  active?: boolean;
  className?: string;
  strokeWidth?: number;
}

export function DrawUnderline({
  variant = 0,
  always = false,
  active = false,
  className = "text-[#4E7F77] dark:text-[#7FB5AB]",
  strokeWidth = 8,
}: DrawUnderlineProps) {
  const shouldReduceMotion = useReducedMotion();
  const path = STROKE_VARIANTS[variant % STROKE_VARIANTS.length];

  return (
    <svg
      viewBox="0 0 310 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none w-full h-full ${className}`}
    >
      <motion.path
        d={path}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: shouldReduceMotion && always ? 1 : 0, opacity: shouldReduceMotion && always ? 1 : 0 }}
        animate={
          always
            ? { pathLength: 1, opacity: 0.9 }
            : active
            ? { pathLength: 1, opacity: 0.95 }
            : { pathLength: 0, opacity: 0 }
        }
        whileInView={always ? { pathLength: 1, opacity: 0.9 } : undefined}
        viewport={{ once: true }}
        transition={{
          pathLength: { duration: shouldReduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.25 },
        }}
      />
    </svg>
  );
}
