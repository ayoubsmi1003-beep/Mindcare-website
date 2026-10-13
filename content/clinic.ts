export const clinic = {
  name: "MindCare Center",
  doctor: "Dr. Larbi Nassiba",
  specialty: "Médecin spécialiste en psychiatrie et pathologies mentales",
  phone: "0554 81 39 11",
  phoneHref: "tel:+213554813911",
  whatsapp: "https://wa.me/213554813911",
  address: "Mahelma, Alger, Algérie",
  mapsUrl: "https://maps.app.goo.gl/LvW2z4tZyutyySD28",
  hours: {
    // Ouvert de 08h30 à 16h00 (premier créneau 8h30, dernier 15h30, durée 30 min)
    // Fermé le LUNDI (1) et le VENDREDI (5)
    open: "08:30",
    close: "16:00",
    lastSlot: "15:30",
    closedDays: [1, 5], // 1 = Lundi, 5 = Vendredi
    closedDay: 1, // for backward compatibility
    label: "De 8h30 à 16h00 (dernier créneau 15h30) — fermé lundi & vendredi",
    labelAr: "من 8:30 ص إلى 4:00 م (آخر موعد 3:30 م) — مغلق الإثنين والجمعة",
    labelEn: "8:30 AM – 4:00 PM (last slot 3:30 PM) — closed Mon & Fri",
  },
  consultationDuration: 30, // 30 minutes par consultation
  priceLabel: "Sur demande", // À CONFIRMER
  emergency: {
    // À CONFIRMER les numéros exacts
    samu: "115",
    police: "17",
    note: "En cas de danger immédiat pour vous ou pour autrui, appelez les secours.",
  },
};
