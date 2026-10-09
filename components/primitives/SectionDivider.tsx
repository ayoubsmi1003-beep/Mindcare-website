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

  // Default: rule with sage diamond
  return (
    <div className={`relative my-10 sm:my-14 w-full flex items-center justify-center ${className}`} aria-hidden="true">
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C7E1DA] to-transparent" />
      <div className="absolute w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#7FB5AB] to-[#4E7F77] border-2 border-white shadow-md rounded-[2px]" />
    </div>
  );
}
