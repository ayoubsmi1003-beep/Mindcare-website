"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface WordRevealProps {
  text: string; // Full string, e.g. "Votre esprit mérite autant de soin que votre corps."
  highlightWord?: string; // Word to render in Fraunces italic sage, e.g. "corps." or "corps"
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  staggerDelay?: number;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function WordReveal({
  text,
  highlightWord,
  className = "",
  as: Component = "h2",
  staggerDelay = 0.05
}: WordRevealProps) {
  const words = text.split(" ");
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const wordVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: EASE_OUT
      }
    }
  };

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
      >
        {words.map((word, i) => {
          const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()«»]/g, "").toLowerCase();
          const cleanHighlight = highlightWord
            ? highlightWord.replace(/[.,/#!$%^&*;:{}=\-_`~()«»]/g, "").toLowerCase()
            : "";

          const isHighlighted = cleanHighlight && cleanWord === cleanHighlight;

          return (
            <motion.span
              key={i}
              variants={wordVariants}
              className={`inline-block ${
                isHighlighted
                  ? "font-serif-display italic text-[#4E7F77] font-normal"
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
