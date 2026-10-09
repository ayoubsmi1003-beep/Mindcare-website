"use client";

import React from "react";

interface GradientOrbProps {
  color?: "sage" | "cream" | "gold";
  size?: number; // width/height in px
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
}

export function GradientOrb({
  color = "sage",
  size = 500,
  top,
  left,
  right,
  bottom,
  className = ""
}: GradientOrbProps) {
  const bgMap = {
    sage: "radial-gradient(circle, rgba(127,181,171,0.22) 0%, rgba(127,181,171,0) 70%)",
    cream: "radial-gradient(circle, rgba(239,231,218,0.45) 0%, rgba(239,231,218,0) 70%)",
    gold: "radial-gradient(circle, rgba(200,164,107,0.18) 0%, rgba(200,164,107,0) 70%)"
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full filter blur-[100px] sm:blur-[130px] opacity-70 animate-orb ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        right,
        bottom,
        background: bgMap[color]
      }}
    />
  );
}
