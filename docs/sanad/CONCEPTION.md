# Sanad Jardin — conception validée

État du 14 novembre 2026 : huit références visuelles générées avec les outils intégrés imagegen-frontend-mobile/imagegen et un prototype de navigation local, sans persistance. Les prompts exacts sont conservés dans design/prompts.json. Aucune activation clinique ou publication.

## Expérience

Le quotidien est le centre : Aujourd’hui, Mon suivi, Sanad, Ressources, Mon espace. Le traitement et le bilan sont accessibles depuis Aujourd’hui ; les rendez-vous et l’aide restent contextuels. Desktop : navigation latérale. Français initial, arabe RTL et anglais dans la réalisation finale.

Crème, sauge, turquoise d’action, corail discret ; jardin méditerranéen éditorial. Les surfaces des informations médicales restent stables et lisibles. Unifier le dessin du logo et des icônes lors de l’implémentation : les variations entre images restent des références, pas des composants définitifs. Les textes ajoutés par le générateur dans la vue desktop ne deviennent pas une promesse de fiabilité ou de conseil médical : conserver le texte validé du brief. Le rythme du bilan reste inférieur à une minute.

## Architecture retenue

Conserver Next.js, React, Tailwind, Motion, Zod et les conventions du site. Espace et API Sanad distincts du chatbot public. UI → services métier → accès serveur aux données / fournisseur. Démonstration Vercel protégée avec PostgreSQL exclusivement synthétique ; offre sans facturation à vérifier avant création de ressource. Aucun stockage ni secret du cabinet réutilisé.

Contrôle synthétique serveur et marqueur en base avant écriture. RLS par patient, sessions révocables, audit transactionnel et idempotence. Téléphones fictifs réservés ; identifiant patient stable ; mot de passe initial JJMMAAAA haché, changement et réinitialisation. Le mode prévisible reste interdit aux vrais comptes. Aucun accès de représentant légal implicite.

Journal et conversations privés par défaut. Le partage porte sur une version choisie ; les nouvelles données restent privées. Révocation des accès futurs et invalidation des synthèses dérivées. Suivi déclaré, effets ressentis et messages au cabinet restent distingués des notes médicales. Aucun score automatique.

Chat livré par scénarios explicitement signalés ; Gemini et le modèle local restent désactivés. Mémoire limitée, visible, corrigeable, désactivable et supprimable séparément. Aucun outil d’écriture clinique ni voix active.

Les traitements, consignes, rendez-vous confirmés et documents seront des instantanés autorisés provenant d’un émetteur synthétique. Les déclarations patient ne les écrasent pas. La validité du traitement est distincte de la fraîcheur de synchronisation ; les rappels exigent une autorisation de source explicitement datée, sans durée clinique inventée.

## Flux après validation

Connexion fictive → Aujourd’hui → bilan / traitement / exercice / conversation. Les données métier seront réellement persistées et vérifiées après reconnexion. Les demandes au cabinet resteront simulées et en attente jusqu’à réponse synthétique. Aucun contact réel ni envoi externe.

Le prototype présent sert uniquement à valider la navigation et les maquettes. Il ne teste ni comptes, ni persistance, ni sécurité, ni fournisseur IA. Aucune saisie n’y est attendue. L’aide sans coordonnées validées restera « à configurer ».

Préparer PWA et ressources statiques hors ligne, sans cache des réponses privées ni données de santé en localStorage. Les notifications fermées attendent un service de livraison vérifié ; aucun rappel fiable revendiqué par un minuteur d’onglet.

## Point de validation

Direction Jardin et conception validées explicitement par l’utilisateur le 14 novembre 2026 : « Valider Jardin et la conception ». La construction complète est autorisée. Cette validation porte sur la conception ; elle ne prouve ni les parcours implémentés, ni la sécurité, ni l’accès privé distant. Les fonctionnalités, contrats et tests du BRIEF.md restent tous dans l’objectif.

## Lancement du prototype

Depuis docs/sanad/design : `python -m http.server 43861 --bind 127.0.0.1`, puis ouvrir http://127.0.0.1:43861/. L’ouverture directe du fichier peut bloquer les modules JavaScript selon le navigateur. Tests : `node --test docs/sanad/design/prototype.test.mjs` depuis la racine.
## Livraison précisée le 15 novembre 2026

La direction Jardin reste validée. La demande finale impose un stockage durable
et un seul compte test accessible depuis le site. Les bases à expiration et les
liens de partage temporaires ne constituent pas la livraison. Les comptes
supplémentaires restent limités aux tests techniques d'isolation locaux.

## Publication autorisée le 15 novembre 2026

Instruction explicite de l’utilisateur : « J’autorise la publication en production de Sanad dans le site existant. » La publication concerne uniquement le portail fictif, la base Neon permanente dédiée et un compte test, sans DNS ni accès au cabinet. Le résultat et les preuves HTTPS sont consignés dans VERIFICATION.md.
