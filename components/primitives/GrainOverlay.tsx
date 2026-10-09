"use client";

interface GrainOverlayProps {
  opacity?: number;
}

export function GrainOverlay({ opacity = 0.025 }: GrainOverlayProps) {
  return (
    <div
      className="aria-hidden:true pointer-events-none fixed inset-0 z-[999] mix-blend-overlay"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
