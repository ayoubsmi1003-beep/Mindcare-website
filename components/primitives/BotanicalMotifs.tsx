"use client";

import React from "react";

export function OliveSprigSvg({ className = "w-14 h-14 text-[#4E7F77] dark:text-[#7FB5AB]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 66C28 52 44 34 64 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M28 52C21 49 18 41 24 35C30 37 33 45 28 52Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M41 39C35 35 34 26 41 22C46 25 47 34 41 39Z"
        fill="currentColor"
        fillOpacity="0.24"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M36 46C43 49 51 47 54 40C47 38 40 40 36 46Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M50 30C57 31 64 27 65 20C58 19 52 24 50 30Z"
        fill="currentColor"
        fillOpacity="0.28"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="65" cy="13" r="2.2" fill="#C8A46B" />
    </svg>
  );
}

export function CalmWaveSvg({ className = "w-16 h-10 text-[#7FB5AB]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 26C18 14 32 14 44 26C56 38 70 38 82 26C87 21 91 18 95 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 36C24 26 36 26 48 36C60 46 74 44 88 32"
        stroke="#C8A46B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <circle cx="50" cy="10" r="3" fill="#C8A46B" fillOpacity="0.55" />
    </svg>
  );
}

export function BotanicalSealSvg({
  label = "MINDCARE · ÉCOUTE · SOIN · SÉRÉNITÉ · ",
  className = "w-32 h-32",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <circle
        cx="100"
        cy="100"
        r="94"
        className="fill-[#3D655F] dark:fill-[#1A302D] stroke-[#C8A46B]/40"
        strokeWidth="1.5"
      />
      <defs>
        <path
          id="mindcare-seal-path"
          d="M 100, 100 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
        />
      </defs>
      <text
        fill="#FCFAF6"
        fontSize="14.5"
        fontWeight="600"
        letterSpacing="3.4"
        className="uppercase font-sans-body"
      >
        <textPath href="#mindcare-seal-path" startOffset="0%">
          {label}
        </textPath>
      </text>
      {/* Inner Organic Sun / Lotus Core */}
      <circle cx="100" cy="100" r="18" stroke="#E2C08A" strokeWidth="2" />
      <path
        d="M100 66V74M100 126V134M66 100H74M126 100H134M76 76L82 82M118 118L124 124M124 76L118 82M82 118L76 124"
        stroke="#A5CEC4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpecialtyCrestSvg({
  categoryId,
  className = "w-28 h-28",
}: {
  categoryId: string;
  className?: string;
}) {
  const id = categoryId.toLowerCase();

  if (id.includes("anxiet") || id.includes("anxiety")) {
    return (
      <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
        <circle cx="70" cy="70" r="54" stroke="#7FB5AB" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M22 72C36 52 52 52 66 72C80 92 96 92 118 68" stroke="#4E7F77" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M28 88C42 70 58 70 72 86C86 102 102 98 116 82" stroke="#C8A46B" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="70" cy="40" r="7" fill="#7FB5AB" fillOpacity="0.25" stroke="#4E7F77" strokeWidth="1.5" />
      </svg>
    );
  }

  if (id.includes("sommeil") || id.includes("sleep")) {
    return (
      <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
        <circle cx="70" cy="70" r="52" stroke="#C8A46B" strokeOpacity="0.3" strokeWidth="1" />
        <path
          d="M84 36C65 40 52 57 54 77C56 95 72 109 92 107C74 114 51 104 45 84C39 63 51 41 72 35C76 34 80 35 84 36Z"
          fill="#C8A46B"
          fillOpacity="0.22"
          stroke="#C8A46B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="96" cy="48" r="2.5" fill="#7FB5AB" />
        <circle cx="106" cy="64" r="1.8" fill="#7FB5AB" />
        <circle cx="92" cy="80" r="2" fill="#C8A46B" />
      </svg>
    );
  }

  if (id.includes("enfant") || id.includes("child") || id.includes("ado")) {
    return (
      <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
        <path d="M70 112V48" stroke="#4E7F77" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M70 74C52 74 42 60 44 46C58 46 68 58 70 74Z" fill="#7FB5AB" fillOpacity="0.26" stroke="#4E7F77" strokeWidth="1.6" />
        <path d="M70 62C88 62 98 48 96 34C82 34 72 46 70 62Z" fill="#C8A46B" fillOpacity="0.22" stroke="#C8A46B" strokeWidth="1.6" />
        <circle cx="70" cy="34" r="6" fill="#7FB5AB" fillOpacity="0.35" stroke="#4E7F77" strokeWidth="1.5" />
      </svg>
    );
  }

  if (id.includes("therap")) {
    return (
      <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
        <circle cx="56" cy="70" r="28" stroke="#4E7F77" strokeWidth="2" fill="#7FB5AB" fillOpacity="0.12" />
        <circle cx="84" cy="70" r="28" stroke="#C8A46B" strokeWidth="2" fill="#C8A46B" fillOpacity="0.1" />
        <circle cx="70" cy="70" r="5" fill="#3D655F" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 140 140" fill="none" className={className} aria-hidden="true">
      <circle cx="70" cy="70" r="46" stroke="#7FB5AB" strokeOpacity="0.35" strokeWidth="1.4" />
      <circle cx="70" cy="70" r="30" stroke="#C8A46B" strokeOpacity="0.45" strokeWidth="1.4" />
      <path d="M70 30C84 46 84 94 70 110C56 94 56 46 70 30Z" stroke="#4E7F77" strokeWidth="1.8" fill="#7FB5AB" fillOpacity="0.16" />
      <circle cx="70" cy="70" r="6" fill="#C8A46B" />
    </svg>
  );
}

export function HorizonLandscapeSvg({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 520"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sageHorizon1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5CEC4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3D655F" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="sageHorizon2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7FB5AB" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#1D3634" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="sageHorizon3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E4B47" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#10201F" stopOpacity="0.98" />
        </linearGradient>
      </defs>
      {/* Distant sun / calm moon glow */}
      <circle cx="720" cy="190" r="110" fill="#C8A46B" fillOpacity="0.16" />
      <circle cx="720" cy="190" r="64" fill="#EFE7DA" fillOpacity="0.38" />
      {/* Far misty ridge */}
      <path
        d="M0 280C220 210 420 230 680 275C920 315 1180 215 1440 250V520H0V280Z"
        fill="url(#sageHorizon1)"
      />
      {/* Mid serene hills */}
      <path
        d="M0 340C280 285 520 365 820 315C1080 272 1260 325 1440 305V520H0V340Z"
        fill="url(#sageHorizon2)"
      />
      {/* Foreground sanctuary silhouette */}
      <path
        d="M0 405C340 365 620 425 940 385C1160 358 1310 392 1440 380V520H0V405Z"
        fill="url(#sageHorizon3)"
      />
    </svg>
  );
}
