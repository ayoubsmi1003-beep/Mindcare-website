export interface PillarItem {
  icon: string;
  title: string;
  description: string;
}

export const pillars: PillarItem[] = [
  {
    icon: "Ear",
    title: "Nous vous écoutons",
    description: "Chaque personne qui entre ici porte une douleur qu'elle ne montre à personne. Ici, personne ne vous demandera d'être fort(e) — juste d'être vous-même."
  },
  {
    icon: "Clock",
    title: "Nous prenons le temps",
    description: "Ailleurs, dix minutes et une ordonnance. Ici, le temps que mérite votre histoire car un vrai diagnostic ne se pose jamais à la hâte."
  },
  {
    icon: "HeartHandshake",
    title: "Nous ne jugeons jamais",
    description: "Vos peurs, vos silences, vos nuits les plus sombres, rien n'est accueilli avec un regard qui juge. Seulement avec une main tendue."
  },
  {
    icon: "Users",
    title: "Nous restons présents",
    description: "La guérison ne tient pas en une séance par mois. Nous restons à vos côtés entre les consultations, chaque jour, aussi longtemps qu'il le faut."
  },
  {
    icon: "Eye",
    title: "Nous voyons la personne avant le trouble",
    description: "Vous n'êtes pas un diagnostic. Vous êtes une personne entière, et c'est elle que nous prenons le temps de connaître."
  }
];

export const marqueeRows = [
  [
    "Est-ce que quelqu'un va enfin m'écouter sans me couper la parole ?",
    "Ai-je le droit de ne pas aller bien ?",
    "Vont-ils me juger si je leur dis tout ?",
    "Combien de temps avant qu'on me prenne au sérieux ?"
  ],
  [
    "Suis-je juste un diagnostic de plus pour eux ?",
    "Devrai-je tout réexpliquer à chaque fois ?",
    "Qui sera là si je craque entre deux séances ?",
    "Ont-ils vraiment le temps pour mon histoire ?"
  ],
  [
    "Vais-je devoir cacher mes silences ?",
    "Ma souffrance sera-t-elle prise au sérieux ?",
    "Puis-je être moi-même, sans masque ?",
    "Y a-t-il un endroit où je ne serai pas réduit(e) à mon trouble ?"
  ]
];
