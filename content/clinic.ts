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
    // Ouvert tous les jours de 8h00 à 17h00, sauf le LUNDI (fermé)
    open: "08:00",
    close: "17:00",
    closedDay: 1, // 1 = lundi
    label: "Tous les jours de 8h00 à 17h00 — fermé le lundi",
  },
  consultationDuration: 45, // minutes — À CONFIRMER avec le cabinet
  priceLabel: "Sur demande", // À CONFIRMER
  emergency: {
    // À CONFIRMER les numéros exacts
    samu: "115",
    police: "17",
    note: "En cas de danger immédiat pour vous ou pour autrui, appelez les secours.",
  },
};
