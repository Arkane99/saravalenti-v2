# Audit Global V2 — Sara Valenti

Site audité : https://sara-valenti.vercel.app  
Date : juin 2026  
Sources : crawl direct (homepage, catalogue, fiche Rita Camel, gamme Rita, à-propos, sitemap, robots.txt), + synthèse de : DESIGN_RULES.md, SARA_VALENTI_DESIGN.md, COPYWRITING_RULES.md, BRAND_VOICE.md, SEARCH_RULES.md, SECURITY_RULES.md, ECOMMERCE_STRATEGY.md, ACCESSIBILITY_RULES.md, PERFORMANCE_BUDGET.md, DECISIONS.md, COMPETITIVE_ANALYSIS.md, LIGHTHOUSE_BASELINE.md, PHOTO_BRIEF_SARA_VALENTI.md, AUDIT_SARA_VALENTI.md, AUDIT_TEXTES_SARA_VALENTI.md, ETAT.md.

Cet audit supersède AUDIT_SARA_VALENTI.md et AUDIT_TEXTES_SARA_VALENTI.md.

---

## Résumé exécutif

| Criticité | Nb | Domaines |
|---|---|---|
| BLOQUANT | 10 | Légal, SEO, données, sécurité, performance, textes |
| IMPORTANT | 18 | SEO, copywriting, UX, GEO, images, e-commerce, a11y |
| MINEUR | 11 | Design, contenu, polish |

**Statut :** Go prod BLOQUÉ — les 10 BLOQUANTS doivent être corrigés avant `vercel --prod`.

---

## BLOQUANTS — à corriger avant mise en production

---

### [CORRIGÉ] BLQ-01 — Prix Elia 19,90 € affiché (devrait être ~109,90 €)

**Dimension :** E-commerce / Données  
**Résolution :** Prix confirmé correct. L'Elia est un porte-monnaie (pas un sac), vendu 19,90 EUR. La collection comprend donc des articles dès 19,90 EUR. Meta description et FAQ harmonisées en conséquence.

---

### [CORRIGÉ] BLQ-02 — Contradiction prix : meta description "109,90 EUR" vs FAQ "19,90 EUR"

**Dimension :** Copywriting / SEO  
**Fichier :** `app/(site)/[locale]/page.tsx` lignes 16 et 71  
**Constat :** La meta description dit "Prix à partir de 109,90 EUR", la FAQ sur la même page dit "Les sacs sont proposés à partir de 19,90 EUR". Ces deux textes apparaissent en SERP (meta) et sur la page (FAQ) — contradiction visible dans Google avant même le clic.  
**Correction :** Une fois BLQ-01 résolu et le prix Elia confirmé, harmoniser les deux textes sur le même montant réel.

---

### [CORRIGÉ] BLQ-03 — Catalogue rendu côté client : produits absents du HTML initial

**Dimension :** SEO critique  
**Confirmé au crawl :** "Chargement…" visible dans le HTML servi aux bots. Les 27 modèles ne sont pas dans le DOM initial.  
**Fichier :** `components/catalogue/CatalogueClient.tsx`  
**Constat :** `useSearchParams` force tout le catalogue dans une `<Suspense>` boundary. Le rendu serveur retourne le fallback "Chargement…" — Google indexe une page catalogue vide.  
**Correction :** Isoler `useSearchParams` dans un composant feuille minimal, passer les produits préfiltrés depuis le Server Component parent :

```tsx
// Pattern correct
// page.tsx (Server Component)
const produits = await fetchProduits() // pré-renderé SSG
// passer les produits au Client Component
// useSearchParams uniquement dans un petit composant feuille pour la re-filtration cliente
```

---

### [CORRIGÉ] BLQ-04 — Politique de confidentialité RGPD absente

**Dimension :** Légal  
**Fichier :** Route manquante `app/(site)/[locale]/confidentialite/page.tsx`  
**Constat :** Le site collecte des données personnelles (Supabase auth, newsletter Brevo, commandes Stripe). La page `/confidentialite` est absente. Le NewsletterBandeau renvoie vers `/mentions-legales` au lieu d'une politique dédiée. Obligation RGPD art. 13.  
**Correction :**
1. Créer `app/(site)/[locale]/confidentialite/page.tsx`
2. Contenu obligatoire : responsable du traitement (Sarah Es-Soudaiki / contact@saravalenti.fr), données collectées, durée de conservation, droits des utilisateurs, base légale par traitement
3. Lier depuis le footer colonne INFORMATIONS + NewsletterBandeau
4. Ajouter à `app/sitemap.ts`

---

### [CORRIGÉ] BLQ-05 — Mentions légales : trois placeholders RGPD non renseignés

**Dimension :** Légal  
**Fichier :** `app/(site)/[locale]/mentions-legales/page.tsx` lignes 25, 26, 49  
**Constat :** Trois placeholders littéraux s'affichent sur la page publique :
- `Contact : [adresse email à renseigner]`
- `Directeur de la publication : [à renseigner]`
- `Pour exercer ces droits : [email à renseigner]`

**Correction :** Renseigner `contact@saravalenti.fr` et `Sarah Es-Soudaiki` dans ces trois champs. La page À propos confirme l'email `contact@saravalenti.fr`.

---

### [CORRIGÉ] BLQ-06 — CGV : PayPal mentionné mais non disponible

**Dimension :** Légal / E-commerce  
**Fichier :** `app/(site)/[locale]/cgv/page.tsx` ligne 53  
**Constat :** "Le paiement s'effectue par carte bancaire (Visa, Mastercard) ou PayPal" — or le checkout redirige uniquement vers Stripe. Information contractuelle inexacte.  
**Correction :** `'Le paiement s'effectue par carte bancaire (Visa, Mastercard, American Express) via la plateforme sécurisée Stripe.'`

---

### [CORRIGÉ] BLQ-07 — Page retours : email de contact absent

**Dimension :** UX / Légal  
**Fichier :** `app/(site)/[locale]/retours/page.tsx` ligne 40  
**Constat :** La procédure de retour demande de "contacter Sara Valenti par email" mais aucun email n'est indiqué. Un client qui veut retourner sa commande est bloqué.  
**Correction :** Ajouter après la phrase : `'Écrivez-nous à contact@saravalenti.fr avec votre numéro de commande.'`

---

### [CORRIGÉ] BLQ-08 — robots.txt : /api/ bloqué — flux marketplaces inaccessibles

**Dimension :** SEO / Marketplaces  
**Confirmé au crawl :** `Disallow: /api/`  
**Fichier :** `app/robots.ts`  
**Constat :** Les flux Google Merchant Center (`/api/google-feed`), Meta (`/api/meta-feed`) et TikTok (`/api/tiktok-feed`) ne peuvent pas être crawlés par les plateformes. Ces routes publiques ISR sont volontairement accessibles.  
**Correction :**
```ts
// app/robots.ts
rules: {
  userAgent: '*',
  allow: '/',
  disallow: ['/studio', '/api/webhook', '/api/checkout', '/api/auth/'],
  // Retirer le /api/ générique
}
```

---

### BLQ-09 — Sitemap pointe www.saravalenti.fr sur le staging (NEXT_PUBLIC_SITE_URL absent)

**Dimension :** SEO  
**Confirmé au crawl :** Sitemap contient 155 URLs toutes avec `https://www.saravalenti.fr` — non soumettable à Google Search Console depuis le staging.  
**Fichier :** `app/sitemap.ts` ligne 6  
**Constat :** `NEXT_PUBLIC_SITE_URL` n'est pas configurée dans Vercel Preview. Le sitemap n'est pas soumettable avant go prod.  
**Correction :**
```bash
vercel env add NEXT_PUBLIC_SITE_URL preview
# Valeur : https://sara-valenti.vercel.app
vercel env add NEXT_PUBLIC_SITE_URL production
# Valeur : https://www.saravalenti.fr
```

---

### [CORRIGÉ] BLQ-10 — LCP 9,6 s (CRITIQUE) — image hero sans `priority`

**Dimension :** Performance  
**Mesuré :** Lighthouse 13.4.0 juin 2026 — Performance 72/100, LCP 9,6 s.  
**Fichier :** Composant hero homepage et pages gamme  
**Constat :** Le TTFB est excellent (10 ms) mais l'image hero n'est pas préchargée. Le LCP à 9,6 s entraîne un classement Google dégradé pour le critère Core Web Vitals depuis le passage au Page Experience signal.  
**Correction :**
```tsx
<Image
  src={heroSrc}
  alt="..."
  fill
  sizes="100vw"
  priority  // OBLIGATOIRE sur l'image hero
  placeholder="blur"
  blurDataURL={lqip}
/>
```
Et dans `next.config.ts` : `images: { formats: ['image/avif', 'image/webp'] }`

---

## IMPORTANTS — à traiter dans les 2 semaines post-lancement

---

### [CORRIGÉ] IMP-01 — Checkout : 6 champs sans accents (page transactionnelle critique)

**Dimension :** Copywriting  
**Fichier :** `app/(site)/[locale]/checkout/page.tsx` lignes 122, 125, 147, 151, 248  
**Constat :** Labels, messages d'erreur et texte de redirection manquent leurs accents :
- `'Prenom'` → `'Prénom'`
- `'Telephone'` → `'Téléphone'`
- `'Veuillez reessayer.'` → `'Veuillez réessayer.'`
- `'Erreur reseau. Veuillez reessayer.'` → `'Erreur réseau. Veuillez réessayer.'`
- `'Vous allez etre redirige vers Stripe...'` → `'Vous allez être redirigé vers Stripe...'`

Et dans `checkout/confirmation/page.tsx` :
- `'Un email de confirmation vous a ete envoye.'` → `'Un email de confirmation vous a été envoyé.'`

---

### [CORRIGÉ] IMP-02 — Tirets cadrantins dans les titres et metas (règle dure violée)

**Dimension :** Copywriting (règle absolue Studio Clave)  
**Fichier :** `catalogue/[slug]/page.tsx` lignes 57, 76 ; `entretien-cuir/page.tsx` ligne 180  
**Constat :** Trois tirets cadrantins (—) dans du contenu public :
- `title: \`${p.nom} — tous les coloris | Sara Valenti\`` (visible dans les SERP)
- `\`${titre} — sac en cuir italien Sara Valenti.\`` (meta description)
- `alt="Détail du cuir brossé — sac Rita Sara Valenti"` (alt text accessible)

**Correction :** Remplacer par ` - ` (tiret court entouré d'espaces) :
- `${p.nom} - tous les coloris | Sara Valenti`
- `${titre}, sac en cuir italien Sara Valenti.`
- `Détail du cuir brossé, sac Rita Sara Valenti`

---

### [CORRIGÉ] IMP-03 — "cuir pleine surface" dans la gamme Mina (règle dure violée)

**Dimension :** Copywriting  
**Fichier :** `gamme/[slug]/page.tsx` ligne 135  
**Constat :** `"par rapport au cuir pleine surface"` — terme interdit, proche de "cuir pleine fleur" (CLAUDE.md).  
**Correction :** `"par rapport au cuir structuré ou grainé"`

---

### [CORRIGÉ] IMP-04 — Accents manquants dans d'autres pages visibles

**Dimension :** Copywriting  
**Fichiers :** compte/inscription, compte/commandes, FicheProduit, catalogue/[slug]  
**Constat :**
- `'Verifiez votre email'` → `'Vérifiez votre email'`
- `'Mode demonstration --...'` → `'Mode démonstration -...'` (double tiret aussi = règle dure)
- `'Mode demonstration -- Supabase non configure.'` → idem
- `'Epuise'` → `'Épuisé'` (badge et bouton)

---

### [CORRIGÉ] IMP-05 — llms.txt absent (GEO — visibilité dans les LLMs)

**Dimension :** GEO  
**Confirmé au crawl :** 404 sur `/llms.txt`  
**Constat :** Signal principal pour la visibilité dans ChatGPT, Claude, Gemini, Perplexity. Pour "meilleur sac cuir italie" ou "sac cuir brossé", la visibilité LLM est directement liée à ce fichier.  
**Correction :** Créer `/public/llms.txt` :

```markdown
# Sara Valenti

> Boutique française de sacs en cuir fabriqués dans des ateliers italiens.
> Cuir brossé, suède et grainé. Modèles intemporels à partir de 109,90 EUR. Livraison offerte dès 45 EUR.

## Collection

- [Sacs Rita en cuir brossé](/gamme/rita): sac à main structuré, 5 coloris, 109,90 EUR
- [Sacs Grazia suède et grainé](/gamme/grazia): 13 coloris, cuir naturel doux
- [Sacs Mina](/gamme/mina): sac porté épaule souple
- [Catalogue complet](/catalogue): 27 modèles, 88 variantes couleur

## Informations marque

- [À propos](/a-propos): marque française, fabrication italienne artisanale
- [Guide entretien cuir](/entretien-cuir): par type de cuir (brossé, suède, grainé, irisé)
- [Livraison et retours](/livraison): livraison offerte dès 45 EUR, retours 14 jours
```

---

### [CORRIGÉ] IMP-06 — Hreflang absent du layout global

**Dimension :** SEO Multilingue  
**Fichier :** `app/(site)/[locale]/layout.tsx`  
**Constat :** Les 4 locales (FR/EN/NL/DE) sont configurées dans next-intl mais aucun `<link rel="alternate" hreflang="...">` n'est généré. Google ne sait pas que les versions linguistiques existent.  
**Correction :**
```ts
alternates: {
  canonical: 'https://www.saravalenti.fr',
  languages: {
    'fr': 'https://www.saravalenti.fr',
    'en': 'https://www.saravalenti.fr/en',
    'nl': 'https://www.saravalenti.fr/nl',
    'de': 'https://www.saravalenti.fr/de',
    'x-default': 'https://www.saravalenti.fr',
  },
}
```

---

### [CORRIGÉ] IMP-07 — Grazia : H1, meta title et sous-titre hero mentionnent suède uniquement (13 coloris = suède + grainé)

**Dimension :** Copywriting / SEO  
**Fichier :** `gamme/[slug]/page.tsx` lignes 75-76 et 80  
**Constat :** 7 des 13 coloris Grazia sont en cuir grainé, mais tout le contenu SEO dit "suède" uniquement. Moitié du catalogue invisible dans les meta.  
**Correction :**
- H1 : `'Sac Grazia en cuir suède et grainé : 13 coloris disponibles'`
- Meta title : `'Sac Grazia suède et grainé - 13 coloris - Sara Valenti'`
- Sous-titre hero : `'Sac en cuir suède et grainé, 13 coloris'`

---

### [CORRIGÉ] IMP-08 — Rita FAQ : couleurs inexistantes ("marron", "miel")

**Dimension :** Copywriting / Données  
**Fichier :** `gamme/[slug]/page.tsx` ligne 62  
**Constat :** FAQ Rita dit "Le noir et le marron sont les plus polyvalents" et "Les tons chauds (camel, miel)". Les 5 coloris Rita sont : noir, camel, marine, chocolat, taupe. "Marron" et "miel" n'existent pas.  
**Correction :** `'Le noir et le chocolat sont les plus polyvalents. Les tons chauds (camel) mettent en valeur le grain du cuir brossé. Le taupe offre une neutralité élégante.'`

---

### [CORRIGÉ] IMP-09 — Grazia FAQ : couleurs inexistantes ("caramel", "gris perle")

**Dimension :** Copywriting / Données  
**Fichier :** `gamme/[slug]/page.tsx` ligne 112  
**Constat :** FAQ Grazia mentionne "caramel" et "gris perle" qui n'existent pas dans la collection.  
**Correction :** Utiliser les noms réels du CSV : cognac, camel, taupe, beige, bordeaux, kaki, noir.

---

### [CORRIGÉ] IMP-10 — Schema.org ProductGroup absent sur les pages modèle

**Dimension :** SEO / AEO  
**Fichier :** `catalogue/[slug]/page.tsx` pages modèles (ex: `/catalogue/rita`)  
**Constat :** Les pages modèle regroupent N couleurs mais utilisent un schema `Product` classique au lieu de `ProductGroup` avec `hasVariant`. Les Rich Results Google pour les produits multicoloris nécessitent ce schéma.  
**Correction :**
```json
{
  "@type": "ProductGroup",
  "name": "Sac Rita",
  "brand": { "@type": "Brand", "name": "Sara Valenti" },
  "hasVariant": [
    { "@type": "Product", "name": "Rita Camel", "color": "Camel",
      "offers": { "@type": "Offer", "price": "109.90", "priceCurrency": "EUR" } }
  ]
}
```

---

### IMP-11 — Heroes homepage et gamme Rita : même photo (règle transversale violée)

**Dimension :** Design  
**Source :** PHOTO_BRIEF_SARA_VALENTI.md — scores Homepage 3/10, Gamme Rita 2/10  
**Constat :** Les deux pages utilisent la même photo Rita Camel gros plan sur fond gris. Violation directe règle IMAGE_SELECTION §6.8 "Jamais deux heroes avec la même photo". De plus, fond gris studio = interdit par §6.2 ("Photo produit studio sur fond gris neutre — NON").  
**Correction :** Suivre les briefs photo de PHOTO_BRIEF_SARA_VALENTI.md :
- Homepage : photo lifestyle porté, heure dorée, tiers bas-gauche sombre (Unsplash `leather bag paris street golden hour`)
- Gamme Rita : gros plan texture cuir brossé, lumière rasante (Unsplash `leather texture macro natural light`)

---

### IMP-12 — Gamme Mina hero : sujet taupe sur fond gris, aucune zone sombre

**Dimension :** Design  
**Source :** PHOTO_BRIEF_SARA_VALENTI.md — score Gamme Mina 3/10  
**Constat :** Sac taupe sur fond gris clair — contraste quasi nul, aucune profondeur. La règle §6.4 exige une sous-exposition intentionnelle et un fond dans les tons de la matière pour le suède.  
**Correction :** Remplacer par photo lifestyle ou Mina Noir accroché sur fond texturé sombre. Priorité P2.

---

### IMP-13 — À propos : photo de sac sur page marque, CTA absent

**Dimension :** Design / Copywriting  
**Source :** PHOTO_BRIEF_SARA_VALENTI.md score 4/10 ; AUDIT_SARA_VALENTI.md IMP-08  
**Constat :** Photo du sac Rita sur une page qui raconte l'histoire de la marque. Règle §6.5 : "NON : photo de sac (c'est une page marque, pas produit)". De plus, aucun CTA en bas de page (COPYWRITING_RULES.md : les pages éditoriales se terminent par un appel à l'action).  
**Correction :**
1. Remplacer le hero par une photo mains d'artisan ou atelier (Unsplash `leather craftsman atelier hands`)
2. Ajouter en bas de page : `<Link href="/catalogue">Découvrir la collection</Link>`

---

### [CORRIGÉ] IMP-14 — CSP : script-src 'unsafe-inline' non documenté

**Dimension :** Sécurité  
**Fichier :** `next.config.ts` ligne 7  
**Constat :** `'unsafe-inline'` permet l'exécution de scripts inline en production. C'est assumé pour Tailwind + Next.js inline scripts, mais `upgrade-insecure-requests` est absent.  
**Correction :**
```ts
// Ajouter dans la CSP :
"upgrade-insecure-requests",
// Documenter que 'unsafe-inline' est assumé et 'unsafe-eval' est absent
```

---

### [CORRIGÉ] IMP-15 — Locales EN/NL/DE actives mais livraison France uniquement

**Dimension :** Internationalisation / UX  
**Résolution :** Zones de livraison étendues à FR/BE/NL/DE/CH/LU dans `livraison/page.tsx` (meta, schemaFaq, FAQ visible) et `cgv/page.tsx` (Article 6).

**Roadmap post go-prod :**
- Configurer les transporteurs Boxtal pour BE/NL/DE/CH/LU (tarifs et délais par zone)
- Traduire les pages EN/NL/DE (livraison, cgv, retours)
- Passer les hreflang par pays (ex: `nl-BE`, `de-DE`, `de-CH`) et non plus seulement par langue

---

### IMP-16 — Sitemap : 155 URLs vs 115+ attendues (vérification GROQ requise)

**Dimension :** SEO  
**Confirmé au crawl :** 155 URLs avec 91 URLs `/catalogue/[modele]-[couleur]`. Attendu : 88 variantes + 27 modèles + pages statiques + gammes.  
**Constat :** Le compte de 91 (au lieu de 88) peut indiquer des doublons ou des variantes orphelines. La priorité 0.9 sur les pages couleur est correcte.  
**Vérification :**
```bash
curl https://sara-valenti.vercel.app/sitemap.xml | grep "<url>" | wc -l
```

---

### [CORRIGÉ] IMP-17 — OG image ratio 4:3 au lieu de 1.91:1

**Dimension :** SEO / Partage social  
**Fichier :** `layout.tsx:41`  
**Constat :** Images OG en 1200×900 (4:3). Facebook, LinkedIn, Twitter recadrent ce ratio et peuvent couper le sujet principal. Le standard recommandé est 1200×630 (1.91:1).  
**Correction :** `urlFor(image).width(1200).height(630).fit('crop')` dans `generateMetadata`.

---

### IMP-18 — Newsletter : code promo 10 % promis sans flow Brevo configuré

**Dimension :** E-commerce / Copywriting  
**Fichier :** `components/layout/NewsletterBandeau.tsx` ligne 58  
**Constat :** "Inscrivez-vous et recevez 10 % de remise sur votre première commande." La route `/api/newsletter` envoie l'email à Brevo mais sans logique de génération de code promo. Les clients s'inscriront sans recevoir leur remise.  
**Correction :** Soit configurer le flow Brevo avec génération de code promo avant go prod, soit remplacer par : `'Inscrivez-vous pour recevoir nos actualités et offres exclusives.'`

---

## MINEURS — à traiter en backlog

---

### [CORRIGÉ] MIN-01 — H1 catalogue générique sans mots-clés

**Fichier :** `catalogue/page.tsx`  
**Constat :** H1 = "Catalogue" + sous-titre. SEO-faible pour la page de catégorie principale.  
**Correction :** H1 `'Sacs en cuir italien'` (aligne avec la homepage) + sous-titre conservé.

---

### [CORRIGÉ] MIN-02 — Pas de WebSite schema avec SearchAction

**Fichier :** `page.tsx` homepage  
**Constat :** Schema `Organization` présent mais pas de `WebSite` avec `SearchAction` pour la barre de recherche Google.  
**Correction :**
```json
{ "@type": "WebSite", "url": "https://www.saravalenti.fr",
  "potentialAction": { "@type": "SearchAction",
    "target": "https://www.saravalenti.fr/catalogue?q={search_term_string}",
    "query-input": "required name=search_term_string" } }
```

---

### MIN-03 — CTAs homepage trop similaires (3 CTAs qui font la même chose)

**Fichier :** `page.tsx`  
**Constat :** "Découvrir la collection →", "Voir tout le catalogue", "Voir la collection" : trois CTAs redondants. Von Restorff Effect inversé — l'abondance noie l'importance.  
**Correction :** Garder 1 CTA primaire ("Voir le catalogue") par section. Les CTAs secondaires doivent être distincts par gamme ("Découvrir la gamme Rita", "Voir Grazia").

---

### [CORRIGÉ] MIN-04 — Pas de canonical explicite par page dynamique

**Fichier :** Pages catalogue et gamme  
**Constat :** Next.js génère les canonicals depuis `metadataBase` mais les pages dynamiques ne définissent pas `alternates.canonical` explicitement. En cas de paramètres UTM dans l'URL, le canonical peut pointer vers l'URL avec paramètres.  
**Correction :** Dans `generateMetadata` des pages catalogue :
```ts
alternates: { canonical: `https://www.saravalenti.fr/catalogue/${slug}` }
```

---

### [CORRIGÉ] MIN-05 — BreadcrumbList absent sur les pages gamme

**Fichier :** `gamme/[slug]/page.tsx`  
**Constat :** Les fiches couleur ont un `BreadcrumbList` 4 niveaux (Phase 5g). Les pages gamme `/gamme/rita` n'en ont pas.  
**Correction :** Ajouter `Accueil > Rita` en schema.org `BreadcrumbList` sur les pages gamme.

---

### MIN-06 — Section "Modèles phares" homepage : dimensions Rita "environ 30 x 22 cm"

**Fichier :** `gamme/[slug]/page.tsx` ligne 51  
**Constat :** "Environ" sans précision H/L/P. Contradictions potentielles avec les dimensions Sanity.  
**Correction :** Attendre les données Sanity confirmées puis remplacer par les dimensions exactes ou supprimer le "environ".

---

### MIN-07 — Politique de cookies absente

**Fichier :** Layout global  
**Constat :** Aucun bandeau consentement. Actuellement OK (pas de cookies tiers). Si Brevo ou analytics sont activés en prod, la conformité RGPD sera bloquée.  
**Recommandation :** Ajouter une notice minimale "Ce site n'utilise pas de cookies de traçage" ou préparer un bandeau consent si analytics activé.

---

### MIN-08 — "100% cuir véritable" dans FicheProduit (registre mass-market)

**Fichier :** `components/produit/FicheProduit.tsx` ligne 273  
**Constat :** "100% cuir véritable" est le wording des marques mass-market. L'AnnouncementBar a déjà été corrigé vers "Cuir naturel italien" mais FicheProduit conserve l'ancienne formulation.  
**Correction :** `'Cuir naturel italien'` — cohérent avec BRAND_VOICE.md et l'AnnouncementBar.

---

### MIN-09 — Fiche produit : accordéon "Description" absent (2 accordéons affichés au lieu de 3)

**Confirmé au crawl :** Deux sections extensibles listées (Caractéristiques + Entretien) au lieu de 3 (Description + Caractéristiques + Entretien).  
**Fichier :** `components/produit/FicheProduit.tsx`  
**Constat :** ETAT.md Phase 5h décrit 3 accordéons dont "Description (ouvert par défaut)". Si la description n'est pas visible dans le DOM crawlé, elle peut être rendue inline (avant les accordéons) — à vérifier visuellement.  
**Correction :** Vérifier en local que `useState(true)` sur le premier accordéon le rend bien visible dans le DOM initial.

---

### MIN-10 — Footer colonne "Mon compte" : "Mes commandes" trompeur si non connecté

**Fichier :** `components/layout/Footer.tsx`  
**Constat :** "Mes commandes" dans le footer implique des commandes existantes. L'utilisateur non connecté est redirigé vers la connexion sans message d'explication.  
**Recommandation :** Conserver le libellé (standard e-commerce) mais s'assurer que la page `/compte/commandes` a un état vide clair avec CTA "Se connecter".

---

### MIN-11 — Fiche produit : accordéon description manque le lien guide entretien si cuir irisé

**Fichier :** `components/produit/FicheProduit.tsx`  
**Constat :** L'accordéon Entretien pointe vers `/entretien-cuir` — excellent. Mais le guide entretien n'a pas de section "cuir irisé" si le modèle est en cuir irisé.  
**Correction :** Vérifier dans `/entretien-cuir/page.tsx` qu'une section cuir irisé existe et est liée depuis les fiches produit correspondantes.

---

## Récapitulatif par dimension

### DESIGN & VISUEL

| Ref | Criticité | Problème |
|-----|-----------|----------|
| IMP-11 | IMPORTANT | Heroes homepage + gamme Rita : même photo, fond studio gris |
| IMP-12 | IMPORTANT | Gamme Mina hero : taupe sur gris, aucune zone sombre |
| IMP-13 | IMPORTANT | À propos : photo de sac sur page marque |
| MIN-03 | MINEUR | 3 CTAs redondants sur la homepage |
| MIN-09 | MINEUR | Accordéon Description potentiellement invisible |

**Points positifs :**
- Gamme Grazia hero 6/10 : sac noir suède = contraste naturel excellent
- `sv-mid` corrigé à `#5a5552` — WCAG AA 4.6:1
- Grille `grid-cols-2 md:grid-cols-3 xl:grid-cols-4` conforme au design system
- Tokens Cormorant Garamond + DM Sans bien implémentés
- AnnouncementBar `bg-sv-black` + texte `sv-cream` — conforme §3.11

---

### COPYWRITING & BRAND VOICE

| Ref | Criticité | Problème |
|-----|-----------|----------|
| BLQ-02 | BLOQUANT | Contradiction prix meta vs FAQ (19,90 vs 109,90) |
| BLQ-05 | BLOQUANT | Mentions légales : 3 placeholders RGPD |
| BLQ-06 | BLOQUANT | CGV : PayPal mentionné mais absent |
| BLQ-07 | BLOQUANT | Retours : email de contact manquant |
| IMP-01 | IMPORTANT | Checkout : 6 champs sans accents |
| IMP-02 | IMPORTANT | Tirets cadrantins dans titre, meta, alt |
| IMP-03 | IMPORTANT | "cuir pleine surface" (règle dure) |
| IMP-04 | IMPORTANT | Accents manquants dans 6 autres pages |
| IMP-07 | IMPORTANT | Grazia : "suède" uniquement dans tous les textes SEO |
| IMP-08 | IMPORTANT | Rita FAQ : couleurs inexistantes |
| IMP-09 | IMPORTANT | Grazia FAQ : couleurs inexistantes |
| MIN-08 | MINEUR | "100% cuir véritable" dans FicheProduit |

**Points positifs :**
- Ton éditorial des pages gamme (Rita, Grazia, Mina) : niveau Polène/Sézane
- FAQ homepage 8 questions bien structurées
- AnnouncementBar : "Cuir naturel italien" — registre correct
- Wording CTAs : "Découvrir la collection", "Ajouter au panier" — conforme
- Aucun "Acheter maintenant", aucun "N'hésitez pas à"

---

### SEO / GEO / AEO

| Ref | Criticité | Problème |
|-----|-----------|----------|
| BLQ-03 | BLOQUANT | Catalogue HTML initial = "Chargement..." (produits non indexés) |
| BLQ-08 | BLOQUANT | /api/ bloqué dans robots.txt |
| BLQ-09 | BLOQUANT | Sitemap pointe www.saravalenti.fr sur staging |
| IMP-05 | IMPORTANT | llms.txt absent (GEO) |
| IMP-06 | IMPORTANT | Hreflang absent |
| IMP-07 | IMPORTANT | Grazia : meta SEO incomplets (suède seulement) |
| IMP-10 | IMPORTANT | Schema ProductGroup absent sur pages modèle |
| IMP-16 | IMPORTANT | Sitemap 155 URLs à vérifier (91 couleurs vs 88 attendues) |
| IMP-17 | IMPORTANT | OG image ratio 4:3 au lieu de 1.91:1 |
| MIN-01 | MINEUR | H1 catalogue "Catalogue" générique |
| MIN-02 | MINEUR | WebSite schema + SearchAction absent |
| MIN-04 | MINEUR | Canonicals explicites absents |
| MIN-05 | MINEUR | BreadcrumbList absent sur pages gamme |

**Points positifs :**
- Sitemap dynamique en place (155 URLs, priorités correctes)
- Schema.org Product + BreadcrumbList + isVariantOf sur fiches couleur
- Schema.org Organization + FAQPage homepage
- Schema.org HowTo + FAQPage sur /entretien-cuir
- meta description homepage présente avec modèles et prix
- Architecture URL double-niveau `/catalogue/rita` + `/catalogue/rita-camel` — best practice

---

### SÉCURITÉ

| Ref | Criticité | Problème |
|-----|-----------|----------|
| IMP-14 | IMPORTANT | CSP : 'unsafe-inline' présent, upgrade-insecure-requests absent |

**Points positifs :**
- X-Frame-Options: DENY en place
- X-Content-Type-Options: nosniff
- HSTS: max-age=63072000 includeSubDomains preload
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera, microphone, geolocation bloqués
- Stripe webhook : vérification signature HMAC en place
- RLS Supabase : 18 tables avec RLS activé
- Aucun secret en NEXT_PUBLIC_
- /studio bloqué dans robots.txt

---

### PERFORMANCE

| Ref | Criticité | Problème |
|-----|-----------|----------|
| BLQ-10 | BLOQUANT | LCP 9,6 s — image hero sans `priority` |
| — | IMPORTANT | JS excessif — 388 Ko économisables (Lighthouse) |
| — | IMPORTANT | Poids total page 1 949 Ko (budget : ≤ 1 Mo homepage) |

**Actions P1 (après LCP) :**
1. Installer `@next/bundle-analyzer` et inspecter le bundle
2. Descendre `"use client"` au plus bas niveau possible
3. Vérifier que les images Sanity sont servies avec `urlFor().width(800).format('webp')`
4. `sizes` sur toutes les `<Image>` du catalogue

**Points positifs :**
- TTFB : 10 ms (excellent — serveur Vercel Edge rapide)
- CLS : 0 (excellent — `width/height` sur tous les `<Image>`)
- FCP : 1,5 s (bon — ≤ 1 800 ms)
- Fonts via next/font — zéro render-blocking
- 12 premières cartes catalogue en `priority={true}`

---

### E-COMMERCE

| Ref | Criticité | Problème |
|-----|-----------|----------|
| BLQ-01 | BLOQUANT | Elia à 19,90 € (erreur de données) |
| BLQ-06 | BLOQUANT | CGV : PayPal mentionné mais absent |
| BLQ-07 | BLOQUANT | Retours : email de contact manquant |
| IMP-15 | IMPORTANT | EN/NL/DE actifs mais livraison France uniquement |
| IMP-18 | IMPORTANT | Code promo 10 % promis sans flow Brevo |

**Actions go-prod restantes (ETAT.md) :**
1. Créer webhook Stripe → récupérer `STRIPE_WEBHOOK_SECRET`
2. Pointer DNS saravalenti.fr → Vercel (Ionos)
3. CORS Studio Sanity : ajouter `https://www.saravalenti.fr`
4. Token Sanity Editor pour le script `update-descriptions-rita.ts`
5. Configurer `BREVO_LIST_ID_NEWSLETTER`

**Points positifs :**
- Guest checkout en place (règle Baymard n°2 — compte non obligatoire)
- Tunnel 3 étapes : adresse → livraison → paiement (conforme Baymard)
- Pictos réassurance sous le CTA "Ajouter au panier"
- Seuil livraison 45 EUR affiché dans l'AnnouncementBar et la page livraison
- Maquette abandon panier (Brevo) prête (stub fonctionnel)
- Apple Pay / Google Pay via Stripe Elements à activer dans le dashboard

---

### POSITIONNEMENT CONCURRENTIEL

**Versus Oh My Bag (dominant, 759 refs, 4.9/5, 341 avis) :**
- Sara Valenti doit capitaliser sur l'artisanat italien et les pages gamme — différenciateurs que Oh My Bag n'a pas
- Livraison dès 45 EUR (vs sans seuil chez OhMyBag) — acceptable au lancement
- Zéro avis au lancement = faiblesse critique : lancer la collecte dès J+1 (séquence Brevo J+7, J+14)

**Versus Maison 1921 (187 refs, 4.79/5, 321 avis) :**
- Sara Valenti surpasse déjà Maison 1921 sur le SEO on-page (H1 ciblé, meta descriptions, schema.org)
- Maison 1921 n'a pas de page À propos (404) — Sara Valenti peut prendre cette position de confiance

**Versus Dione Couture (simili vegan, 46 avis) :**
- Pas un concurrent direct. Éviter toute mention comparative.
- Opportunité : positionner "cuir naturel artisanal" comme catégorie distincte du "simili vegan"

**Opportunités SEO non exploitées par les concurrents :**
- "sac cuir brossé femme" — faible concurrence
- "sac artisanal cuir italie" — très faible concurrence
- "entretien sac cuir brossé" — quasi nulle (contenu à créer sur le blog)
- "sac cuir made in italy femme" — fort potentiel

---

### ACCESSIBILITÉ

**Scores Lighthouse :** A11Y 91/100 — cible go-live : ≥ 95.

**4 points manquants (estimé) — causes probables :**
- `sv-gold (#b8935a)` sur `sv-cream (#f5f0ea)` : ratio ~2.1:1 — INSUFFISANT pour le texte normal (WCAG AA exige 4.5:1). Ce token ne doit jamais être utilisé pour du texte sur fond clair, seulement pour les fonds et bordures.
- Boutons paiement/CTA sans `aria-label` suffisant si icône seule
- Hiérarchie de titres à vérifier sur les pages dynamiques (présence d'un seul H1)

**Actions :**
1. Passer aXe DevTools audit complet — identifier les 4 violations AA exactes
2. Vérifier que `sv-gold` n'est jamais utilisé pour du texte sur fond clair (utiliser `sv-gold-dark #7e5e2c`)
3. Re-mesurer avec Lighthouse (cible : ≥ 95)

**Points positifs :**
- `:focus-visible` avec `outline: 2px solid var(--sv-gold)` — Focus visible global en place
- `aria-pressed` sur les swatches cartes et miniatures fiche
- `aria-controls/id` sur les accordéons
- `aria-valuetext` sur le slider prix
- `aria-label` sur les swatches sidebar
- Boutons CTA min 44×44px (règle touch target)
- Structure sémantique correcte (`<article>` pour les cartes, `<nav>` pour la navigation)

---

## Plan d'action — Priorité absolue

### Sprint pré-lancement (cette semaine)

1. **[BLQ-01]** Corriger le prix Elia dans Sanity Studio
2. **[BLQ-02]** Harmoniser le prix dans meta description homepage et FAQ
3. **[BLQ-03]** Passer le catalogue en rendu serveur (isoler `useSearchParams`)
4. **[BLQ-04]** Créer `/confidentialite` (page RGPD)
5. **[BLQ-05]** Renseigner les 3 placeholders dans `/mentions-legales`
6. **[BLQ-06]** Corriger les CGV (supprimer PayPal)
7. **[BLQ-07]** Ajouter l'email de retour dans `/retours`
8. **[BLQ-08]** Corriger `robots.ts` — autoriser les flux API publics
9. **[BLQ-09]** Configurer `NEXT_PUBLIC_SITE_URL` dans Vercel Preview + Production
10. **[BLQ-10]** Ajouter `priority` sur l'image hero de chaque page (homepage, Rita, Grazia, Mina, À propos)

### Sprint post-lancement (semaines 2-3)

11. **[IMP-01]** Accents manquants dans le checkout (Prénom, Téléphone, réessayer...)
12. **[IMP-02]** Tirets cadrantins dans titre, meta, alt
13. **[IMP-03]** "cuir pleine surface" → "cuir structuré ou grainé"
14. **[IMP-04]** Accents manquants dans les autres pages (confirmation, compte, Épuisé)
15. **[IMP-05]** Créer `/public/llms.txt`
16. **[IMP-07]** Grazia : meta + H1 + sous-titre hero avec "suède ET grainé"
17. **[IMP-08 + IMP-09]** Couleurs inexistantes dans les FAQ Rita et Grazia
18. **[IMP-11 + IMP-12 + IMP-13]** Remplacer les heroes (Unsplash en attendant le shooting)

### Backlog (mois 2)

19. **[IMP-06]** Hreflang dans le layout
20. **[IMP-10]** Schema ProductGroup sur pages modèle
21. **[IMP-14]** CSP : ajouter `upgrade-insecure-requests`
22. **[IMP-15]** Avertissement livraison France sur les locales EN/NL/DE
23. **[IMP-17]** OG image recadrée en 1200×630
24. **[IMP-18]** Flow Brevo code promo 10 % ou reformuler la promesse
25. **[MIN-01 à MIN-11]** Polish design et SEO

---

## Checklist go-prod (complémentaire à END_OF_SESSION_CHECKLIST.md)

- [ ] Elia prix ≥ 75 EUR dans Sanity Studio
- [ ] `/confidentialite` accessible et liée depuis footer + newsletter
- [ ] `/mentions-legales` sans placeholder
- [ ] robots.txt : `/api/webhook` bloqué, `/api/google-feed` accessible
- [ ] Sitemap pointe `https://www.saravalenti.fr`
- [ ] `priority` sur tous les heroes
- [ ] Accents checkout : Prénom, Téléphone, réessayer, redirigé
- [ ] Webhook Stripe configuré (`STRIPE_WEBHOOK_SECRET`)
- [ ] DNS saravalenti.fr pointé vers Vercel
- [ ] CORS Sanity Studio avec `https://www.saravalenti.fr`
- [ ] LCP mesuré ≤ 4 s après correction `priority`
- [ ] Accessibilité re-mesurée ≥ 92 (cible go-live, ≥ 95 en mois 2)

---

*Généré : juin 2026 — Audit complet multi-dimensions sur staging https://sara-valenti.vercel.app*  
*Supersède AUDIT_SARA_VALENTI.md + AUDIT_TEXTES_SARA_VALENTI.md*  
*Prochaine mise à jour : après go prod ou lors d'un changement structurant*
