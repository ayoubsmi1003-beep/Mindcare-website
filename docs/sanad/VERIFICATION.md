# Vérification — étape de conception, 14 novembre 2026

## PASS

- Huit images distinctes : six vues mobiles françaises, une référence arabe RTL et un desktop. Visuellement inspectées à la génération ; contenu fictif signalé. Les images restent des références, pas une preuve d’accessibilité de l’application future.
- `node --test docs/sanad/design/prototype.test.mjs` : 2 tests réussis, 0 échec, 0 skip. Résolution sûre des fragments inconnus ; présence et taille des PNG ; cibles de navigation valides.
- `node --check docs/sanad/design/prototype.mjs` : sortie 0.
- `git diff --check` : sortie 0.
- Navigateur intégré réel : ouverture du prototype local ; lien Connexion → Aujourd’hui → Bilan ; accès à la référence arabe puis retour Aujourd’hui. Titres, liens et image active constatés dans l’arbre d’accessibilité. Onglet conservé pour revue.

## FAIL / limite d’outil

- Capture du navigateur : « Unable to capture screenshot ». Aucun fichier de capture navigateur livré ; les PNG de génération ne sont pas présentés comme des captures de l’application.
- Récupération complète du code déployé : le connecteur tronque de nombreux fichiers. Aucun contenu tronqué appliqué, aucune réconciliation réputée terminée. Voir SOURCE-PROVENANCE.md.

## NOT RUN

- Build, lint et typecheck du site : code applicatif inchangé et dépendances non installées à cette étape documentaire.
- Comptes, RLS, persistance, base, contrats de synchronisation et appels IA : aucune implémentation complète avant validation des maquettes.
- Recette de l’application aux largeurs 360/390/430, tablette et desktop : la navigation de référence ne remplace pas cette recette future.
- Provisionnement PostgreSQL, preview distante protégée, notifications, connexion au cabinet, qualification clinique et remise en service du domaine.

## Reprise

Attendre l’accord explicite sur la direction visuelle et la conception, puis poursuivre le BRIEF.md sans réduire le périmètre. Résoudre la provenance complète des correctifs du site avant toute livraison qui modifierait ses parcours existants. Aucun accès à la base du cabinet, aucune publication en production, aucun domaine modifié et aucune dépense engagée.
