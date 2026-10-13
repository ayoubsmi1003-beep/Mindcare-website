"use client";

import React from "react";
import { WordReveal } from "../primitives/WordReveal";
import { Reveal } from "../primitives/Reveal";
import { Marquee } from "../primitives/Marquee";
import { Ear, Clock, HeartHandshake, Users, Eye } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

const ICON_MAP: Record<string, React.ReactNode> = {
  0: <Ear className="w-5 h-5" strokeWidth={1.75} />,
  1: <Clock className="w-5 h-5" strokeWidth={1.75} />,
  2: <HeartHandshake className="w-5 h-5" strokeWidth={1.75} />,
  3: <Users className="w-5 h-5" strokeWidth={1.75} />,
  4: <Eye className="w-5 h-5" strokeWidth={1.75} />,
};

export function WhyUs() {
  const { language, t } = useAppContext();

  const philosophyTag = language === "ar" ? "فلسفتنا" : language === "en" ? "Our Philosophy" : "Notre Philosophie";

  const headline = language === "ar"
    ? "«هنا.. لا نعالج مجرد عرض، بل ننصت ونعتني بك كإنسان.»"
    : language === "en"
    ? "“Here, we don't just treat a symptom. We care for you as a whole person.”"
    : "« Ici, on ne soigne pas un trouble. On prend soin de vous. »";

  const highlightWord = language === "ar" ? "كإنسان.»" : language === "en" ? "person.”" : "vous. »";

  const introText = language === "ar"
    ? "نعلم كم يتردد الكثيرون قبل فتح باب عيادة نفسية خشية النظرة المجتمعية أو الاستعجال. أسسنا مركز مايند كير ليكون مساحة دافئة تُصان فيها كرامتك، ويُحترم فيها صمتك، وتُسمع فيها كلمتك دون خوف."
    : language === "en"
    ? "Far from rushed appointments, we built a serene environment where every word matters, every silence is respected, and you are valued."
    : "Loin des rendez-vous expédiés et des étiquettes posées à la hâte, nous avons construit un espace où chaque parole compte, chaque silence est respecté, et chaque personne est vue avant son diagnostic.";

  const marqueeRows = language === "ar"
    ? [
        [
          "هل سينصت إليّ أحدٌ حقاً دون أن يقاطعني؟",
          "هل من حقي ألا أكون بخير اليوم؟",
          "هل سيصدرون أحكاماً إذا أخبرتهم بكل شيء؟",
        ],
        [
          "هل أنا مجرد حالة أو تشخيص إضافي بالنسبة لهم؟",
          "من سيكون بجانبي إذا احتجت إلى الدعم بين الجلسات؟",
          "هل لديهم وقت كافٍ لاستيعاب قصتي؟",
        ],
        [
          "هل يجب عليّ كتمان لحظات ضعفي وصمتي؟",
          "هل ستُحترم معاناتي ويُؤخذ ألمي بجدية؟",
          "هل يمكنني أن أكون نفسي بصدق دون قناع؟",
        ],
      ]
    : language === "en"
    ? [
        [
          "Will someone truly listen to me without interruption?",
          "Do I have the right to not be okay today?",
          "Will they judge me if I share everything?",
        ],
        [
          "Am I just another diagnosis to them?",
          "Who will be there for me between appointments?",
          "Do they really have time for my story?",
        ],
        [
          "Will my suffering be taken seriously?",
          "Can I be completely myself without a mask?",
          "Is there a safe space where I'm not reduced to my disorder?",
        ],
      ]
    : [
        [
          "Est-ce que quelqu'un va enfin m'écouter sans me couper la parole ?",
          "Ai-je le droit de ne pas aller bien ?",
          "Vont-ils me juger si je leur dis tout ?",
        ],
        [
          "Suis-je juste un diagnostic de plus pour eux ?",
          "Qui sera là si je craque entre deux séances ?",
          "Ont-ils vraiment le temps pour mon histoire ?",
        ],
        [
          "Ma souffrance sera-t-elle prise au sérieux ?",
          "Puis-je être moi-même, sans masque ?",
          "Y a-t-il un endroit où je ne serai pas réduit(e) à mon trouble ?",
        ],
      ];

  const pillarsList = t.whyUs.pillars;

  return (
    <section className="w-full py-28 sm:py-36 bg-gradient-to-b from-[#F2F8F6] via-[#F7F2E9] to-[#EBF4F1] dark:from-[#0C1615] dark:via-[#081110] dark:to-[#0D1817] border-y border-[#EFE7DA] dark:border-[#1E3530] overflow-hidden relative transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-16 relative z-10">
        {/* Header - Centered */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10201F]/[0.04] dark:bg-white/[0.04] border border-[#10201F]/[0.08] dark:border-white/[0.08] text-[11px] font-medium tracking-[0.2em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              {philosophyTag}
            </span>
          </Reveal>

          <WordReveal
            as="h2"
            text={headline}
            highlightWord={highlightWord}
            className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#10201F] dark:text-white font-normal leading-tight text-center"
          />

          <Reveal delay={0.15}>
            <p className="font-sans-body text-base sm:text-lg text-[#3D5250] dark:text-[#B3CFC8] leading-relaxed font-normal max-w-2xl mx-auto">
              {introText}
            </p>
          </Reveal>
        </div>

        {/* 3 Marquee Rows */}
        <div className="space-y-3 py-4">
          <Marquee items={marqueeRows[0]} direction={language === "ar" ? "left" : "right"} speed={42} />
          <Marquee items={marqueeRows[1]} direction={language === "ar" ? "right" : "left"} speed={55} />
          <Marquee items={marqueeRows[2]} direction={language === "ar" ? "left" : "right"} speed={48} />
        </div>

        {/* 5 Pillars Grid */}
        <div className="pt-8 space-y-8">
          {/* Row 1: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillarsList.slice(0, 3).map((pillar, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="group h-full p-7 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#10201F]/5 dark:border-white/5 flex items-center justify-center mb-5 text-[#3D655F] dark:text-[#7FB5AB] group-hover:bg-[#E3F0EC] dark:group-hover:bg-[#1C3330] transition-colors">
                    {ICON_MAP[idx]}
                  </div>

                  <h3 className="font-serif-display text-xl text-[#10201F] dark:text-white font-medium mb-3 group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="font-sans-body text-sm text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Row 2: 2 Cards Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pillarsList.slice(3, 5).map((pillar, idx) => (
              <Reveal key={idx + 3} delay={0.3 + idx * 0.1}>
                <div className="group h-full p-7 rounded-2xl bg-[#FCFAF6] dark:bg-[#0E1A18] border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#10201F]/5 dark:border-white/5 flex items-center justify-center mb-5 text-[#3D655F] dark:text-[#7FB5AB] group-hover:bg-[#E3F0EC] dark:group-hover:bg-[#1C3330] transition-colors">
                    {ICON_MAP[idx + 3]}
                  </div>

                  <h3 className="font-serif-display text-xl text-[#10201F] dark:text-white font-medium mb-3 group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="font-sans-body text-sm text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
