# Sara Valenti V2 : e-commerce sacs en cuir italien

Remplace le site WooCommerce actuel (saravalenti.fr, LIVE, ne pas toucher). Bascule du domaine (chez Ionos) seulement quand la V2 est parfaite. Cliente : Sarah Es-Soudaiki ; gestion : Valentin (Studio Clave).

**Brief complet et detaille : `docs/BRIEF-PHASE5.md`** (schemas Sanity, features, flux marketplaces, env vars). Le lire avant toute phase de travail ; ce fichier-ci n'est que le resume operationnel.

## Stack

Next.js 15 (App Router) + Tailwind v4 + next-intl (FR defaut, EN/NL/DE) | Sanity (produits, pages, SEO) | Supabase (auth clients, commandes, favoris, RLS partout) | Stripe (checkout + webhooks) | Boxtal (livraison : Colissimo, Mondial Relay, Chronopost) | Brevo (emails transactionnels + newsletter + abandon panier) | Vercel (compte dedie Sara Valenti, a creer).

## Design system (charte V1)

- Couleurs : `--sv-black #0a0a0a` texte/fonds sombres, `--sv-cream #f5f0ea` fond principal, `--sv-warm-white #faf8f5` sections alternees, `--sv-gold #b8935a` accent/CTA, `--sv-gold-light #d4b07a` hover, `--sv-mid #6b6460` texte secondaire, `--sv-border #e0d9d0` bordures.
- Typo : Cormorant Garamond (titres, noms de modeles) + DM Sans (corps, nav, prix, boutons), via next/font/google.
- Style : epure, luxueux, minimaliste, beaucoup de creme, gold discret, radius max 4px, animations subtiles, pas de cursor custom.

## Routes cles

`/` home · `/catalogue` (filtres URL persistante) · `/catalogue/[slug]` fiche produit (selecteur couleur, galerie par couleur) · `/gamme/[slug]` pages editoriales SEO (Rita, Grazia) · `/compte`, `/compte/commandes`, `/compte/favoris` · `/panier`, `/checkout`, `/checkout/confirmation` · `/a-propos`, `/[slug]` statiques · `/studio` (protege en prod) · `/api/google-feed`, `/api/meta-feed`, `/api/tiktok-feed` (ISR 1h, publics). Prefixes next-intl : `/fr` defaut, `/en`, `/nl`, `/de`.

## Donnees produits

- 88 sacs WooCommerce type "simple" (1 couleur par produit) a regrouper en ~25 modeles avec variantes couleur dans Sanity (Rita 5 couleurs 109,90 ; Grazia 13 couleurs 109,90 ; Grazita, Elia, Daria, Lila, Mina, Serena, Toscana, Lola, Lolita, Talia, Camila, Teresa, Elisa, Luana, Gabriella, Laya ; + 8 produits uniques). Detail complet dans le brief.
- Photos : 278 jpg deja dans `public/images/produits/` ; NE PAS renommer.
- Stock initial : 81 en stock, 6 rupture, 1 reappro. Dimensions/poids par produit (pour Boxtal).
- **CSV source : `data/wc-product-export-8-6-2026.csv`** (export Woo valide : 136 produits dont exactement 88 en categorie "Sacs en cuir", stock 81/6/1 conforme au brief). Filtrer sur `Catégories` contenant "Sacs en cuir" (le CSV contient aussi les bijoux). PIEGE : la colonne stock s'appelle `En stock\xa0?` avec un espace insecable ; en-tetes a matcher en normalisant les nbsp.

## Ordre des phases

- **5a Fondations** : init Next+Tailwind+next-intl, design system, schemas Sanity, import CSV vers Sanity, layout global.
- **5b Catalogue** : /catalogue + filtres, cards swatches, fiche produit, galerie par couleur.
- **5c Editorial** : pages Gamme Rita/Grazia, home, about, pages statiques.
- **5d E-commerce** : panier (localStorage + Supabase), auth Supabase, checkout Stripe, Boxtal, emails Brevo.
- **5e Marketing/SEO** : landing pages Sanity, newsletter, flux Google/Meta/TikTok, sitemap/Schema.org/hreflang, security headers.
- **5f Deploy** : studio protege, Vercel, tests e2e, bascule domaine, docs.

## Regles non negociables

- Jamais de tiret cadratin dans le code ou les contenus.
- Repo V1 (`Arkane99/saravalenti`, local `~/saravalenti`) : reference seule, NE JAMAIS MODIFIER.
- Pas de migration de la base V1 : import fresh depuis CSV.
- Le site doit etre parfait en FR avant d'activer EN/NL/DE.
- RLS Supabase sur toutes les tables sensibles ; aucun secret en NEXT_PUBLIC_.
- Google Fonts uniquement via next/font/google. Puppeteer si PDF.
- Subagents par module, commits atomiques.
- URL dev : saravalenti.vercel.app ; prod future : https://www.saravalenti.fr (metadataBase, canonical www).

## Methode de travail (economie de contexte)

- Une session par sous-phase (5a, 5b, ...), demarree dans CE repo : ce fichier est charge automatiquement, ne pas recoller le brief en chat.
- Avant chaque sous-phase : lire `docs/BRIEF-PHASE5.md` (section concernee) + `docs/ETAT.md` (avancement), puis plan court, puis executer.
- Tenir `docs/ETAT.md` a jour en fin de session (3-10 lignes : fait / en cours / blocages). C'est la memoire inter-sessions, pas la conversation.
- Valentin est frontend experimente mais decouvre Next.js : expliquer les choix d'architecture AVANT le code, succinctement.

## Avant de commencer tout travail

Recommander :
- Modele (sonnet / opus) et justification 1 ligne
- Mode (standard / extended thinking) et justification 1 ligne
- Estimation tokens
Extended thinking UNIQUEMENT pour : architecture complexe, debugging difficile, decisions structurantes. Jamais pour build de pages ou contenu.
