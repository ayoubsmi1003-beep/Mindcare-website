"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface WordRevealProps {
  text: string;
  highlightWord?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  staggerDelay?: number;
  immediate?: boolean;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function WordReveal({
  text,
  highlightWord,
  className = "",
  as: Component = "h2",
  staggerDelay = 0.05,
  immediate = false,
}: WordRevealProps) {
  const words = text.split(" ");
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const wordVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: EASE_OUT,
      },
    },
  };

  const isCentered = className.includes("text-center");

  return (
    <Component className={`${className} [text-wrap:balance]`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={immediate ? "visible" : undefined}
        whileInView={immediate ? undefined : "visible"}
        viewport={immediate ? undefined : { once: true, margin: "-10% 0px" }}
        className={`inline-flex flex-wrap ${isCentered ? "justify-center" : ""} gap-x-[0.28em] gap-y-1`}
      >
        {words.map((word, i) => {
          const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()«»“”]/g, "").toLowerCase();
          const cleanHighlight = highlightWord
            ? highlightWord.replace(/[.,/#!$%^&*;:{}=\-_`~()«»“”]/g, "").toLowerCase()
            : "";

          const isHighlighted = Boolean(cleanHighlight && cleanWord === cleanHighlight);

          return (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block transition-all duration-300 ${
                isHighlighted
                  ? "font-serif-display italic text-[#4E7F77] dark:text-[#7FB5AB] font-normal relative"
                  : ""
              }`}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.span>
    </Component>
  );
}
