import { clinic } from "@/content/clinic";
import { DayAvailability, Slot } from "./types";
import { civilDate } from './booking-protocol';
function clinicClock(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Algiers',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const value=(kind:string)=>parts.find(part=>part.type===kind)?.value ?? '';
  return {date:`${value('year')}-${value('month')}-${value('day')}`,minutes:Number(value('hour'))*60+Number(value('minute'))};
}

export function generateSlotsForDate(
  dateStr: string,
  language: string = "fr"
): { slots: Slot[]; isClosed: boolean; reason?: string } {
  if(!civilDate.safeParse(dateStr).success)return {slots:[],isClosed:true};
  const [year, month, day] = dateStr.split("-").map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = targetDate.getUTCDay();

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

  const today = clinicClock();
  const isToday = today.date===dateStr;

  while (true) {
    const slotEndTime = new Date(current.getTime() + durationMin * 60000);
    if (slotEndTime > endTime) break;

    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    let isAvailable = true;

    // Check if slot is in the past for today
    if (dateStr<today.date || isToday && current.getHours()*60+current.getMinutes() <= today.minutes + 15) {
      isAvailable = false;
    }

    slots.push({
      time: timeStr,
      available: isAvailable,
    });

    current = slotEndTime;
  }

  return { slots, isClosed: false };
}

export function getUpcomingDays(count: number = 10, language: string = "fr"): DayAvailability[] {
  const result: DayAvailability[] = [];
  const today = new Date(clinicClock().date+'T12:00:00Z');

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
    d.setUTCDate(today.getUTCDate() + i);

    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = d.getUTCDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const { slots, isClosed, reason } = generateSlotsForDate(dateStr, language);

    result.push({
      date: dateStr,
      dayName: dayNames[d.getUTCDay()],
      dayNumber: d.getUTCDate(),
      monthName: monthNames[d.getUTCMonth()],
      isClosed,
      reason,
      slots,
    });
  }

  return result;
}
