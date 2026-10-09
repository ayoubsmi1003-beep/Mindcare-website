export type Language = "fr" | "en" | "ar";

export interface TranslationSchema {
  nav: {
    brandName: string;
    doctorSubtitle: string;
    about: string;
    doctor: string;
    care: string;
    aftercare: string;
    reviews: string;
    faq: string;
    contact: string;
    ctaChat: string;
    ctaBook: string;
    mobileHome: string;
    mobileCare: string;
    mobileCall: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    highlight: string;
    subtitle: string;
    bookBtn: string;
    chatBtn: string;
    doctorTag: string;
    hoursTag: string;
    privacyTag: string;
    reviewsTag: string;
    floatQuote: string;
  };
  reassurance: {
    title: string;
    subtitle: string;
    badges: {
      confidentiality: string;
      activeListening: string;
      gentlePacing: string;
      personalized: string;
    };
  };
  familiar: {
    title: string;
    subtitle: string;
    items: Array<{
      quote: string;
      answer: string;
    }>;
  };
  whyUs: {
    title: string;
    subtitle: string;
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
  doctor: {
    badge: string;
    title: string;
    subtitle: string;
    bio: string;
    qualifications: string[];
    quote: string;
  };
  services: {
    title: string;
    subtitle: string;
    closingTitle: string;
    closingText: string;
    categories: Array<{
      id: string;
      title: string;
      services: Array<{
        id: string;
        title: string;
        description: string;
      }>;
    }>;
  };
  journey: {
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      text: string;
    }>;
  };
  aftercare: {
    title: string;
    subtitle: string;
    privacyNote: string;
    phases: Array<{
      number: string;
      title: string;
      text: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    googleNote: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  location: {
    title: string;
    subtitle: string;
    addressLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    openDays: string;
    closedNote: string;
    mapsBtn: string;
    accessTitle: string;
    accessText: string;
  };
  bookingSection: {
    title: string;
    subtitle: string;
    bookBtn: string;
    chatBtn: string;
  };
  bookingFlow: {
    modalTitle: string;
    step1Title: string;
    optionFirstTime: string;
    optionFollowUp: string;
    step2Title: string;
    optionSelf: string;
    optionChild: string;
    optionRelative: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    confirmBtn: string;
    successTitle: string;
    successSubtitle: string;
    backBtn: string;
    nextBtn: string;
  };
  chatDrawer: {
    title: string;
    subtitle: string;
    placeholder: string;
    sendBtn: string;
    quickTitle: string;
    quick1: string;
    quick2: string;
    quick3: string;
    bookNowBtn: string;
  };
  crisisBanner: {
    title: string;
    desc: string;
    samuBtn: string;
    cabinetBtn: string;
  };
  footer: {
    motto: string;
    desc: string;
    navTitle: string;
    contactTitle: string;
    rights: string;
    disclaimer: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  fr: {
    nav: {
      brandName: "MindCare Center",
      doctorSubtitle: "Dr. Larbi Nassiba",
      about: "À propos",
      doctor: "Dr. Larbi",
      care: "Soins",
      aftercare: "Aftercare",
      reviews: "Avis",
      faq: "FAQ",
      contact: "Accès & Contact",
      ctaChat: "Assistante AI",
      ctaBook: "Prendre RDV",
      mobileHome: "Accueil",
      mobileCare: "Soins",
      mobileCall: "Appeler",
    },
    hero: {
      eyebrow: "Centre de Psychiatrie · Mahelma, Alger",
      headline: "« Votre esprit mérite autant de soin que votre corps. »",
      highlight: "corps. »",
      subtitle: "Quel que soit votre combat, vous n'avez plus à le mener seul(e), car il existe un espace pour respirer, un espace pensé pour vous.",
      bookBtn: "Prendre rendez-vous",
      chatBtn: "Parler à notre assistante",
      doctorTag: "Dr. Larbi Nassiba",
      hoursTag: "6j/7, 8h–17h",
      privacyTag: "Confidentialité",
      reviewsTag: "+30 avis (4.9★)",
      floatQuote: "« Ici, personne ne vous demandera d'être fort(e). »",
    },
    reassurance: {
      title: "Un espace de confiance et de bienveillance",
      subtitle: "Nous avons conçu notre cabinet pour qu'il ne ressemble en rien à une institution froide, mais à un lieu apaisant.",
      badges: {
        confidentiality: "Secret médical absolu",
        activeListening: "Écoute sans jugement",
        gentlePacing: "À votre propre rythme",
        personalized: "Suivi sur-mesure",
      },
    },
    familiar: {
      title: "Ce que vous ressentez aujourd'hui n'est pas une fatalité",
      subtitle: "Beaucoup de nos patients ont ressenti exactement ces mêmes doutes avant de franchir notre porte.",
      items: [
        {
          quote: "« Je suis constamment fatigué(e), même après avoir dormi. »",
          answer: "L'épuisement mental est souvent plus lourd que l'épuisement physique. Nous vous aidons à identifier la source profonde de cette fatigue.",
        },
        {
          quote: "« J'ai l'impression que personne ne comprend ce que je traverse. »",
          answer: "La souffrance psychique isole. En consultation, vous trouverez une écoute médicale sans préjugés ni fausses promesses.",
        },
        {
          quote: "« J'ai peur d'être dépendant(e) aux médicaments. »",
          answer: "Les traitements médicamenteux ne sont prescrits que si nécessaire et toujours expliqués. La psychothérapie reste le cœur de notre démarche.",
        },
        {
          quote: "« Je devrais être capable de gérer cela tout(e) seul(e). »",
          answer: "Consulter un psychiatre est un acte de responsabilité envers soi-même, comme consulter pour tout autre besoin de santé.",
        },
      ],
    },
    whyUs: {
      title: "Pourquoi MindCare Center est différent",
      subtitle: "Notre philosophie repose sur une approche humaine, moderne et attentive.",
      pillars: [
        {
          title: "Nous vous écoutons",
          description: "Chaque personne qui entre ici porte une histoire unique. Ici, personne ne vous demandera d'être fort(e) — juste d'être vous-même.",
        },
        {
          title: "Nous prenons le temps",
          description: "Le temps que mérite votre situation. Un diagnostic et un accompagnement ne se posent jamais à la hâte.",
        },
        {
          title: "Nous ne jugeons jamais",
          description: "Vos doutes, vos craintes et vos silences sont accueillis avec respect et bienveillance professionnelle.",
        },
        {
          title: "Nous restons présents",
          description: "Un suivi ne s'arrête pas à la porte du cabinet. Notre accompagnement veille sur votre continuité.",
        },
        {
          title: "La personne avant le trouble",
          description: "Vous n'êtes pas une étiquette ou un diagnostic. Vous êtes une personne entière que nous accompagnons.",
        },
      ],
    },
    doctor: {
      badge: "Médecin psychiatre",
      title: "Dr. Larbi Nassiba",
      subtitle: "Psychiatre et psychothérapeute cognitivo-comportementale à Mahelma",
      bio: "Diplômée en médecine spécialisée, Dr. Larbi Nassiba associe une rigueur scientifique exemplaire à une profonde empathie humaine. Elle accueille chaque patient avec une attention bienveillante pour construire un parcours de guérison adapté.",
      qualifications: [
        "Spécialiste en psychiatrie et psychopathologie",
        "Spécialisée en Thérapies Cognitivo-Comportementales (TCC)",
        "Prise en charge des enfants, adolescents et adultes",
        "Accompagnement des traumatismes et burn-out",
      ],
      quote: "« Ma mission est d'offrir à chaque personne la clarté, l'écoute et les outils nécessaires pour retrouver un équilibre durable. »",
    },
    services: {
      title: "Nos domaines d'accompagnement",
      subtitle: "Une prise en charge médicale et psychothérapeutique complète et personnalisée.",
      closingTitle: "Notre équipe & notre approche",
      closingText: "Notre équipe spécialisée prend en charge chaque tranche d'âge, en adaptant ses méthodes thérapeutiques à ce que chaque personne traverse réellement — consultations psychiatriques et psychologiques, avec une prescription médicamenteuse uniquement lorsque cela est nécessaire.",
      categories: [
        {
          id: "anxiete-humeur",
          title: "Troubles Anxieux & de l'Humeur",
          services: [
            {
              id: "anxiete-generalisee",
              title: "Anxiété généralisée",
              description: "Nous savons ce que c'est de vivre avec une inquiétude qui ne s'arrête jamais, même quand tout va bien en apparence. Nous vous aidons à retrouver un esprit enfin apaisé.",
            },
            {
              id: "crises-angoisse",
              title: "Crises d'angoisse & attaques de panique",
              description: "Nous comprenons cette peur de perdre le contrôle, ce cœur qui s'emballe sans prévenir. Nous vous aidons à comprendre ce qui se passe en vous — et à reprendre les rênes.",
            },
            {
              id: "phobies",
              title: "Phobies",
              description: "Nous ne vous dirons jamais \"il suffit d'essayer\". Nous savons que votre peur est réelle, et nous vous accompagnons à votre rythme, jusqu'à la dépasser.",
            },
            {
              id: "anxiete-sociale",
              title: "Anxiété sociale",
              description: "Nous comprenons ce poids d'avoir peur du regard des autres. Ici, il n'y a aucun jugement — seulement une écoute qui vous permet d'être vous-même.",
            },
            {
              id: "depression",
              title: "Dépression & troubles de l'humeur",
              description: "Quand plus rien n'a de goût, quand se lever devient un effort immense, nous ne vous jugeons pas — nous vous tendons la main, doucement, jusqu'à ce que vous retrouviez votre lumière.",
            },
            {
              id: "bipolaire",
              title: "Trouble bipolaire",
              description: "Nous savons combien il est épuisant de ne jamais savoir quel jour vous allez vivre. Nous vous aidons à retrouver une stabilité durable.",
            },
            {
              id: "toc",
              title: "Troubles obsessionnels compulsifs",
              description: "Nous savons que ces pensées qui reviennent sans cesse ne sont pas qui vous êtes. Nous vous aidons à briser ce cercle, étape par étape.",
            },
          ],
        },
        {
          id: "stress-sommeil",
          title: "Stress, Sommeil & Épuisement",
          services: [
            {
              id: "ptsd",
              title: "Stress post-traumatique & traumatismes psychologiques",
              description: "Ce que vous avez vécu vous a marqué(e), et personne ne devrait avoir à revivre cette douleur seul(e). Nous croyons que ce qui a été blessé peut être traversé — pas seulement supporté en silence.",
            },
            {
              id: "sommeil",
              title: "Troubles du sommeil (insomnie, cauchemars)",
              description: "Nous savons que les nuits sans sommeil épuisent bien plus que le corps — elles épuisent l'esprit tout entier. Nous vous aidons à retrouver un repos vrai.",
            },
            {
              id: "psychosomatique",
              title: "Troubles psychosomatiques",
              description: "Nous prenons au sérieux ce que votre corps essaie de dire, même quand les mots manquent — ces maux, ces tensions que la médecine seule n'explique pas toujours.",
            },
            {
              id: "adaptation",
              title: "Troubles de l'adaptation",
              description: "Un grand changement, une perte, un bouleversement soudain peut déstabiliser toute une vie. Nous vous aidons à retrouver vos repères, pas à pas.",
            },
            {
              id: "burnout",
              title: "Burn-out & épuisement professionnel",
              description: "Nous voyons ce que le travail vous a pris — votre énergie, votre joie, parfois même le sentiment de savoir qui vous êtes en dehors de votre fonction. Nous vous aidons à vous retrouver, entièrement.",
            },
          ],
        },
        {
          id: "enfance-adolescence",
          title: "Enfance & Adolescence",
          services: [
            {
              id: "autisme",
              title: "Troubles du spectre autistique",
              description: "Nous voyons votre enfant, pas seulement un diagnostic. Nous vous aidons à comprendre son monde intérieur, pour mieux le rejoindre.",
            },
            {
              id: "tdah",
              title: "TDAH (déficit de l'attention)",
              description: "Nous savons que votre enfant n'est ni \"mal élevé\" ni \"paresseux\" — il fonctionne simplement différemment. Nous vous aidons à révéler tout son potentiel.",
            },
            {
              id: "enuresie",
              title: "Énurésie",
              description: "Nous traitons cela sans jamais faire honte à votre enfant, avec patience et délicatesse, en cherchant la cause profonde plutôt que le symptôme.",
            },
            {
              id: "scolaire",
              title: "Difficultés scolaires",
              description: "Derrière chaque échec scolaire, il y a souvent une souffrance invisible. Nous cherchons à la comprendre, jamais à la punir.",
            },
            {
              id: "ado-emotionnel",
              title: "Difficultés émotionnelles chez l'adolescent",
              description: "Nous savons que votre adolescent ne vous rejette pas — il cherche simplement qui il est. Nous l'aidons à trouver sa voix, en douceur.",
            },
          ],
        },
        {
          id: "relations-famille",
          title: "Relations, Famille & Dépendances",
          services: [
            {
              id: "relations",
              title: "Difficultés relationnelles & conjugales",
              description: "Nous savons qu'un lien peut se briser en silence, à force de non-dits accumulés. Nous vous aidons à retrouver le chemin l'un vers l'autre.",
            },
            {
              id: "addictions",
              title: "Addictions & dépendances",
              description: "Nous ne jugeons jamais une dépendance, qu'elle soit à une substance ou un comportement. Nous vous aidons à reprendre le contrôle de votre vie, en toute confidentialité.",
            },
            {
              id: "tca",
              title: "Troubles de l'alimentation",
              description: "Nous savons que cela ne concerne jamais vraiment la nourriture. Derrière chaque comportement, il y a une souffrance plus profonde que nous prenons le temps de comprendre.",
            },
          ],
        },
        {
          id: "troubles-profonds",
          title: "Troubles Profonds & Suivi Psychiatrique",
          services: [
            {
              id: "schizophrenie",
              title: "Schizophrénie & troubles psychotiques",
              description: "Nous ne voyons jamais la maladie avant la personne. Quand la réalité devient difficile à saisir, nous restons présents, avec rigueur et sans jamais vous abandonner.",
            },
            {
              id: "personnalite",
              title: "Troubles de la personnalité",
              description: "Nous cherchons à comprendre votre façon d'être au monde, sans jamais vous réduire à un trouble ou à un diagnostic.",
            },
            {
              id: "adulte-senior",
              title: "Difficultés chez l'adulte & le senior",
              description: "Nous savons que la souffrance émotionnelle ne connaît pas d'âge. Chacun mérite une écoute adaptée à ce qu'il traverse, à chaque étape de la vie.",
            },
          ],
        },
        {
          id: "epreuves-vie",
          title: "Accompagnement face aux Épreuves de Vie",
          services: [
            {
              id: "deuil",
              title: "Deuil",
              description: "Nous savons que le deuil n'a pas de calendrier. Nous vous accompagnons aussi longtemps qu'il le faut.",
            },
            {
              id: "maladies-chroniques",
              title: "Maladies chroniques",
              description: "Nous savons qu'une maladie ne touche jamais que le corps. Nous prenons soin de tout ce qu'elle bouleverse en vous.",
            },
            {
              id: "separations",
              title: "Séparations & ruptures",
              description: "Nous savons que perdre quelqu'un, même en vie, laisse un vide immense. Nous vous aidons à vous reconstruire, pas à pas.",
            },
            {
              id: "evenements-difficiles",
              title: "Événements de vie difficiles",
              description: "Quel que soit le bouleversement que vous traversez, vous n'avez pas à le porter seul(e). Nous sommes là, à chaque étape de votre chemin.",
            },
          ],
        },
      ],
    },
    journey: {
      title: "Votre parcours de soin en 4 étapes",
      subtitle: "Un cheminement clair, rassurant et structuré dès votre premier contact.",
      steps: [
        {
          number: "01",
          title: "Premier contact & réservation",
          text: "Réservez votre créneau en ligne ou contactez-nous par téléphone/WhatsApp. Nous confirmons rapidement votre rendez-vous.",
        },
        {
          number: "02",
          title: "Première consultation approfondie",
          text: "Pendant 45 minutes, Dr. Larbi Nassiba prend le temps d'écouter votre histoire, de comprendre vos symptômes et vos attentes.",
        },
        {
          number: "03",
          title: "Proposition de plan thérapeutique",
          text: "Un accompagnement personnalisé vous est expliqué en toute transparence : suivi psychothérapeutique TCC, conseils ou traitement médical adapté si besoin.",
        },
        {
          number: "04",
          title: "Suivi continu & Aftercare",
          text: "Vous bénéficiez d'un accompagnement suivi et régulier avec l'appui de nos outils de soutien pour consolider vos progrès.",
        },
      ],
    },
    aftercare: {
      title: "Le Programme Aftercare",
      subtitle: "Une présence bienveillante qui continue entre chaque rendez-vous.",
      privacyNote: "Vos données restent confidentielles et protégées.",
      phases: [
        {
          number: "01",
          title: "Toujours là, même à distance",
          text: "Entre deux consultations, la vie continue. Nous avons créé un espace d'interaction et de suivi pour ne jamais vous laisser seul(e) face à vos interrogations.",
        },
        {
          number: "02",
          title: "Un accompagnement au quotidien",
          text: "Un mois entre deux rendez-vous peut sembler long. Notre assistante intelligente disponible 24/7 vous aide à faire le point et garder le cap.",
        },
        {
          number: "03",
          title: "Un lien renforcé avec votre médecin",
          text: "L'outil ne remplace pas le médecin — il enrichit le suivi. Les informations recueillies permettent de mieux ajuster chaque consultation suivante.",
        },
        {
          number: "04",
          title: "Une progression mesurable",
          text: "Observer ses progrès semaine après semaine redonne confiance et sérénité sur votre propre chemin de rétablissement.",
        },
      ],
    },
    testimonials: {
      title: "Ce que disent nos patients",
      subtitle: "Des témoignages authentiques publiés sur notre fiche Google.",
      googleNote: "Note moyenne 4.9/5 basée sur plus de 30 avis Google vérifiés.",
    },
    faq: {
      title: "Questions fréquentes",
      subtitle: "Des réponses transparentes pour apaiser vos doutes.",
      items: [
        {
          id: "fou",
          question: "Est-ce que consulter un psychiatre veut dire que je suis « fou » ?",
          answer: "Non. Absolument pas. Consulter un psychiatre, c'est exactement comme consulter un cardiologue pour le cœur. C'est un acte de soin, jamais un aveu de faiblesse.",
        },
        {
          id: "medicaments",
          question: "Est-ce que je vais forcément repartir avec des médicaments ?",
          answer: "Non. Une prescription n'est envisagée que lorsqu'elle est réellement nécessaire, et toujours expliquée. Beaucoup de nos accompagnements reposent uniquement sur la psychothérapie.",
        },
        {
          id: "confidentialite",
          question: "Est-ce que ce que je dis restera confidentiel ?",
          answer: "Totalement. Le secret médical est absolu. Ce qui se dit dans ce cabinet ne sort jamais d'ici.",
        },
        {
          id: "duree",
          question: "Combien de temps dure une consultation ?",
          answer: "Le temps qu'il faut. Une première consultation dure environ 45 minutes car il s'agit de bien comprendre votre parcours.",
        },
        {
          id: "silence",
          question: "Et si je n'arrive pas à exprimer mes émotions ?",
          answer: "Ce n'est pas grave. Les silences font partie du soin. Personne ne vous forceras. Venir est déjà le premier pas.",
        },
        {
          id: "enfants",
          question: "Prenez-vous en charge les enfants et adolescents ?",
          answer: "Oui. Notre équipe accompagne tous les âges avec des méthodes adaptées de l'enfance à la personne âgée.",
        },
      ],
    },
    location: {
      title: "Cabinet & Accès",
      subtitle: "Un cadre apaisant et facilement accessible à Mahelma, Alger.",
      addressLabel: "Adresse du cabinet",
      phoneLabel: "Téléphone & WhatsApp",
      hoursLabel: "Horaires de consultation",
      openDays: "Tous les jours de 08h00 à 17h00",
      closedNote: "Fermé le LUNDI",
      mapsBtn: "Ouvrir dans Google Maps",
      accessTitle: "Comment vous rendre au cabinet",
      accessText: "Situé à Mahelma (Alger), le cabinet dispose d'un accès facile et d'un stationnement disponible dans la zone.",
    },
    bookingSection: {
      title: "Prêt(e) à faire le premier pas ?",
      subtitle: "Prenez rendez-vous en quelques clics ou évaluez vos besoins avec notre assistante.",
      bookBtn: "Prendre RDV maintenant",
      chatBtn: "Discuter avec l'assistante",
    },
    bookingFlow: {
      modalTitle: "Prise de rendez-vous en ligne",
      step1Title: "Avez-vous déjà consulté au cabinet ?",
      optionFirstTime: "Premier rendez-vous",
      optionFollowUp: "Suivi de consultation",
      step2Title: "Pour qui souhaitez-vous prendre rendez-vous ?",
      optionSelf: "Pour moi-même",
      optionChild: "Pour mon enfant",
      optionRelative: "Pour un proche",
      step3Title: "Quel est le motif principal de votre démarche ?",
      step4Title: "Choisissez un créneau horaire",
      step5Title: "Vos coordonnées de contact",
      nameLabel: "Nom & Prénom",
      namePlaceholder: "Ex: Mohamed Amine",
      phoneLabel: "Numéro de téléphone",
      phonePlaceholder: "Ex: 0554 81 39 11",
      notesLabel: "Remarques complémentaires (Optionnel)",
      notesPlaceholder: "Précisez si nécessaire...",
      confirmBtn: "Confirmer le rendez-vous",
      successTitle: "Rendez-vous confirmé !",
      successSubtitle: "Nous vous avons envoyé une confirmation par SMS/WhatsApp.",
      backBtn: "Retour",
      nextBtn: "Continuer",
    },
    chatDrawer: {
      title: "Assistante AI MindCare",
      subtitle: "Disponible 24/7 pour répondre à vos questions et vous guider.",
      placeholder: "Posez votre question en toute sérénité...",
      sendBtn: "Envoyer",
      quickTitle: "Questions fréquemment posées :",
      quick1: "Comment se déroule la première séance ?",
      quick2: "Quels sont les horaires du cabinet ?",
      quick3: "Est-ce que tout reste confidentiel ?",
      bookNowBtn: "Prendre RDV directement",
    },
    crisisBanner: {
      title: "En cas d'urgence médicale ou psychiatrique",
      desc: "Si vous êtes en danger immédiat, ou si vous avez des pensées de vous faire du mal, n'attendez pas votre rendez-vous. Appelez immédiatement les secours (SAMU 115, Police 17) ou rendez-vous au service d'urgence le plus proche.",
      samuBtn: "SAMU 115",
      cabinetBtn: "Cabinet 0554 81 39 11",
    },
    footer: {
      motto: "« Prendre soin de l'esprit, avec la même rigueur que le corps. »",
      desc: "Cabinet spécialisé en psychiatrie et psychothérapie cognitivo-comportementale à Mahelma, Alger.",
      navTitle: "Navigation",
      contactTitle: "Contact & Accès",
      rights: "Tous droits réservés.",
      disclaimer: "Ce site ne fournit aucun diagnostic ni conseil médical. Seule une consultation avec un médecin permet une évaluation.",
    },
  },

  en: {
    nav: {
      brandName: "MindCare Center",
      doctorSubtitle: "Dr. Larbi Nassiba",
      about: "About Us",
      doctor: "Dr. Larbi",
      care: "Care & Services",
      aftercare: "Aftercare",
      reviews: "Reviews",
      faq: "FAQ",
      contact: "Location",
      ctaChat: "AI Assistant",
      ctaBook: "Book Appointment",
      mobileHome: "Home",
      mobileCare: "Services",
      mobileCall: "Call Us",
    },
    hero: {
      eyebrow: "Psychiatry & Mental Health Center · Mahelma, Algiers",
      headline: "“Your mind deserves as much care as your body.”",
      highlight: "body.”",
      subtitle: "Whatever struggle you are facing, you no longer have to carry it alone. Here is a safe, serene space designed specifically for you.",
      bookBtn: "Book a consultation",
      chatBtn: "Speak with our assistant",
      doctorTag: "Dr. Larbi Nassiba",
      hoursTag: "6 days/wk, 8am–5pm",
      privacyTag: "Strict Privacy",
      reviewsTag: "+30 reviews (4.9★)",
      floatQuote: "“Here, no one will ever ask you to be strong.”",
    },
    reassurance: {
      title: "A haven of trust and compassionate care",
      subtitle: "We designed our clinic to feel like a soothing sanctuary rather than a cold institutional clinic.",
      badges: {
        confidentiality: "Absolute medical secrecy",
        activeListening: "Non-judgmental listening",
        gentlePacing: "Paced at your own rhythm",
        personalized: "Customized treatment plans",
      },
    },
    familiar: {
      title: "What you are feeling today is not a permanent state",
      subtitle: "Many of our patients felt these exact same doubts before stepping through our doors.",
      items: [
        {
          quote: "“I feel constantly exhausted, even after sleeping.”",
          answer: "Emotional burnout often feels heavier than physical fatigue. We help you uncover and address the root causes.",
        },
        {
          quote: "“I feel like nobody truly understands what I'm going through.”",
          answer: "Mental distress can feel isolating. In consultation, you will find empathetic medical listening free of judgment.",
        },
        {
          quote: "“I am afraid of becoming dependent on medication.”",
          answer: "Medication is only prescribed when necessary and thoroughly explained. Psychotherapy remains the core of our approach.",
        },
        {
          quote: "“I should be able to handle this all by myself.”",
          answer: "Seeking psychiatric care is a courageous act of personal health responsibility, just like any other medical need.",
        },
      ],
    },
    whyUs: {
      title: "Why MindCare Center is different",
      subtitle: "Our philosophy is built on an empathetic, modern, and attentive model of psychiatric care.",
      pillars: [
        {
          title: "We truly listen",
          description: "Every person who enters carries a unique journey. No one here expects you to put on a brave face — just be yourself.",
        },
        {
          title: "We take the time needed",
          description: "Your health deserves genuine time. A thorough diagnosis and healing plan are never rushed.",
        },
        {
          title: "Zero judgment",
          description: "Your worries, silences, and deepest doubts are welcomed with professional empathy and respect.",
        },
        {
          title: "Continuous presence",
          description: "Healing extends beyond the office doors. Our care framework keeps you supported every day.",
        },
        {
          title: "Person before diagnosis",
          description: "You are not a label or a condition. You are a complete individual whom we support with dignity.",
        },
      ],
    },
    doctor: {
      badge: "Psychiatrist & Psychotherapist",
      title: "Dr. Larbi Nassiba",
      subtitle: "Specialist Psychiatrist & CBT Psychotherapist in Mahelma",
      bio: "A specialized medical graduate, Dr. Larbi Nassiba combines exemplary scientific standards with genuine human warmth. She welcomes every patient attentively to craft a personalized path toward psychological wellness.",
      qualifications: [
        "Specialist in Psychiatry & Psychopathology",
        "Specialized in Cognitive Behavioral Therapy (CBT)",
        "Care for children, adolescents, adults, and seniors",
        "Trauma, Anxiety & Burnout Therapy",
      ],
      quote: "“My mission is to offer each person the clarity, listening, and therapeutic tools needed to achieve lasting balance.”",
    },
    services: {
      title: "Our Areas of Specialty",
      subtitle: "Comprehensive, personalized psychiatric and psychotherapeutic care.",
      closingTitle: "Our Team & Approach",
      closingText: "Our specialized medical team supports every age group, tailoring therapeutic methods to what each individual genuinely experiences — with medications prescribed strictly when necessary.",
      categories: [
        {
          id: "anxiete-humeur",
          title: "Anxiety & Mood Disorders",
          services: [
            {
              id: "anxiete-generalisee",
              title: "Generalized Anxiety",
              description: "We understand the weight of persistent worry that never turns off. We guide you back to mental peace.",
            },
            {
              id: "crises-angoisse",
              title: "Panic Attacks & Acute Anxiety",
              description: "We know the terrifying sensation of losing control. We help you understand your body's signals and regain mastery.",
            },
            {
              id: "phobies",
              title: "Phobias",
              description: "We respect your fears and accompany you gently at your own pace until you overcome them.",
            },
            {
              id: "anxiete-sociale",
              title: "Social Anxiety",
              description: "We understand the dread of judgment. Here, you find a safe environment to express yourself freely.",
            },
            {
              id: "depression",
              title: "Depression & Mood Conditions",
              description: "When hope feels distant and daily life feels overwhelming, we offer compassionate hands to help you heal.",
            },
            {
              id: "bipolaire",
              title: "Bipolar Disorder",
              description: "Navigating intense mood shifts is exhausting. We help establish stable, lasting balance.",
            },
            {
              id: "toc",
              title: "Obsessive Compulsive Disorder (OCD)",
              description: "Intrusive thoughts do not define who you are. We help break the cycle step by step.",
            },
          ],
        },
        {
          id: "stress-sommeil",
          title: "Stress, Sleep & Burnout",
          services: [
            {
              id: "ptsd",
              title: "PTSD & Trauma Therapy",
              description: "Traumatic experiences leave deep wounds. You do not have to carry them in silence.",
            },
            {
              id: "sommeil",
              title: "Sleep Disorders & Insomnia",
              description: "Sleepless nights drain mind and body. We assist you in restoring natural, restful sleep.",
            },
            {
              id: "psychosomatique",
              title: "Psychosomatic Symptoms",
              description: "We pay close attention to physical tension caused by unexpressed emotional distress.",
            },
            {
              id: "adaptation",
              title: "Adjustment Disorders",
              description: "Sudden life changes or loss can unsettle your foundation. We help you regain your bearings.",
            },
            {
              id: "burnout",
              title: "Burnout & Occupational Stress",
              description: "When work exhausts your energy and joy, we help you reclaim your identity and well-being.",
            },
          ],
        },
        {
          id: "enfance-adolescence",
          title: "Childhood & Adolescence",
          services: [
            {
              id: "autisme",
              title: "Autism Spectrum Support",
              description: "We see your child as a unique individual, helping families connect and understand their world.",
            },
            {
              id: "tdah",
              title: "ADHD Assessment & Care",
              description: "Children with ADHD function differently. We help unlock their full innate potential.",
            },
            {
              id: "enuresie",
              title: "Enuresis",
              description: "Treated with utmost gentleness and zero shame, addressing core emotional factors.",
            },
            {
              id: "scolaire",
              title: "Academic & School Difficulties",
              description: "Uncovering hidden stress behind learning obstacles with empathy rather than pressure.",
            },
            {
              id: "ado-emotionnel",
              title: "Adolescent Emotional Challenges",
              description: "Guiding teenagers through identity, mood, and relational shifts with warmth.",
            },
          ],
        },
        {
          id: "relations-famille",
          title: "Relationships & Addictions",
          services: [
            {
              id: "relations",
              title: "Family & Couples Difficulties",
              description: "Helping restore meaningful communication and rebuild fragile bonds.",
            },
            {
              id: "addictions",
              title: "Addiction & Behavioral Dependency",
              description: "Strictly confidential support without judgment to regain control over your life.",
            },
            {
              id: "tca",
              title: "Eating Disorders",
              description: "Addressing the underlying emotional turmoil behind eating behaviors.",
            },
          ],
        },
        {
          id: "troubles-profonds",
          title: "Complex Psychiatric Care",
          services: [
            {
              id: "schizophrenie",
              title: "Psychotic Disorders & Schizophrenia",
              description: "Rigorous medical expertise paired with enduring human presence and dignity.",
            },
            {
              id: "personnalite",
              title: "Personality Disorders",
              description: "Understanding your experience of the world without reducing you to a diagnosis.",
            },
            {
              id: "adulte-senior",
              title: "Adult & Senior Mental Care",
              description: "Empathy and specialized care tailored for every stage of adult life.",
            },
          ],
        },
        {
          id: "epreuves-vie",
          title: "Life Transitions & Grief",
          services: [
            {
              id: "deuil",
              title: "Grief & Loss Support",
              description: "Grief has no set timeline. We accompany you through loss as long as needed.",
            },
            {
              id: "maladies-chroniques",
              title: "Chronic Illness Coping",
              description: "Supporting emotional health when facing demanding physical conditions.",
            },
            {
              id: "separations",
              title: "Separation & Life Shifts",
              description: "Helping you rebuild confidence and peace step by step.",
            },
            {
              id: "evenements-difficiles",
              title: "Difficult Life Events",
              description: "You do not have to carry life's heaviest burdens alone.",
            },
          ],
        },
      ],
    },
    journey: {
      title: "Your 4-Step Healing Journey",
      subtitle: "A structured, comforting pathway from your first contact.",
      steps: [
        {
          number: "01",
          title: "First Contact & Booking",
          text: "Select a suitable time slot online or contact us via phone/WhatsApp for prompt confirmation.",
        },
        {
          number: "02",
          title: "Initial Comprehensive Session",
          text: "During a 45-minute consultation, Dr. Larbi Nassiba listens attentively to understand your story and needs.",
        },
        {
          number: "03",
          title: "Personalized Treatment Plan",
          text: "A clear, transparent plan is presented — combining psychotherapy, guidance, or medication if required.",
        },
        {
          number: "04",
          title: "Continuous Follow-Up & Aftercare",
          text: "Benefit from structured ongoing care supported by our dedicated follow-up tools.",
        },
      ],
    },
    aftercare: {
      title: "The Aftercare Program",
      subtitle: "A continuous, supportive presence between every appointment.",
      privacyNote: "Your data remains strictly confidential and protected.",
      phases: [
        {
          number: "01",
          title: "Always Present, Even at Distance",
          text: "Life continues between sessions. We provide dedicated support so you never feel alone with your questions.",
        },
        {
          number: "02",
          title: "Daily Guidance, Not Monthly",
          text: "A month between consultations can feel long. Our 24/7 AI assistant helps you track your state and maintain progress.",
        },
        {
          number: "03",
          title: "Direct Bridge to Your Doctor",
          text: "Technology enhances human care. Collected insights allow Dr. Larbi Nassiba to personalize each follow-up session.",
        },
        {
          number: "04",
          title: "Visible Progress",
          text: "Seeing your weekly progress provides tangible hope and reassurance along your recovery journey.",
        },
      ],
    },
    testimonials: {
      title: "What Our Patients Say",
      subtitle: "Authentic reviews published on our Google Business Profile.",
      googleNote: "Average rating 4.9/5 based on over 30 verified Google reviews.",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Clear, transparent answers to address your questions.",
      items: [
        {
          id: "fou",
          question: "Does seeing a psychiatrist mean I am 'crazy'?",
          answer: "Not at all. Seeing a psychiatrist is just like seeing a cardiologist for heart health. It is an act of care, never a weakness. Most of our patients live normal lives but chose not to suffer silently.",
        },
        {
          id: "medicaments",
          question: "Will I automatically be prescribed medication?",
          answer: "No. Medication is only considered when genuinely necessary and always thoroughly explained. Many treatment plans rely solely on psychotherapy.",
        },
        {
          id: "confidentialite",
          question: "Will everything I say remain confidential?",
          answer: "Absolutely. Medical confidentiality is strict and absolute. What is discussed in our office stays strictly private.",
        },
        {
          id: "duree",
          question: "How long does a consultation last?",
          answer: "As long as needed. A first consultation typically lasts around 45 minutes to thoroughly understand your medical background.",
        },
        {
          id: "silence",
          question: "What if I find it difficult to speak or express feelings?",
          answer: "That is completely fine. Silences are part of healing. No one will pressure you. Taking the step to come is already a huge achievement.",
        },
        {
          id: "enfants",
          question: "Do you treat children and teenagers?",
          answer: "Yes. Our team supports patients of all age groups with specialized methods tailored for youth and seniors.",
        },
      ],
    },
    location: {
      title: "Clinic Location & Access",
      subtitle: "A peaceful and easily accessible clinic in Mahelma, Algiers.",
      addressLabel: "Clinic Address",
      phoneLabel: "Phone & WhatsApp",
      hoursLabel: "Consultation Hours",
      openDays: "Every day from 08:00 AM to 05:00 PM",
      closedNote: "Closed on MONDAYS",
      mapsBtn: "Open in Google Maps",
      accessTitle: "Getting to the Clinic",
      accessText: "Located in Mahelma (Algiers), the clinic offers straightforward access and convenient nearby parking.",
    },
    bookingSection: {
      title: "Ready to take the first step?",
      subtitle: "Book your appointment online in a few clicks or assess your needs with our assistant.",
      bookBtn: "Book Appointment Now",
      chatBtn: "Chat with Assistant",
    },
    bookingFlow: {
      modalTitle: "Online Appointment Booking",
      step1Title: "Have you consulted at our clinic before?",
      optionFirstTime: "First-time appointment",
      optionFollowUp: "Follow-up consultation",
      step2Title: "Who is this appointment for?",
      optionSelf: "For myself",
      optionChild: "For my child",
      optionRelative: "For a family member / loved one",
      step3Title: "What is the primary reason for your visit?",
      step4Title: "Select a date and time slot",
      step5Title: "Your contact details",
      nameLabel: "Full Name",
      namePlaceholder: "E.g. Mohamed Amine",
      phoneLabel: "Phone Number",
      phonePlaceholder: "E.g. 0554 81 39 11",
      notesLabel: "Additional Notes (Optional)",
      notesPlaceholder: "Any relevant details...",
      confirmBtn: "Confirm Appointment",
      successTitle: "Appointment Confirmed!",
      successSubtitle: "We have sent confirmation details via SMS/WhatsApp.",
      backBtn: "Back",
      nextBtn: "Continue",
    },
    chatDrawer: {
      title: "MindCare AI Assistant",
      subtitle: "Available 24/7 to answer your questions and guide you.",
      placeholder: "Type your question in total confidence...",
      sendBtn: "Send",
      quickTitle: "Frequently asked questions:",
      quick1: "What happens during the first consultation?",
      quick2: "What are the clinic opening hours?",
      quick3: "Is everything strictly confidential?",
      bookNowBtn: "Book Appointment Directly",
    },
    crisisBanner: {
      title: "Medical or Psychiatric Emergency",
      desc: "If you are in immediate danger or having thoughts of self-harm, please do not wait. Call emergency services immediately (SAMU 115, Police 17) or go to the nearest emergency room.",
      samuBtn: "SAMU 115",
      cabinetBtn: "Clinic 0554 81 39 11",
    },
    footer: {
      motto: "“Caring for the mind with the same precision as the body.”",
      desc: "Clinic specialized in psychiatry and cognitive behavioral psychotherapy in Mahelma, Algiers.",
      navTitle: "Navigation",
      contactTitle: "Contact & Location",
      rights: "All rights reserved.",
      disclaimer: "This website provides general health information and does not replace professional medical evaluation.",
    },
  },

  ar: {
    nav: {
      brandName: "مركز مايند كير",
      doctorSubtitle: "الدكتورة لاربي نصيبة",
      about: "عن العيادة",
      doctor: "د. لاربي",
      care: "خدمات العلاج",
      aftercare: "المتابعة المستمرة",
      reviews: "آراء المرضى",
      faq: "الأسئلة الشائعة",
      contact: "الموقع والتواصل",
      ctaChat: "المساعدة الذكية",
      ctaBook: "حجز موعد",
      mobileHome: "الرئيسية",
      mobileCare: "الخدمات",
      mobileCall: "اتصال",
    },
    hero: {
      eyebrow: "مركز الطب النفسي والصحة العقلية · معالمة، الجزائر",
      headline: "«عقلك يستحق من الرعاية والاهتمام ما يستحقه جسدك.»",
      highlight: "جسدك.»",
      subtitle: "مهما كانت حدة المعاناة التي تمر بها، لست مضطراً لمواجهتها بمفردك.. هنا مساحتك الآمنة للتنفس واستعادة عافيتك.",
      bookBtn: "حجز موعد استشارة",
      chatBtn: "التحدث مع المساعدة الذكية",
      doctorTag: "د. لاربي نصيبة",
      hoursTag: "٦ أيام/الأسبوع، ٨ص–٥م",
      privacyTag: "سرية طبية مطلقة",
      reviewsTag: "+٣٠ تقييم (٤.٩★)",
      floatQuote: "«هنا.. لن نطلب منك أن تكون قوياً، بل أن تكون أنت.»",
    },
    reassurance: {
      title: "مساحة من الثقة والطمأنينة والاحتواء",
      subtitle: "صممنا عيادتنا لتبتعد تماماً عن أجواء العيادات الباردة، ولتكون الملاذ الدافئ والمريح لنفسك.",
      badges: {
        confidentiality: "سرية طبية تامة ومطلقة",
        activeListening: "إنصات دافئ بدون أي أحكام",
        gentlePacing: "العلاج بخطواتك الخاصة",
        personalized: "خطة علاجية مخصصة لك",
      },
    },
    familiar: {
      title: "ما تشعر به اليوم ليس نهاية المطاف",
      subtitle: "كثير من مرضانا مروا بنفس هذه التساؤلات والمخاوف قبل أن يخطوا خطوتهم الأولى نحو عيادتنا.",
      items: [
        {
          quote: "«أشعر بإرهاق مستمر وشديد حتى بعد النوم الطويل.»",
          answer: "الإرهاق النفسي يزن في كثير من الأحيان أكثر من التعب الجسدي. نحن نساعدك على اكتشاف المصدر الحقيقي لهذا الثقل وتجاوزه.",
        },
        {
          quote: "«أشعر أنه لا أحد يستوعب حقيقة ما أقر به داخلي.»",
          answer: "الألم النفسي يعزل صاحبه. في جلساتنا الاستشارية، ستجد إنصاتاً طبياً راقياً خالياً من الأحكام أو الوعود الزائفة.",
        },
        {
          quote: "«أخشى الاعتماد الدائم على الأدوية النفسية.»",
          answer: "الأدوية لا تُوصف إلا عند الضرورة الطبية المؤكدة مع شرح كامل. العلاج النفسي والسلوكي هو ركيزتنا الأساسية.",
        },
        {
          quote: "«كان ينبغي عليّ القدرة على تجاوز الأمر بنفسي.»",
          answer: "طلب الاستشارة النفسية هو دليل وعي وشجاعة ومسؤولية تجاه صحتك، تماماً كأي استشارة طبية لجسدك.",
        },
      ],
    },
    whyUs: {
      title: "لماذا يختلف مركز مايند كير؟",
      subtitle: "فلسفتنا تقوم على نهج إنساني حديث، يضع كرامة المريض وراحته النفسية في المقام الأول.",
      pillars: [
        {
          title: "ننصت إليك بقلب مفتوح",
          description: "كل شخص يلج عيادتنا يحمل قصة فريدة. هنا لن يطلب منك أحد التظاهر بالقوة — فقط كن على طبيعتك.",
        },
        {
          title: "نعطي الوقت حقه الكافي",
          description: "وقتك وقصتك يستحقان الاهتمام. التشخيص الدقيق والخطة العلاجية لا يُصنعان أبداً على عجل.",
        },
        {
          title: "بدون أي أحكام مسبقة",
          description: "مخاوفك، صمتك، ولحظات ضعفك تُستقبل باحترام وتقدير مهني دافئ.",
        },
        {
          title: "حضور دائم ومستمر",
          description: "الرعاية لا تنتهي عند باب العيادة. نظام المتابعة لدينا يرافق خطى تعافيك يومياً.",
        },
        {
          title: "الإنسان قبل التشخيص",
          description: "أنت لست مجرد مسمى لمرض أو حالة. أنت إنسان متكامل نرافقه بكل أمانة واحترام.",
        },
      ],
    },
    doctor: {
      badge: "طبيبة أخصائية في الأمراض النفسية والعقلية",
      title: "الدكتورة لاربي نصيبة",
      subtitle: "أخصائية الطب النفسي والعلاج السلوكي المعرفي بمعالمة",
      bio: "طبيبة أخصائية متميزة، تجمع الدكتورة لاربي نصيبة بين الدقة العلمية الطبية العالية والتعاطف الإنساني العميق. تستقبل كل مريض باهتمام دافئ لبناء مسار تعافي فردي يناسب احتياجاته النفسية.",
      qualifications: [
        "أخصائية الأمراض النفسية والعقلية",
        "متخصصة في العلاج السلوكي المعرفي (CBT)",
        "رعاية الأطفال، المراهقين، البالغين وكبار السن",
        "علاج الصدمات النفسية والاحتراق النفسي",
      ],
      quote: "«رسالتي هي تقديم الإنصات الصادق، والوضوح العلمي، والأدوات النفسية التي تمكّن كل شخص من استعادة توازنه واطمئنانه.»",
    },
    services: {
      title: "مجالات الرعاية والعلاج النفسي",
      subtitle: "رعاية طبية ونفسية شاملة ومخصصة لكل الفئات العمرية.",
      closingTitle: "فريقنا ونهجنا العلاجي",
      closingText: "يتكفل فريقنا المتخصص بجميع الفئات العمرية، مع تكييف المناهج العلاجية وفق ما يمر به المريض واقعياً — استشارات نفسية وطبية، مع وصف الأدوية فقط عند الضرورة القصوى.",
      categories: [
        {
          id: "anxiete-humeur",
          title: "اضطرابات القلق والمزاج",
          services: [
            {
              id: "anxiete-generalisee",
              title: "القلق العام والتوتر المستمر",
              description: "نعلم معنى العيش مع قلق دائم لا يهدأ. نساعدك على استعادة السكينة وهدوء البال.",
            },
            {
              id: "crises-angoisse",
              title: "نوبات الهلع ونوبات الخوف الحاد",
              description: "نفهم الشعور المفاجئ بفقدان السيطرة ووتيرة القلب المتسارعة. نساعدك على فهم الجسد واستعادة زمام المبادرة.",
            },
            {
              id: "phobies",
              title: "المخاوف المرضية (الفوبيا)",
              description: "نحترم خوفك ونرافقك بخطوات متأنية تناسب قدرتك حتى تتجاوز الخوف بنجاح.",
            },
            {
              id: "anxiete-sociale",
              title: "القلق الاجتماعي",
              description: "نفهم ثقل الخوف من نظرات الآخرين. هنا مساحة تقبّل تتيح لك التعبير بحرية.",
            },
            {
              id: "depression",
              title: "الاكتئاب وتقلبات المزاج",
              description: "عندما تفقد الحياة بريقها، نمد لك يد العون بكل رفق حتى تستعيد نورك الداخلي.",
            },
            {
              id: "bipolaire",
              title: "اضطراب ثنائي القطب",
              description: "مساعدة مخصصة لإعادة التوازن والاستقرار النفسي الدائم في مواجهة التقلبات المزاجية.",
            },
            {
              id: "toc",
              title: "الوسواس القهري",
              description: "الأفكار الملحّة لا تمثّل حقيقتك. نساعدك على كسر الدائرة المغلقة خطوة بخطوة.",
            },
          ],
        },
        {
          id: "stress-sommeil",
          title: "الضغوط، النوم والإنهاك النفسي",
          services: [
            {
              id: "ptsd",
              title: "اضطراب صدمة ما بعد الأحداث الصعبة",
              description: "الصدمات النفسية تترك أثراً عميقاً. نؤمن بأن الجراح يمكن علاجها وتجاوزها بأمان.",
            },
            {
              id: "sommeil",
              title: "اضطرابات النوم والأرق",
              description: "الليالي الأرقة تنهك النفس والجسد. نساعدك على استعادة النوم الطبيعي المريح.",
            },
            {
              id: "psychosomatique",
              title: "الأعراض النفسجسمية",
              description: "ننصت بجدية لما يعبّر عنه جسدك من آلام وتوترات مرتبطة بالضغوط النفسية.",
            },
            {
              id: "adaptation",
              title: "صعوبات التكيف مع التغيرات",
              description: "التغيرات المفاجئة قد تزعزع الاستقرار. نساعدك على إعادة بناء القوة والمرونة.",
            },
            {
              id: "burnout",
              title: "الاحتراق النفسي والإرهاق المهني",
              description: "عندما تستهلك ضغوط العمل طاقتك وشغفك، نساعدك على استعادة ذاتك وعافيتك.",
            },
          ],
        },
        {
          id: "enfance-adolescence",
          title: "صحة الأطفال والمراهقين",
          services: [
            {
              id: "autisme",
              title: "اضطرابات طيف التوحد",
              description: "نرى طفلك كإنسان فريد، ونساعد الأسرة على فهم عالمه الداخلي والتواصل معه.",
            },
            {
              id: "tdah",
              title: "فرط الحركة ونقص الانتباه (TDAH)",
              description: "الطفل ليس كسولاً ولا مشاغباً، بل يفكر بطريقة مختلفة. نساعده على إبراز طاقاته.",
            },
            {
              id: "enuresie",
              title: "التبول اللاإرادي",
              description: "علاج بالصبر والرفق التام دون إحراج الطفل، مع معالجة الأسباب النفسية العميقة.",
            },
            {
              id: "scolaire",
              title: "الصعوبات المدرسية والتعلم",
              description: "فهم المعاناة الخفية خلف التعثر الدراسي ودعم الطفل بتشجيع واحتواء.",
            },
            {
              id: "ado-emotionnel",
              title: "التحديات النفسية لدى المراهقين",
              description: "مرافقة المراهق في مرحلة البحث عن الذات وتجاوز تقلبات هذه المرحلة الحساسة.",
            },
          ],
        },
        {
          id: "relations-famille",
          title: "العلاقات والتعافي من الإدمان",
          services: [
            {
              id: "relations",
              title: "الصعوبات الأسرية والزوجية",
              description: "المساعدة في ترميم جسور التواصل وإعادة التفاهم والسكينة بين الأفراد.",
            },
            {
              id: "addictions",
              title: "السلوكيات الإدمانية",
              description: "مساندة سرية وتامة دون أي أحكام لاستعادة السيطرة الكاملة على حياتك.",
            },
            {
              id: "tca",
              title: "اضطرابات السلوك الغذائي",
              description: "معالجة الجذور النفسية العميقة المرتبطة بالسلوكيات الغذائية بحساسية وفهم.",
            },
          ],
        },
        {
          id: "troubles-profonds",
          title: "الاستشارات النفسية المتخصصة",
          services: [
            {
              id: "schizophrenie",
              title: "اضطرابات الذهان والفصام",
              description: "خبرة طبية دقيقة ومرافقة مستمرة تضمن الكرامة والدعم الدائم.",
            },
            {
              id: "personnalite",
              title: "اضطرابات الشخصية",
              description: "فهم النمط النفسي والعمل على تعزيز التكيف والتوازن مع الذات والمحيط.",
            },
            {
              id: "adulte-senior",
              title: "رعاية البالغين وكبار السن",
              description: "إنصات مخصص وعناية متكاملة تناسب كل مرحلة من مراحل العمر.",
            },
          ],
        },
        {
          id: "epreuves-vie",
          title: "مرافقة الأزمات والمراحل الانتقالية",
          services: [
            {
              id: "deuil",
              title: "مرافقة حالات الفقد والحزن",
              description: "الحزن يحتاج إلى وقت ومساحة. نرافقك بكل صبر ورفق خلال هذه المرحلة.",
            },
            {
              id: "maladies-chroniques",
              title: "التكيف مع الأمراض المزمنة",
              description: "دعم الجانب النفسي لتعزيز القوة والقدرة على مواجهة التحديات الصحية.",
            },
            {
              id: "separations",
              title: "الانفصال والتغيرات الكبرى",
              description: "المساعدة في إعادة بناء الثقة والتوازن النفسي بخطوات واثقة.",
            },
            {
              id: "evenements-difficiles",
              title: "ظروف الحياة الصعبة",
              description: "مهما كانت صعوبة ما تمر به، فلست وحدك في هذا الطريق.",
            },
          ],
        },
      ],
    },
    journey: {
      title: "رحلتك العلاجية في ٤ خطوات",
      subtitle: "مسار واضح ومطمئن ومصمم بعناية منذ اتصالك الأول.",
      steps: [
        {
          number: "٠١",
          title: "التواصل الأولي وحجز الموعد",
          text: "اختر الوقت المناسب لك عبر الموقع أو عبر الهاتف/واتساب ليصلك التأكيد فوراً.",
        },
        {
          number: "٠٢",
          title: "الجلسة الاستشارية الأولى الشاملة",
          text: "في استشارة مدتها ٤٥ دقيقة، تنصت الدكتورة لاربي نصيبة باهتمام كامل لفهم تاريخك واحتياجاتك.",
        },
        {
          number: "٠٣",
          title: "تحديد الخطة العلاجية المناسبة",
          text: "عرض خيارات العلاج بوضوح وشفافية : جلسات علاج سلوكي معرفي، توجيه نفسي، أو علاج دوائي عند الحاجة.",
        },
        {
          number: "٠٤",
          title: "المتابعة المستمرة والدائمة",
          text: "الاستفادة من برنامج المتابعة المستمرة لترسيخ التحسن والاطمئنان اليومي على حالتك.",
        },
      ],
    },
    aftercare: {
      title: "برنامج المتابعة المستمرة (Aftercare)",
      subtitle: "مرافقة دافئة ودائمة تظل بجانبك بين كل جلسة وأخرى.",
      privacyNote: "بياناتك محميّة وتخضع لأعلى معايير السرية الطبية.",
      phases: [
        {
          number: "٠١",
          title: "معك دائماً رغم المسافات",
          text: "الحياة تستمر بين الجلسات. وفرنا مساحة تواصل ومتابعة لضمان عدم شعورك بالوحدة أمام أي تساؤل.",
        },
        {
          number: "٠٢",
          title: "دعم يومي متواصل",
          text: "الشهر بين الجلسات قد يبدو طويلاً. مساعدتنا الذكية المتاحة ٢٤/٧ تساعدك على متابعة حالتك والحفاظ على تقدمك.",
        },
        {
          number: "٠٣",
          title: "جسر مباشر مع طبيبتك",
          text: "التقنية تعزز الرعاية الطبية. البيانات المجمعة تمكّن الدكتورة من ضبط وتوجيه الجلسات اللاحقة بدقة أعمق.",
        },
        {
          number: "٠٤",
          title: "تقدم ملموس يمكنك رؤيته",
          text: "متابعة تطورك أسبوعاً بعد أسبوع يمنحك الأمل والثقة في مسار تعافيك النفسي.",
        },
      ],
    },
    testimonials: {
      title: "آراء وانطباعات مرضانا",
      subtitle: "شهادات حقيقية استمدت من تقييمات مرضانا على جوجل.",
      googleNote: "متوسط التقييم ٤.٩ / ٥ بناءً على أكثر من ٣٠ تقييماً معتمداً على جوجل.",
    },
    faq: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات شفافة ومطمئنة لإزالة كل تساؤلاتك.",
      items: [
        {
          id: "fou",
          question: "هل زيارة الطبيب النفسي تعني أنني شخص «مجنون»؟",
          answer: "بالطبع لا، مطلقاً. زيارة الطبيب النفسي تماماً كزيارة طبيب القلب؛ هي خطوة واعية للرعاية بالذات وليست دليلاً على ضعف. أغلب مرضانا يمارسون حياتهم اليومية بشكل طبيعي، لكنهم قرروا ألا يعانوا في صمت.",
        },
        {
          id: "medicaments",
          question: "هل من الضروري أن أخرج بوصفة أدوية من الجلسة الأولى؟",
          answer: "لا. الدواء لا يُوصف إلا عند الضرورة الطبية الفعالية، ويتم شرحه دائماً. الكثير من حالاتنا تعتمد بالكامل على الجلسات النفسية والسلوكية.",
        },
        {
          id: "confidentialite",
          question: "هل ستظل جميع معلوماتي سرية تماماً؟",
          answer: "نعم وبشكل مطلق. السر الطبي أمانة مقدسة. كل ما يُدار في العيادة لا يخرج منها أبداً لأي طرف كان.",
        },
        {
          id: "duree",
          question: "كم تستغرق الجلسة الاستشارية؟",
          answer: "تستغرق الاستشارة الأولى حوالي ٤٥ دقيقة لإعطاء الوقت الكافي لفهم حالتك والاستماع إليك بتأنٍ.",
        },
        {
          id: "silence",
          question: "ماذا لو لم أستطع التعبير عن مشاعري بسهولة؟",
          answer: "هذا أمر طبيعي جداً. اللحظات الصامتة جزء من العلاج. لن يضغط عليك أحد، وحضورك للعيادة هو بنفسه خطوة شجاعة.",
        },
        {
          id: "enfants",
          question: "هل تستقبلون الأطفال والمراهقين؟",
          answer: "نعم. يتكفل فريقنا بكافة الفئات العمرية عبر أساليب علاجية مخصصة تناسب الأطفال، المراهقين، والبالغين.",
        },
      ],
    },
    location: {
      title: "موقع العيادة وسبل الوصول",
      subtitle: "بيئة هادئة وسهلة الوصول في قلب معالمة، الجزائر العاصمة.",
      addressLabel: "عنوان العيادة",
      phoneLabel: "الهاتف والواتساب",
      hoursLabel: "أوقات الاستقبال",
      openDays: "مفتوح يومياً من الساعة ٠٨:٠٠ صباحاً حتى ٠٥:٠٠ مساءً",
      closedNote: "مغلق يوم الاثنين",
      mapsBtn: "فتح في خرائط جوجل",
      accessTitle: "طريقة الوصول إلى العيادة",
      accessText: "تقع العيادة في معالمة (الجزائر العاصمة)، وتتميز بمسار سهل وأماكن متوفرة لركن السيارات.",
    },
    bookingSection: {
      title: "هل أنت مستعد لأول خطوة نحو التعافي؟",
      subtitle: "احجز موعدك في لحظات أو تحدث مع مساعدتنا الذكية لتحديد احتياجاتك.",
      bookBtn: "حجز موعد الآن",
      chatBtn: "التحدث مع المساعدة الذكية",
    },
    bookingFlow: {
      modalTitle: "حجز موعد عبر الإنترنت",
      step1Title: "هل سبق لك زيارة العيادة من قبل؟",
      optionFirstTime: "موعد للمرة الأولى",
      optionFollowUp: "متابعة استشارة سابقة",
      step2Title: "لمن ترغب في حجز الموعد؟",
      optionSelf: "لنفسي",
      optionChild: "لطفلي",
      optionRelative: "لأحد القريبين / العائلة",
      step3Title: "ما هو السبب الرئيسي للزيارة؟",
      step4Title: "اختر التاريخ والوقت المناسب",
      step5Title: "معلومات الاتصال الخاصة بك",
      nameLabel: "الاسم واللقب",
      namePlaceholder: "مثال: محمد أمين",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "مثال: 0554 81 39 11",
      notesLabel: "ملاحظات إضافية (اختياري)",
      notesPlaceholder: "أي تفاصيل تود توضيحها...",
      confirmBtn: "تأكيد حجز الموعد",
      successTitle: "تم تأكيد موعدك بنجاح!",
      successSubtitle: "تم إرسال تفاصيل التأكيد عبر الرسائل النصية / واتساب.",
      backBtn: "رجوع",
      nextBtn: "متابعة",
    },
    chatDrawer: {
      title: "المساعدة الذكية لمركز مايند كير",
      subtitle: "متوفرة على مدار الساعة للإجابة على تساؤلاتك وإرشادك بكل لطف وسرية.",
      placeholder: "اكتب سؤالك بكل راحة وسرية...",
      sendBtn: "إرسال",
      quickTitle: "أسئلة يتكرر طرحها :",
      quick1: "كيف تجري الجلسة الأولى؟",
      quick2: "ما هي أوقات عمل العيادة؟",
      quick3: "هل المعلومات تكون سرية تماماً؟",
      bookNowBtn: "حجز موعد مباشر",
    },
    crisisBanner: {
      title: "في حالات الطوارئ الطبية أو النفسية الحادة",
      desc: "إذا كنت تشعر بظروف طارئة أو أفكار ملحة تؤذيك، لا تنتظر الموعد. اتصل فوراً بالطوارئ (الحماية المدنية 115، الشرطة 17) أو توجه إلى أقرب مصلحة استعجالات طبية. حياتك غالية ولست وحدك.",
      samuBtn: "الإسعاف 115",
      cabinetBtn: "العيادة 0554 81 39 11",
    },
    footer: {
      motto: "«الرعاية بالنفس والروح، بنفس الدقة والأمانة التي يرعى بها الجسد.»",
      desc: "عيادة متخصصة في الطب النفسي والعلاج السلوكي المعرفي في معالمة، الجزائر العاصمة.",
      navTitle: "روابط سريعة",
      contactTitle: "التواصل والموقع",
      rights: "جميع الحقوق محفوظة.",
      disclaimer: "هذا الموقع يقدم معلومات توعوية ولا يغني عن الاستشارة الطبية المباشرة مع الطبيب الأخصائي.",
    },
  },
};
