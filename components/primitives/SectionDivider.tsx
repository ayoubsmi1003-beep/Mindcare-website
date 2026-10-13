"use client";

import React from "react";

interface SectionDividerProps {
  variant?: "fade" | "arc" | "rule" | "gradient";
  fromBg?: string;
  toBg?: string;
  className?: string;
}

export function SectionDivider({
  variant = "gradient",
  fromBg = "#FCFAF6",
  toBg = "#F7F2E9",
  className = ""
}: SectionDividerProps) {
  if (variant === "gradient" || variant === "fade") {
    return (
      <div
        className={`h-20 sm:h-28 w-full pointer-events-none ${className}`}
        style={{
          background: `linear-gradient(180deg, ${fromBg} 0%, ${toBg} 100%)`
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "arc") {
    return (
      <div className={`w-full overflow-hidden leading-none pointer-events-none ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-20 text-[#F7F2E9]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 96C480 20 960 20 1440 96V0H0V96Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  // Default: clean architectural hairline with subtle dot
  return (
    <div className={`relative my-10 sm:my-14 w-full flex items-center justify-center ${className}`} aria-hidden="true">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C7E1DA]/70 dark:via-[#24423E] to-transparent" />
      <div className="absolute w-2 h-2 rounded-full bg-[#4E7F77] dark:bg-[#7FB5AB] ring-4 ring-[#FCFAF6] dark:ring-[#07100F]" />
    </div>
  );
}
