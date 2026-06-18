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

## Fait (Phase 5c, juin 2026)

- CLAUDE.md : regle model/mode/tokens ajoutee.
- Sanity queries : REQUETE_PRODUITS_GAMME (slug + gamme field), REQUETE_MODELES_PHARES, REQUETE_AVIS.
- lib/types.ts : AvisClient type, gamme field sur ProduitDetail.
- /gamme/[slug] : pages statiques Rita/Grazia/Mina avec contenu editorial hardcode, grille produits Sanity, FAQ, Schema.org ProductGroup + FAQPage.
- / (homepage) : H1 "Sacs en cuir italien", section matieres (3 blocs GEO), carousel modeles phares, avis clients, arguments. Schema.org Organization + WebSite.
- /a-propos : contenu valide verbatim, Schema.org Organization.
- /entretien-cuir : guide par type de cuir (brosse/suede/graine/irise), FAQ 6 questions, Schema.org HowTo + FAQPage. Lie depuis FicheProduit et toutes les pages gamme.
- Pages statiques : /livraison, /retours, /cgv, /mentions-legales. /livraison avec Schema.org FAQPage.
- Footer : liens a-propos + entretien-cuir ajoutes.
- Build vert : 16 routes SSG generees.

## Fait (Phase 5d, juin 2026)

Packages ajoutes : zustand, @supabase/supabase-js, @supabase/ssr, stripe, @stripe/stripe-js.

Infrastructure :
- lib/supabase/client.ts (browser), lib/supabase/server.ts (RSC/routes), lib/supabase/helpers.ts (isSupabaseConfigured, isStripeConfigured).
- lib/stripe.ts (instance Stripe serveur, apiVersion 2026-05-27.dahlia).
- lib/store/panier.ts (Zustand + localStorage, ajouterAuPanier / retirer / changerQuantite / vider).
- lib/store/favoris.ts (Zustand + localStorage, toggle / estFavori).
- supabase/migrations/001_ecommerce.sql : tables commandes + adresses + favoris avec RLS. A executer sur Supabase Dashboard.
- .env.local : placeholders Supabase, Stripe, Boxtal, Brevo ajoutes.

Composants :
- components/panier/CartDrawer.tsx : panneau lateral (slide-in droite), lignes quantifiees, CTA checkout.
- components/layout/BoutonPanier.tsx : icone panier avec badge count dans le Header.
- Header + layout site mis a jour (CartDrawer injecte dans layout).
- FicheProduit : boutons Ajouter au panier + Favoris fonctionnels (Zustand).
- BoutonAction : props aria-pressed + aria-label ajoutes.

Pages :
- /panier : vue complete panier client, quantites, total, CTA checkout.
- /compte/connexion, /compte/inscription : formulaires Supabase Auth (fallback message si non configure).
- /compte/layout.tsx : guard auth (redirect vers connexion si non authentifie, mode demo si Supabase absent).
- /compte : dashboard email + liens.
- /compte/commandes : historique depuis Supabase (mode demo si absent).
- /compte/favoris : grille produits depuis slugs Zustand → fetch /api/produits.
- /checkout : 3 etapes (adresse → livraison → paiement), recapitulatif commande.
- /checkout/confirmation : succes apres Stripe ou mock.

API routes :
- /api/livraison : mock Boxtal (3 options fixes : Colissimo 5.49/6.99, Mondial Relay 3.99, Chronopost 9.99).
- /api/checkout : mock si STRIPE_SECRET_KEY=PLACEHOLDER sinon vraie Stripe Checkout Session.
- /api/webhook : verifie signature Stripe, met a jour commandes Supabase, TODO Brevo.
- /api/auth/deconnexion : signOut Supabase + redirect accueil.
- /api/produits : fetch Sanity par slugs (pour page favoris).

Strategie mock : tout fonctionne avec placeholders. Plugger les vraies cles → production ready sans toucher au code.

Build vert : 30 routes generees. Sonnet 4.6 standard, environ 110k tokens.

## Fait (Phase 5e, juin 2026)

SEO technique et marketing.

Sitemap et robots :
- app/sitemap.ts : sitemap dynamique (produits Sanity + gammes + pages statiques). Genere /sitemap.xml au build.
- app/robots.ts : autorisation /, interdiction /studio et /api/. Pointe vers /sitemap.xml.

Schema.org enrichi :
- /catalogue/[slug] : JSON-LD Product (AggregateOffer par variante, image, disponibilite, prix promo) + BreadcrumbList. Genere cote serveur avec urlFor pour les images Sanity.

Flux marketplaces (ISR 1 heure) :
- /api/google-feed : XML RSS Google Merchant Center (g:id/title/description/link/image_link/price/availability/brand/item_group_id).
- /api/meta-feed : JSON flat Meta Commerce Manager (memes champs + item_group_id pour grouper les variantes couleur).
- /api/tiktok-feed : CSV TikTok Shop (sku_id, title, description, price, currency, availability, image_url, brand, category, item_group_id). Encodage CSV correct (guillemets, echappement).
- Tous les flux : une ligne/objet/item par variante (couleur x produit). Images via urlFor().width(800).height(1000).fit('crop'). Donne le slug produit comme item_group_id pour grouper dans l'interface marketplace.

Security headers (next.config.ts) :
- Appliques a toutes les routes sauf /studio (qui a besoin de unsafe-eval).
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera, microphone, geolocation bloques ; payment autorise pour Stripe.
- Strict-Transport-Security: max-age=63072000 includeSubDomains preload.
- Content-Security-Policy : self + unsafe-inline (Next.js) + js.stripe.com (scripts/frames) + fonts.googleapis.com/gstatic.com + cdn.sanity.io (images) + *.sanity.io (connect).

Newsletter RGPD :
- components/layout/NewsletterBandeau.tsx : bandeau bas de page (client), appait 4 s apres le chargement, jamais reaffiche apres rejet (localStorage). Email + case RGPD obligatoire. Lien /mentions-legales.
- /api/newsletter : POST email -> Brevo API si BREVO_API_KEY configure, sinon log console mock.
- Integre dans app/(site)/[locale]/layout.tsx.

Build vert : 33 routes generees. Sonnet 4.6 standard, environ 25k tokens.

## Fait (revue visuelle + corrections, juin 2026)

Six groupes de corrections apres review visuelle desktop/mobile 390px. Build vert a chaque commit.

Fix 1 (commit 0143ba9) — Overflow horizontal mobile :
- html { overflow-x: hidden } dans globals.css.
- FicheProduit : boutons CTA flex-col sm:flex-row (empiles sur mobile, cote a cote sur sm+).

Fix 2 (commit 1db37b6) — 15 accents manquants :
- NewsletterBandeau : nouveautes → nouveautes, premiere → premiere, donnees → donnees, Confidentialite → Confidentialite, Reessayez/ecrivez → corriges.
- /panier : ajoute → ajoute, Recapitulatif, Calculee, aria-labels quantite.
- /compte : Connecte, modeles, sauvegardes, deconnecter, demonstration, configure.

Fix 3 (commit 463cd46) — Gamme Mina :
- messages/fr.json : cle "gammeMina" ajoutee.
- Header : lien /gamme/mina dans le tableau liens.
- Footer : lien /gamme/mina dans la colonne BOUTIQUE.

Fix 4 (commit 8f88875) — Navigation mobile hamburger :
- components/layout/NavMobile.tsx cree (client) : icone 3 barres md:hidden, drawer slide-in depuis la gauche (w-72), overlay semi-transparent, fermeture automatique au changement de pathname (usePathname), scroll body bloque.
- Header.tsx : import + <NavMobile liens={liens} /> dans la zone actions.

Fix 5 (commit 5b39f91) — Filtres catalogue drawer mobile :
- CatalogueClient.tsx refactorise : panneauFiltres extrait en variable JSX (pas de duplication).
- Sidebar aside : hidden md:block (invisible sur mobile).
- Bouton "Filtres (N)" : visible md:hidden dans la barre de tri.
- Drawer : fixed inset-0 z-50 depuis la droite (w-80), overlay, scroll interne, bouton "Voir les resultats (N)" en bas.
- State drawerOuvert + overflow body bloque.

Fix 6 (commit 665fa93) — og:image :
- layout.tsx : openGraph.images par defaut → /images/produits/Sac-Rita-Camel-3-scaled.jpg (1200x900).
- catalogue/[slug]/page.tsx : generateMetadata enrichi avec urlFor(premiere_photo).width(1200).height(900).fit('crop').
- gamme/[slug]/page.tsx : OG_IMAGES map (rita/grazia/mina → photos locales).

Build final : 33 routes. Tous les commits sur main.

## Fait — Phase 5f corrections visuelles (juin 2026, 7 corrections)

Commits : 4c00731 (H1) d2375c8 (a-propos) 44c8a01 (URL couleurs + import) 7e8844c (SEO) 4bb623a (images hero)

- Fix 1 — H1 homepage : text-4xl text-balance, libelle "Sacs en cuir italien" (sans "collection Sara Valenti").
- Fix 2 — Schema Sanity + import : description_courte par variante couleur. Re-import : 27 modeles, 88 variantes.
- Fix 3 — Architecture URL 1 page / couleur : /catalogue/rita-camel, /catalogue/grazia-graine-bordeaux.
  generateStaticParams genere N pages par modele (N = nb couleurs). Swatches = Links. Schema.org Product + isVariantOf.
  lib/slugifier.ts partage la logique import / frontend.
- Fix 4 — Bug Gamme Grazia : resolu par le re-import (grazia-graine + grazita.gamme='grazia' now in Sanity).
  GROQ query REQUETE_PRODUITS_GAMME inchangee, elle etait correcte.
- Fix 5 — /a-propos : hero image (Rita Camel) + "Notre promesse" en citation Cormorant italique centree.
- Fix 6 — Textes SEO/GEO/AEO : meta description home avec modeles/prix, FAQ 4 questions + FAQPage schema home,
  claims verifiables ("tradition maqroitniere etablie" vs "reference mondiale"), gamme Rita precisions dimensions.
- Fix 7 — Images hero : gammes Rita/Grazia/Mina + /entretien-cuir. Photos produits existantes.
  Structure prete pour swap Unsplash au go prod.
- package.json : import:run charge desormais .env.local via --env-file.

## En attente (go prod)

1. Valentin : valider visuellement ces corrections en local (npm run dev) ou sur la prochaine preview.
2. Deployer les corrections : vercel (preview) puis vercel --prod apres validation.
3. Stripe : creer le webhook → endpoint https://www.saravalenti.fr/api/webhook, event checkout.session.completed → recuperer whsec_... → vercel env add STRIPE_WEBHOOK_SECRET production --value 'whsec_...'
4. Domaine : pointer saravalenti.fr vers Vercel (Settings → Domains), configurer DNS chez Ionos.
5. CORS Studio Sanity : dashboard.sanity.io → project r949oibi → API → CORS → ajouter https://www.saravalenti.fr + credentials.
6. Images Unsplash : swapper les photos produits (hero gammes + entretien-cuir) par des photos Unsplash cuir/maroquinerie/lifestyle avec credit photographe.

### Cles manquantes / placeholders restants

- STRIPE_WEBHOOK_SECRET : whsec_PLACEHOLDER (a renseigner apres creation du webhook)
- BREVO_LIST_ID_NEWSLETTER : PLACEHOLDER (optionnel, le stub console fonctionne sans)

### Notes

- .env.local gitignore : OK.
- Vercel project ID : prj_RTmWy3Uu2mGkeHZgncg55fbE2wkX (compte palissonv-6407s-projects).
- GitHub non connecte a Vercel (erreur Login Connection) : deploy CLI uniquement pour l'instant.
- URLs catalogue : /catalogue/rita-camel etc. Les anciennes URLs /catalogue/rita sont maintenant 404 (pre-launch, OK).
