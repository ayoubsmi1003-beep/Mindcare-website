export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    id: "fou",
    question: "Est-ce que consulter un psychiatre veut dire que je suis \"fou\" ?",
    answer: "Non. Absolument pas. Consulter un psychiatre, c'est exactement comme consulter un cardiologue pour le cœur. C'est un acte de soin, jamais un aveu de faiblesse. La grande majorité de nos patients mènent une vie tout à fait ordinaire — ils ont simplement décidé de ne plus souffrir en silence."
  },
  {
    id: "medicaments",
    question: "Est-ce que je vais forcément repartir avec des médicaments ?",
    answer: "Non. Une prescription n'est envisagée que lorsqu'elle est réellement nécessaire, et toujours expliquée. Beaucoup de nos accompagnements reposent uniquement sur la thérapie cognitivo-comportementale (TCC)."
  },
  {
    id: "confidentialite",
    question: "Est-ce que ce que je dis restera confidentiel ?",
    answer: "Totalement. Le secret médical est absolu. Ce qui se dit dans ce cabinet ne sort pas de ce cabinet — ni à votre famille, ni à votre employeur, ni à personne."
  },
  {
    id: "duree",
    question: "Combien de temps dure une consultation ?",
    answer: "Le temps qu'il faut. Une première consultation est plus longue, car il s'agit d'abord de comprendre votre histoire. Nous ne travaillons pas à la chaîne."
  },
  {
    id: "silence",
    question: "Et si je n'arrive pas à parler ?",
    answer: "Ce n'est pas grave. Les silences font partie du soin. Personne ne vous forcera à dire ce que vous n'êtes pas prêt(e) à dire. Venir, c'est déjà énorme."
  },
  {
    id: "enfants",
    question: "Prenez-vous en charge les enfants et les adolescents ?",
    answer: "Oui. Notre équipe accompagne tous les âges, avec des méthodes adaptées à chaque tranche d'âge — de l'enfance à la personne âgée."
  },
  {
    id: "proche",
    question: "Je veux prendre rendez-vous pour un proche qui refuse d'y aller.",
    answer: "C'est une situation que nous connaissons bien, et elle est légitime. Contactez-nous : nous vous conseillerons sur la meilleure façon d'aborder cela, avec délicatesse et sans forcer."
  },
  {
    id: "rendez-vous",
    question: "Comment se passe la prise de rendez-vous ?",
    answer: "En ligne sur ce site en moins d'une minute, ou par téléphone au 0554 81 39 11. Vous recevrez une confirmation sur WhatsApp."
  }
];
