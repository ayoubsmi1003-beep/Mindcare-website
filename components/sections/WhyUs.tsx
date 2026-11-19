"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { WordReveal } from "../primitives/WordReveal";
import { Reveal } from "../primitives/Reveal";
import { Marquee } from "../primitives/Marquee";
import { Ear, Clock, HeartHandshake, Users, Eye } from "lucide-react";
import { useAppContext } from "@/lib/app-context";

const ICON_MAP: Record<number, React.ReactNode> = {
  0: <Ear className="w-5 h-5" strokeWidth={1.75} />,
  1: <Clock className="w-5 h-5" strokeWidth={1.75} />,
  2: <HeartHandshake className="w-5 h-5" strokeWidth={1.75} />,
  3: <Users className="w-5 h-5" strokeWidth={1.75} />,
  4: <Eye className="w-5 h-5" strokeWidth={1.75} />,
};

export function WhyUs() {
  const { language, t } = useAppContext();
  const shouldReduceMotion = useReducedMotion();

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
            <span className="inline-flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#3D655F] dark:text-[#A5CEC4] uppercase">
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
              <span>{philosophyTag}</span>
              <span className="w-5 h-px bg-[#C8A46B]" aria-hidden="true" />
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

        {/* 3 Marquee Rows (Inner Unspoken Questions) */}
        <div className="space-y-3 py-4">
          <Marquee variant="card" items={marqueeRows[0]} direction={language === "ar" ? "left" : "right"} speed={42} />
          <Marquee variant="card" items={marqueeRows[1]} direction={language === "ar" ? "right" : "left"} speed={55} />
          <Marquee variant="card" items={marqueeRows[2]} direction={language === "ar" ? "left" : "right"} speed={48} />
        </div>

        {/* Asymmetric Bento Grid of 5 Pillars */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-6 gap-6">
          {pillarsList.map((pillar, idx) => {
            const spanClass = idx < 2 ? "md:col-span-3" : "md:col-span-2";
            return (
              <Reveal key={idx} delay={idx * 0.08} className={spanClass}>
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative h-full p-7 sm:p-8 rounded-3xl bg-[#FCFAF6]/90 dark:bg-[#0E1A18]/90 backdrop-blur-md border border-[#EFE7DA] dark:border-[#1E3530] hover:border-[#7FB5AB] shadow-[0_8px_24px_rgba(46,75,71,0.05)] hover:shadow-[0_18px_40px_rgba(46,75,71,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Soft ambient highlight on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(127,181,171,0.16)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#F2F8F6] dark:bg-[#142523] border border-[#10201F]/5 dark:border-white/5 flex items-center justify-center text-[#3D655F] dark:text-[#7FB5AB] group-hover:bg-[#E3F0EC] dark:group-hover:bg-[#1C3330] transition-colors">
                        {ICON_MAP[idx]}
                      </div>
                      <span className="font-serif-display text-sm text-[#C8A46B] tabular-nums">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-serif-display text-xl sm:text-2xl text-[#10201F] dark:text-white font-medium group-hover:text-[#3D655F] dark:group-hover:text-[#7FB5AB] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="font-sans-body text-sm text-[#4A605E] dark:text-[#B3CFC8] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
