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

## Fait (Phase 5b, juin 2026)

- Couche donnees : sanity/lib/queries.ts (REQUETE_CATALOGUE, REQUETE_PRODUIT, REQUETE_SLUGS), lib/types.ts, lib/format.ts (prix EUR), lib/couleurs.ts (nom -> hex pour swatches).
- /catalogue : fetch serveur (revalidate 60) + CatalogueClient (filtrage client). Filtres couleur/matiere/type/prix-max/stock + tri (nouveautes/prix), etat synchronise a l'URL (partageable). useSearchParams sous <Suspense>.
- CarteProduit : image qui change au survol/clic des swatches, badge gamme/epuise, prix + promo.
- /catalogue/[slug] : FicheProduit (galerie par couleur + miniatures, selecteur couleur, stock, dimensions, accordeon description PortableText, CTA panier/favoris placeholders), suggeres, generateStaticParams (26 pages), metadata + canonical.
- @portabletext/react ajoute. Build vert (26 fiches generees). Verifie au navigateur : filtre type 26->3 + URL ?type=Banane, fiche Rita changement couleur/image + accordeon.
- Limitations notees : tri "populaires" omis (pas de donnees de vente) ; filtre prix = max seul (pas min/max).

## Revue 5b (workflow multi-agents) : 11 constats confirmes, tous corriges (commit 2bfc9c4)

- Bug filtre prix : les variantes sans prix etaient exclues du catalogue (Infinity), et le filtre s'appliquait meme curseur au plafond. Corrige (filtrePrixActif + on garde les sans-prix). prixMax depuis l'URL borne a [0, plafond].
- A11y : focus clavier visible global (:focus-visible, or fonce) ; aria-pressed sur swatches carte + miniatures fiche ; aria-controls/id sur accordeon ; aria-valuetext sur slider prix ; aria-label swatches sidebar.
- Contraste AA : boutons gold passent en texte sombre (blanc echouait a 2.85:1) ; nouveau token --color-sv-gold-dark #7e5e2c pour le TEXTE or sur fond clair (prix promo, labels, hover) applique partout (5b + Header/Footer/home).
- Perf LCP : priority sur les 6 premieres cartes du catalogue (verifie : eager vs lazy).
- Note : design token --color-sv-gold (clair) reste pour fonds/bordures/accents ; --color-sv-gold-dark uniquement pour le texte sur clair.

## En cours

- Phase 5b terminee et revue. Prochaine : phase 5c (pages editoriales : gammes Rita/Grazia/Mina via schema pageGamme, home, about, statiques CGV/livraison/retours).
- Reste l'action CORS Studio (voir plus haut) ; n'impacte pas le site public.

## Blocages / questions ouvertes

1. CORS Studio a autoriser (voir ci-dessus).
2. Email du compte Vercel dedie Sara Valenti : a confirmer.
3. Cles API restantes : Supabase, Stripe, Boxtal, Brevo (phase 5d).
