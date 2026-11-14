# SANAD — Prompt de réalisation pour Codex

## Mission

Tu dois concevoir puis construire **Sanad**, le portail d’accompagnement des patients du cabinet, intégré au site existant de la docteure. Agis avec la rigueur d’une équipe senior : conception produit, direction artistique, développement, sécurité et vérification. Produis une application riche et réellement interactive, avec une expérience mobile particulièrement soignée.

Ce brief reprend mes choix. Ne recommence pas un questionnaire général. Prends les décisions techniques ordinaires toi-même à partir du dépôt. Pose une question seulement si une information introuvable bloque réellement le travail, si une décision modifie substantiellement le produit, ou pour la validation visuelle prévue ci-dessous.

L’ordre voulu est : **vérifier le site en panne → proposer les maquettes mobiles → faire valider le design → construire Sanad par étapes → préparer le raccordement MindCare**.

La livraison actuelle est une **démonstration privée complète**, utilisable par des testeurs autorisés, avec des profils entièrement fictifs dans un environnement isolé. Aucun vrai patient, aucune copie du cabinet, aucun accès à sa base. L’ouverture aux patients viendra après le raccordement et les validations nécessaires.

## 1. Identifier les bons projets avant toute modification

- Le projet Vercel identifié le 14 novembre 2026 s’appelle `mindcare-website`. Son dépôt GitHub, sa branche, son URL et sa configuration restent à vérifier. Ce nom ne prouve ni la pile technique ni le bon fonctionnement actuel.
- Le dossier local `C:\MindCare\alexa-v8-final` contient MindCare, le logiciel du cabinet. Ne suppose pas qu’il contient le site public.
- Les instructions locales désignent historiquement `C:\MindCare\Final mindcare` comme dépôt canonique, mais ce chemin n’a pas été trouvé lors de l’inspection précédente. Vérifie la situation actuelle plutôt que de choisir arbitrairement un dépôt.
- Identifie le dépôt lié au projet Vercel avec les outils connectés disponibles. Vérifie les instructions applicables, les remotes, la branche, les changements locaux et les commits récents. Préserve tout travail existant.
- Travaille dans le dépôt propriétaire du site. Inspecte MindCare en lecture seule, uniquement pour comprendre les contrats nécessaires à l’intégration future.
- Avant d’agir, annonce brièvement `TASK / SCOPE / ENTRYPOINT / STOP CONDITION`.
- Lis les fichiers d’instructions applicables et le contexte ciblé. Dans MindCare, respecte notamment les portes SQL, les règles de confidentialité, les migrations immuables et les fichiers protégés. N’édite pas `STATE.md`, les archives, `fr.ts` ou les migrations appliquées.
- Ne modifie pas le schéma clinique de MindCare pendant cette mission. Si une évolution future est indispensable, documente-la pour la phase suivante ; aucune migration clinique spéculative.

## 2. Vérifier le site existant

Reproduis l’indisponibilité signalée. Examine les éléments pertinents : dernier déploiement, configuration de build, routage, dépendances et erreurs d’exécution. Ne confonds pas un écran de protection Vercel avec une panne applicative.

Détermine une cause vérifiable. Corrige dans la branche de travail les problèmes nécessaires au retour en fonctionnement, avec le plus petit changement complet. Conserve les pages, la marque et les fonctionnalités du site, notamment son chatbot existant, sauf correction justifiée. Aucun redesign général du site public.

Ne lis pas et n’affiche pas les secrets. Vérifie la présence des variables requises par leur nom ou leur état, sans exposer leur valeur. Si une action du titulaire du compte est indispensable, explique exactement laquelle et poursuis le travail indépendant.

Une réparation locale ou une preview ne suffit pas pour annoncer que le site public est réparé. Prépare les changements et leur vérification ; aucune publication en production ni changement de domaine sans mon instruction explicite.

## 3. Périmètre et architecture

Intègre Sanad dans le site existant via une entrée « Espace patient / Sanad » et un espace de routes dédié, en reprenant ses conventions. Un sous-chemin comme `/sanad` est une proposition à confirmer par l’inspection, pas une obligation de réécrire le routage.

Préserve la pile existante et réutilise ses composants, sa validation et son authentification lorsque leurs garanties conviennent. Aucun changement de framework, microservice ou dépendance lourde sans nécessité démontrée.

Sépare simplement trois responsabilités : interface patient ; services métier avec contrôle d’accès et persistance ; accès aux données et fournisseur IA. Les données patient ne doivent pas dépendre directement du SDK Gemini dans les composants.

La démonstration doit avoir une vraie persistance isolée pour tester les parcours après rechargement et reconnexion. Un assemblage de tableaux JavaScript et de boutons sans effet ne remplit pas la mission. Définis et versionne le schéma minimal propre à la démonstration selon les conventions du site, sans toucher aux données existantes.

L’activation du mode démonstration et son stockage doivent être vérifiés côté serveur. Refuse l’exécution contre une base non explicitement identifiée comme synthétique. Aucun paramètre d’URL ou interrupteur client ne peut sélectionner une base clinique. Pas de fixtures synthétiques dans le stockage de production.

À terme, Sanad et l’IA seront hébergés sur une machine dédiée au cabinet, qui restera allumée. Prépare cette portabilité sans déployer maintenant l’infrastructure locale. Le navigateur patient ne doit jamais accéder directement à PostgreSQL. Aucun port de base exposé sur Internet. Décris les besoins futurs de HTTPS, accès distant, sauvegarde et disponibilité ; aucune promesse de service permanent avant vérification.

## 4. Direction artistique : « Sanad Jardin »

Lecture du brief : application mobile d’accompagnement, chaleureuse, rassurante et contemporaine, avec une identité visuelle propre et une forte qualité d’exécution.

- Palette : crème et vert sauge comme base, turquoise comme couleur d’action, petites touches corail. Définis les valeurs dans des tokens centralisés.
- Illustrations originales éditoriales : plantes, paysages et scènes humaines, avec un vocabulaire graphique cohérent. Adultes et adolescents doivent s’y sentir à leur place ; aucune infantilisation.
- Verre translucide utilisé avec intention sur la navigation et quelques surfaces. Les données importantes, médicaments et messages doivent rester très lisibles sur des fonds stables.
- Typographie soignée, auto-hébergée si le projet le permet, avec une couverture arabe réellement vérifiée et une hiérarchie cohérente entre les langues.
- Rythme varié selon les écrans : accueil illustré, suivi clair, conversation intime et lisible, ressources immersives, réglages sobres. Ne transforme pas tout en piles de cartes identiques.
- Animations fluides et discrètes pour les transitions, les retours d’action et quelques illustrations. Respecte la réduction des animations. Aucun effet qui gêne la saisie ou ralentit le téléphone.
- Aucune statistique décorative, courbe inventée, barre de progression arbitraire ou notification simulant une vraie activité.
- Ne copie pas une autre marque. Ne livre pas le thème par défaut d’une bibliothèque comme identité finale.

Utilise les skills de design disponibles selon leur vrai périmètre. `imagegen-frontend-mobile` convient aux concepts d’écrans ; `imagegen` aux illustrations originales. Les règles de landing page de `design-taste-frontend` ne doivent pas dicter la navigation ou la densité d’un produit de santé.

### Validation visuelle obligatoire

Avant l’implémentation complète, propose une direction cohérente avec au minimum six écrans mobiles lisibles : connexion, Aujourd’hui, traitement, bilan quotidien, conversation Sanad et ressources. Ajoute une variante arabe avec RTL et un exemple desktop. Montre les écrans séparément à une taille permettant de lire leur contenu.

Présente aussi un parcours cliquable léger lorsque les outils le permettent. Distingue les images de référence et le prototype fonctionnel. Prépare une courte description du produit, de ses flux et des choix techniques pour accompagner les maquettes. Demande alors une validation concrète du design et de cette conception. Après validation, poursuis sans redemander l’autorisation pour chaque écran.

Si un outil d’illustration est indisponible, annonce la limite et prépare une direction visuelle vérifiable avec les moyens disponibles ; n’annonce pas des illustrations générées qui n’existent pas.

## 5. Navigation et langues

Navigation mobile à cinq onglets : **Aujourd’hui / Mon suivi / Sanad / Ressources / Mon espace**. Le traitement, les messages du cabinet, le programme hebdomadaire et l’aide doivent rester faciles à trouver. Le centre de l’application est le quotidien du patient, sans surcharge.

Prévois des accès contextuels vers les rendez-vous et le cabinet, sans créer de sixième onglet permanent. Sur tablette et ordinateur, adapte réellement la disposition.

Toute l’interface existe en français, arabe et anglais : formulaires, erreurs, états vides, notifications, contenus d’exercices et paramètres. Le français est le choix initial proposé. Centralise les traductions selon les conventions du dépôt.

L’arabe implique RTL, gestion des contenus mixtes, champs de téléphone, dates et navigation. Les numéros et identifiants doivent rester lisibles. Le chatbot doit comprendre le français, l’arabe, l’anglais et, autant que le fournisseur retenu le permet, la darija et l’Arabizi, sans promettre une qualité non évaluée.

## 6. Comptes et confidentialité

Mon choix pour les **comptes fictifs de cette démonstration** est : numéro de téléphone comme nom d’utilisateur ; date de naissance au format `JJMMAAAA` comme mot de passe initial, modifiable ensuite par le patient. Utilise uniquement des coordonnées de test non acheminables et documentées comme telles. Ne reprends aucun exemple provenant d’un vrai dossier.

Implémente ce comportement uniquement dans l’environnement synthétique vérifié. Le mot de passe initial doit être haché avec le mécanisme éprouvé du projet, jamais conservé ou journalisé en clair. Après changement, l’ancien secret ne fonctionne plus. Le cabinet peut réinitialiser l’accès après vérification d’identité ; il ne peut pas consulter le mot de passe actuel.

Ce mode prévisible ne constitue pas une authentification qualifiée pour les vrais dossiers. Son activation en production reste bloquée jusqu’à une décision de sécurité explicite sur l’activation et la récupération des comptes. N’affirme pas qu’un simple changement facultatif de mot de passe élimine ce risque.

Le numéro de téléphone n’est pas la clé primaire du patient. Normalise les formats locaux et internationaux avec les outils du projet. Traite explicitement les numéros absents, invalides, partagés ou déjà associés : pas de création ambiguë ni de fusion automatique. Le rattachement futur doit utiliser un identifiant patient stable vérifié.

Prépare le contrat de création en un bouton : autorisation de la docteure, patient ciblé, consentements nécessaires, résultat, audit, gestion des doublons et répétition sûre. Teste ce contrat dans un dispositif synthétique réservé aux développeurs. **Ne construis pas encore l’écran Aftercare dans MindCare.**

Isolation stricte entre patients, contrôle d’accès côté serveur et au niveau de la persistance selon la pile, sessions sécurisées, limitation des tentatives, réponses qui ne révèlent pas l’existence d’un compte, déconnexion et révocation effectives. Aucun secret dans le navigateur, les URL, les logs ou les captures.

### Ce que la docteure pourra voir

- Suivi, symptômes, prises déclarées, effets ressentis et messages envoyés au cabinet.
- Journal et conversations uniquement lorsque le patient choisit explicitement de les partager.
- Une synthèse ou une mémoire ne doit pas révéler indirectement un contenu privé.
- Le patient voit ce qui est partagé, avec qui et depuis quand. Il peut retirer le partage pour les accès futurs ; explique les limites concernant un contenu déjà consulté ou intégré au dossier.
- Toute synthèse IA porte son origine, sa date et ses limites. Elle n’est pas une note médicale signée.

Sanad doit être conçu pour tous les âges. Prépare des parcours et formulations adaptés, sans donner automatiquement au représentant légal accès au journal ou aux conversations. Les règles de consentement, de représentation et de confidentialité des mineurs devront être validées avant usage réel. Aucun accès aux vrais patients, adultes ou mineurs, à ce stade.

## 7. Fonctionnalités à réaliser

### Aujourd’hui

Accueil illustré personnalisé avec nom d’usage fictif, date locale, prochaine action utile, bilan du jour, traitements pertinents et prochain rendez-vous. Salutation sobre, raccourcis vers Sanad et les exercices. Les informations viennent des données persistées ; un état vide reste un vrai état vide.

### Traitements

Affiche uniquement le traitement actif validé et explicitement partagé par la docteure : médicament, dose, voie, horaires et consignes lorsqu’ils existent. Aucune déduction d’horaire ou de posologie à partir du nom d’un médicament.

Rappels, actions « pris / oublié / pas pris », raison facultative, historique des déclarations, effets ressentis et demande de renouvellement. Les déclarations sont identifiées comme provenant du patient ; elles ne prouvent pas une prise effective. Gère les corrections de déclaration sans perdre la traçabilité, les doubles clics et les tentatives répétées.

Un oubli ne déclenche jamais un conseil de doubler une dose. Un changement de traitement ne doit pas être effectué par le patient ou le chatbot. Prévois les traitements au besoin sans inventer de programme fixe.

Affiche la date de dernière synchronisation. En cas de validité incertaine, explique la situation et suspends les rappels concernés. Une panne temporaire ne suffit pas, à elle seule, à déclarer une prescription invalide : définis le critère de fraîcheur, de validité et de révocation à partir du contrat.

### Bilan quotidien et tendances

Bilan de moins d’une minute : humeur, anxiété, sommeil, énergie et effets ressentis. Réponses facultatives, libellés compréhensibles et possibilités de correction. Présente les tendances et les jours sans données honnêtement, sans transformer ces indicateurs en diagnostic ou en score de risque non validé.

**Pas de questionnaires cliniques standardisés dans cette première version.**

### Journal guidé

Questions : ce qui s’est passé, l’émotion ressentie, le besoin et ce qui a aidé. Consultation des entrées, modification selon les règles de conservation et partage explicite d’une entrée avec la docteure. Aucun partage activé par défaut. Pas de note vocale dans cette livraison.

### Programme hebdomadaire et objectifs

Programme complet comprenant habitudes, exercices, objectifs réalistes et bilan de fin de semaine. Distingue les éléments proposés par la docteure des choix personnels du patient. Permets de reporter une activité et de reprendre après une interruption sans message culpabilisant.

Ajoute routines de sommeil, activités agréables, petits objectifs, calendrier personnel et suivi simple des progrès. Pas de classement, compétition, série de jours punitive ou récompense encourageant une mauvaise déclaration de prise.

### Ressources et exercices

Respiration, ancrage, détente, routine de sommeil et exercices courts pour les moments difficiles. Instructions, durée, progression contrôlable, pause et arrêt accessibles. La respiration animée respecte la réduction des animations et propose une alternative statique.

Bibliothèque de psychoéducation, favoris, catégories, recherche si la quantité de contenu le justifie, et parcours choisis par la docteure. Chaque contenu porte un statut de validation. En démonstration, les contenus rédigés pour le projet sont signalés comme devant être relus avant usage clinique. Pas de longues recommandations thérapeutiques inventées pour remplir l’interface.

### Rendez-vous et préparation de consultation

Prochain rendez-vous confirmé, rappels discrets, préparation des questions, bilan depuis la dernière visite et demande de changement soumise au cabinet. Une demande reste « en attente » tant qu’elle n’est pas confirmée. Pas de modification silencieuse de l’agenda.

Prévois un résumé destiné au patient, documents expressément partagés et aperçu sécurisé. Une synthèse automatique ne doit pas dépasser les données autorisées ni être présentée comme validée par la docteure.

### Messages et demandes au cabinet

Messagerie sécurisée avec demandes structurées : renouvellement, rendez-vous, effet ressenti, question administrative. États distincts pour brouillon, envoi, réception technique et réponse. Un accusé technique n’est pas une lecture médicale.

Affiche les horaires et délais de réponse réellement configurés. Ne promets aucune surveillance continue. Dans la démonstration, une réception simulée doit être clairement identifiée comme telle et ne doit contacter personne au cabinet. Les réponses de test restent dans le dispositif synthétique.

Les pièces jointes libres ne font pas partie de cette première version. Les documents publiés par la docteure constituent un flux distinct et contrôlé.

### Aide et plan de sécurité

Bouton d’aide facile à trouver, indépendant du chatbot. Contacts locaux vérifiés, proche choisi par le patient et plan de sécurité validé par la docteure. Ne fabrique aucun numéro. Pour les contacts de crise, utilise les outils de recherche de ressources appropriés lorsqu’ils sont disponibles, puis vérifie leur provenance et leur actualité.

Si les coordonnées ne sont pas validées, affiche un état « à configurer » dans la démonstration. Aucun appel ou message automatique. Pas de signalement automatique au cabinet dans le périmètre retenu. Ne présente jamais Sanad comme un service d’urgence.

### Mon espace

Langue, nom d’usage, mot de passe, préférences de notification, confidentialité et partage, mémoire de Sanad, contacts utiles et déconnexion. Distingue données du compte et données cliniques ; aucune suppression clinique automatique depuis les réglages. Les modalités de conservation et les demandes relatives aux données doivent suivre une politique validée, pas un texte juridique inventé.

## 8. Chatbot Sanad

Personnalité : chaleureux, calme, naturel, respectueux et sans jugement. Il écoute, reformule lorsque cela aide et pose une question à la fois. Il évite les réponses interminables, les formules mécaniques et les assurances injustifiées. Il se présente clairement comme une IA, sans prétendre être humain, médecin ou disponible en permanence.

Il peut aider à mettre des mots sur une émotion, préparer une question pour la docteure, retrouver une consigne explicitement partagée et proposer un exercice autorisé. Il ne pose pas de diagnostic, ne prescrit pas, ne modifie pas une dose et ne donne pas de directive personnalisée de prise ou d’arrêt. Les situations préoccupantes mènent vers les moyens d’aide prévus, sans promettre qu’un professionnel a été alerté.

Prépare une mémoire limitée aux préférences et éléments autorisés. Elle est visible, corrigeable et désactivable. Désactiver l’usage futur et supprimer une mémoire sont deux opérations distinctes ; respecte les obligations de conservation applicables. Aucun partage involontaire de cette mémoire avec la docteure. Ne réinjecte pas les contenus révoqués dans le contexte IA.

### Fournisseurs et contrainte Gemini

Le souhait initial est de réutiliser Gemini, déjà utilisé par le chatbot du site. Inspecte cette intégration avant d’écrire un second client. Ne réutilise pas ses conversations, son contexte ni ses permissions pour Sanad.

Les conditions officielles vérifiées le 14 novembre 2026 interdisent l’usage de Gemini API en pratique clinique ou pour donner des conseils médicaux, ainsi que son utilisation dans un service destiné à des moins de 18 ans ou susceptible d’être utilisé par eux. Les services non payants ne doivent pas recevoir d’informations personnelles, confidentielles ou sensibles. Source : https://aistudio.google.com/docs/terms . Revérifie les conditions applicables au produit exact avant toute activation.

En conséquence, prépare une interface fournisseur simple, mais **n’active pas Gemini dans le parcours patient Sanad tous âges**. Ne considère pas qu’un avertissement ou un simple filtre d’âge lève ces restrictions. N’active pas non plus un envoi cloud de données du cabinet après pseudonymisation sans décision applicable.

Un adaptateur Gemini peut être préparé pour des tests de développement non cliniques autorisés, séparés du portail patient et réservés à des adultes, si les conditions le permettent. Aucun appel facturé ou activation de facturation sans instruction explicite. Documente exactement ce qui a été testé.

Le mode de démonstration du portail utilise des échanges scénarisés clairement indiqués ou un fournisseur dont l’usage a été vérifié et autorisé. Une réponse scénarisée ne doit jamais être présentée comme une génération réelle. Le fournisseur local reste désactivé jusqu’à sa disponibilité et sa qualification : pas de modèle fictivement connecté.

Prépare délais d’attente, annulation, erreurs, quotas et indisponibilité propre. La protection ne repose pas seulement sur le prompt : accès aux données contrôlé côté serveur, aucun outil d’écriture clinique à disposition du chatbot, validation des sorties structurées et rendu des messages sans injection HTML.

Le texte est le mode livré. La dictée et la lecture vocale sont uniquement préparées dans le contrat pour une activation locale ultérieure ; aucun bouton de voix qui semble fonctionner alors qu’il ne fonctionne pas.

## 9. Synchronisation future et écran docteure

**L’écran Aftercare dans MindCare sera construit dans une mission suivante.** Prépare maintenant les contrats nécessaires et leurs tests avec un émetteur/récepteur synthétique. Ne présente pas ce dispositif comme une synchronisation réelle avec le cabinet.

MindCare fait autorité sur : identité et rattachement, traitement actif validé, consignes, rendez-vous confirmés, objectifs prescrits et documents partagés. Sanad fournit : bilans, prises déclarées, effets ressentis, demandes, messages et éléments volontairement partagés. Aucune fusion aveugle des deux sources.

Définis les champs minimaux, identifiants stables, versions, dates d’effet, origine, état de partage et références de corrélation. L’identité et le périmètre patient sont établis par la session authentifiée et le rattachement vérifié, jamais par un identifiant arbitraire accepté du navigateur.

Prévois répétitions sans doublon, événements dans le désordre, reprise après interruption, accusés de réception, révocation de partage, modification et arrêt d’un traitement. Aucune livraison exactement une fois supposée. Aucun écrasement de prescription par une déclaration patient.

Documente les futurs indicateurs de la docteure : dernière synchronisation, dernier bilan, tendances, prises déclarées, effets ressentis, demandes en attente et éléments partagés. Les données manquantes ne valent ni « tout va bien » ni « patient en danger ». Cette liste sera consultée pendant les horaires du cabinet, avec des délais de réponse configurés.

N’ajoute pas de score clinique automatique ni de règle de priorité médicale non validée. Les droits d’une éventuelle assistante devront être distincts de ceux de la docteure ; aucun accès clinique implicite.

## 10. Notifications, installation et hors ligne

Prévois une expérience web mobile installable lorsque la pile le permet, avec manifeste et icônes soignés. Les notifications de traitement, rendez-vous et messages sont facultatives, demandées après explication et configurables avec horaires silencieux.

Texte neutre sur l’écran verrouillé, sans diagnostic ni médicament. Pas de SMS, WhatsApp ou e-mail sortant dans ce périmètre.

Vérifie les capacités réelles d’iOS et Android avant de promettre des rappels lorsque l’application est fermée. Un minuteur JavaScript dans un onglet ou une fonction Vercel laissée en mémoire ne constitue pas un système de rappel fiable. Si un service de planification/push reste à configurer, livre les états et contrats nécessaires et marque la livraison effective des notifications comme non vérifiée.

Hors ligne : ressources statiques et exercices disponibles, informations utiles d’aide déjà vérifiées si présentes. Pas de conservation durable des données sensibles sur le téléphone par défaut. Aucun cache de réponses authentifiées par le service worker, aucune donnée de santé dans `localStorage` par commodité.

Un message saisi hors connexion n’est jamais affiché comme reçu. À la déconnexion, purge les données locales de session et les caches privés éventuels. Ne promets pas de chatbot local dans le navigateur : le futur modèle tournera sur l’installation du cabinet.

## 11. Qualité d’exécution et vérification

Chaque parcours possède ses états utiles : chargement, vide, succès, erreur, absence de réseau, session expirée et accès refusé. Préserve les saisies lorsque c’est sûr, préviens les doubles envois et présente des erreurs compréhensibles dans les trois langues.

Vérifie sur des largeurs de 360, 390 et 430 pixels, puis tablette et desktop. Teste le clavier virtuel dans le chat, les zones sûres du téléphone, la barre de navigation, le zoom, les textes longs et le RTL. Pas de défilement horizontal accidentel. Contraste suffisant, zones tactiles confortables, lecteurs d’écran, labels, focus et réduction des animations.

Budget raisonnable pour un téléphone courant : illustrations optimisées, chargement différé des ressources secondaires, transparences mesurées et absence de dépendance lourde décorative. Mesure les performances disponibles et distingue mesures de laboratoire et résultats réels.

Tests ciblés obligatoires pour :

1. Création d’un compte fictif, doublon, date de naissance initiale, changement de mot de passe, réinitialisation et session révoquée.
2. Isolation entre deux patients, accès aux objets d’autrui, partage du journal/conversation et révocation, y compris dans les résumés et le contexte IA.
3. Bilans et prises déclarées persistés après reconnexion, corrections et prévention des doublons.
4. Modification/arrêt de traitement, événements retardés, validité incertaine et suspension des rappels concernés.
5. Demande de rendez-vous restant en attente et message hors ligne jamais marqué reçu.
6. Verrouillage du stockage synthétique, accès privé de la démonstration et absence de connexion au cabinet.
7. Interdiction d’activer Gemini dans le parcours patient, indisponibilité fournisseur, absence d’outil d’écriture clinique et échanges scénarisés identifiables.
8. Traductions complètes, rendu arabe et parcours mobiles essentiels.

Utilise les outils du dépôt pour les tests et contrôles de types, lint et build pertinents. Effectue une vérification navigateur réelle des flux principaux et fournis des captures lisibles. Un test avec un faux fournisseur ne prouve ni la qualité d’un modèle réel ni une qualification clinique.

## 12. Organisation et livrables

Tu peux déléguer des tâches indépendantes à des sous-agents si l’environnement le permet : audit du site, revue UX/accessibilité, vérification des contrats ou revue des changements. Définis des périmètres nets, évite les modifications concurrentes des mêmes fichiers et reste responsable de l’intégration. N’invente pas une équipe ou une revue qui n’a pas eu lieu.

Étapes attendues :

1. Identifier les dépôts et la panne, établir une base vérifiable.
2. Présenter conception et maquettes concrètes pour validation.
3. Écrire un plan d’implémentation ciblé, puis construire comptes, navigation, données et confidentialité.
4. Construire tous les modules retenus, le dialogue de démonstration, les contrats et les états dégradés.
5. Vérifier l’ensemble, corriger les écarts et préparer une démonstration privée si les outils et autorisations le permettent.
6. Livrer le code, les preuves, les limites et le dossier de raccordement pour la future mission MindCare.

Produis une documentation courte et utile : lancement local, configuration sans secrets, accès privé, données synthétiques, tests, contrats de synchronisation et besoins de l’installation locale future. Garde les décisions et contrats nécessaires dans des fichiers suivis du dépôt propriétaire du site. Utilise sa convention de branche ; à défaut, `codex/sanad-aftercare`. Commits propres et ciblés autorisés ; aucune fusion ou publication en production sans instruction explicite.

Si une phase est bloquée, poursuis les travaux indépendants et indique précisément le blocage. Ne conclus pas après une simple maquette si la phase d’implémentation a été validée. N’élargis pas le produit au-delà de ce brief et ne masque pas les fonctions manquantes derrière des boutons décoratifs.

Le rapport final distingue : **DONE / CHANGED / DELETED / VERIFIED / NOT DONE / OUT-OF-SCOPE / NEXT**, avec résultats **PASS / FAIL / NOT RUN**, commandes exécutées, captures et lien de preview privée si réellement créé. Indique clairement ce qui reste simulé : cabinet, notifications, IA ou synchronisation.

Critère final : une démonstration privée cohérente, visuellement aboutie et vérifiable de Sanad, dont les parcours et la persistance fonctionnent, avec préparation documentée de l’intégration locale. Elle ne doit pas être qualifiée « prête pour les vrais patients » tant que les dépendances, la sécurité, le contenu clinique et le raccordement ne sont pas effectivement validés.

**Commence maintenant par l’identification du dépôt du site et la vérification de la panne.**
