# Brief Phase 5 : Sara Valenti V2 (reference complete)

Source : brief valide par Valentin (juin 2026). Ce document est la reference detaillee ; le resume operationnel est dans `CLAUDE.md`.

## Contexte

Sara Valenti est une marque de sacs en cuir italien (fabrication italienne, cuir brosse, suede, graine). Site e-commerce de Sarah Es-Soudaiki, gere par Valentin (Studio Clave). Le site actuel tourne sur WooCommerce ; on le remplace par Next.js + Sanity + Supabase + Stripe + Boxtal. Le site doit etre parfait AVANT de basculer le domaine saravalenti.fr (actuellement live avec des commandes en cours). Domaine chez Ionos.

- Repo V1 de reference : Arkane99/saravalenti (prive, local `~/saravalenti`) : NE PAS MODIFIER.
- Repo V2 : Arkane99/saravalenti-v2 (ce repo).
- URL pendant le dev : saravalenti.vercel.app. Prod future : https://www.saravalenti.fr.
- Marches : France (principal), Belgique, Pays-Bas, Allemagne. Prix : 19,90 a 109,90 EUR.
- Email du compte Vercel dedie : a confirmer.

## Stack

| Brique | Choix | Role |
|---|---|---|
| Framework | Next.js 15 App Router | front + API routes |
| CSS | Tailwind v4 | tokens dans globals.css |
| CMS | Sanity | produits, pages, contenus, SEO |
| Auth + DB | Supabase | comptes clients, commandes, favoris |
| Paiement | Stripe | checkout, webhooks statut commande |
| Livraison | Boxtal | tarifs selon adresse + dimensions + poids |
| Emails | Brevo | confirmation commande, newsletter, abandon panier |
| Deploy | Vercel | compte dedie Sara Valenti |
| Fonts | next/font/google | Cormorant Garamond + DM Sans |
| i18n | next-intl | FR defaut ; EN, NL, DE via Sanity |

## Design system (charte V1 a reproduire)

```
--sv-black:      #0a0a0a   (texte principal, fonds sombres)
--sv-cream:      #f5f0ea   (fond principal)
--sv-warm-white: #faf8f5   (fond sections alternees)
--sv-gold:       #b8935a   (accent principal, CTA, soulignements)
--sv-gold-light: #d4b07a   (hover gold, details)
--sv-mid:        #6b6460   (texte secondaire, labels)
--sv-border:     #e0d9d0   (bordures, separateurs)
```

Typo : Cormorant Garamond (titres, noms de modeles, signatures) ; DM Sans (corps, navigation, prix, labels, boutons).

Style : epure, luxueux, minimaliste ; beaucoup d'espace creme ; accents gold discrets ; border-radius max 4px ; animations subtiles (fade, translate leger) ; pas de cursor custom.

## Donnees produits

Source : CSV WooCommerce exporte, 88 sacs type "simple" (une couleur par produit). A regrouper par modele avec selecteur couleur dans Sanity.

### Modeles a pages Gamme dediees

- Rita : 5 couleurs (noir, camel, marine, chocolat, taupe), cuir brosse, 109,90
- Grazia : 13 couleurs (noir, taupe, chocolat, camel, beige, bordeaux, kaki, moka, cognac...), cuir suede + brosse, 109,90

### Autres modeles avec variantes

| Modele | Couleurs | Particularite | Prix |
|---|---|---|---|
| Grazita | 6 | | 89,90 |
| Elia | 9 | cuir suede + graine | 44,90 |
| Daria | 4 | franges | 59,90 |
| Lila | 4 | suede | 44,90 |
| Mina | 5 | suede souple | 44,90 |
| Serena | 4 | fermeture metallique | 44,90 |
| Toscana | 3 | sac a dos convertible | 59,90 |
| Lola | 2 | banane double | 34,90 |
| Lolita | 4 | banane simple | 19,90 / 29,90 |
| Talia | 3 | anneau dore | 44,90 |
| Camila | 4 | | 44,90 |
| Teresa | 3 | sacoche | 44,90 |
| Elisa | 3 | | 44,90 |
| Luana | 2 | multipoche | 44,90 |
| Gabriella | 2 | | 44,90 |
| Laya | 2 | sac sceau | 59,90 |

Produits uniques : Ava, Boha, Jiada, Klara, Leola, Xena, Elya, Paloma.

### Attributs

- Matiere : Cuir brosse, Cuir suede, Cuir graine, Cuir irise.
- Couleur : Noir, Camel, Taupe, Chocolat, Marine, Bordeaux, Kaki, Beige, Moka, Cognac, Prune, Vert sapin, Leopard, Argente, Dore, Ocre, Turquoise.
- Type : Sac a main, Sac a bandouliere, Sac a dos, Banane, Sacoche, Sac sceau, Sac multipoche, Sac a rabat, Sac porte epaule, Sac convertible.

### Dimensions (pour Boxtal)

Longueur 15 a 43 cm (moy. 29) ; largeur 2 a 16 cm (moy. 8) ; hauteur 8 a 33 cm (moy. 21) ; poids 0 a 1 kg.

### Stock initial

81 en stock, 6 rupture, 1 en reappro.

### Textes et photos

- Descriptions courtes et longues dans le CSV, bien redigees ; les longues contiennent du HTML WooCommerce a convertir en Portable Text.
- 278 photos jpg dans `public/images/produits/` (plusieurs vues par produit). NE PAS renommer.

## Schemas Sanity

### produit

```typescript
{
  nom: string,                    // "Rita"
  slug: slug,                     // "rita"
  type: reference vers typeDeSac, // Sac a main
  description_courte: text,       // cards catalogue
  description: portableText,      // page produit
  variantes: array of {
    couleur: string,
    matiere: string,
    prix: number,
    promo: number,
    stock: number | 'backorder',
    photos: array of image,       // galerie par couleur
    sku: string,
    poids: number,
    dimensions: { l, w, h }
  },
  produits_suggeres: array of reference vers produit,
  est_page_gamme: boolean,        // true pour Rita, Grazia
  seo: {
    titre: string, description: string, og_image: image,
    slug_fr: string, slug_en: string, slug_nl: string, slug_de: string
  },
  date_creation: datetime
}
```

### pageGamme

```typescript
{
  modele: reference vers produit,
  hero: { titre: string, accroche: string, photo_hero: image },
  sections: portableText,
  variantes_en_bas: boolean,
  seo: { ... }
}
```

### pageCatalog

```typescript
{ titre: string, description: portableText, seo: { ... } }
```

### pageStatique (About, CGV, mentions legales, livraison, retours)

```typescript
{ titre: string, slug: slug, contenu: portableText, seo: { ... } }
```

### avisClient

```typescript
{ texte: text, auteur: string, note: number (1-5), produit: reference, date: datetime, verifie: boolean }
```

## Routes

```
/                       Homepage
/catalogue              Catalogue avec filtres
/catalogue/[slug]       Fiche produit (selecteur couleur)
/gamme/[slug]           Page Gamme editoriale (Rita, Grazia...)
/compte                 Dashboard client
/compte/commandes       Historique commandes
/compte/favoris         Favoris
/panier                 Panier
/checkout               Checkout Stripe
/checkout/confirmation  Confirmation commande
/a-propos               About editable
/[slug]                 Pages statiques
/studio                 Sanity Studio (protege en prod)
/sitemap.xml            Auto-genere
/robots.txt
```

i18n next-intl : /fr (defaut), /en, /nl, /de.

## Features e-commerce

### Catalogue et filtres (/catalogue)

Sidebar : couleur (swatches multi-selection), matiere, type de sac (checkboxes), prix (slider 0-150), stock (toggle "en stock" + "inclure reappro"), tri (nouveautes, prix asc/desc, populaires). URL persistante avec params (shareable).

### Fiche produit

Galerie par couleur ; swatches avec nom au hover ; stock par couleur (en stock / dernieres pieces / rupture) ; dimensions et poids ; description courte visible + longue en accordeon ; "Vous aimerez aussi" (suggeres configurables Sanity) ; ajouter au panier + favoris ; partage social.

### Pages Gamme (SEO longue traine)

Rita et Grazia d'abord, extensible via Sanity. URL /gamme/rita, /gamme/grazia. Contenu editorial complet (histoire, matiere, fabrication, entretien), photos lifestyle, toutes les couleurs en bas avec CTA. Schema.org ProductGroup.

### Compte client (Supabase Auth)

Inscription/connexion (email + password, Google OAuth) ; dashboard commandes ; favoris ; adresses sauvegardees.

### Panier et checkout

Panier persistant (localStorage + Supabase si connecte) ; checkout Stripe (Elements ou Payment Links) ; calcul Boxtal temps reel (adresse + dimensions + poids) ; options Colissimo / Mondial Relay / Chronopost ; email Brevo apres commande.

### Marketing

- Newsletter : popup ou bandeau discret, liste Brevo dediee.
- Landing pages configurables depuis Sanity (ads, jeux concours) : URL custom, hero, CTA, formulaire opt-in.
- Abandon panier : webhook Brevo si panier non converti apres 2 h.

## Flux marketplaces (ISR 1 h, publics, sans auth)

- `/api/google-feed` : XML/RSS Google Merchant (g:id, g:title, g:description, g:link, g:image_link, g:price, g:availability, g:condition, g:brand, g:gtin depuis UGS Sanity).
- `/api/meta-feed` : JSON Meta Commerce Manager (memes donnees + item_group_id pour variantes couleur).
- `/api/tiktok-feed` : CSV TikTok Shop (title, description, price, image_url, availability, brand, category).

## SEO

- Par produit (Sanity) : titre meta, description, og:image, slug par langue.
- Schema.org Product (prix, dispo, images, avis) ; ProductGroup sur pages Gamme.
- hreflang automatique via next-intl.
- metadataBase https://www.saravalenti.fr ; canonical www ; sitemap auto (produits, gammes, statiques).
- Core Web Vitals : next/image partout, lazy loading, blur placeholder.

## Variables d'environnement

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BOXTAL_ACCESS_KEY=
BOXTAL_SECRET_KEY=
BREVO_API_KEY=
BREVO_LIST_ID_NEWSLETTER=
NEXT_PUBLIC_SITE_URL=https://www.saravalenti.fr
```

## Ordre de developpement

- 5a Fondations : init Next 15 + Tailwind v4 + next-intl ; design system ; Sanity (setup + schemas produit, pageGamme, avisClient) ; script import CSV vers Sanity (88 produits regroupes par modele) ; layout global (header nav/panier/compte/langues + footer).
- 5b Catalogue : /catalogue + filtres URL persistante ; cards avec swatches ; fiche produit ; galerie par couleur.
- 5c Editorial : pages Gamme Rita + Grazia ; homepage ; about ; statiques (CGV, mentions, livraison, retours).
- 5d E-commerce : panier ; compte Supabase Auth ; checkout Stripe ; Boxtal ; emails Brevo.
- 5e Marketing/SEO : landing pages ; newsletter ; flux Google/Meta/TikTok ; sitemap + metadata + Schema.org + hreflang ; security headers.
- 5f Deploy : studio protege en prod ; Vercel (compte dedie) ; tests e2e (checkout, commande, emails) ; bascule domaine ; CLAUDE.md + LESSONS.md.

## Decisions techniques

- Jamais de tiret cadratin dans le code ou les contenus.
- Puppeteer si generation PDF necessaire.
- Google Fonts uniquement via next/font/google.
- RLS Supabase sur toutes les tables sensibles (commandes, adresses, favoris).
- NEXT_PUBLIC_ interdit pour les secrets.
- Subagents par module, commits atomiques.
- FR parfait avant d'activer les autres langues.
- Pas de migration de la base V1 : import fresh depuis CSV.
- Photos dans /public/images/produits/ : ne pas renommer.
