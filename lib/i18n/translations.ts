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
      hoursTag: "5j/7 · 8h30–15h30",
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
      openDays: "De 08h30 à 16h00 (dernier créneau 15h30)",
      closedNote: "Fermé le LUNDI et le VENDREDI",
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
      hoursTag: "5 days/wk · 8:30am–3:30pm",
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
      openDays: "From 08:30 AM to 04:00 PM (last slot 03:30 PM)",
      closedNote: "Closed on MONDAYS & FRIDAYS",
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
      doctorSubtitle: "الدكتورة العربي نسيبة",
      about: "عن العيادة",
      doctor: "د. العربي",
      care: "مجالات الرعاية",
      aftercare: "المرافقة المستمرة",
      reviews: "تجارب المرضى",
      faq: "الأسئلة الشائعة",
      contact: "الموقع والتواصل",
      ctaChat: "المساعدة الذكية",
      ctaBook: "حجز موعد",
      mobileHome: "الرئيسية",
      mobileCare: "الرعاية",
      mobileCall: "اتصال",
    },
    hero: {
      eyebrow: "مركز الطب النفسي والصحة النفسية · المعالمة، الجزائر العاصمة",
      headline: "«عقلك وراحتك النفسية يستحقان ذات الرعاية التي تمنحها لجسدك.»",
      highlight: "تمنحها لجسدك.»",
      subtitle: "نعلم كم صمدت طويلاً وحدك قبل أن تصل إلى هنا، وأن الثقل الذي تكتمه في صدرك يستحق الإنصات.. خذ نفساً عميقاً، لست وحدك، ومساحتك الآمنة هنا.",
      bookBtn: "حجز موعد استشارة",
      chatBtn: "المساعدة الذكية للإرشاد",
      doctorTag: "د. العربي نسيبة",
      hoursTag: "٥ أيام/الأسبوع · ٨:٣٠ص–٣:٣٠م",
      privacyTag: "سرية طبية تامة ومطلقة",
      reviewsTag: "+٣٠ تقييم موثق (٤.٩★)",
      floatQuote: "«هنا.. لن يُطلب منك أن تتظاهر بالقوة، بل أن تكون أنت بكل راحة.»",
    },
    reassurance: {
      title: "مساحة من السكينة، الاحترام، والإنصات الصادق",
      subtitle: "صممنا عيادتنا بعيداً عن برود الجدران الطبية التقليدية، لتكون ملاذاً دافئاً يهدئ قلقك من اللحظة الأولى التي تخطو فيها عتبتنا.",
      badges: {
        confidentiality: "سرية طبية تامة تحفظ كرامتك",
        activeListening: "إنصات دافئ بلا أي أحكام مسبقة",
        gentlePacing: "نمضي في العلاج بخطواتك وتوقيتك أنت",
        personalized: "خطة رعاية مفصلة لإنسانيتك وظروفك",
      },
    },
    familiar: {
      title: "ما تشعر به اليوم ليس نهاية المطاف",
      subtitle: "كثيرون ممن زاروا عيادتنا عاشوا ذات الحيرة والمخاوف قبل أن يخطوا خطوتهم الأولى نحو الراحة.",
      items: [
        {
          quote: "«أستيقظ متعباً رغم النوم الطويل، وجسدي كله ثقيل ومشتت.»",
          answer: "التعب النفسي يستنزف طاقة الجسد بصمت. عندما يكون عقلك في توتر مستمر، لا يكفي النوم وحده لإراحتك. نحن نساعدك على فك هذا الثقل من جذوره لتستعيد حيويتك.",
        },
        {
          quote: "«أشعر أنه لا أحد حولي يستوعب حقيقة ما أصارعه في داخلي.»",
          answer: "الألم النفسي مؤلم لأنه يعزل صاحبه عن العالم. في جلساتنا، ستجد إنصاتاً يفهم ما وراء صمتك، دون تقليل من معاناتك أو تقديم لوم أو نصائح معلبة.",
        },
        {
          quote: "«أخشى أن تجعلني الأدوية النفسية مدمناً أو تغيّر طبيعتي.»",
          answer: "هذا تخوف مشروع نسمعه كثيراً. العلاج النفسي القائم على الحوار والتوجيه السلوكي المعرفي هو ركيزتنا الأساسية. والأدوية لا تُوصف إلا عند الضرورة الطبية المؤكدة، بشرح شفاف ومتابعة دقيقة تضمن سلامتك.",
        },
        {
          quote: "«أشعر بالذنب.. كان ينبغي أن أكون أقوى وأتجاوز هذا بمفردي.»",
          answer: "طلب المساعدة الطبية ليس علامة ضعف، بل هو ذروة الشجاعة والمسؤولية تجاه نفسك وأحبابك. تماماً كما تراجع الطبيب عند كسر عظمك، يحق لروحك أن تتلقى الرعاية المختصة.",
        },
      ],
    },
    whyUs: {
      title: "لماذا يختلف مركز مايند كير؟",
      subtitle: "فلسفتنا تقوم على نهج إنساني دافئ، يضع كرامتك ومشاعرك فوق كل اعتبار طبي أو سريري.",
      pillars: [
        {
          title: "إنصاتٌ خالص بقلبٍ حاضر",
          description: "لكل إنسان قصة فريدة تستحق أن تُسمع كاملة. لن يطلب منك أحد التظاهر بالتماسك؛ هنا يمكنك أن تبكي، تصمت، أو تتحدث بكل عفوية.",
        },
        {
          title: "وقتٌ كافٍ لك وحدك",
          description: "لا نؤمن بالاستشارات المتعجلة أو المقتضبة. نمنحك كامل الوقت والاهتمام لفهم تفاصيل معاناتك وبناء خطة التعافي بروية.",
        },
        {
          title: "مساحة آمنة بلا أحكام",
          description: "مخاوفك، أسرارك، ولحظات انكسارك تُستقبل باحتواء مهني رحيم، خالٍ تماماً من أي نقد أو لوم.",
        },
        {
          title: "سندٌ مستمر يرافقك",
          description: "الرعاية لا تنتهي عند إغلاق باب العيادة. نبقى بجانبك بين الجلسات لتشعر دائماً بالأمان وأنك لست متروكاً لنفسك.",
        },
        {
          title: "كرامتك قبل أي تشخيص",
          description: "أنت لست مجرد اسم لمرض أو ورقة وصفة طبية. أنت إنسان متكامل نرافقه بكل صدق وأمانة حتى يستعيد عافيته.",
        },
      ],
    },
    doctor: {
      badge: "طبيبة أخصائية في الطب النفسي والأمراض العقلية",
      title: "الدكتورة العربي نسيبة",
      subtitle: "أخصائية الطب النفسي والعلاج السلوكي المعرفي (CBT) بالمعالمة",
      bio: "طبيبة أخصائية في الطب النفسي، تؤمن الدكتورة العربي نسيبة بأن التعافي الحقيقي يبدأ حين يشعر الإنسان بأنه مسموعٌ ومحتوى دون خوف أو حرج. تجمع بين الكفاءة العلمية الطبية الرصينة والتعاطف الإنساني الصادق، لتستقبل كل مريض باهتمام دافئ يرسم مسار علاج يحترم وتيرته وخصوصيته.",
      qualifications: [
        "طبيبة أخصائية في الطب النفسي والأمراض العقلية (جامعة الجزائر)",
        "متخصصة في العلاج السلوكي المعرفي (TCC / CBT)",
        "رعاية متخصصة للأطفال، المراهقين، والبالغين",
        "علاج اضطرابات القلق، الصدمات النفسية، والاحتراق النفسي",
      ],
      quote: "«رسالتي هي توفير الإنصات الصادق، والوضوح العلمي، والأدوات النفسية التي تمكّن كل شخص من تجاوز عتمته واستعادة سكينته واطمئنانه الداخلي.»",
    },
    services: {
      title: "مجالات الرعاية والعلاج النفسي",
      subtitle: "رعاية طبية ونفسية متكاملة مصممة برفق لكل مرحلة عمرية.",
      closingTitle: "فريقنا ونهجنا العلاجي",
      closingText: "نرافق كافة الفئات العمرية بعناية تراعي ظروف كل شخص — استشارات نفسية حوارية، علاج سلوكي معرفي، مع ترشيد استخدام الأدوية إلا في الحالات الطبية الضرورية وبشرح وافٍ.",
      categories: [
        {
          id: "anxiete-humeur",
          title: "اضطرابات القلق ونوبات الهلع والمزاج",
          services: [
            {
              id: "anxiete-generalisee",
              title: "القلق العام والتوتر المستمر",
              description: "نعلم ثقل العيش مع بالٍ لا يهدأ وخوف دائم من المجهول. نساعدك على استرجاع السكينة والشعور بالأمان في يومك.",
            },
            {
              id: "crises-angoisse",
              title: "نوبات الهلع والخوف المفاجئ",
              description: "ذلك الشعور المباغت بتسارع نبضات القلب وضيق الأنفاس وفقدان السيطرة.. نساعدك على فهم ما يجري لجسدك وتجاوز النوبة بهدوء وثقة.",
            },
            {
              id: "phobies",
              title: "المخاوف المرضية (الفوبيا)",
              description: "خوفك ليس سخيفاً ولا مدعاة للحرج. نأخذ معاناتك بجدية، ونرافقك خطوة بخطوة حتى تستعيد حريتك في مواجهة ما يقلقك.",
            },
            {
              id: "anxiete-sociale",
              title: "الرهاب والقلق الاجتماعي",
              description: "ثقل الارتباك أمام الناس والخوف من نظرات الآخرين أو أحكامهم.. نمنحك مساحة تقبل تعيد إليك ثقتك وتجعلك تعبر بحرية.",
            },
            {
              id: "depression",
              title: "الاكتئاب وثقل المزاج",
              description: "حين تفقد الأيام ألوانها وتتحول أبسط تفاصيل الحياة إلى عبء ثقيل.. نمد لك يداً صبورة لتخرج من العتمة وتستعيد نورك الداخلي.",
            },
            {
              id: "bipolaire",
              title: "اضطراب الوجدان ثنائي القطب",
              description: "تقلبات المزاج الحادة بين الحزن العميق والنشاط المفرط.. علاج طبي متوازن يضمن لك الاستقرار والسلام النفسي المستدام.",
            },
            {
              id: "toc",
              title: "الوسواس القهري (TOC)",
              description: "الأفكار المزعجة المتكررة التي ترهقك وتجبرك على أفعال معينة ليست أنت.. نساعدك على فك قيودها خطوة بخطوة.",
            },
          ],
        },
        {
          id: "stress-sommeil",
          title: "الضغوط، اضطرابات النوم، والإنهاك",
          services: [
            {
              id: "ptsd",
              title: "صدمات الحياة والأحداث القاسية (PTSD)",
              description: "الذكريات المؤلمة التي ترفض الرحيل وتعاود مباغتتك.. نساعدك على معالجة أثر الصدمة وتضميد جراح الماضي بأمان.",
            },
            {
              id: "sommeil",
              title: "اضطرابات النوم والأرق المزمن",
              description: "الليالي الطويلة المرهقة وأنت تصارع أفكارك في الفراش.. نساعدك على استعادة النوم الطبيعي الهادئ دون قلق.",
            },
            {
              id: "psychosomatique",
              title: "الأعراض النفسجسدية والآلام المجهولة",
              description: "آلام الجسد وتشنجات القولون والصداع التي لا تجد لها الفحوصات سبباً عضوياً.. ننصت لما يحاول جسدك قوله تحت وطأة التوتر.",
            },
            {
              id: "adaptation",
              title: "صعوبات التكيف مع تقلبات الحياة",
              description: "الأزمات المفاجئة التي تزعزع استقرارك.. نساعدك على بناء المرونة النفسية واستعادة توازنك.",
            },
            {
              id: "burnout",
              title: "الاحتراق النفسي والإرهاق المهني",
              description: "حين تستهلكك متطلبات العمل ومسؤوليات الحياة حتى تفرغ طاقتك تماماً.. نساعدك على وضع الحدود واستعادة نفسك وشغفك.",
            },
          ],
        },
        {
          id: "enfance-adolescence",
          title: "صحة الأطفال، المراهقين والأسرة",
          services: [
            {
              id: "autisme",
              title: "طيف التوحد وصعوبات التواصل",
              description: "نرى طفلك بفرادة شخصيته وإمكاناته، ونكون عوناً وسنداً للوالدين لبناء لغة تفاهم وحب دافئة معه.",
            },
            {
              id: "tdah",
              title: "فرط الحركة وتشتت الانتباه (TDAH)",
              description: "طفلك ليس مشاغباً ولا كسولاً، بل يملك دماغاً يفكر بأسلوب مختلف. نوجهه لنحتضن ذكاءه وننظم طاقته بأساليب مثبتة.",
            },
            {
              id: "enuresie",
              title: "التبول اللاإرادي ومخاوف الطفولة",
              description: "علاج هادئ بالصبر والرفق يحفظ كرامة طفلك ومشاعره، بعيداً عن أي عتاب أو إحراج، مع معالجة الأسباب النفسية العميقة.",
            },
            {
              id: "scolaire",
              title: "الصعوبات المدرسية والتعثر الدراسي",
              description: "فهم المعاناة النفسية الكامنة خلف تراجع النتائج المدرسية ودعم الطفل بتشجيع واحتواء يزيل عنه عقدة الفشل.",
            },
            {
              id: "ado-emotionnel",
              title: "أزمات المراهقة والتقلبات العاطفية",
              description: "مرافقة المراهق في مرحلة البحث عن الهوية وتجاوز الانعزال أو التوتر، وبناء جسور الحوار مع العائلة.",
            },
          ],
        },
        {
          id: "relations-famille",
          title: "العلاقات، الفقدان، وظروف الحياة",
          services: [
            {
              id: "relations",
              title: "الخلافات الزوجية والأسرية",
              description: "حين تضيق لغة الحوار وتتراكم الخيبات، نساعد في ترميم جسور التواصل وإعادة السكينة والتفاهم بين أفراد الأسرة.",
            },
            {
              id: "addictions",
              title: "السلوكيات الإدمانية والتعافي",
              description: "مساندة طبية سرية تامة دون أي لوم أو تجريح، لمساعدتك على استعادة السيطرة الكاملة على مسار حياتك.",
            },
            {
              id: "tca",
              title: "اضطرابات الشهية والسلوك الغذائي",
              description: "معالجة الجذور النفسية العميقة الكامنة خلف علاقتك بالمرآة والوجبات، برفق وتفهم عالٍ.",
            },
          ],
        },
        {
          id: "troubles-profonds",
          title: "الاستشارات النفسية التخصصية",
          services: [
            {
              id: "schizophrenie",
              title: "اضطرابات الذهان والفصام",
              description: "خبرة طبية متخصصة ومرافقة إنسانية طويلة الأمد تضمن الكرامة وتقدم الدعم المستمر للمريض وعائلته.",
            },
            {
              id: "personnalite",
              title: "اضطرابات الشخصية والتكيف",
              description: "فهم النمط النفسي الداخلي وتطوير مهارات التكيف والتوازن مع الذات والمحيط الاجتماعي.",
            },
            {
              id: "adulte-senior",
              title: "رعاية البالغين وكبار السن",
              description: "إنصات محترم وعناية دافئة تراعي خصوصية كل مرحلة عمرية وتخفف من وطأة الشعور بالوحدة أو الاكتئاب.",
            },
          ],
        },
        {
          id: "epreuves-vie",
          title: "مرافقة الأزمات والمراحل الانتقالية",
          services: [
            {
              id: "deuil",
              title: "مرافقة حالات الفقدان والحزن (Deuil)",
              description: "ألم الفراق لا يحتاج إلى وعظ، بل إلى مساحة تُحترم فيها دموعك وتُعطى فيها مساحة للوجع حتى يلتئم برفق.",
            },
            {
              id: "maladies-chroniques",
              title: "التكيف النفسي مع الأمراض المزمنة",
              description: "دعم نفسي يعزز الصمود الداخلي ويساعدك على تقبل العلاج ومواصلة الحياة بأمل.",
            },
            {
              id: "separations",
              title: "الانفصال والتغيرات الحياتية الكبرى",
              description: "المساندة في تجاوز صدمات الانفصال وإعادة بناء الثقة بالنفس للمضي قدماً في الحياة.",
            },
            {
              id: "evenements-difficiles",
              title: "أزمات الحياة ومفترقات الطرق",
              description: "مهما كانت قسوة ما تمر به اليوم، تذكر أنك لست مجبراً على مواجهة العاصفة بمفردك.",
            },
          ],
        },
      ],
    },
    journey: {
      title: "رحلتك العلاجية في ٤ خطوات واضحة",
      subtitle: "مسار مطمئن وهادئ، صُمم بعناية ليزيل عنك أي ارتباك منذ اتصالك الأول.",
      steps: [
        {
          number: "٠١",
          title: "التواصل الأولي وحجز الموعد",
          text: "اختر موعدك بكل يسر عبر الموقع أو بالاتصال المباشر، ليصلك التأكيد والمعلومات الوافية فوراً.",
        },
        {
          number: "٠٢",
          title: "استقبال دافئ يحفظ كرامتك",
          text: "مكان مريح، ترحيب إنساني رحيم، بعيداً عن أجواء العيادات الباردة والمربكة.",
        },
        {
          number: "٠٣",
          title: "الجلسة الأولى: إنصاتٌ خالص بلا أحكام",
          text: "جلسة كاملة لك وحدك، تنصت فيها الدكتورة العربي نسيبة إلى تاريخك وظروفك بروية لفهم ما وراء الكلمات.",
        },
        {
          number: "٠٤",
          title: "خطة تعافٍ مخصصة ومرافقة مستمرة",
          text: "نحدد معاً الخطوات العلاجية المناسبة لك، مع بقائنا بجانبك لمتابعة تحسنك وتثبيت استقرارك.",
        },
      ],
    },
    aftercare: {
      title: "برنامج المرافقة المستمرة (Aftercare)",
      subtitle: "لأن أصعب التحديات قد تواجهك في يومك بين الموعد والآخر.. حرصنا على أن نكون سنداً لا ينقطع.",
      privacyNote: "محادثاتك وسجلاتك الطبية تخضع لأعلى درجات السرية والأمانة الطبية.",
      phases: [
        {
          number: "٠١",
          title: "سندٌ دائم بين الجلسات",
          text: "العلاج لا ينحصر في ساعة الاستشارة؛ وفرنا لك قنوات تواصل لتطمئن وتسأل متى ما شعرت بالحاجة.",
        },
        {
          number: "٠٢",
          title: "متابعة التقدم خطوة بخطوة",
          text: "نلاحظ التطور الإيجابي ونعدل الخطة العلاجية بمرونة تناسب وتيرتك وراحتك النفسية.",
        },
        {
          number: "٠٣",
          title: "مساعدة ذكية إرشادية على مدار الساعة",
          text: "مساعدتنا الافتراضية متاحة لمساندتك بتمارين التنفس والاسترخاء وتذكيرك بمواعيدك بكل خصوصية.",
        },
        {
          number: "٠٤",
          title: "استعادة ثقتك واستقلالك النفسي",
          text: "تزويدك بأدوات عملية وملموسة تمنحك القدرة على تجاوز عواصف الحياة بثقة وثبات مستدامين.",
        },
      ],
    },
    testimonials: {
      title: "كلمات وتجارب من القلب",
      subtitle: "شهادات صادقة ومؤثرة لمرضى استعادوا طمأنينتهم بعد زيارة العيادة.",
      googleNote: "متوسط التقييم ٤.٩ / ٥ بناءً على أكثر من ٣٠ تقييماً موثقاً على جوجل.",
    },
    faq: {
      title: "أسئلة تتردد في خاطرك؟",
      subtitle: "إجابات شفافة ومطمئنة تزيل عنك الحيرة والتردد.",
      items: [
        {
          id: "fou",
          question: "هل زيارة الطبيب النفسي تعني أنني «مهبول» أو مجنون؟",
          answer: "إطلاقاً. هذا المفهوم الخاطئ حرم الكثيرين من عيش حياة هادئة. زيارة الطبيب النفسي تشبه تماماً زيارة طبيب القلب أو الباطنية؛ هي قرار حكيم وشجاع لرعاية عقلك ومشاعرك. أغلب من يزورون عيادتنا هم أشخاص ناجحون، آباء وأمهات، وطلاب يمارسون حياتهم، لكنهم اختاروا ألا يتعذبوا في صمت.",
        },
        {
          id: "medicaments",
          question: "هل سأخرج حتماً بوصفة أدوية من أول موعد؟ وهل سأدمن عليها؟",
          answer: "لا، أبداً. الأدوية النفسية ليست حلاً سحرياً ولا تُصرف تلقائياً. نعتمد بشكل أساسي على العلاج المعرفي السلوكي والجلسات الحوارية. وإذا استدعت حالتك دواءً طبياً، فإن الدكتورة تشرح لك بدقة فوائده ومدته وكيفية إيقافه تدريجياً وبأمان تام.",
        },
        {
          id: "confidentialite",
          question: "هل يبقى ما أقوله داخل العيادة سراً؟ أخشى أن يعرف أحد من معارفي.",
          answer: "السر الطبي أمانة مقدسة ومسؤولية قانونية وأخلاقية صارمة. كل كلمة تشاركها وكل معلومة تخصك تظل بينك وبين طبيبتك داخل غرفة الاستشارة، ولن يعلم بزيارتك أو تفاصيلك أي طرف ثالث مهما كانت الظروف.",
        },
        {
          id: "duree",
          question: "كم تدوم الجلسة؟ وهل سيكون لدي وقت كافٍ للكلام؟",
          answer: "تستغرق الجلسة الاستشارية حوالي 30 إلى 45 دقيقة كاملة لك وحدك. لن نقاطعك ولن نستعجلك؛ خذ وقتك لتتنفس وتعبر عما بداخلك براحة تامة.",
        },
        {
          id: "silence",
          question: "ماذا لو ارتبكت ولم أعرف كيف أشرح ما يؤلمني؟",
          answer: "هذا أمر طبيعي جداً ونمر به يومياً. لست مطالباً بترتيب كلامك كخطاب. حتى صمتك ودموعك وترددك هي رسائل مفهومة لدينا. الدكتورة ستساعدك بلطف على التعبير خطوة بخطوة دون أي إحراج.",
        },
        {
          id: "enfants",
          question: "كيف تتعاملون مع الأطفال والمراهقين الذين يرفضون التحدث؟",
          answer: "الأطفال والمراهقون يعبرون بطرق مختلفة (بالرسم، اللعب، أو الحوار غير المباشر). نعتمد أساليب لطيفة وغير ضاغطة تشعرهم بالأمان والتقبل وتساعدهم على إخراج ما يكتمونه.",
        },
      ],
    },
    location: {
      title: "موقع العيادة وسبل الوصول",
      subtitle: "أجواء دافئة وهادئة في قلب المعالمة، الجزائر العاصمة.",
      addressLabel: "عنوان العيادة",
      phoneLabel: "الهاتف والواتساب",
      hoursLabel: "أوقات الاستقبال",
      openDays: "من الساعة ٠٨:٣٠ صباحاً حتى ٠٤:٠٠ مساءً (آخر موعد ٠٣:٣٠ م)",
      closedNote: "مغلق يومي الإثنين والجمعة",
      mapsBtn: "فتح المسار في خرائط جوجل",
      accessTitle: "كيفية الوصول إلى العيادة",
      accessText: "تقع العيادة في موقع هادئ يضمن خصوصيتك التامة بالمعالمة، مع توفر مسار يسير وأماكن مريحة لركن السيارات.",
    },
    bookingSection: {
      title: "هل أنت مستعد لأول خطوة نحو الراحة؟",
      subtitle: "لست مضطراً لحمل هذا الثقل وحدك بعد الآن.. احجز موعدك بهدوء أو تواصل مع مساعدتنا الذكية للإرشاد.",
      bookBtn: "حجز موعد استشارة",
      chatBtn: "المساعدة الذكية للإرشاد",
    },
    bookingFlow: {
      modalTitle: "حجز موعد استشارة طبية",
      step1Title: "هل سبق لك زيارة عيادتنا من قبل؟",
      optionFirstTime: "زيارتي الأولى للعيادة",
      optionFollowUp: "متابعة استشارة سابقة",
      step2Title: "لمن ترغب في حجز هذا الموعد؟",
      optionSelf: "لنفسي",
      optionChild: "لطفلي أو مراهق",
      optionRelative: "لأحد المقربين / أحد أفراد العائلة",
      step3Title: "ما هو السبب الرئيسي الذي ترغب في معالجته؟",
      step4Title: "اختر التاريخ والتوقيت الأنسب لراحتك",
      step5Title: "معلومات الاتصال الخاصة بك",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "مثال: عبد الرحمن",
      phoneLabel: "رقم الهاتف",
      phonePlaceholder: "مثال: 0554 81 39 11",
      notesLabel: "رسالة أو ملاحظات تود مشاركتها مسبقاً (اختياري)",
      notesPlaceholder: "أي تفاصيل أو مشاعر تود توضيحها لنا قبل المجيء...",
      confirmBtn: "تأكيد حجز الموعد",
      successTitle: "تم تسجيل موعدك بنجاح ونحن بانتظارك",
      successSubtitle: "أرسلنا لك تفاصيل الموعد عبر رسالة نصية قصيرة / واتساب. راحة بالك أمانتنا.",
      backBtn: "رجوع",
      nextBtn: "متابعة",
    },
    chatDrawer: {
      title: "المساعد الافتراضي لعيادة MindCare",
      subtitle: "متواجد معك للإجابة على استفساراتك وتوجيهك بكل لطف وهدوء وسرية تامة.",
      placeholder: "اكتب ما تشعر به أو سؤالك بكل راحة وسرية...",
      sendBtn: "إرسال",
      quickTitle: "أسئلة قد تطمئن بالك :",
      quick1: "كيف تجري الجلسة الأولى مع الدكتورة؟",
      quick2: "أشعر بقلق كبير.. كيف أبدأ الخطوة الأولى؟",
      quick3: "هل ما أشاركه هنا يبقى سرياً تماماً؟",
      bookNowBtn: "حجز موعد استشارة",
    },
    crisisBanner: {
      title: "في حالات الطوارئ الطبية أو النفسية الحرجة",
      desc: "إذا كنت تمر بلحظة ضيق شديدة أو تراودك أفكار لإيذاء نفسك، من فضلك لا تنتظر الموعد. اتصل فوراً بأرقام الطوارئ (الحماية المدنية 115، الشرطة 17) أو توجه إلى أقرب مصلحة استعجالات طبية. حياتك غالية جداً ولست وحدك في هذا العالم.",
      samuBtn: "الإسعاف 115",
      cabinetBtn: "العيادة 0554 81 39 11",
    },
    footer: {
      motto: "«رعاية العقل والنفس بذات الدقة، الأمانة، والرحمة التي يُرعى بها الجسد.»",
      desc: "عيادة متخصصة في الطب النفسي والعلاج السلوكي المعرفي (CBT) بالمعالمة، الجزائر العاصمة.",
      navTitle: "تصفح الموقع",
      contactTitle: "التواصل والزيارة",
      rights: "جميع الحقوق محفوظة.",
      disclaimer: "يقدم هذا الموقع معلومات توعوية وطبية عامة ولا يغني عن الاستشارة المباشرة مع الطبيب الأخصائي.",
    },
  },
};
