"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import { ExternalLink } from "lucide-react";

export interface LocationMapProps {
  location?: string;
  coordinates?: string;
  className?: string;
  mapsUrl?: string;
  expandLabel?: string;
  openMapsLabel?: string;
  defaultExpanded?: boolean;
}

export function LocationMap({
  location = "San Francisco, CA",
  coordinates = "37.7749° N, 122.4194° W",
  className = "",
  mapsUrl,
  expandLabel = "Click to expand",
  openMapsLabel = "Open Google Maps",
  defaultExpanded = false,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8]);
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // If clicking an external link inside, let it navigate
    if ((e.target as HTMLElement).closest("a")) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${location} map - ${isExpanded ? "Expanded" : "Collapsed"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#10201E] border border-neutral-200/80 dark:border-[#243B37] shadow-xl dark:shadow-2xl shadow-emerald-950/5 dark:shadow-black/50 transition-colors"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          width: isExpanded ? 360 : 250,
          height: isExpanded ? 290 : 144,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Subtle gradient background sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-neutral-500/5 pointer-events-none" />

        {/* Animated Map View when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Map Canvas Background */}
              <div className="absolute inset-0 bg-[#F4F1EA] dark:bg-[#0E1A18] transition-colors" />

              {/* Road Grid SVG */}
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Main thoroughfares */}
                <motion.line
                  x1="0%"
                  y1="35%"
                  x2="100%"
                  y2="35%"
                  className="stroke-neutral-300 dark:stroke-[#223B37]"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <motion.line
                  x1="0%"
                  y1="65%"
                  x2="100%"
                  y2="65%"
                  className="stroke-neutral-300 dark:stroke-[#223B37]"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <motion.line
                  x1="30%"
                  y1="0%"
                  x2="30%"
                  y2="100%"
                  className="stroke-neutral-300/80 dark:stroke-[#223B37]/80"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
                <motion.line
                  x1="70%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                  className="stroke-neutral-300/80 dark:stroke-[#223B37]/80"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />

                {/* Secondary horizontal grid lines */}
                {[20, 50, 80].map((y, idx) => (
                  <motion.line
                    key={`h-${idx}`}
                    x1="0%"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    className="stroke-neutral-300/40 dark:stroke-[#2A4540]/40"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                  />
                ))}

                {/* Secondary vertical grid lines */}
                {[15, 45, 55, 85].map((x, idx) => (
                  <motion.line
                    key={`v-${idx}`}
                    x1={`${x}%`}
                    y1="0%"
                    x2={`${x}%`}
                    y2="100%"
                    className="stroke-neutral-300/40 dark:stroke-[#2A4540]/40"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  />
                ))}
              </svg>

              {/* Building Blocks / City Parcels */}
              <motion.div
                className="absolute top-[38%] left-[8%] w-[18%] h-[22%] rounded-sm bg-neutral-300/60 dark:bg-[#1E3330] border border-neutral-400/30 dark:border-[#2C4A45]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
              <motion.div
                className="absolute top-[12%] left-[34%] w-[14%] h-[18%] rounded-sm bg-neutral-300/50 dark:bg-[#1A2E2B] border border-neutral-400/20 dark:border-[#27423D]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              />
              <motion.div
                className="absolute top-[68%] left-[74%] w-[20%] h-[20%] rounded-sm bg-neutral-300/60 dark:bg-[#1E3330] border border-neutral-400/30 dark:border-[#2C4A45]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              />
              <motion.div
                className="absolute top-[18%] right-[8%] w-[12%] h-[26%] rounded-sm bg-neutral-300/50 dark:bg-[#1A2E2B] border border-neutral-400/20 dark:border-[#27423D]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              />
              <motion.div
                className="absolute top-[56%] left-[6%] w-[10%] h-[14%] rounded-sm bg-neutral-300/40 dark:bg-[#172825] border border-neutral-400/20 dark:border-[#253D39]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              />
              <motion.div
                className="absolute top-[8%] left-[74%] w-[16%] h-[12%] rounded-sm bg-neutral-300/50 dark:bg-[#1A2E2B] border border-neutral-400/20 dark:border-[#27423D]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.75 }}
              />

              {/* Central Pulsing Beacon + Pin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                {/* Ping ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-emerald-400/30 dark:bg-emerald-400/20 animate-ping" />

                {/* Pin SVG */}
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative drop-shadow-xl"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(52, 211, 153, 0.6))",
                  }}
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill="#34D399"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    className="fill-white dark:fill-[#10201E]"
                  />
                </svg>
              </motion.div>

              {/* Edge Vignette / Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40 dark:from-[#10201E]/95 dark:via-transparent dark:to-[#10201E]/40 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Grid Pattern when collapsed */}
        <motion.div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
          animate={{ opacity: isExpanded ? 0 : 0.05 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern
                id="expand-map-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  className="stroke-neutral-900 dark:stroke-white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#expand-map-grid)" />
          </svg>
        </motion.div>

        {/* Foreground Content Interface */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          {/* Top Row: Map Icon & Live Badge */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <motion.div
                className="relative"
                animate={{ opacity: isExpanded ? 0.3 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500 dark:text-emerald-400"
                  animate={{
                    filter: isHovered
                      ? "drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))"
                      : "drop-shadow(0 0 4px rgba(52, 211, 153, 0.3))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </motion.svg>
              </motion.div>
            </div>

            {/* Live Indicator Badge */}
            <motion.div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#1A2E2A] border border-neutral-200/60 dark:border-[#2C4842] backdrop-blur-sm"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 tracking-wider uppercase">
                Live
              </span>
            </motion.div>
          </div>

          {/* Bottom Info: Location, Coordinates, Maps Action */}
          <div className="space-y-1.5">
            <motion.h3
              className="text-neutral-900 dark:text-white font-medium text-sm tracking-tight"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 pt-0.5"
                >
                  <p className="text-neutral-500 dark:text-[#A5CEC4] text-xs font-mono tracking-tight">
                    {coordinates}
                  </p>

                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <span>{openMapsLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="h-px bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Tooltip Hint below card */}
      <motion.p
        className="absolute -bottom-6 left-1/2 text-[10px] font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap pointer-events-none"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          y: isHovered && !isExpanded ? 0 : 4,
        }}
        transition={{ duration: 0.2 }}
      >
        {expandLabel}
      </motion.p>
    </motion.div>
  );
}
