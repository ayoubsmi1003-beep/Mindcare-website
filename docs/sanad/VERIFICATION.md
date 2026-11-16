# Vérification Aftercare

La livraison courante Lavender du 16 novembre 2026 et ses nouvelles vérifications sont décrites dans [LAVENDER-RELEASE.md](LAVENDER-RELEASE.md). Les preuves correspondantes sont dans [proofs/lavender](proofs/lavender). Les résultats ci-dessous concernent uniquement la livraison précédente et ne sont pas des réexécutions de Lavender.

## Historique — 15 novembre 2026

Ce rapport remplace le bilan de conception du 14 novembre. Les résultats
ci-dessous concernent une démonstration avec données exclusivement fictives,
publiée sur le site après autorisation explicite. Ils ne qualifient ni usage
clinique, ni fournisseur IA réel, ni exploitation avec de vrais patients.

## PASS — sources et tests ciblés

Les exécutions ci-dessous ont été observées pendant la réalisation ; cette
mise à jour documentaire ne les présente pas comme une nouvelle exécution.

| Contrôle | Résultat | Commande ou preuve |
| --- | --- | --- |
| Sources du site déployé | 84 originaux retrouvés sur 85 ; 81 fichiers courants identiques, 4 différences intentionnelles | [SOURCE-PROVENANCE.md](SOURCE-PROVENANCE.md), `source-reconciliation.json`, `deployed-source-hashes.json` |
| Site public restauré | 12/12, 0 échec, 0 skip | `node --test scripts/booking-current.test.mjs scripts/booking-ui.test.mjs scripts/public-chat.test.mjs scripts/gemini-fallback.test.mjs` |
| Contrats synthétiques | 22/22, 0 échec, 0 skip | `node --experimental-strip-types --test lib/sanad/contracts/contracts.test.mjs` |
| Commandes et frontière HTTP | 4/4, 0 échec, 0 skip | `node --experimental-strip-types --test lib/sanad/commands.test.mjs` |
| Interface et traductions | 13/13, 0 échec, 0 skip | `node --test components/sanad/ui.test.cjs` |
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
Les 41 tests contrats/interface/commandes/service worker ont ensuite été relancés :
41 PASS, zéro skip. La dernière protection serveur des droits opérateur est
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
Cette ancienne base Claimable était uniquement la recette intermédiaire ; elle
n'est plus le stockage configuré depuis la création de la base permanente ci-dessous.

Le parcours site public compilé → lien « Espace patient / Sanad » → /sanad →
connexion avec le seul compte fort est PASS en mode de publication explicite.
L’ancien mot de passe public et un compte d’isolation désactivé renvoient 401.
[Preuve](proofs/final-site-entry.json), [capture](proofs/390-final-site-entry.png).
Les accès du testeur restent hors dépôt et hors captures.

Le retrait de partage ne propose plus une action refusée par la base : le bouton
est désactivé pour la version retirée, avec explication FR/AR/EN. Une nouvelle
version reste partageable. Test RED observé puis GREEN ; Chromium sur le build
compilé : retrait conservé après rechargement, nouvelle version partagée puis
retirée, état final privé, arabe RTL 360 pixels sans débordement.
[Preuve](proofs/withdrawn-sharing.json), [FR](proofs/withdrawn-sharing-fr-390.png),
[AR](proofs/withdrawn-sharing-ar-360.png).

## FAIL / limites connues

- Le domaine `mindcare-centre.com` et son `www` restent indisponibles en HTTPS
  depuis le poste ; la vérification titulaire/DNS nécessite l'action du titulaire.
  L'URL Vercel historique répond 200, l'alias d'équipe est protégé par SSO.
  Aucun de ces constats ne prouve la remise en service du domaine.

## État de livraison durable

La demande du 15 novembre impose un stockage sans expiration et un seul compte
test. Le seed standard crée désormais un compte et quatre objets d’autorité ;
les comptes d’isolation supplémentaires exigent --test-fixtures sur loopback.
L'ancienne base de recette comportait deux profils techniques désactivés. La base
permanente livrée contient exactement un profil, actif ; aucun second compte de
test n'y a été créé. Les essais d'isolation restent dans les bases techniques.

Le parcours de réponse du cabinet est terminé dans le dispositif synthétique :
message envoyé, reçu technique, réponse opérateur corrélée, lecture après
rechargement. Les réponses sont exclusivement opérateur, sans doublon, et
le message envoyé est immuable. Chromium contre le build final et PostgreSQL
17 distant : PASS ; arabe RTL 360 pixels sans débordement.
[Preuve](proofs/clinic-reply-flow.json), [capture FR](proofs/390-clinic-reply.png),
[capture AR](proofs/360-clinic-reply-ar.png).

Le compte Neon connecté est vérifié : organisation Ayoub, offre Free. La base
permanente `sanad_portal`, PostgreSQL 17, projet `morning-recipe-93493444` nommé
`mindcare-website`, appartient à cette organisation. La branche principale n'a pas
de champ d'expiration et n'est pas une ressource Claimable. Le seed distant crée
exactement un profil et quatre instantanés. Le mot de passe fort est conservé,
la date initiale publique renvoie 401. Le marqueur synthétique correspond ; le rôle
`sanad_runtime` n'a ni superuser, BYPASSRLS ni exécution des portes opérateur.

Recette réelle contre cette nouvelle base : écriture d'un journal fictif privé,
déconnexion, reconnexion et journal retrouvé. Chromium sur le build compilé :
site → lien Sanad → connexion → rechargement authentifié, largeur 390 sans
débordement. [Preuve](proofs/permanent-postgres.json),
[capture](proofs/permanent-site-entry.png).

Les quatre variables de preview utilisent cette base permanente. Nouveau déploiement
de `c26758e` : `dpl_3UFBhjssaQh4AQaUnhC51oT8QHWN` ; build READY vérifié.
Accès anonyme observé : 302 vers Vercel SSO. Aucun lien temporaire créé.
Le refus initial de production est levé par l'autorisation explicite de l'utilisateur :
« J'autorise la publication en production de Sanad dans le site existant. »
Le déploiement `dpl_EgtCCGhnjESqA1aUR5x7TbFzY7zm`, commit `d9dfe1a83ed8dbe1d2344ae5f13f2a4d36a92c1f`,
est READY en production et l'alias permanent `mindcare-website-eight.vercel.app`
le désigne. Aucune modification DNS, fusion Git ou protection contournée.

## PASS — recette HTTPS de production

[Site](https://mindcare-website-eight.vercel.app/) → lien Sanad →
[/sanad](https://mindcare-website-eight.vercel.app/sanad), sans lien temporaire.
Chromium réel contre Vercel et la base Neon permanente : page publique 200,
connexion avec le compte fort, cookie Secure/HttpOnly/SameSite Strict, réponses
privées no-store, bilan 7,5 heures sauvé par l'interface et retrouvé après reload,
journal sauvé par l'interface, partage puis retrait, nouvelle tentative du même
partage refusée 409, dialogue scénarisé, demande de rendez-vous pending,
document privé, override Gemini refusé 400, reconnexion avec toutes les données
retrouvées et partage toujours retiré. Ancien mot de passe public : 401.
Après déconnexion, état et document privés : 401. Aucune erreur JavaScript de page.

Arabe RTL 360 pixels et anglais desktop 1440 : aucun débordement. Service worker
activé ; son cache contient seulement sept ressources publiques, aucune API ou
donnée de session ; localStorage est vide. La lecture SQL finale confirme un
seul profil actif, un bilan, une conversation et un partage retiré dans la base
synthétique permanente. [Preuve](proofs/production-https.json),
[capture FR](proofs/production-fr-390.png), [capture AR](proofs/production-ar-360.png).

## NOT RUN / restant à terminer

- Stockage permanent, publication sur le site et recette HTTPS authentifiée : PASS,
  documentés ci-dessus ; aucun rattachement clinique.
- Téléphones physiques, clavier iOS/Android, lecteur d’écran, installation PWA
  et livraison des notifications application fermée : non vérifiés.
- Raccordement MindCare, écran Aftercare, transport durable de synchronisation,
  modèle réel, sauvegarde/restauration du futur PC et qualification clinique :
  hors de cette démonstration, non réalisés.

## Reprise

Lancement : [IMPLEMENTATION.md](IMPLEMENTATION.md). Préparation du raccordement :
[CONTRACTS.md](CONTRACTS.md) et [FUTURE-HOSTING.md](FUTURE-HOSTING.md).
La démonstration intégrée au site est livrée avec sa recette HTTPS. L'ouverture
aux vrais patients reste bloquée par les validations d'identité, sécurité, mineurs,
contenu, exploitation et raccordement ; aucune donnée clinique n'est nécessaire
pour poursuivre les essais synthétiques.

## Refonte Glass — publication du 15 novembre 2026

La demande de refonte remplace Jardin. Production dpl_GNM2gD7zewpVbDU8wbAyrKWXtin3, source 53d819a056d2645eca5c931175cf7e3cf82c4b5d : READY, alias permanent confirmé. Les anciennes captures ci-dessus sont historiques. Aucun changement de base, API, mot de passe ou nombre de comptes.

PASS : 195 nouveaux cas navigateur FR/AR/EN, cinq largeurs, 13 écrans ; aucun contrôle débordant ou sans label. Verre au pointeur, dock à ressort, transitions et vrai minuteur enregistrés en [vidéo](proofs/glass/sanad-glass-motion.webm). Préférence de mouvement modifiée en direct : RED puis GREEN. Lien d’évitement dégagé du header desktop/mobile ; contrastes échantillonnés 17,91:1 et 8,70:1. Exercice contrôlé après vrai rechargement hors ligne. [Accessibilité](proofs/glass/accessibility.json), [matrice](proofs/glass/browser-matrix.json).

PASS : build optimisé (178 kB au premier chargement Sanad), typecheck, lint ciblé, 19 tests UI/commandes/SW existants puis test de migration du cache RED→GREEN (3/3 SW). Aucune dépendance ajoutée. Quatre images Jardin/nuit supprimées ; aucun appel réseau vers elles. Cache v2 limité à cinq ressources publiques, purge uniquement des anciennes versions Sanad.

PASS : recette HTTPS du redesign : connexion, cookie sécurisé, bilan/journal sauvegardés puis relus, chat scénarisé, partage/retrait, demande pending, document privé et refus après déconnexion. [Preuve actuelle](proofs/glass/production-https.json), [FR](proofs/glass/production-fr-390.png), [AR](proofs/glass/production-ar-360.png).

DOMAINE NON RÉPARÉ : délégation vers verify-contact-details.namecheap.com / failed-whois-verification.namecheap.com et parking 198.54.117.242. Domaine vérifié dans Vercel ; /sanad répond 200 en HTTPS à son adresse Vercel avec TLS normal. Accès Namecheap non établi : aucun navigateur ouvert, lancement bloqué par expiration d’approbation Computer Use. Le connecteur Namecheap ne gère pas les comptes/DNS. Aucun DNS/mail/TXT modifié. [Diagnostic](proofs/glass/domain.json), [procédure Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/10698/46/what-to-do-if-my-domain-was-suspended-due-to-whois-verification-process/). La vérification du titulaire doit être terminée dans ce compte, puis les DNS restaurés contrôlés. Statut interne du compte non vérifié.

Téléphones physiques, lecteur d’écran réel et push fermé : NOT RUN. Raccordement clinique et modèle réel restent hors de cette livraison fictive.

## Healing, light/night and smart tools — 16 novembre 2026

Nouvel hôte permanent demandé : [sanad-mindcare.vercel.app](https://sanad-mindcare.vercel.app/), domaine Vercel vérifié attaché au projet existant. Aucun lien temporaire ni contournement de protection. Même base Neon permanente et unique compte fictif ; aucun schéma, rôle ou mot de passe modifié.

PASS local final : 38 tests ciblés, TypeScript, ESLint ciblé et build optimisé (18,8 kB / 181 kB premier chargement). Matrice réelle 390/390, 13 écrans × trois langues × cinq largeurs × deux thèmes ; 16 cas de chat court, huit cas de géométrie/focus, thèmes serveur/client vérifiés. Dix vérifications fonctionnelles et trois vérifications visuelles en temps réel : thème persistant, pause finie, reprise réelle de la même révision d’exercice et export personnel excluant les textes privés. [Détails et preuves](SMART-RELEASE.md).

Le nouveau cœur/souffle remplace le symbole 3D. Les suggestions reposent sur des règles expliquées et les saisies existantes ; aucun score clinique, donnée manquante imputée ou appel modèle. Le récapitulatif téléchargé n’est pas transmis au cabinet.

Ancien domaine personnalisé : la délégation publique Namecheap reste le blocage décrit plus haut. Nouvelle vérification navigateur : la page du registrar demande une connexion, aucune session de compte disponible. Aucun paramètre de registrar n’a été modifié. Le nouvel hôte Vercel est la voie d’accès permanente demandée, pas une preuve de réparation de mindcare-centre.com.

## PASS — nouvelle adresse Sanad en production

Publication dpl_Ea9sbmvnk1HngFfH1pMEmF2NsWyS, commit 4173cd282a9b1e5ab60bb6b68c7e5dcaa013e36d : READY. Alias permanent [Sanad](https://sanad-mindcare.vercel.app/) confirmé sur ce déploiement ; racine 307 vers /sanad, portail 200 privé no-store et site public d'origine 200.

11/11 vérifications Chromium HTTPS PASS, temps réel, sans réponse API simulée : thème serveur/client et reload, session sécurisée, reprise d’exercice avec même identifiant et version attendue, récapitulatif réellement téléchargé et exclusions privées, cache public uniquement et refus après déconnexion. [Preuve HTTPS](proofs/smart/production/production-proof.json), [identité du déploiement et unique profil](proofs/smart/production/deployment.json), [vidéo réelle](proofs/smart/production/sanad-healing-motion.webm).

L'accès de test fort est inchangé ; son fichier privé pointe vers la nouvelle adresse. La livraison demandée est publiée. Limites inchangées : modèle scénarisé, aucun raccordement clinique, pas de téléphone physique ni lecteur d’écran réel vérifié. L’ancien domaine Namecheap reste bloqué au registrar ; aucune réparation de sa délégation n’est revendiquée.
