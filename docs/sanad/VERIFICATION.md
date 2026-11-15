# Vérification Sanad — 15 novembre 2026

Ce rapport remplace le bilan de conception du 14 novembre. Les résultats
ci-dessous concernent une démonstration privée locale avec données fictives.
Ils ne qualifient ni usage clinique, ni fournisseur IA réel, ni exploitation.

## PASS — sources et tests ciblés

Les exécutions ci-dessous ont été observées pendant la réalisation ; cette
mise à jour documentaire ne les présente pas comme une nouvelle exécution.

| Contrôle | Résultat | Commande ou preuve |
| --- | --- | --- |
| Sources du site déployé | 84 originaux retrouvés sur 85 ; 81 fichiers courants identiques, 4 différences intentionnelles | [SOURCE-PROVENANCE.md](SOURCE-PROVENANCE.md), `source-reconciliation.json`, `deployed-source-hashes.json` |
| Site public restauré | 12/12, 0 échec, 0 skip | `node --test scripts/booking-current.test.mjs scripts/booking-ui.test.mjs scripts/public-chat.test.mjs scripts/gemini-fallback.test.mjs` |
| Contrats synthétiques | 22/22, 0 échec, 0 skip | `node --experimental-strip-types --test lib/sanad/contracts/contracts.test.mjs` |
| Commandes et frontière HTTP | 4/4, 0 échec, 0 skip | `node --experimental-strip-types --test lib/sanad/commands.test.mjs` |
| Interface et traductions | 12/12, 0 échec, 0 skip | `node --test components/sanad/ui.test.cjs` |
| Service worker isolé | 2/2, 0 échec, 0 skip | `node --test lib/sanad/sw.test.mjs` |
| Crypto et vraies portes PostgreSQL isolées | 9/9, 0 échec, 0 skip | `node --experimental-strip-types --test lib/sanad/server/crypto.test.mjs lib/sanad/server/integration.test.mjs` |
| Parcours HTTP vers la base synthétique | 1 test de parcours complet, réussi | Démonstration locale lancée, puis `node --test scripts/sanad-api.test.mjs` |
| Lint global | Sortie 0 | `node node_modules/eslint/bin/eslint.js .` |

Le verrou de dépendances original du déploiement est le seul fichier non
retrouvé : le verrou courant contient les ajouts Sanad. Les quatre différences
assumées concernent la navigation Sanad, les dépendances PostgreSQL, ce verrou
et l'en-tête du service worker. Aucun fichier tronqué du connecteur n'a été appliqué.

Les tests couvrent notamment sessions, mots de passe, isolation entre patients,
corrections et concurrence, idempotence, partage par révision/révocation,
interdiction d'écritures patient sur les objets d'autorité, commandes invalides,
traitement modifié/arrêté et événements retardés. Les tests de contrat couvrent
aussi déduplication après sérialisation, conflit d'autorité, confidentialité du
contexte et refus des fournisseurs Gemini/local dans le parcours patient.
Les tests HTTP vérifient de vraies réponses, cookies et données persistées,
dont le refus 409 d'une clé de chat réutilisée avec un autre texte ou une autre
conversation. Le test de contrat inclut la révocation à date d'effet future ;
le cabinet, les messages reçus et le dialogue restent synthétiques.

## PASS — navigateur et présentation

Le navigateur réel a confirmé un bilan enregistré avec 7,5 heures de sommeil,
retrouvé après rechargement, une conversation partagée puis révoquée, la pause
d'un exercice et le refus de présenter une saisie hors connexion comme reçue.
Captures fonctionnelles : [bilan](proofs/390-bilan.png),
[conversation](proofs/390-conversation.png), [arabe](proofs/390-arabe.png),
[ressources](proofs/390-ressources.png), [hors ligne](proofs/390-offline.png).

La revue indépendante a rendu **195 cas** : 13 écrans × 5 largeurs
(360/390/430/768/1440 pixels CSS) × 3 langues (FR/AR/EN). Aucun débordement
horizontal ou champ sans label associé dans cette matrice ; RTL arabe, champs
téléphone/heure LTR, focus clavier visible, en-tête fixe et réduction des
animations contrôlés. L'aide, auparavant masquée sous 376 pixels, a été corrigée
puis ouverte au clic à 360 pixels dans les trois langues, sans collision.

Preuves : [compte rendu de revue](proofs/ui-review-summary.md),
[matrice](proofs/ui-review-report.json), [clavier](proofs/ui-review-keyboard.json),
[aide corrigée](proofs/ui-review-help-fixed.json),
[mobile français](proofs/ui-review-fr-390-today.png),
[mobile arabe](proofs/ui-review-ar-390-today.png),
[desktop arabe](proofs/ui-review-ar-1440-today.png).
La seule erreur console de la matrice est le 401 initial attendu sans session ;
aucune erreur JavaScript de page n'a été relevée.

La matrice vérifie le rendu et la navigation : elle n'a pas enregistré de bilan
ou envoyé de message. Les essais fonctionnels ci-dessus et HTTP apportent les
preuves d'écriture. Le viewport de 420 pixels avec saisie active est une
approximation du clavier mobile, pas un essai sur téléphone physique.

Le cycle réel du service worker a aussi été vérifié dans Chromium : en-tête
`Service-Worker-Allowed` limité à `/sanad`, activation et contrôle de page,
rechargement hors connexion vers la page générique, puis début/pause d'exercice
hors ligne réussis. Le cache ne contient que sept ressources publiques et
`localStorage` est vide. Capture : [hors ligne réel](proofs/390-offline.png).
Cela ne prouve pas le cycle d'installation d'une PWA sur téléphone.

Le rognage du sélecteur de langue à 360 pixels a été corrigé après la matrice :
largeur finale 94 pixels, texte 11 pixels, largeur du document 360 pixels lors du
contrôle final. Capture : [en-tête final](proofs/360-header-final.png).

`npm run build` a terminé avec succès : `/sanad` représente 16 ko et 134 ko de
JavaScript au premier chargement. Typecheck global et lint global : PASS.
Les 40 tests contrats/interface/commandes/service worker ont ensuite été relancés :
40 PASS, zéro skip. La dernière protection serveur des droits opérateur est
également couverte par le typecheck et les neuf tests PostgreSQL.

La recette Chromium contre le build optimisé vérifie l'envoi retardé, le blocage
du champ pendant l'envoi, l'annulation accessible et le brouillon conservé après
une erreur 503 : [preuve](proofs/final-browser-mutations.json). Mesure locale sans
bridage réseau/CPU : TTFB 293 ms, DOMContentLoaded 835 ms, chargement 1 143 ms ;
ces valeurs de laboratoire ne prédisent pas un téléphone sur réseau mobile.

Base distante créée et vérifiée : PostgreSQL 17.12, base vide dédiée `sanad_demo`,
trois comptes fictifs, douze objets d'autorité synthétiques. Le rôle web n'est ni
propriétaire ni superuser, n'a ni BYPASSRLS, lecture directe des tables ni droit
d'exécuter les portes opérateur. La migration 002 corrige le défaut global
`PUBLIC EXECUTE`, reproduit en RED puis testé en GREEN ; le serveur refuse un
rôle web trop privilégié. [Preuve distante](proofs/cloud-postgres.json).
La base Claimable expire le 18 novembre 2026 à 11:31 UTC sans rattachement ;
aucune pérennité n'est promise avant ce rattachement.

Le parcours site public compilé → lien « Espace patient / Sanad » → /sanad →
connexion avec le seul compte fort est PASS en mode de publication explicite.
L’ancien mot de passe public et un compte d’isolation désactivé renvoient 401.
[Preuve](proofs/final-site-entry.json), [capture](proofs/390-final-site-entry.png).
Les accès du testeur restent hors dépôt et hors captures.

## FAIL / limites connues

- Le domaine `mindcare-centre.com` et son `www` restent indisponibles en HTTPS
  depuis le poste ; la vérification titulaire/DNS nécessite l'action du titulaire.
  L'URL Vercel historique répond 200, l'alias d'équipe est protégé par SSO.
  Aucun de ces constats ne prouve la remise en service du domaine.

## État de livraison durable

La demande du 15 novembre impose un stockage sans expiration et un seul compte
test. Le seed standard crée désormais un compte et quatre objets d’autorité ;
les comptes d’isolation supplémentaires exigent --test-fixtures sur loopback.
Dans la base de recette distante, deux profils techniques sont désactivés et
leurs sessions révoquées : un seul compte est actif. Aucun historique supprimé.

Le parcours de réponse du cabinet est terminé dans le dispositif synthétique :
message envoyé, reçu technique, réponse opérateur corrélée, lecture après
rechargement. Les réponses sont exclusivement opérateur, sans doublon, et
le message envoyé est immuable. Chromium contre le build final et PostgreSQL
17 distant : PASS ; arabe RTL 360 pixels sans débordement.
[Preuve](proofs/clinic-reply-flow.json), [capture FR](proofs/390-clinic-reply.png),
[capture AR](proofs/360-clinic-reply-ar.png).

La preview ae45bff est READY dans le projet du site ; accès anonyme : redirection
302 vers Vercel SSO. Aucun lien temporaire de contournement créé. Ce déploiement
de recette ne constitue pas la livraison durable. Le rattachement du stockage
au compte propriétaire est encore pending. Aucune production ou DNS modifié.

## NOT RUN / restant à terminer

- Stockage permanent, vérification après rattachement et publication finale
  accessible depuis le site : NON TERMINÉS.
- Recette navigateur authentifiée sur le domaine Vercel distant : NON EXÉCUTÉE ;
  les tests HTTP et navigateur passent avec le serveur local et la vraie base distante.
- Téléphones physiques, clavier iOS/Android, lecteur d’écran, installation PWA
  et livraison des notifications application fermée : non vérifiés.
- Raccordement MindCare, écran Aftercare, transport durable de synchronisation,
  modèle réel, sauvegarde/restauration du futur PC et qualification clinique :
  hors de cette démonstration, non réalisés.

## Reprise

Lancement : [IMPLEMENTATION.md](IMPLEMENTATION.md). Préparation du raccordement :
[CONTRACTS.md](CONTRACTS.md) et [FUTURE-HOSTING.md](FUTURE-HOSTING.md).
Compléter les preuves finales avant tout bilan de livraison intégré. L'ouverture
réelle reste bloquée par les validations d'identité, sécurité, mineurs,
contenu, exploitation et raccordement ; aucune donnée clinique n'est nécessaire
pour poursuivre les essais synthétiques.
