# Base synthétique Sanad

Ces migrations visent exclusivement une base **vide dédiée**, nommée `sanad_*`.
Aucun accès au cabinet et aucune reprise des variables PostgreSQL d'un autre produit.
Le service refuse `VERCEL_ENV=production`. Son chargement n'ouvre aucune connexion.

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

Le lanceur applique `001_synthetic.sql` puis `002_function_privileges.sql`.
La seconde retire les droits implicites `PUBLIC EXECUTE` des fonctions existantes
et des futures fonctions du propriétaire. Une révocation limitée au schéma ne
retire pas le défaut global de PostgreSQL. Les droits web explicites sont conservés.
Pour une instance synthétique déjà initialisée avec 001, appliquer seulement 002
avec le rôle opérateur, sans rejouer la création ni les fixtures. La porte serveur
refuse un rôle web ayant accès aux fonctions opérateur.

```powershell
node scripts/sanad-db.mjs migrate --synthetic
node scripts/sanad-db.mjs seed --synthetic
```

La commande seed crée trois profils fictifs indépendants (dont un adolescent), dans la plage
de fiction `+447700900001` à `+447700900003`. Leurs dates initiales sont des scénarios de
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
