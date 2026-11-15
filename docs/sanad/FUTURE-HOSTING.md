# Installation future sur le PC dédié du cabinet

Ce document décrit des travaux à préparer, pas une installation exécutée.
La livraison actuelle utilise uniquement des données fictives et un dialogue
scénarisé. Aucune connexion, migration, copie de base ou activation du modèle du
cabinet n'est autorisée par ce document. Le contrat de raccordement est dans
[CONTRACTS.md](CONTRACTS.md).

## Topologie cible à qualifier

```text
Téléphone patient → HTTPS public → proxy/TLS → service web/API Sanad
                                             ├─ PostgreSQL privé Sanad
                                             ├─ adaptateur authentifié MindCare
                                             └─ fournisseur IA local autorisé
```

Le navigateur accède uniquement aux API HTTPS. PostgreSQL écoute sur une
interface privée/loopback et n'est jamais exposé à Internet ; aucune redirection
de port de base sur le routeur. Le service web emploie un rôle de moindre
privilège ; les identifiants d'administration restent hors de son environnement.
Le logiciel du cabinet conserve l'autorité sur ses écritures cliniques via ses
portes existantes. Sanad ne lit pas directement ses tables depuis le navigateur
et ne fusionne pas une déclaration patient avec une prescription.

Le site public peut rester hébergé séparément. Avant de déplacer une route,
définir explicitement le nom de domaine, la séparation des sessions, les origines
autorisées et le chemin des données. Le choix d'un hébergeur, tunnel ou service
DNS ne vaut pas autorisation de lui transmettre des données de santé.

## Accès distant, HTTPS et exploitation Windows

- Choisir un accès entrant administré compatible avec la connexion du cabinet
  (IP publique ou CGNAT à vérifier). Documenter les acteurs intermédiaires et
  leurs accès ; aucun tunnel improvisé vers la base ou l'administration.
- Installer un reverse proxy avec certificat reconnu et renouvellement
  automatique testé. HTTPS obligatoire, cookies sécurisés, origine autorisée,
  limites de taille et débit, protections de session et révocation conservées.
- Authentifier séparément les échanges entre services, avec rotation/révocation
  des identifiants et prévention du rejeu. Déduire l'autorité émettrice des
  identifiants vérifiés, jamais du `source` fourni dans le message.
- Exécuter web, base et futur modèle comme services Windows sous comptes dédiés,
  avec démarrage automatique, reprise après panne et permissions minimales.
  Tester un redémarrage réel, la reconnexion réseau et les droits du compte de
  service. Aucun terminal utilisateur ouvert ne constitue un service.
- Maintenir Windows, Node, PostgreSQL et le proxy avec une procédure de mise à
  jour et retour arrière testée. Ne pas remplacer ni modifier l'installation
  MindCare existante sans mission distincte.

Le PC doit rester allumé, connecté et protégé contre la mise en veille ; vérifier
son alimentation, l'espace disque et le besoin d'onduleur. Définir les plages de
maintenance et afficher un état indisponible utile côté patient. Débit montant,
charge concurrente, temps du modèle et interruptions doivent être mesurés avant
toute promesse de disponibilité. Aucune garantie 24 h/24 n'est acquise.

## Sauvegarde et récupération

Définir les pertes et délais de récupération acceptables avec la responsable.
Prévoir sauvegardes PostgreSQL cohérentes et chiffrées, copie indépendante de la
machine, contrôle de succès, capacité disque et rotation validée. Les éventuels
documents contrôlés et la configuration nécessaire à la restauration doivent
être inclus sans disperser les secrets dans les exports ou journaux.

Protéger séparément les clés de chiffrement et les accès de récupération.
Tester une restauration sur une installation isolée, avec vérification de
l'intégrité, des rattachements, des accès et des tombstones de révocation.
Une commande de sauvegarde réussie seule ne prouve pas une restauration possible.
La durée de conservation, les destinations et les accès doivent être validés
avant usage réel ; aucun transfert de dossier vers un service externe par défaut.

## Portabilité et garde-fous actuels

Le service conserve Next.js et PostgreSQL. Les valeurs sont configurées côté
serveur ; aucune URL de base, clé modèle ou clé opérateur dans `NEXT_PUBLIC_*`.
La démonstration utilise `SANAD_MODE=synthetic`, `SANAD_DEMO_INSTANCE_ID` et
`SANAD_DATABASE_URL` avec vérification du marqueur synthétique en base avant les
opérations. L'opérateur utilise une connexion distincte. Ne jamais remplacer
ces valeurs par une base clinique pour « essayer » le raccordement.

`VERCEL_ENV=production` bloque actuellement les opérations Sanad. Un futur mode
clinique exige un travail explicite sur l'activation, l'authentification, les
contrats et leur qualification ; il ne consiste pas à enlever ce verrou.
Le mot de passe initial prévisible de la démonstration reste interdit pour les
vrais comptes sans décision sur activation, récupération et vérification
d'identité. Les droits des mineurs et représentants restent à valider.

Le fournisseur patient actuel est uniquement `scenario`, clairement étiqueté.
Ni Gemini ni le modèle local ne sont activables dans ce parcours par une variable
de configuration. Le futur fournisseur local devra implémenter une frontière
serveur contrôlée : contexte minimum autorisé, grants par révision, retraits
effectifs dans les synthèses/mémoires, délais, annulation et limites de débit.
Il n'aura aucun outil d'écriture de prescription, ordonnance ou agenda confirmé.
Le chatbot public existant constitue un flux séparé ; aucune donnée patient ne
doit y être relayée.

## Notifications et vérifications avant ouverture

Les rappels fermés nécessitent un ordonnanceur durable et un fournisseur push
qualifié, un consentement, des horaires silencieux et un texte neutre. Tester
iOS/Android installés et fermés, expiration, révocation et panne réseau. Un timer
d'onglet ne suffit pas. Aucun SMS, e-mail ou WhatsApp sortant n'est prévu ici.

Avant ouverture réelle : qualifier le mapping MindCare et le rattachement sans
ambiguïté, le transport/rejeu/reprise, l'isolation et le partage révoqué, les
comptes et leur récupération, la restauration, l'accès distant, le redémarrage,
la charge et les parcours mobiles. Faire valider contenu, consentement,
conservation, mineurs, horaires et délais du cabinet. Les coordonnées d'aide
doivent être vérifiées ; aucune surveillance continue ou alerte automatique
n'est promise. Le modèle réel exige sa propre évaluation multilingue et clinique.

Ces vérifications, le déploiement sur PC et le raccordement réel restent **NOT
RUN** dans cette mission. Une preview privée fonctionnelle ne remplace aucun de
ces contrôles.
