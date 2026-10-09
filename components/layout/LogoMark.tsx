"use client";

import React from "react";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className = "w-8 h-8 text-[#7FB5AB]", size }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      aria-hidden="true"
    >
      {/* Left Hemisphere Organic Leaf-Brain */}
      <path
        d="M 44 24 C 38 22 28 26 26 34 C 24 40 28 46 28 50 C 26 54 22 58 24 68 C 26 76 34 82 44 80 M 44 24 C 44 32 38 40 34 46 M 44 46 C 36 50 30 60 44 68 M 44 68 C 36 72 32 78 44 80"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 32 32 C 30 26 36 24 40 26 C 40 32 34 34 32 32 Z"
        fill="currentColor"
      />
      <path
        d="M 28 44 C 22 42 24 36 28 36 C 32 38 30 44 28 44 Z"
        fill="currentColor"
      />
      <path
        d="M 34 56 C 28 56 28 50 32 48 C 36 50 36 56 34 56 Z"
        fill="currentColor"
      />
      <path
        d="M 30 66 C 26 64 28 58 32 60 C 34 64 32 68 30 66 Z"
        fill="currentColor"
      />
      <circle cx="42" cy="20" r="2.5" fill="currentColor" />
      <circle cx="22" cy="38" r="2" fill="currentColor" />
      <circle cx="20" cy="56" r="2" fill="currentColor" />
      <circle cx="24" cy="74" r="2.5" fill="currentColor" />

      {/* Right Hemisphere Organic Leaf-Brain (Symmetrical Mirror) */}
      <path
        d="M 56 24 C 62 22 72 26 74 34 C 76 40 72 46 72 50 C 74 54 78 58 76 68 C 74 76 66 82 56 80 M 56 24 C 56 32 62 40 66 46 M 56 46 C 64 50 70 60 56 68 M 56 68 C 64 72 68 78 56 80"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 68 32 C 70 26 64 24 60 26 C 60 32 66 34 68 32 Z"
        fill="currentColor"
      />
      <path
        d="M 72 44 C 78 42 76 36 72 36 C 68 38 70 44 72 44 Z"
        fill="currentColor"
      />
      <path
        d="M 66 56 C 72 56 72 50 68 48 C 64 50 64 56 66 56 Z"
        fill="currentColor"
      />
      <path
        d="M 70 66 C 74 64 72 58 68 60 C 66 64 68 68 70 66 Z"
        fill="currentColor"
      />
      <circle cx="58" cy="20" r="2.5" fill="currentColor" />
      <circle cx="78" cy="38" r="2" fill="currentColor" />
      <circle cx="80" cy="56" r="2" fill="currentColor" />
      <circle cx="76" cy="74" r="2.5" fill="currentColor" />
    </svg>
  );
}
