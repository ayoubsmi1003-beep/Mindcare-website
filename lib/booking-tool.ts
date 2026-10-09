import { Type } from "@google/genai";
import { generateSlotsForDate } from "./availability";

export const BOOKING_FUNCTION_DECLARATIONS = [
  {
    name: "check_availability",
    description: "Retourne les créneaux libres pour une date au format YYYY-MM-DD.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING, description: "Date au format YYYY-MM-DD (ex: 2026-08-01)" }
      },
      required: ["date"]
    }
  },
  {
    name: "propose_booking",
    description: "Prépare une proposition de rendez-vous pour confirmation par le patient. NE réserve rien directement.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING, description: "Date au format YYYY-MM-DD" },
        time: { type: Type.STRING, description: "Heure au format HH:mm" },
        motif: { type: Type.STRING, description: "Motif principal de la consultation" },
        forWhom: { type: Type.STRING, description: "Pour qui est le RDV" },
        firstTime: { type: Type.BOOLEAN, description: "S'il s'agit d'une première consultation" }
      },
      required: ["date", "time", "motif"]
    }
  }
];

export function checkAvailabilityHandler(dateStr: string) {
  const { slots, isClosed, reason } = generateSlotsForDate(dateStr || new Date().toISOString().split("T")[0]);
  if (isClosed) {
    return { date: dateStr, isClosed: true, message: reason, availableSlots: [] };
  }
  const availableSlots = slots.filter((s) => s.available).map((s) => s.time);
  return {
    date: dateStr,
    isClosed: false,
    availableSlotsCount: availableSlots.length,
    availableSlots
  };
}

export function proposeBookingHandler(args: {
  date: string;
  time: string;
  motif?: string;
  forWhom?: string;
  firstTime?: boolean;
}) {
  return {
    success: true,
    details: {
      date: args.date,
      time: args.time,
      motif: args.motif || "Consultation psychiatrique",
      forWhom: args.forWhom || "moi",
      firstTime: args.firstTime ?? true
    }
  };
}
