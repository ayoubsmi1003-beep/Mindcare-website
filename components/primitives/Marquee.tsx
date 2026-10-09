"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number; // duration in seconds
  className?: string;
}

export function Marquee({
  items,
  direction = "left",
  speed = 45,
  className = ""
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatedItems = [...items, ...items, ...items, ...items];

  const animateX = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden py-2 group select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <motion.div
        className="flex min-w-full w-max gap-4 sm:gap-6 items-center"
        animate={{ x: animateX }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedItems.map((text, idx) => (
          <div
            key={idx}
            className="whitespace-nowrap rounded-full bg-[#E3F0EC] border border-[#C7E1DA] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#1D3634] shadow-xs transition-colors hover:bg-[#C7E1DA] hover:border-[#A5CEC4]"
          >
            {text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
