# Contrats Sanad / MindCare — dispositif synthétique v1

Ces contrats préparent le raccordement. Ils ne synchronisent aucun cabinet :
`lib/sanad/contracts/schemas.ts`, `sync.ts` et `provider.ts` forment un dispositif
de développeur en mémoire, sérialisable pour les tests. Le portail persiste ses
données synthétiques via ses propres portes PostgreSQL ; le récepteur de contrats
n'est pas branché sur une base clinique. Aucun écran Aftercare MindCare ni
migration clinique n'est livré ici.

## Autorité et identité

| Émetteur authentifié | Objets dont il fait autorité |
| --- | --- |
| MindCare | Identité/rattachement, traitement validé, consigne, rendez-vous confirmé, objectif prescrit, document partagé |
| Sanad | Bilan, prise déclarée, effet ressenti, message, demande en attente, révision de journal/conversation explicitement partagée |

`patientId` est un identifiant stable ; `bindingId` identifie le rattachement vérifié.
Un téléphone n'est jamais une clé patient. `receiveEvent(state, payload,
verifiedBinding, verifiedSender)` exige le périmètre et l'autorité émettrice en
arguments séparés. Un champ `source`, une URL ou un en-tête client ne les prouve
pas. Le futur adaptateur devra authentifier le service distant, vérifier le
rattachement et déterminer ces arguments côté serveur. Il reste à réaliser.
Un patient ne peut pas publier une prescription, même en écrivant `source: mindcare`.

## Enveloppe et données minimales

Chaque événement porte `schemaVersion: 1`, `eventId`, `correlationId`, `patientId`,
`bindingId`, `objectId`, `version` entière positive, `effectiveAt`, `emittedAt`,
`source`, `shareState: shared | revoked` et un `object` strict discriminé par `kind`.
`lastSyncedAt` est facultatif et technique. Les dates sont ISO avec fuseau ;
l'affichage et les limites journalières se calculent en `Africa/Algiers`.
Les champs inconnus et versions de schéma non reconnues sont rejetés.

Le traitement exige `name`, son état `active | paused | stopped`, sa période
`validFrom` / `validUntil`, ses horaires explicites, `asNeeded` et
`remindersAuthorizedUntil`. `dose`, `route` et `instructions` sont facultatifs :
ils restent absents si la source ne les fournit pas. Aucune posologie, voie ou
heure n'est déduite du nom, ni récupérée dans une prescription antérieure.
Chaque événement contient un instantané complet ; `version` identifie sa version
source, sans seconde version concurrente dans l'objet.
L'observance référence `treatmentObjectId` et `treatmentVersion`, préserve
`taken | forgotten | not-taken | unknown`, une raison facultative et `scheduledAt`
seulement si un horaire est connu ; elle n'écrit jamais dans le traitement.

Une demande de rendez-vous reste `pending` ; seul un événement MindCare peut
apporter un rendez-vous confirmé ou annulé. Les documents référencent un
`documentId` et un titre ; le contrat ne transporte ni fichier libre ni URL publique.
Le futur téléchargement devra vérifier le partage et le patient à chaque accès.

### Mapping du stockage synthétique vers le contrat

Les clés ci-dessous correspondent à `commands.ts`, `server/backend.ts` et aux
instantanés de `scripts/sanad-db.mjs`. Les tests construisent et valident ces
objets ; aucun adaptateur au cabinet n'est activé.

| Source synthétique | Objet de contrat / règle |
| --- | --- |
| `record.id`, `record.version` | `objectId`, `version`. Le `sourceVersion` du corps traitement est une copie de cette version, pas un compteur séparé ; un futur adaptateur devra refuser leur désaccord. |
| `body.shared`, `body.lastSyncedAt` | `shareState` (`true → shared`, `false → revoked`), `lastSyncedAt` dans l'enveloppe. Ne jamais interpréter un partage absent comme accordé. |
| `treatment` | `kind: treatment`, champs nom/dose/voie/consignes/validité/horaires repris explicitement, sans `sourceVersion`, `shared`, `lastSyncedAt` dans l'objet. |
| `appointment` | `kind: appointment`, `startsAt`, `confirmedAt`, `status`, `location` facultatif. `date` et `startTime` sont des représentations locales en `Africa/Algiers` de `startsAt`, jamais des dates indépendantes. |
| `prescribedGoal` | `kind: doctor-goal`, `title`, `status` (`active/completed/withdrawn`), `targetDate` et `instructions` si fournis. Un objectif personnel reste distinct et ne devient pas une prescription. |
| `document` | `kind: shared-document`, `documentId = record.id`, `title`, métadonnées vérifiées facultatives `mediaType`, `fileName`, `sizeBytes`, `publishedAt`. `contentKey` reste une clé de résolution serveur privée, jamais une URL publique ; ne pas inventer de taille ou date absente. |
| `checkin` | `kind: checkin`, `date`, `mood` (`difficult/mixed/calm`), `anxiety` et `energy` (`low/medium/high`), `sleepHours` (0–24), `effects`. Réponses facultatives, au moins une observation ; `recordedAt = record.updatedAt`. Aucun diagnostic ou score. |
| `adherence` | `treatmentId → treatmentObjectId`, version réellement référencée → `treatmentVersion`, `status: not_taken → declaration: not-taken`, `taken/forgotten` inchangés ; `reason` et `scheduledAt` facultatifs. Aucun horaire inventé pour une prise au besoin. |
| `adverse`, `message`, `request` | `effect` avec `recordedAt = updatedAt` et texte ; `message` envoyé avec texte ; `request` avec `category → requestType`, texte et état `pending`. Un brouillon n'est pas transmis. La démonstration reste simulée. |
| `journal`, `conversation` | Partage de la version exacte sélectionnée : `revision = record.version`. Texte représentant exactement cette révision (champs guidés ou messages), aucune synthèse ajoutée ; révocation sans texte. |

Le rattachement, l'autorité, l'identifiant d'événement et sa corrélation proviennent
du service vérifié. `emittedAt` date l'émission ; `effectiveAt` vient de la date
d'effet explicite de la source. La date de réception ne remplace jamais une date
clinique manquante. Le mapping de transport doit refuser les métadonnées requises
absentes, puis passer le résultat dans `EventSchema`.

## Répétitions, reprise et ordre

- `eventId` identique + contenu identique : accusé `duplicate`. Un contenu différent
  sous le même identifiant est un conflit. Une version d'objet déjà utilisée sous
  un autre événement est aussi un conflit, sans écrasement silencieux.
- Le récepteur conserve versions, empreintes et événements nécessaires à la
  chronologie d'effet. Une version ancienne reçoit `stale` mais peut compléter
  l'histoire avant une modification future. Elle ne remplace jamais un arrêt ou
  une pause déjà effective de version supérieure.
- `currentObject(..., now)` choisit la plus haute version dont `effectiveAt <= now`.
  Un arrêt futur reçu avant l'état actif antérieur n'efface donc pas la période
  active. Les dates d'effet doivent être définies par la source autoritaire.
- L'accusé contient `eventId`, `correlationId`, `status` et `technicalOnly: true`.
  Il indique un résultat technique, jamais une lecture ou validation médicale.
- Les tests sérialisent/restaurent l'état et rejouent les événements. Ce n'est pas
  un mécanisme durable de livraison. Le futur transport devra ajouter une outbox,
  des reçus atomiques avec les écritures, un curseur de reprise, des retries bornés
  et un traitement des conflits ; accuser seulement après commit durable.
  Aucune hypothèse de livraison « exactement une fois ».

## Partage et révocation

Le journal et la conversation sont privés par défaut dans le portail. Le contrat
ne reçoit que les révisions choisies pour le partage ou leur révocation. Une
révision partagée comporte `revision` et `text` ; sa révocation ne comporte aucun
texte. Une modification exige une nouvelle révision et un nouveau choix de partage.

Une empreinte rend le contenu d'une même révision immuable, même sous une nouvelle
version d'objet. Révoquer cette révision pose un tombstone et purge tous ses textes
retenus. Cette révocation est appliquée même si sa version d'objet est retardée ;
un ancien partage ne peut pas la ressusciter. Les autres révisions explicitement
partagées restent distinctes. Les tombstones et empreintes survivent à la
sérialisation ; aucune trace d'audit du dispositif ne contient le texte purgé.

`buildPatientContext` est une préparation côté serveur, non un accès autonome aux
données : même patient/rattachement, audience patient, révision courante, source
non révoquée et grant `patient-ai` pour la révision exacte. Une révocation prime
sur un grant actif contradictoire. Les notes privées de la docteure et les autres
patients sont exclus. La mémoire dérivée perd l'accès dès qu'une provenance perd
son autorisation. Désactiver la mémoire exclut ses éléments du contexte sans les
supprimer ; correction et suppression sont séparées.

Le scénario actuel ne charge ni dossier, ni journal, ni mémoire dans un modèle.
Ces fonctions ne prouvent pas une intégration IA réelle. Un retrait empêche les
accès futurs ; il ne peut retirer ce qu'un destinataire a déjà lu ou ajouté à un
dossier autorisé. Conservation, mineurs et représentation restent à valider.

## Création en un bouton : contrat réservé aux développeurs

`provisionSyntheticAccount` exige une autorité docteure séparée du payload,
le patient/rattachement vérifié, `operationId`, consentement au portail daté,
identité vérifiée, `synthetic: true` et `phoneStatus: unique-test`.
Numéro absent, invalide, partagé ou déjà associé de façon ambiguë : résolution
humaine, jamais rattachement automatique. Aucune assistante n'hérite de ce droit.

Résultats : `created`, `already-exists`, puis `duplicate` au rejeu identique.
Même `already-exists` réserve l'opération et crée une trace sans secret ; réutiliser
son identifiant pour une autre demande échoue. Un rattachement contradictoire
échoue. Cette fixture ne crée ni identifiants de connexion ni accès réel.
Le véritable compte synthétique passe par les portes opérateur du portail ;
aucun bouton n'est ajouté au logiciel du cabinet.

## Fraîcheur, rappels et futur tableau docteure

Une ancienne `lastSyncedAt` ne révoque pas une prescription. Les rappels exigent
un traitement partagé actif, une période de validité en cours, des horaires
explicites, hors « au besoin », et une autorisation de rappel non expirée.
Sans autorisation ou après son échéance, ils sont suspendus ; aucune durée clinique
arbitraire n'est inventée. Arrêt, pause ou révocation les rendent inéligibles.
Ce calcul ne livre aucune notification lorsque l'application est fermée.

Le futur écran docteure pourra afficher : dernière synchronisation, dernier bilan,
tendances avec jours manquants, prises déclarées, effets ressentis, demandes en
attente et éléments partagés. Il distinguera source, date et limites des synthèses.
Aucune donnée manquante ne signifie « tout va bien » ou « danger ». Consultation
aux horaires configurés, sans surveillance continue ni score automatique ; les
droits d'assistante devront être définis séparément.

## Vérification reproductible

Node 24, dépendances du dépôt installées :

```powershell
node --experimental-strip-types --test lib/sanad/contracts/contracts.test.mjs
```

Le hook de résolution `.ts` reste dans le test ; les imports TypeScript de
l'application conservent les conventions Next. Les scénarios couvrent autorité,
isolation, doublons, conflits, arrêt futur reçu dans le désordre, révocation
retardée, contenu immuable, reprise sérialisée, provisioning et contexte privé.
Le fournisseur `scenario` reste identifiable, sans SDK IA ni appel réseau ;
Gemini et le fournisseur local sont refusés pour le parcours patient actuel.
Les tests ne qualifient ni un modèle réel ni une synchronisation clinique.
