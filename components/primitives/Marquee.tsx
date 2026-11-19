"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number; // duration in seconds
  variant?: "editorial" | "card";
  className?: string;
}

export function Marquee({
  items,
  direction = "left",
  speed = 45,
  variant = "editorial",
  className = "",
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const duplicatedItems = [...items, ...items, ...items, ...items];

  const animateX = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div
      className={`relative w-full overflow-hidden py-2 group select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <motion.div
        className="flex min-w-full w-max gap-5 sm:gap-8 items-center"
        animate={shouldReduceMotion ? undefined : { x: animateX }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                repeat: Infinity,
                ease: "linear",
                duration: speed,
              }
        }
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedItems.map((text, idx) =>
          variant === "card" ? (
            <div
              key={idx}
              className="whitespace-nowrap rounded-2xl bg-[#FCFAF6]/85 dark:bg-[#0E1A18]/85 backdrop-blur-sm border border-[#EFE7DA] dark:border-[#1E3530] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#1D3634] dark:text-[#E3F0EC] shadow-2xs transition-colors hover:border-[#7FB5AB]"
            >
              {text}
            </div>
          ) : (
            <div
              key={idx}
              className="whitespace-nowrap flex items-center gap-5 sm:gap-8 text-xs sm:text-sm font-medium text-[#2E4B47] dark:text-[#C7E1DA]"
            >
              <span>{text}</span>
              <span aria-hidden="true" className="text-[#C8A46B] text-xs">
                ✦
              </span>
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
