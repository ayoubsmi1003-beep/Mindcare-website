# Base du site — constat et limites

- Dépôt : https://github.com/ayoubsmi1003-beep/Mindcare-website ; main e4ba4f65e2c760e549c64f61ba7b6a6adaddde41.
- Branche locale de travail : codex/sanad-aftercare ; dépôt C:\MindCare\mindcare-website.
- Vercel : mindcare-website, projet prj_I4CaXYL5C3GdV0aXgDPSaXhiWA4e, déploiement CLI dpl_3PvJMyiTujLuY7smjozcRTq6zg7t, READY.
- Les métadonnées Git du déploiement ne prouvent pas son contenu : son arbre comporte notamment les API booking/clinic-bridge, des services de réservation et quatre fichiers de tests absents de main. Préserver ces changements avant toute livraison modifiant le site existant.
- Le connecteur a retourné 84 réponses de fichiers sur 85 ; de nombreuses chaînes base64 sont explicitement tronquées à 2 000 caractères. Elles ne constituent pas une sauvegarde restaurable. AUCUN de ces contenus tronqués n’a été appliqué. L’illustration hero.svg, trop volumineuse pour le connecteur, a néanmoins un SHA-1 brut identique à la copie GitHub : ba9a9d066866a8b3d75c2cc3d5b33d007fb80a39.
- Aucun checkout complet des correctifs déployés retrouvé dans les emplacements inspectés. La réconciliation reste ouverte ; ne pas publier une régression de réservation depuis la seule copie main.
- Aucun secret consulté, aucune base du cabinet contactée, aucune ressource distante créée, aucun domaine modifié.

## Domaine

L’URL historique mindcare-website-eight.vercel.app répond HTTP 200. L’alias d’équipe est protégé par SSO. Le domaine apex et www mindcare-centre.com échouent en HTTPS depuis le poste ; DNS 198.54.117.242, serveurs failed-whois-verification.namecheap.com et verify-contact-details.namecheap.com, Vercel misconfigured=true. L’hypothèse de suspension de vérification titulaire est étayée par la documentation officielle Namecheap ; sa résolution nécessite l’action du titulaire dans son compte. Aucune panne applicative générale ni réparation publique n’est déduite de ces seuls contrôles.
