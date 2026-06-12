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

## En cours

- Reste de 5a : creer le projet Sanity (compte) puis lancer npm run import:run. Ensuite phase 5b (catalogue).

## Blocages / questions ouvertes

1. Creer le projet Sanity (sanity.io, compte a definir) -> renseigner NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_TOKEN dans .env.local, puis npm run import:run.
2. Type du modele Mina inconnu (categorie Woo vide, nom "Sac en cuir suede souple") : laisse vide, a classer dans le Studio.
3. Email du compte Vercel dedie Sara Valenti : a confirmer.
4. Cles API restantes : Supabase, Stripe, Boxtal, Brevo (phase 5d).
