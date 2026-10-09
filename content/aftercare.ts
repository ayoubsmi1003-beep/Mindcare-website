export interface AftercarePhase {
  number: string;
  title: string;
  text: string;
}

export const aftercarePhases: AftercarePhase[] = [
  {
    number: "01",
    title: "Toujours là, même à distance",
    text: "Entre deux consultations, la vie continue — les nuits difficiles, les pensées qui reviennent, les jours où tout devient lourd. Nous avons créé une présence qui reste avec vous, chaque jour, même quand nous ne sommes pas physiquement là."
  },
  {
    number: "02",
    title: "Un accompagnement quotidien, pas mensuel",
    text: "Nous savons qu'un mois entre deux rendez-vous peut sembler une éternité quand on traverse une tempête intérieure. Notre plateforme, propulsée par l'intelligence artificielle, veille sur vous chaque jour — pour que vous ne soyez jamais livré(e) à vous-même entre les séances."
  },
  {
    number: "03",
    title: "Un lien direct avec votre médecin",
    text: "L'intelligence artificielle ne remplace jamais l'humain — elle le renforce. Chaque donnée recueillie permet à Dr. Larbi Nassiba et son équipe de mieux comprendre votre évolution, d'ajuster votre traitement avec une précision inédite, et de vous consacrer un temps de consultation encore plus pertinent."
  },
  {
    number: "04",
    title: "Une progression que vous pouvez enfin voir",
    text: "Voir son évolution, semaine après semaine, redonne espoir. Nous vous offrons cette visibilité claire sur votre parcours — pour que vous puissiez constater, par vous-même, tout le chemin déjà parcouru."
  }
];

export const aftercarePrivacyNote = "Vos données restent confidentielles et protégées.";
