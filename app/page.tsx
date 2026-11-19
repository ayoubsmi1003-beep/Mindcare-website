"use client";

import React, { useState } from "react";
import { AppProvider } from "@/lib/app-context";
import { GrainOverlay } from "@/components/primitives/GrainOverlay";
import { SmoothScrollShell } from "@/components/primitives/SmoothScrollShell";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { Familiar } from "@/components/sections/Familiar";
import { ManifestoRibbon } from "@/components/sections/ManifestoRibbon";
import { WhyUs } from "@/components/sections/WhyUs";
import { Doctor } from "@/components/sections/Doctor";
import { Services } from "@/components/sections/Services";
import { Journey } from "@/components/sections/Journey";
import { Aftercare } from "@/components/sections/Aftercare";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Location } from "@/components/sections/Location";
import { BookingSection } from "@/components/sections/Booking";
import { Footer } from "@/components/layout/Footer";

import { BookingFlow } from "@/components/booking/BookingFlow";
import { ChatDrawer } from "@/components/chat/ChatDrawer";

function MainApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMotif, setInitialMotif] = useState("");

  const handleOpenBooking = (motif: string = "") => {
    setInitialMotif(motif);
    setIsBookingOpen(true);
  };

  return (
    <SmoothScrollShell isModalOpen={isBookingOpen || isChatOpen}>
      <div className="min-h-[100dvh] w-full bg-[#FCFAF6] dark:bg-[#07100F] text-[#10201F] dark:text-[#F2F8F6] font-sans-body relative selection:bg-[#E3F0EC] selection:text-[#10201F] transition-colors duration-300">
        {/* SVG Micro-Noise Grain Overlay */}
        <GrainOverlay opacity={0.035} />

        {/* Dynamic Navigation */}
        <Nav
          onOpenBooking={() => handleOpenBooking()}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Main Content Sections (overflow-x-clip preserves position: sticky) */}
        <main id="main-content" className="relative z-10 overflow-x-clip">
          <Hero
            onOpenBooking={() => handleOpenBooking()}
            onOpenChat={() => setIsChatOpen(true)}
          />

          <Reassurance />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10201F]/[0.08] dark:via-white/[0.08] to-transparent" aria-hidden="true" />

          <Familiar />

          <ManifestoRibbon />

          <WhyUs />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10201F]/[0.08] dark:via-white/[0.08] to-transparent" aria-hidden="true" />

          <Doctor />

          <Services />

          <Journey />

          <Aftercare />

          {/* Untouched Testimonials Section */}
          <Testimonials />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10201F]/[0.08] dark:via-white/[0.08] to-transparent" aria-hidden="true" />

          <Faq />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#10201F]/[0.08] dark:via-white/[0.08] to-transparent" aria-hidden="true" />

          <Location />

          <BookingSection
            onOpenBooking={() => handleOpenBooking()}
            onOpenChat={() => setIsChatOpen(true)}
          />
        </main>

        {/* Comprehensive Footer */}
        <Footer />

        {/* Standalone 5-Step Booking Flow */}
        <BookingFlow
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialMotif={initialMotif}
        />

        {/* Multilingual Gemini Chat Drawer */}
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onOpenBooking={() => {
            setIsChatOpen(false);
            handleOpenBooking();
          }}
        />
      </div>
    </SmoothScrollShell>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
