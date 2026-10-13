import { clinic } from "@/content/clinic";
import { DayAvailability, Slot } from "./types";

export function generateSlotsForDate(
  dateStr: string,
  language: string = "fr"
): { slots: Slot[]; isClosed: boolean; reason?: string } {
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday

  // Doctor does NOT work on Monday (1) and Friday (5)
  // "doctor mtkhdmch b tnin w ljem3a"
  const closedDays = clinic.hours.closedDays || [1, 5];
  if (closedDays.includes(dayOfWeek)) {
    const isMonday = dayOfWeek === 1;
    let reason = "Le cabinet est fermé le lundi et le vendredi.";
    if (language === "ar") {
      reason = isMonday
        ? "العيادة مغلقة يوم الإثنين (عطلة أسبوعية)."
        : "العيادة مغلقة يوم الجمعة (عطلة أسبوعية).";
    } else if (language === "en") {
      reason = isMonday
        ? "The clinic is closed on Mondays."
        : "The clinic is closed on Fridays.";
    } else {
      reason = isMonday
        ? "Le cabinet est fermé le lundi."
        : "Le cabinet est fermé le vendredi.";
    }
    return {
      slots: [],
      isClosed: true,
      reason,
    };
  }

  // Booking starts at 08:30, last slot is at 15:30, 30 min per slot
  // "ebda m 8.30 w last one 15.30 ... w 30 min l kol whda"
  const durationMin = clinic.consultationDuration || 30; // 30 minutes
  const startHour = 8;
  const startMinute = 30;
  // Last slot is 15:30, ending at 16:00
  const endHour = 16;
  const endMinute = 0;

  const slots: Slot[] = [];
  let current = new Date(year, month - 1, day, startHour, startMinute);
  const endTime = new Date(year, month - 1, day, endHour, endMinute);

  const today = new Date();
  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === month - 1 &&
    today.getDate() === day;

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
      available: isAvailable,
    });

    current = slotEndTime;
    index++;
  }

  return { slots, isClosed: false };
}

export function getUpcomingDays(count: number = 10, language: string = "fr"): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date();

  const dayNamesFr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNamesFr = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc."
  ];

  const dayNamesAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const monthNamesAr = [
    "جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان",
    "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNamesEn = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const dayNames = language === "ar" ? dayNamesAr : language === "en" ? dayNamesEn : dayNamesFr;
  const monthNames = language === "ar" ? monthNamesAr : language === "en" ? monthNamesEn : monthNamesFr;

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const { slots, isClosed, reason } = generateSlotsForDate(dateStr, language);

    result.push({
      date: dateStr,
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isClosed,
      reason,
      slots,
    });
  }

  return result;
}
