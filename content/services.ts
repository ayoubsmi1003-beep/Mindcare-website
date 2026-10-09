export interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  iconName: string;
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "anxiete-humeur",
    title: "Troubles Anxieux & de l'Humeur",
    iconName: "Waves",
    services: [
      {
        id: "anxiete-generalisee",
        title: "Anxiété généralisée",
        description: "Nous savons ce que c'est de vivre avec une inquiétude qui ne s'arrête jamais, même quand tout va bien en apparence. Nous vous aidons à retrouver un esprit enfin apaisé."
      },
      {
        id: "crises-angoisse",
        title: "Crises d'angoisse & attaques de panique",
        description: "Nous comprenons cette peur de perdre le contrôle, ce cœur qui s'emballe sans prévenir. Nous vous aidons à comprendre ce qui se passe en vous — et à reprendre les rênes."
      },
      {
        id: "phobies",
        title: "Phobies",
        description: "Nous ne vous dirons jamais \"il suffit d'essayer\". Nous savons que votre peur est réelle, et nous vous accompagnons à votre rythme, jusqu'à la dépasser."
      },
      {
        id: "anxiete-sociale",
        title: "Anxiété sociale",
        description: "Nous comprenons ce poids d'avoir peur du regard des autres. Ici, il n'y a aucun jugement — seulement une écoute qui vous permet d'être vous-même."
      },
      {
        id: "depression",
        title: "Dépression & troubles de l'humeur",
        description: "Quand plus rien n'a de goût, quand se lever devient un effort immense, nous ne vous jugeons pas — nous vous tendons la main, doucement, jusqu'à ce que vous retrouviez votre lumière."
      },
      {
        id: "bipolaire",
        title: "Trouble bipolaire",
        description: "Nous savons combien il est épuisant de ne jamais savoir quel jour vous allez vivre. Nous vous aidons à retrouver une stabilité durable."
      },
      {
        id: "toc",
        title: "Troubles obsessionnels compulsifs",
        description: "Nous savons que ces pensées qui reviennent sans cesse ne sont pas qui vous êtes. Nous vous aidons à briser ce cercle, étape par étape."
      }
    ]
  },
  {
    id: "stress-sommeil",
    title: "Stress, Sommeil & Épuisement",
    iconName: "Moon",
    services: [
      {
        id: "ptsd",
        title: "Stress post-traumatique & traumatismes psychologiques",
        description: "Ce que vous avez vécu vous a marqué(e), et personne ne devrait avoir à revivre cette douleur seul(e). Nous croyons que ce qui a été blessé peut être traversé — pas seulement supporté en silence."
      },
      {
        id: "sommeil",
        title: "Troubles du sommeil (insomnie, cauchemars, difficultés d'endormissement)",
        description: "Nous savons que les nuits sans sommeil épuisent bien plus que le corps — elles épuisent l'esprit tout entier. Nous vous aidons à retrouver un repos vrai."
      },
      {
        id: "psychosomatique",
        title: "Troubles psychosomatiques",
        description: "Nous prenons au sérieux ce que votre corps essaie de dire, même quand les mots manquent — ces maux, ces tensions que la médecine seule n'explique pas toujours."
      },
      {
        id: "adaptation",
        title: "Troubles de l'adaptation",
        description: "Un grand changement, une perte, un bouleversement soudain peut déstabiliser toute une vie. Nous vous aidons à retrouver vos repères, pas à pas."
      },
      {
        id: "burnout",
        title: "Burn-out & épuisement professionnel",
        description: "Nous voyons ce que le travail vous a pris — votre énergie, votre joie, parfois même le sentiment de savoir qui vous êtes en dehors de votre fonction. Nous vous aidons à vous retrouver, entièrement."
      }
    ]
  },
  {
    id: "enfance-adolescence",
    title: "Enfance & Adolescence",
    iconName: "Baby",
    services: [
      {
        id: "autisme",
        title: "Troubles du spectre autistique",
        description: "Nous voyons votre enfant, pas seulement un diagnostic. Nous vous aidons à comprendre son monde intérieur, pour mieux le rejoindre."
      },
      {
        id: "tdah",
        title: "TDAH (déficit de l'attention avec hyperactivité)",
        description: "Nous savons que votre enfant n'est ni \"mal élevé\" ni \"paresseux\" — il fonctionne simplement différemment. Nous vous aidons à révéler tout son potentiel."
      },
      {
        id: "enuresie",
        title: "Énurésie",
        description: "Nous traitons cela sans jamais faire honte à votre enfant, avec patience et délicatesse, en cherchant la cause profonde plutôt que le symptôme."
      },
      {
        id: "scolaire",
        title: "Difficultés scolaires",
        description: "Derrière chaque échec scolaire, il y a souvent une souffrance invisible. Nous cherchons à la comprendre, jamais à la punir."
      },
      {
        id: "ado-emotionnel",
        title: "Difficultés émotionnelles chez l'adolescent",
        description: "Nous savons que votre adolescent ne vous rejette pas — il cherche simplement qui il est. Nous l'aidons à trouver sa voix, en douceur."
      }
    ]
  },
  {
    id: "relations-famille",
    title: "Relations, Famille & Dépendances",
    iconName: "HeartHandshake",
    services: [
      {
        id: "relations",
        title: "Difficultés relationnelles, familiales & conjugales",
        description: "Nous savons qu'un lien peut se briser en silence, à force de non-dits accumulés. Nous vous aidons à retrouver le chemin l'un vers l'autre."
      },
      {
        id: "addictions",
        title: "Addictions & dépendances comportementales",
        description: "Nous ne jugeons jamais une dépendance, qu'elle soit à une substance, un écran ou un comportement incontrôlable. Nous vous aidons à reprendre le contrôle de votre vie, en toute confidentialité."
      },
      {
        id: "tca",
        title: "Troubles de l'alimentation",
        description: "Nous savons que cela ne concerne jamais vraiment la nourriture. Derrière chaque comportement, il y a une souffrance plus profonde que nous prenons le temps de comprendre."
      }
    ]
  },
  {
    id: "troubles-profonds",
    title: "Troubles Profonds & Suivi Psychiatrique",
    iconName: "Brain",
    services: [
      {
        id: "schizophrenie",
        title: "Schizophrénie & autres troubles psychotiques",
        description: "Nous ne voyons jamais la maladie avant la personne. Quand la réalité devient difficile à saisir, nous restons présents, avec rigueur et sans jamais vous abandonner."
      },
      {
        id: "personnalite",
        title: "Troubles de la personnalité",
        description: "Nous cherchons à comprendre votre façon d'être au monde, sans jamais vous réduire à un trouble ou à un diagnostic."
      },
      {
        id: "adulte-senior",
        title: "Difficultés émotionnelles chez l'adulte & la personne âgée",
        description: "Nous savons que la souffrance émotionnelle ne connaît pas d'âge. Chacun mérite une écoute adaptée à ce qu'il traverse, à chaque étape de la vie."
      }
    ]
  },
  {
    id: "epreuves-vie",
    title: "Accompagnement face aux Épreuves de Vie",
    iconName: "Sunrise",
    services: [
      {
        id: "deuil",
        title: "Deuil",
        description: "Nous savons que le deuil n'a pas de calendrier. Nous vous accompagnons aussi longtemps qu'il le faut."
      },
      {
        id: "maladies-chroniques",
        title: "Maladies chroniques",
        description: "Nous savons qu'une maladie ne touche jamais que le corps. Nous prenons soin de tout ce qu'elle bouleverse en vous."
      },
      {
        id: "separations",
        title: "Séparations & ruptures",
        description: "Nous savons que perdre quelqu'un, même en vie, laisse un vide immense. Nous vous aidons à vous reconstruire, pas à pas."
      },
      {
        id: "evenements-difficiles",
        title: "Événements de vie difficiles",
        description: "Quel que soit le bouleversement que vous traversez, vous n'avez pas à le porter seul(e). Nous sommes là, à chaque étape de votre chemin."
      }
    ]
  }
];

export const servicesClosingNote = {
  title: "Notre équipe & notre approche",
  text: "Notre équipe spécialisée prend en charge chaque tranche d'âge, en adaptant ses méthodes thérapeutiques à ce que chaque personne traverse réellement — consultations psychiatriques et psychologiques, avec une prescription médicamenteuse uniquement lorsque cela est nécessaire."
};
