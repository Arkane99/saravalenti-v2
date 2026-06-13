# Etat d'avancement Sara Valenti V2

Mettre a jour ce fichier en fin de chaque session (fait / en cours / blocages). C'est la memoire inter-sessions du projet.

## Fait

- Repo V2 cree (Arkane99/saravalenti-v2), 278 photos produits dans public/images/produits/.
- Brief complet persiste (docs/BRIEF-PHASE5.md) + CLAUDE.md operationnel.
- CSV des 88 sacs valide et versionne : data/wc-product-export-8-6-2026.csv (136 produits dont 88 "Sacs en cuir", stock 81/6/1 conforme au brief ; colonnes descriptions, dimensions, poids, attributs OK ; piege nbsp dans l'en-tete "En stock ?").

## Fait (Phase 5a, juin 2026)

- Scaffold Next 15.5 + Tailwind v4 + TS : build vert, home /fr statique.
- Design system : tokens sv-* dans globals.css, fonts Cormorant Garamond + DM Sans (next/font), composants Bouton/BoutonAction.
- next-intl : FR seul actif (locales dans i18n/routing.ts), localePrefix as-needed, middleware excluant /api /studio.
- Layouts : app/(site)/[locale]/ (site) + app/(studio)/studio/ (Sanity Studio, hors i18n). Header/Footer globaux.
- Sanity : schemas produit (variantes couleur), pageGamme, pageCatalog, pageStatique, avisClient, typeDeSac, objet seo. Studio embarque /studio. Client + urlFor dans sanity/lib.
- Import : scripts/import-produits.ts. Dry-run valide : 88 sacs -> 26 modeles, 303 photos toutes appariees en local, Rita 5 / Grazia 13 conformes. Apercu : data/import-preview.json. npm run import:dry / import:run.

## Import Sanity fait (projet r949oibi, dataset production)

- npm run import:run execute : 26 produits, 8 typeDeSac, 88 variantes, 206 image assets. Verifie par requete GROQ. Rita = 5 variantes + photo + type "Sac a main".
- Mina : type "Sac porte epaule" + page gamme (override TYPE_PAR_MODELE dans le script). Pages gamme = Rita, Grazia, Mina.
- .env.local rempli (projectId + token), gitignored. Cles aussi a mettre dans Vercel au deploiement.

## A FAIRE PAR VALENTIN (bloque cote token) : autoriser le CORS du Studio

Le Studio /studio plante en CORS tant que l'origine n'est pas autorisee (le token de contenu n'a pas le grant sanity.project.cors/create). Deux options :
- Dashboard : https://www.sanity.io/manage/project/r949oibi/api -> CORS origins -> Add -> http://localhost:3000 + cocher "Allow credentials". (Ajouter aussi l'URL Vercel au deploiement.)
- CLI : `cd ~/Documents/saravalenti-v2 && npx sanity cors add http://localhost:3000 --credentials` (login navigateur avec le compte Sanity). sanity.cli.ts est en place.

Le SITE public (home, catalogue, fetch CDN) n'a PAS besoin de CORS ; seul le Studio navigateur en a besoin.

## En cours

- Phase 5a terminee cote code + data. Reste l'action CORS ci-dessus, puis phase 5b (catalogue : page /catalogue + filtres, cards, fiche produit, galerie par couleur).

## Blocages / questions ouvertes

1. CORS Studio a autoriser (voir ci-dessus).
2. Email du compte Vercel dedie Sara Valenti : a confirmer.
3. Cles API restantes : Supabase, Stripe, Boxtal, Brevo (phase 5d).
