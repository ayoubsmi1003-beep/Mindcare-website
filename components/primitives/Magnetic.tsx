"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number; // max offset in px, default 6
  sheen?: boolean;
  className?: string;
}

export function Magnetic({
  children,
  strength = 6,
  sheen = false,
  className = ""
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Scale displacement
    const x = (distanceX / (width / 2)) * strength;
    const y = (distanceY / (height / 2)) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 18, stiffness: 220, mass: 0.8 }}
      className={`relative inline-block overflow-hidden ${className}`}
    >
      {children}
      {sheen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
        />
      )}
    </motion.div>
  );
}
