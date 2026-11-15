# Base du site — constat et limites

- Dépôt : https://github.com/ayoubsmi1003-beep/Mindcare-website ; main e4ba4f65e2c760e549c64f61ba7b6a6adaddde41.
- Branche locale de travail : codex/sanad-aftercare ; dépôt C:\MindCare\mindcare-website.
- Vercel : mindcare-website, projet prj_I4CaXYL5C3GdV0aXgDPSaXhiWA4e, déploiement CLI dpl_3PvJMyiTujLuY7smjozcRTq6zg7t, READY.
- Les métadonnées Git du déploiement ne prouvent pas son contenu : son arbre comporte notamment les API booking/clinic-bridge, des services de réservation et quatre fichiers de tests absents de main. Préserver ces changements avant toute livraison modifiant le site existant.
- Réconciliation du 15 novembre : **84 fichiers originaux sur les 85 du manifeste Vercel sont retrouvés et vérifiés par SHA-1 des octets bruts**. Cela couvre tous les fichiers exécutables du site déployé, son interface de réservation et son chatbot. Le seul original non retrouvé est l’ancien `package-lock.json` ; la branche conserve son verrou de dépendances courant avec les ajouts Sanad. Ce verrou doit être qualifié par installation/build, pas présenté comme identique à celui d’octobre.
- Preuve de référence : `deployed-source-hashes.json`, arbre `src` obtenu par `list_deployment_files` sur le déploiement identifié ci-dessus. `source-reconciliation.json` donne, pour chacun des 85 chemins, le hash Vercel, les hashes des candidats initiaux, le hash original retrouvé, son origine et le hash courant de la branche. SHA-1 sert ici à comparer des copies identifiées ; ce n’est ni un hash de blob Git ni une garantie de sécurité cryptographique.
- Le checkout `G:\.claude\projects\Final mindcare\.worktrees\mindcare-website` a été consulté **en lecture seule**. Il ne correspondait qu’à 34 fichiers du déploiement ; huit fichiers manquants dans la branche cible ont pu y être repris exactement. Il n’a pas été copié en bloc. Ses suppressions locales de composants et bibliothèques historiques ne correspondent pas au manifeste déployé ; **aucune suppression n’a été reprise**.
- Les autres originaux proviennent de Git main, de réponses Vercel complètes et de modifications de source historiques ciblées : sessions `01a131a1-237d-7a33-a087-fcda51ce405c` et `01a13716-506f-7023-8885-46e09ba51740`. La source temporaire historique `website-current-github` avait disparu du poste. Ses patches réussis et écritures de fichiers ont été rejoués dans un espace temporaire limité aux chemins du manifeste. Chaque résultat a été accepté uniquement après égalité du hash brut attendu, y compris après correction des seules lignes vides ajoutées par le rejeu. Aucun contenu de journal non pertinent n’a été recopié dans le dépôt.
- Les réponses Vercel tronquées à 2 000 caractères ne sont pas restaurables : **aucune n’a été appliquée**. Elles ont seulement servi à identifier une limite du connecteur. Les grandes sources ont été restaurées depuis les écritures historiques puis vérifiées intégralement par leur hash.
- La branche contient **81 fichiers identiques au déploiement**. Quatre différences sont intentionnelles et recensées : navigation vers Sanad ; ajout de `pg` et `@types/pg` ; verrou de dépendances courant ; en-tête `Service-Worker-Allowed` du service worker Sanad dans `next.config.ts`. Aucun redesign public n’a été ajouté pendant la restauration.
- Aucun secret consulté, aucune base du cabinet contactée, aucune ressource distante créée, aucun domaine modifié.

## Vérification de la restauration

**PASS** : les quatre suites originales du site public, 12 tests, zéro échec et zéro skip :

```sh
node --test scripts/booking-current.test.mjs scripts/booking-ui.test.mjs scripts/public-chat.test.mjs scripts/gemini-fallback.test.mjs
```

Ces tests vérifient notamment les préférences horaires, le minimum de données de la demande, les états de reçu, le filtrage du chatbot et les replis Gemini. Ils ne prouvent pas un envoi réel au cabinet, le fonctionnement d’un fournisseur IA réel ou la résolution du domaine. Le build et la vérification navigateur de la branche intégrée relèvent du rapport de livraison Sanad.

## Domaine

L’URL historique mindcare-website-eight.vercel.app répond HTTP 200. L’alias d’équipe est protégé par SSO. Le domaine apex et www mindcare-centre.com échouent en HTTPS depuis le poste ; DNS 198.54.117.242, serveurs failed-whois-verification.namecheap.com et verify-contact-details.namecheap.com, Vercel misconfigured=true. L’hypothèse de suspension de vérification titulaire est étayée par la documentation officielle Namecheap ; sa résolution nécessite l’action du titulaire dans son compte. Aucune panne applicative générale ni réparation publique n’est déduite de ces seuls contrôles.
