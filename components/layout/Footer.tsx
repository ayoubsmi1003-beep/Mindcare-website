"use client";

import React from "react";
import { LogoMark } from "./LogoMark";
import { clinic } from "@/content/clinic";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

export function Footer() {
  const { language, t } = useAppContext();

  const motto = language === "ar"
    ? "«العناية بالصحة النفسية بذات الدقة والاهتمام كالجسد.»"
    : language === "en"
    ? "“Caring for the mind with the same precision as the body.”"
    : "« Prendre soin de l'esprit, avec la même rigueur que le corps. »";

  const subline = language === "ar"
    ? "عيادة متخصصة في الطب النفسي والعلاج السلوكي المعرفي بالمعالمة، الجزائر العاصمة."
    : language === "en"
    ? "Specialized psychiatry and cognitive-behavioral therapy practice in Mahelma, Algiers."
    : "Cabinet spécialité en psychiatrie et psychothérapie cognitivo-comportementale à Mahelma, Alger.";

  const navTitle = language === "ar" ? "روابط سريعة" : language === "en" ? "Navigation" : "Navigation";
  const contactTitle = language === "ar" ? "العنوان والتواصل" : language === "en" ? "Contact & Access" : "Contact & Accès";

  const disclaimer = language === "ar"
    ? "هذا الموقع مخصص للإعلام المبدئي والتوجيه، ولا يغني بأي حال عن الاستشارة والمعاينة الطبية المباشرة."
    : language === "en"
    ? "This website is for informational purposes and does not replace a medical consultation with a physician."
    : "Ce site ne fournit aucun diagnostic ni conseil médical. Seule une consultation avec un médecin permet une évaluation.";

  return (
    <footer className="w-full bg-[#10201F] text-[#FCFAF6] pt-16 pb-24 md:pb-16 px-4 sm:px-8 border-t border-[#1D3634]">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1D3634]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <LogoMark className="w-10 h-10 text-[#7FB5AB]" />
              <div>
                <h2 className="font-serif-display text-xl font-medium tracking-wide text-white">
                  MindCare Center
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] text-[#7FB5AB]">
                  {t.nav.doctorSubtitle}
                </p>
              </div>
            </div>

            <p className="font-serif-display italic text-[#C7E1DA] text-base leading-relaxed max-w-sm pt-2">
              {motto}
            </p>

            <p className="text-xs text-[#718684] leading-relaxed max-w-sm">
              {subline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#7FB5AB] font-medium">
              {navTitle}
            </h3>
            <ul className="space-y-2 text-sm text-[#C7E1DA]">
              <li>
                <a href="#familiar" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-white transition-colors">
                  {t.hero.doctorTag}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t.nav.care}
                </a>
              </li>
              <li>
                <a href="#aftercare" className="hover:text-white transition-colors">
                  {t.nav.aftercare}
                </a>
              </li>
              <li>
                <a href="#temoignages" className="hover:text-white transition-colors">
                  {t.nav.reviews}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#7FB5AB] font-medium">
              {contactTitle}
            </h3>
            <div className="space-y-2.5 text-sm text-[#C7E1DA]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7FB5AB] shrink-0 mt-1" />
                <span>{clinic.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7FB5AB] shrink-0" />
                <a href={clinic.phoneHref} className="hover:text-white transition-colors">
                  {clinic.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#7FB5AB] shrink-0" />
                <a href={clinic.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {language === "ar" ? "واتساب مباشر" : "WhatsApp direct"}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-xs text-[#718684]">
                <Clock className="w-4 h-4 text-[#7FB5AB] shrink-0 mt-0.5" />
                <span>
                  {language === "ar"
                    ? "السبت – الخميس (ما عدا الإثنين والجمعة): 8:30 ص – 4:00 م"
                    : language === "en"
                    ? "Sat–Thu (except Mon & Fri): 8:30 AM – 4:00 PM (last slot 3:30 PM)"
                    : clinic.hours.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Medical Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#718684]">
          <p>© {new Date().getFullYear()} MindCare Center. {language === "ar" ? "جميع الحقوق محفوظة." : "Tous droits réservés."}</p>
          <p className="max-w-md text-center md:text-right italic">
            {disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
