# Sanad Jardin — démonstration privée

État du 15 novembre 2026. Le portail `/sanad` est une démonstration persistante
pour testeurs autorisés, avec un seul compte fictif à livrer. Le site
public et son chatbot restent distincts. Cette livraison ne raccorde aucun
cabinet et n'est pas qualifiée pour de vrais patients.

## Lancer la démonstration locale

Depuis `C:\MindCare\mindcare-website`, avec Node 24, les dépendances installées,
Docker actif et l'image `postgres:16-alpine` déjà disponible :

```powershell
npm ci
node scripts/sanad-local-demo.mjs --synthetic
```

Ouvrir [Sanad local](http://127.0.0.1:43862/sanad). Le lanceur crée un conteneur
PostgreSQL dédié sur un port loopback aléatoire, migre une base vide, charge les
fixtures et démarre Next sur `127.0.0.1:43862`. Les identifiants techniques sont
générés dans le processus et ne sont pas affichés. Il refuse un lancement cloud.

Garder le processus ouvert pendant les essais. `Ctrl+C` arrête le serveur et
supprime exclusivement son conteneur : les données de cette instance sont
jetables. Les saisies persistent après rechargement et reconnexion tant que
l'instance reste active ; un nouveau lancement recrée une démonstration neuve.
Ne pas employer ce lanceur comme hébergement permanent ou stockage clinique.
Après un build réussi, `node scripts/sanad-local-demo.mjs --synthetic --built`
utilise `next start` au lieu du serveur de développement, avec la même base jetable.

## Compte de test

| Profil | Identifiant de démonstration | Langue initiale |
| --- | --- | --- |
| Lina fictive | `+447700900001` | Français |

Ce numéro appartient à la plage de fiction Ofcom ; aucun appel ni SMS
n'est envoyé. Les dates de naissance initiales, au format `JJMMAAAA`, sont
définies dans les fixtures `profiles` de [sanad-db.mjs](../../scripts/sanad-db.mjs).
Elles servent de mots de passe initiaux uniquement pour ces comptes fictifs.
Le seul compte préparé pour le site possède désormais un mot de passe fort,
conservé dans un fichier privé hors dépôt. Le mot de passe initial public est
refusé. Les mots de passe sont hachés ; changement et réinitialisation révoquent les
sessions. Ce mode prévisible reste bloqué pour de vrais comptes ; activation,
récupération et droits des mineurs exigent une décision distincte.

Les tests d'isolation utilisent deux comptes supplémentaires uniquement dans une
instance locale jetable : `node scripts/sanad-local-demo.mjs --synthetic --test-fixtures`,
puis `node --test scripts/sanad-api.test.mjs`. Ces comptes ne font pas partie de la livraison.

## Configuration et stockage

Variables du service web : `SANAD_MODE`, `SANAD_DEMO_INSTANCE_ID`,
`SANAD_DATABASE_URL`, `SANAD_PATIENT_PROVIDER`. Le lanceur local les prépare.
Le marqueur synthétique en base et l'identifiant d'instance doivent correspondre
avant toute opération ; `VERCEL_ENV` de production est refusé par défaut.
La publication du compte fictif sur le site est préparée par l'option serveur
`SANAD_PUBLISH_FICTIONAL_TEST=true`, désactivée par défaut. Elle ne retire ni
le verrou synthétique ni la restriction aux identités de fiction. L'option ne
doit être activée qu'avec le stockage durable et le contrôle d'accès final.

Variables opérateur séparées : `SANAD_ADMIN_DATABASE_URL` et
`SANAD_RUNTIME_PASSWORD`. Elles ne doivent pas être transmises au service web,
au navigateur ou aux journaux. Aucun secret dans `NEXT_PUBLIC_*`. Pour une base
de test gérée séparément, suivre [le guide de base](../../db/sanad/README.md) ;
ne jamais réutiliser une connexion du cabinet.

L'interface utilise Next.js/React, les traductions françaises, arabes et
anglaises et des ressources auto-hébergées. Les routes `/api/sanad/*` valident
les commandes puis passent par les portes PostgreSQL. La session détermine le
patient côté serveur ; le rôle web n'accède pas directement aux tables. RLS
forcée, versions, reçus d'idempotence et audit protègent les écritures. Journal
et conversations restent privés ; le partage vise une révision précise et les
révisions suivantes ne sont pas partagées automatiquement.

## Ce que la démonstration permet

Aujourd'hui, suivi et tendances déclarées, bilan quotidien, journal guidé,
objectifs, prises déclarées, effets ressentis, préparation de rendez-vous,
demandes et messages simulés, conversation, exercices, favoris et réglages.
Les demandes restent en attente ; un reçu technique ne signifie pas lecture
médicale. Traitement inerte, rendez-vous, objectif prescrit et document viennent
exclusivement d'instantanés synthétiques. Aucune consigne clinique n'est inventée.

Le fournisseur patient est exclusivement un scénario écrit, signalé dans
l'interface et les réponses. Aucun appel Gemini, modèle local, SDK du chatbot
public, outil d'écriture clinique ou voix active n'est utilisé dans ce parcours.
La mémoire de préférences est visible et corrigeable ; désactivation et
suppression sont séparées. La préparation du contexte autorisé existe dans les
contrats, sans injection réelle d'un dossier dans un modèle.

Le service worker réserve son cache aux ressources statiques ; les réponses
authentifiées ne sont pas conservées. Le mode hors ligne générique n'affiche
aucun dossier et n'envoie aucun message. Les notifications fermées et les
contacts d'aide non vérifiés restent à configurer ; aucune surveillance continue.

## Livraison et raccordement ultérieurs

La base permanente PostgreSQL 17 `sanad_portal` appartient au compte Neon connecté,
organisation Ayoub sur offre Free : projet `morning-recipe-93493444`, nommé
`mindcare-website`, région `aws-eu-central-1`, branche `br-dark-term-ba1trh4g`.
Elle n'est pas Claimable et sa branche n'a pas de date d'expiration. Les limites
et conditions de disponibilité de l'offre Free restent applicables.

Les trois migrations sont appliquées. Cette base contient exactement un profil
fictif, quatre instantanés d'autorité et un journal de recette privé. Le mot de
passe fort déjà fourni est conservé ; la date initiale publique est refusée.
Connexion poolée TLS `verify-full`, rôle web sans propriété, superuser, BYPASSRLS
ni exécution des portes opérateur. Aucun secret opérateur n'est transmis à Vercel.

Les quatre variables Sanad de preview du projet Vercel existant utilisent désormais
cette base permanente. Le code livré reste celui de `c26758e` et Sanad appartient
au site sous `/sanad`. La nouvelle preview protégée est
https://mindcare-website-emts0a45b-ayoubsmi1003-beeps-projects.vercel.app/sanad.
Aucun lien temporaire ou contournement de protection n'est créé.

La revue automatique a refusé la configuration de production : le brief exige
une instruction explicite de publication. Aucun changement de production ou DNS
n'est appliqué. La publication finale et sa recette HTTPS restent à terminer après
cette autorisation. L'ancienne base Claimable de recette n'est plus le stockage
configuré ; elle reste distincte et expirera selon ses conditions initiales.

Les contrats, autorités, révocations et limites sont dans
[CONTRACTS.md](CONTRACTS.md). Le PC dédié, HTTPS, accès distant, sauvegarde et
restauration sont préparés dans [FUTURE-HOSTING.md](FUTURE-HOSTING.md). Aucun écran
Aftercare MindCare ni migration clinique n'est inclus. Les preuves et les
contrôles restant à faire sont dans [VERIFICATION.md](VERIFICATION.md).
