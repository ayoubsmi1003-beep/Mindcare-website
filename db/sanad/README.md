# Base synthétique Sanad

La création initiale vise une base **vide dédiée**, nommée `sanad_*`. La mise à niveau 004 vise cette même base synthétique déjà peuplée.
Aucun accès au cabinet et aucune reprise des variables PostgreSQL d'un autre produit.
Le service refuse `VERCEL_ENV=production` par défaut. L'ouverture demandée du seul
compte fictif sur le site exige l'option serveur `SANAD_PUBLISH_FICTIONAL_TEST=true`.
Elle conserve obligatoirement la base `sanad_*`, le marqueur synthétique, les
numéros réservés à la fiction et tous les contrôles de rôle. Elle n'autorise
aucun vrai compte patient. Son chargement n'ouvre aucune connexion.

Variables serveur : `SANAD_MODE=synthetic`, `SANAD_DEMO_INSTANCE_ID` (UUID stable),
`SANAD_DATABASE_URL` (connexion du rôle `sanad_runtime`, jamais administrateur).
Conserver la validation TLS du fournisseur pour toute connexion distante.
Le marqueur synthétique en base est immuable ; une différence d'instance bloque les portes SQL.

L'opérateur fournit séparément `SANAD_ADMIN_DATABASE_URL` et, pour la migration,
`SANAD_RUNTIME_PASSWORD` (au moins 24 caractères). Ces variables ne vont jamais dans Vercel
avec le service web et ne sont jamais affichées. Le compte opérateur doit pouvoir créer les
rôles et devenir `sanad_owner`. Ne pas réutiliser une base ou un propriétaire existant.

Sur un PostgreSQL géré, le rôle opérateur doit être membre de `sanad_owner` avec
le droit `SET ROLE`. La création du rôle seule ne suffit pas. Cette autorisation
opérateur ne doit jamais être accordée à `sanad_runtime`.

Le lanceur applique `001_synthetic.sql`, `002_function_privileges.sql`, puis `003_clinic_replies.sql`.
La seconde retire les droits implicites `PUBLIC EXECUTE` des fonctions existantes
et des futures fonctions du propriétaire. Une révocation limitée au schéma ne
retire pas le défaut global de PostgreSQL. Les droits web explicites sont conservés.
Pour une instance synthétique déjà initialisée avec 001, appliquer seulement 002
avec le rôle opérateur, sans rejouer la création ni les fixtures. La porte serveur
refuse un rôle web ayant accès aux fonctions opérateur.

`003_clinic_replies.sql` ajoute les réponses de test du cabinet, corrélées à un
message envoyé du même compte et réservées à l'opérateur. Le message envoyé
devient immuable ; une correction passe par un nouveau message. `reply` lit sur
stdin les vérifications habituelles, `profileId`, `messageId`, `id` UUID stable
et `text`. Une répétition identique ne crée pas de doublon. L'interface affiche
la réponse comme simulation ; aucun service du cabinet n'est contacté.

```powershell
node scripts/sanad-db.mjs migrate --synthetic
node scripts/sanad-db.mjs seed --synthetic
```

La commande seed crée uniquement le profil fictif Lina, `+447700900001`.
Les deux comptes d'isolation supplémentaires sont réservés aux tests locaux :
`seed --synthetic --test-fixtures`, refusé pour une base distante.
Les dates initiales sont des scénarios de
développement définis dans le script ; aucun mot de passe n'est affiché. Un doublon échoue,
sans fusion et sans réinitialisation implicite. Les quatre instantanés d'autorité par profil
(produit inerte sans posologie réelle, rendez-vous, objectif et document `welcome`) proviennent
uniquement de l'émetteur synthétique. Aucun rappel n'est autorisé par ces fixtures.

`provision`, `reset` et `receive` lisent un objet JSON sur stdin avec `synthetic`,
`identityVerified`, `consentVerified` strictement `true`. Provision exige `phone`,
`displayName`, `locale` et `initialDob` au format JJMMAAAA ; reset exige `profileId` et
`initialDob` ; receive exige `profileId`, `id` UUID stable, `kind`, `version`, `body`.
L'audit conserve le fait de la vérification, l'action, l'identifiant et la version,
jamais le texte patient, le téléphone, la date initiale ou un secret.

Les instantanés d'autorité non partagés sont filtrés dans la porte SQL de lecture,
sans envoyer leur contenu au navigateur. Une déclaration de prise exige un traitement
actif partagé, sa version courante vérifiée et une date comprise dans sa validité ;
elle ne dépend pas d'une autorisation de notification push. La version source est
capturée par SQL. Une correction historique conserve traitement, version et horaire
initiaux, même après arrêt ou révocation ; seuls statut et motif peuvent changer.

Les portes métier déterminent le patient depuis la session hachée et verrouillée.
`sanad_runtime` n'a ni droits directs sur les tables ni exécution des portes opérateur,
ni propriété, superuser ou BYPASSRLS. Les tables métier ont RLS forcé. Chaque correction
ajoute une révision ; le partage vise une révision précise et une révocation est définitive
pour cette révision. Les reçus d'idempotence n'autorisent aucune lecture d'un autre compte.

Tests réels isolés, Docker disponible et image `postgres:16-alpine` requise :

```powershell
node --experimental-strip-types --test lib/sanad/server/crypto.test.mjs lib/sanad/server/integration.test.mjs
```

Le test démarre son propre conteneur sur un port aléatoire loopback et supprime exclusivement
ce conteneur dans finally. Aucun service existant n'est arrêté. Les conditions cloud,
la protection Vercel et la qualification clinique ne sont pas établies par ces tests.


## Mise à niveau 004 sans réinitialisation

Après sauvegarde privée vérifiée, fournir les variables opérateur existantes
`SANAD_ADMIN_DATABASE_URL`, `SANAD_DEMO_INSTANCE_ID`, `SANAD_MODE=synthetic`, puis :

```powershell
node scripts/sanad-db.mjs upgrade --synthetic
```

Ne pas lancer `seed`, `reset` ou `migrate` sur une base existante. `upgrade` ne
nécessite pas `SANAD_RUNTIME_PASSWORD` et ne change aucun identifiant, compte,
mot de passe, contenu, révision ou partage existant. Il vérifie le marqueur de
l'instance et la présence de 003, prend un verrou de migration, applique 004 dans
une transaction et conserve son SHA-256 dans `sanad.schema_migrations` inaccessible
au rôle web. Une nouvelle exécution est sans effet ; une empreinte différente
échoue avec `CONFLICT` et annule la transaction. 001–003 restent immuables.
Les nouvelles installations via `migrate` incluent 004 automatiquement.

004 ajoute les fiches privées `thoughtRecord` et `consent`, les validations SQL,
la préparation liée à la version courante d'un rendez-vous confirmé partagé,
le résumé des sessions sans jetons et la révocation idempotente des autres
sessions. Seuls journal et conversation acceptent de nouveaux partages ; le
propriétaire peut toujours révoquer un partage historique d'un autre type.
L'horodatage `consent.body.recordedAt` est exclusivement produit par SQL.
