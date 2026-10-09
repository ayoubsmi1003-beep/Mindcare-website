import { clinic } from "@/content/clinic";
import { DayAvailability, Slot } from "./types";

// Mock booked slots for realistic partial availability demo
// SWAP: replace with real calendar source seam (e.g., Google Calendar API or Supabase query)
const MOCK_BOOKED_SLOTS: Record<string, string[]> = {
  // Example predefined booked slots for specific relative dates or pattern
};

export function generateSlotsForDate(dateStr: string): { slots: Slot[]; isClosed: boolean; reason?: string } {
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  // Monday is day 1 in JS getDay() (0 is Sunday, 1 is Monday)
  if (targetDate.getDay() === clinic.hours.closedDay) {
    return {
      slots: [],
      isClosed: true,
      reason: "Le cabinet est fermé le lundi."
    };
  }

  const durationMin = clinic.consultationDuration || 45;
  const startHour = 8;
  const startMinute = 0;
  const endHour = 17;

  const slots: Slot[] = [];
  let current = new Date(year, month - 1, day, startHour, startMinute);
  const endTime = new Date(year, month - 1, day, endHour, 0);

  const today = new Date();
  const isToday = today.getFullYear() === year && today.getMonth() === month - 1 && today.getDate() === day;

  // Derive pseudo-random but consistent booked slots for demo realism based on date string hash
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mockBookedIndices = [hash % 7, (hash + 3) % 7, (hash + 5) % 7];

  let index = 0;
  while (true) {
    const slotEndTime = new Date(current.getTime() + durationMin * 60000);
    if (slotEndTime > endTime) break;

    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    let isAvailable = true;

    // Check if slot is in the past for today
    if (isToday && current.getTime() <= today.getTime() + 15 * 60000) {
      isAvailable = false;
    } else if (mockBookedIndices.includes(index)) {
      isAvailable = false;
    }

    slots.push({
      time: timeStr,
      available: isAvailable
    });

    current = slotEndTime;
    index++;
  }

  return { slots, isClosed: false };
}

export function getUpcomingDays(count: number = 7): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date();
  const dayNamesFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNamesFr = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const { slots, isClosed } = generateSlotsForDate(dateStr);

    result.push({
      date: dateStr,
      dayName: dayNamesFr[d.getDay()],
      dayNumber: d.getDate(),
      monthName: monthNamesFr[d.getMonth()],
      isClosed,
      slots
    });
  }

  return result;
}
