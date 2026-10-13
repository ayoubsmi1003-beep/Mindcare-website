export type ForWhom = "moi" | "mon enfant" | "un proche";

export interface BookingState {
  step: number;
  motif: string;
  forWhom: ForWhom;
  firstTime: boolean;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patientName: string;
  phone: string;
  message?: string;
  consent: boolean;
  reference?: string;
  isSubmitting?: boolean;
}

export interface BookingFormState {
  motif: string;
  forWhom: ForWhom;
  firstTime: boolean;
  selectedDate: string;
  selectedTime: string;
  patientName: string;
  patientPhone: string;
  notes: string;
  consent: boolean;
}

export interface BookingConfirmation {
  referenceId: string;
  patientName: string;
  patientPhone: string;
  motif: string;
  date: string;
  time: string;
}

export interface Slot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  dayName: string;
  dayNumber: number;
  monthName: string;
  isClosed: boolean;
  reason?: string;
  slots: Slot[];
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: string;
  bookingProposal?: {
    date: string;
    time: string;
    motif: string;
    forWhom: ForWhom;
    firstTime: boolean;
    confirmed?: boolean;
    reference?: string;
  };
  isCrisis?: boolean;
}
