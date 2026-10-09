"use client";

import React, { useState } from "react";
import { AppProvider } from "@/lib/app-context";
import { GrainOverlay } from "@/components/primitives/GrainOverlay";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { Familiar } from "@/components/sections/Familiar";
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
    <div className="min-h-[100dvh] w-full bg-[#FCFAF6] dark:bg-[#0A1312] text-[#10201F] dark:text-[#F2F8F6] font-sans-body relative selection:bg-[#E3F0EC] selection:text-[#10201F] transition-colors duration-300">
      {/* SVG Micro-Noise Grain Overlay */}
      <GrainOverlay opacity={0.035} />

      {/* Dynamic Navigation */}
      <Nav
        onOpenBooking={() => handleOpenBooking()}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10 overflow-x-hidden">
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onOpenChat={() => setIsChatOpen(true)}
        />

        <Reassurance />

        <Familiar />

        <WhyUs />

        <Doctor />

        <Services />

        <Journey />

        <Aftercare />

        <Testimonials />

        <Faq />

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
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
