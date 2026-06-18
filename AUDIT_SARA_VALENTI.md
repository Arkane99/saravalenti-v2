# AUDIT_SARA_VALENTI.md

Audit global du projet Sara Valenti V2 — staging https://sara-valenti.vercel.app  
Date : juin 2026 — Base : CLAUDE.md, ETAT.md, DESIGN_RULES.md, COPYWRITING_RULES.md, SEARCH_RULES.md, SECURITY_RULES.md, COMPONENT_LIBRARY.md

---

## Résumé exécutif

| Criticité | Nombre | Domaines |
|---|---|---|
| BLOQUANT | 5 | Légal, SEO, données, robots |
| IMPORTANT | 12 | SEO, sécurité, copywriting, UX |
| MINEUR | 9 | Contenu, design, perf |

**Go prod conditionnel** — les 5 points BLOQUANTS doivent être corrigés avant `vercel --prod`.  
Les points IMPORTANTS sont à traiter dans les 2 semaines post-lancement.

---

## BLOQUANTS — à corriger avant la mise en prod

---

### BLQ-01 — Politique de confidentialité RGPD absente

**Domaine :** Légal  
**Fichier :** `/app/(site)/[locale]/` — page manquante  
**Constat :** Le site collecte des données personnelles (inscription newsletter avec consentement RGPD, création de compte Supabase, commandes, emails transactionnels Brevo). La page `/confidentialite` ou `/politique-de-confidentialite` est absente. Le `NewsletterBandeau` fait référence à `/mentions-legales` au lieu d'une politique de confidentialité dédiée.

**Pourquoi c'est bloquant :** Obligation légale (RGPD art. 13) pour tout site collectant des données personnelles. L'absence constitue une infraction. En cas de contrôle CNIL ou de plainte client, le site est en faute.

**Correction :**
1. Créer `app/(site)/[locale]/confidentialite/page.tsx`
2. Contenu minimum : responsable du traitement, données collectées, durée de conservation, droits des utilisateurs (accès, rectification, suppression), cookies, base légale de chaque traitement
3. Lier depuis le footer (colonne Informations) et depuis le `NewsletterBandeau`
4. Ajouter au sitemap.ts

---

### BLQ-02 — /api/ bloqué dans robots.txt — flux marketplaces inaccessibles

**Domaine :** SEO / Marketplaces  
**Fichier :** `app/robots.ts:11`  
**Constat :**
```ts
disallow: ['/studio', '/api/'],
```
Le `robots.txt` interdit tout le répertoire `/api/` aux bots. Or les flux marketplaces sont des routes API **publiques** conçues pour être crawlées :
- `/api/google-feed` — Google Merchant Center
- `/api/meta-feed` — Meta Commerce Manager
- `/api/tiktok-feed` — TikTok Shop

Ces flux ne peuvent pas être soumis à Google Merchant Center si les bots n'y ont pas accès.

**Correction :**
```ts
// app/robots.ts
disallow: ['/studio', '/api/webhook', '/api/checkout', '/api/auth/'],
// Retirer le /api/ générique — laisser les flux publics accessibles
```

---

### BLQ-03 — Catalogue affiche "Chargement..." pour les bots (SEO)

**Domaine :** SEO critique  
**Fichier :** `components/catalogue/CatalogueClient.tsx` (wrappé dans `<Suspense>`)  
**Constat :** Le catalogue `/catalogue` utilise `useSearchParams` dans `CatalogueClient`, ce qui force le composant dans une `<Suspense>`. Sur le rendu serveur initial (HTML envoyé aux bots), la boundary Suspense retourne le fallback `"Chargement..."` — les 27 modèles et 88 variantes ne sont **pas dans le HTML initial**. Google indexe une page vide.

**Vérification :** `curl https://sara-valenti.vercel.app/catalogue | grep -i "rita\|sac\|catalogue"` retourne uniquement les éléments hors Suspense.

**Correction :** Passer le catalogue en rendu serveur avec les produits pre-rendered, en isolant `useSearchParams` dans un composant client feuille minimal :

```tsx
// CatalogueClient.tsx — rendre les produits côté serveur, isoler useSearchParams
// Option 1 : generateStaticParams sur la page catalogue avec filtres par défaut
// Option 2 : passer les produits filtrés depuis le Server Component parent,
//            useSearchParams uniquement pour la re-filtration côté client
```

---

### BLQ-04 — Prix incohérent — Elia affiché à 19,90 € (devrait être ~109,90 €)

**Domaine :** Données / E-commerce  
**Fichier :** Données Sanity (projet r949oibi)  
**Constat :** La page `/catalogue/elia` affiche 19,90 € pour un sac en cuir suède. Tous les autres modèles sont à 109,90 €. La FAQ homepage mentionne "à partir de 109,90€". Ce prix est visiblement une erreur d'import depuis le CSV WooCommerce.

**Impact :** Un client qui commande à 19,90 € pourrait exiger ce prix. Problème légal et commercial avant la mise en prod.

**Correction :**
1. Vérifier dans Sanity Studio le document `elia` → prix des variantes
2. Vérifier dans `data/wc-product-export-8-6-2026.csv` le prix source de l'Elia
3. Corriger directement dans Sanity Studio (ou via script patch)
4. Vérifier les autres modèles atypiques : Grazita, modèles "uniques" listés dans le brief

---

### BLQ-05 — Sitemap pointe vers www.saravalenti.fr sur le staging

**Domaine :** SEO / Configuration  
**Fichier :** `app/sitemap.ts:6`, `app/robots.ts:15`  
**Constat :**
```ts
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'
```
`NEXT_PUBLIC_SITE_URL` n'est pas configurée dans Vercel pour l'environnement Preview. Le sitemap et le robots.txt générés sur staging contiennent donc `https://www.saravalenti.fr` au lieu de `https://sara-valenti.vercel.app`. Conséquence : le robots.txt pointe vers un sitemap inexistant sur le domaine de prod (non encore actif).

**Impact actuel** : le sitemap retourné par le staging ne peut pas être soumis à Google Search Console (mauvais domaine).

**Correction :**
```bash
# Dans Vercel, pour l'environnement Preview :
vercel env add NEXT_PUBLIC_SITE_URL preview
# Valeur : https://sara-valenti.vercel.app

# Pour production (à faire au moment du go prod) :
vercel env add NEXT_PUBLIC_SITE_URL production
# Valeur : https://www.saravalenti.fr
```

---

## IMPORTANTS — à traiter dans les 2 semaines post-lancement

---

### IMP-01 — llms.txt absent (GEO)

**Domaine :** GEO (Generative Engine Optimization)  
**Fichier :** `/public/llms.txt` — à créer  
**Constat :** `GET https://sara-valenti.vercel.app/llms.txt` → 404. Le standard llms.txt est le signal principal pour la visibilité dans ChatGPT, Claude, Gemini et Perplexity. Pour un e-commerce positionnement cuir italien, la cible "meilleur sac en cuir fabriqué en Italie" est exactement le type de requête traité par les LLMs.

**Correction :** Créer `/public/llms.txt` :

```markdown
# Sara Valenti

> Boutique en ligne française de sacs en cuir fabriqués dans des ateliers italiens. 
> Cuir brossé, suède et grainé. Modèles intemporels à partir de 109,90 EUR. Livraison offerte dès 45 EUR.

## Collection

- [Sacs Rita en cuir brossé](/gamme/rita): Sac à main cuir brossé, 5 coloris, 109,90 EUR
- [Sacs Grazia en suède et grainé](/gamme/grazia): 13 coloris, cuir naturel doux
- [Sacs Mina](/gamme/mina): Sac cabas polyvalent
- [Catalogue complet](/catalogue): 27 modèles, 88 variantes couleur

## Informations marque

- [À propos](/a-propos): Marque française, fabrication italienne
- [Guide entretien cuir](/entretien-cuir): Guide par type de cuir
- [Livraison et retours](/livraison): Livraison offerte dès 45 EUR, retours 14 jours
```

---

### IMP-02 — Hreflang absent du layout global

**Domaine :** SEO Multilingue  
**Fichier :** `app/(site)/[locale]/layout.tsx`  
**Constat :** Le layout définit `metadata` sans `alternates.languages`. Les 4 locales (FR/EN/NL/DE) sont configurées dans next-intl mais Google ne sait pas qu'elles existent — aucun tag `<link rel="alternate" hreflang="...">` n'est généré.

**Correction :**
```ts
// app/(site)/[locale]/layout.tsx
export const metadata: Metadata = {
  // ...existing...
  alternates: {
    canonical: 'https://www.saravalenti.fr',
    languages: {
      'fr': 'https://www.saravalenti.fr/fr',
      'en': 'https://www.saravalenti.fr/en',
      'nl': 'https://www.saravalenti.fr/nl',
      'de': 'https://www.saravalenti.fr/de',
      'x-default': 'https://www.saravalenti.fr',
    },
  },
}
```
Et dans chaque `generateMetadata` de page dynamique, passer les alternates spécifiques à la page.

---

### IMP-03 — Schema.org Product manquant sur les pages modèle `/catalogue/[modele]`

**Domaine :** SEO / AEO  
**Fichier :** `app/(site)/[locale]/catalogue/[slug]/page.tsx` — pages ProductGroup  
**Constat :** Les pages modèle (`/catalogue/rita`) génèrent un schema `Product` classique. Mais elles sont des pages `ProductGroup` (27 couleurs). Le schema correct est `ProductGroup` avec `hasVariant` ou `ItemList`.

**Correction :**
```json
{
  "@type": "ProductGroup",
  "name": "Sac Rita",
  "description": "...",
  "brand": { "@type": "Brand", "name": "Sara Valenti" },
  "hasVariant": [
    { "@type": "Product", "name": "Rita Camel", "color": "Camel", "url": "/catalogue/rita-camel", "offers": { ... } }
  ]
}
```

---

### IMP-04 — CSP : script-src 'unsafe-inline' sans nonce

**Domaine :** Sécurité  
**Fichier :** `next.config.ts:7`  
**Constat :**
```ts
"script-src 'self' 'unsafe-inline' js.stripe.com",
```
`'unsafe-inline'` permet l'exécution de n'importe quel script inline — vecteur d'attaque XSS. La valeur est présente en production (pas seulement en dev).

**Note :** L'alternative (nonces) est plus complexe sur Next.js et force le rendu dynamique. Pour un site SSG, la mitigation pragmatique est :
1. S'assurer que `'unsafe-eval'` n'est pas présent (OK — il ne l'est pas)
2. Ajouter `upgrade-insecure-requests` (actuellement absent)
3. Documenter que `'unsafe-inline'` est assumé pour Tailwind et les inline scripts Next.js

**Correction minimale :**
```ts
// Ajouter dans la CSP :
"upgrade-insecure-requests",
// Vérifier que 'unsafe-eval' reste absent en prod (c'est le cas actuellement)
```

---

### IMP-05 — FAQ Homepage : 8 questions dans le code, 4 visibles au crawl

**Domaine :** AEO / SEO  
**Fichier :** `app/(site)/[locale]/page.tsx`  
**Constat :** D'après ETAT.md, 8 questions FAQ ont été ajoutées en phase 5f. La page crawlée n'en affiche que 4. Le schéma `FAQPage` doit refléter les 8 questions pour maximiser les featured snippets.

**Vérification recommandée :** Inspecter le rendu de `https://sara-valenti.vercel.app` en HTML source — vérifier si les 8 questions sont dans le DOM ou si le composant FAQ est conditionnel/masqué.

---

### IMP-06 — robots.txt : URL sitemap ne correspond pas au domaine staging

(Voir BLQ-05 — déjà documenté en BLOQUANT)

---

### IMP-07 — AnnouncementBar non détectée au crawl

**Domaine :** Design / UX  
**Fichier :** `components/layout/AnnouncementBar.tsx`  
**Constat :** Le bandeau défilant est un Server Component présent dans le layout, mais il n'a pas été détecté dans la réponse du crawler de la homepage. Vérifier visuellement que le bandeau s'affiche bien et qu'il n'est pas masqué par un `hidden` ou un ordre CSS.

**Note :** Le composant est bien importé dans `layout.tsx:77` avant `<Header />`. Si le problème persiste, vérifier `globals.css` → `.animate-marquee` et `@keyframes marquee`.

---

### IMP-08 — /a-propos : voix à la première personne incohérente + CTA absent

**Domaine :** Copywriting  
**Fichier :** `app/(site)/[locale]/a-propos/page.tsx`  
**Constat :**
1. Le crawler relève l'usage du "je" dans "Sara Valenti est née d'une conviction" — si la fondatrice ne se présente pas nominalement, ce "je" flotte sans ancrage.
2. Aucun CTA en fin de page vers le catalogue ou les gammes. D'après COPYWRITING_RULES.md, les pages éditoriales se terminent avec un appel à l'action.
3. Le titre H1 crawlé est "À propos de Sara Valenti" — format correct mais pas de mot-clé SEO (type de produit).

**Correction :**
- Ajouter en fin de page : `<Link href="/catalogue">Découvrir la collection</Link>` avec le style CTA
- Vérifier que le titre H1 ou H2 contient "sacs en cuir" ou "cuir italien" pour le SEO

---

### IMP-09 — Page /livraison : pas de grille tarifaire, contradiction délais

**Domaine :** Copywriting / UX  
**Fichier :** `app/(site)/[locale]/livraison/page.tsx`  
**Constat :**
1. Pas de prix de livraison affichés (renvoi au calcul au checkout) — frustrant pour l'utilisateur avant de commencer une commande
2. Contradiction : "expédiées le jour même avant midi" dans un endroit, "24–48h" dans la FAQ
3. D'après ETAT.md Phase 5d, les prix mock Boxtal sont : Colissimo 5,49/6,99 EUR, Mondial Relay 3,99 EUR, Chronopost 9,99 EUR. Ces prix peuvent être affichés comme indicatifs.

**Correction :**
```
Indicatif (calculé précisément au checkout) :
- Mondial Relay : à partir de 3,99 EUR (3–5 jours)
- Colissimo : à partir de 5,49 EUR (2–5 jours)
- Chronopost : à partir de 9,99 EUR (24h)
- Livraison offerte dès 45 EUR d'achats
```
Harmoniser les délais d'expédition à "sous 2 jours ouvrés" dans toutes les pages.

---

### IMP-10 — Sitemap : 39 URLs au lieu de 115+

**Domaine :** SEO  
**Fichier :** `app/sitemap.ts`  
**Constat :** Le crawler du sitemap retourne 39 URLs. Attendu : 5 pages statiques + 27 modèles + 88 couleurs + 3 gammes + 5 pages infos = ~130 URLs. La discordance peut venir de deux causes :
1. `REQUETE_SLUGS_COULEURS` ne retourne pas les 88 variantes (problème Sanity ou query)
2. Le sitemap est correctement généré mais en HTML rendu (pas XML) pour le crawler

**Vérification :**
```bash
curl https://sara-valenti.vercel.app/sitemap.xml | grep "<url>" | wc -l
```
Si < 115, vérifier la query GROQ `REQUETE_SLUGS_COULEURS` et ses résultats dans Sanity Studio.

---

### IMP-11 — Politique de livraison : "France métropolitaine uniquement" pas cohérent avec EN/NL/DE

**Domaine :** Internationalisation / UX  
**Fichier :** `app/(site)/[locale]/livraison/page.tsx`  
**Constat :** La page livraison indique "uniquement en France métropolitaine et en Corse". Les routes EN, NL, DE sont actives dans next-intl (dans le routing). Si un visiteur néerlandophone accède au site en `/nl/`, il voit une page livraison disant que la livraison est uniquement en France.

**Correction à court terme :** Ajouter une note "Site en cours d'internationalisation — livraison France uniquement pour l'instant" ou désactiver les locales non-FR jusqu'au go prod.

---

### IMP-12 — OG image de la homepage : ratio non standard

**Domaine :** SEO / Partage social  
**Fichier :** `app/(site)/[locale]/layout.tsx:41`  
**Constat :**
```ts
images: [{ url: '...', width: 1200, height: 900, alt: '...' }]
```
Le ratio 4:3 (1200×900) est accepté mais non optimal. Le standard recommandé pour Twitter/OG est **1200×630 (1.91:1)**. Facebook et LinkedIn affichent les images 4:3 recadrées, ce qui peut couper le sujet principal.

**Correction :** Recadrer l'image OG à 1200×630 ou utiliser `urlFor(image).width(1200).height(630).fit('crop')` pour Sanity.

---

## MINEURS — à traiter en backlog

---

### MIN-01 — Titre H1 homepage trop court pour le SEO

**Fichier :** `app/(site)/[locale]/page.tsx`  
**Constat :** H1 = "Sacs en cuir italien" (20 caractères). C'est correct et ciblé, mais sans verbe d'action ni différenciation. Le H1 est cohérent avec le ETAT.md (Fix 1 Phase 5f).  
**Recommandation :** Conserver si le design est validé. Ajouter le mot-clé "fabrication italienne" dans le H2 immédiatement après.

---

### MIN-02 — Pas de balise canonical explicite par page

**Fichier :** Pages individuelles  
**Constat :** Next.js génère automatiquement le canonical depuis `metadataBase`, mais les pages dynamiques ne définissent pas `alternates.canonical` explicitement. En cas de duplication (paramètres UTM, variants URL), les canonicals auto peuvent pointer vers des URLs avec paramètres.  
**Recommandation :** Ajouter dans `generateMetadata` des pages catalogue :
```ts
alternates: { canonical: `https://www.saravalenti.fr/catalogue/${slug}` }
```

---

### MIN-03 — Pas de schema.org WebSite avec SearchAction sur homepage

**Fichier :** `app/(site)/[locale]/page.tsx`  
**Constat :** Le schema.org `Organization` est présent (Phase 5c). Le schema `WebSite` avec `SearchAction` permettrait à Google d'afficher une barre de recherche directement dans les résultats pour la marque.  
**Correction :**
```json
{ "@type": "WebSite", "url": "https://www.saravalenti.fr", "potentialAction": { "@type": "SearchAction", "target": "https://www.saravalenti.fr/catalogue?q={search_term_string}", "query-input": "required name=search_term_string" } }
```

---

### MIN-04 — CTAs homepage trop similaires

**Fichier :** `app/(site)/[locale]/page.tsx`  
**Constat :** La homepage a 3 CTAs proches : "Découvrir la collection →", "Voir tout le catalogue", "Voir la collection". Trois liens qui font la même chose créent de la confusion (Von Restorff Effect inversé).  
**Recommandation :** Garder un CTA primaire fort ("Voir le catalogue") et des CTAs secondaires distincts par section ("Découvrir la gamme Rita", "Voir Grazia", etc.).

---

### MIN-05 — Pas d'image sur la page /a-propos

**Fichier :** `app/(site)/[locale]/a-propos/page.tsx`  
**Constat :** La page est 100% texte. D'après ETAT.md Phase 5f, un hero "photo Rita Camel" a été ajouté. La cohérence image/texte est importante pour la conversion et le temps sur page (signal SXO).  
**Recommandation :** Vérifier que l'image hero est bien déployée sur Vercel et que le build la génère correctement.

---

### MIN-06 — Breadcrumb absent sur les pages gamme

**Fichier :** `app/(site)/[locale]/gamme/[slug]/page.tsx`  
**Constat :** Les pages `/gamme/rita` n'ont pas de `BreadcrumbList` schema.org. Les fiches produit `/catalogue/[slug]` en ont un. Les pages gamme devraient aussi avoir `Accueil > Rita`.

---

### MIN-07 — Section "Modèles phares" homepage : images prioritaires

**Fichier :** `app/(site)/[locale]/page.tsx`  
**Constat :** Le carousel des modèles phares est probablement after-fold. Si les images ne sont pas `priority`, elles sont lazy-loaded → pas d'impact sur LCP mais potentiel CLS.  
**Recommandation :** S'assurer que les images above-fold uniquement ont `priority`. Vérifier dans les DevTools que le LCP element est bien l'image hero avec `priority`.

---

### MIN-08 — Politique de cookies non implémentée

**Fichier :** Layout global  
**Constat :** Le site n'a pas de bandeau de consentement cookies. Actuellement pas de cookies tiers (pas de GA, pas de Meta Pixel), mais si un service analytics ou publicitaire est ajouté plus tard, l'absence de consent manager bloquera la conformité RGPD.  
**Recommandation :** Pour la mise en prod, ajouter une notice minimale ("Ce site n'utilise pas de cookies de traçage") ou un bandeau simple si Brevo/analytics sont activés.

---

### MIN-09 — Newsletter bandeau : texte avec accent manquant potentiel

**Fichier :** `components/layout/NewsletterBandeau.tsx`  
**Constat :** ETAT.md Phase 5 Fix 2 mentionne 15 accents manquants corrigés. Vérifier que le fichier actuellement en prod contient bien les accents corrigés (`nouveautés`, `première`, `données`).

---

## Récapitulatif des actions par priorité

### Avant `vercel --prod` (cette semaine)

1. **[BLQ-01]** Créer `/confidentialite` — page RGPD obligatoire
2. **[BLQ-02]** Corriger `robots.ts` — autoriser `/api/google-feed`, `/api/meta-feed`, `/api/tiktok-feed`
3. **[BLQ-03]** Corriger le catalogue SSR — les produits doivent être dans le HTML initial
4. **[BLQ-04]** Corriger le prix de l'Elia dans Sanity Studio (19,90 € → prix réel)
5. **[BLQ-05]** Configurer `NEXT_PUBLIC_SITE_URL` dans Vercel pour Preview et Production

### Dans les 2 semaines post-lancement

6. **[IMP-01]** Créer `/public/llms.txt` (GEO — visibilité LLMs)
7. **[IMP-02]** Ajouter hreflang dans le layout et les pages dynamiques
8. **[IMP-05]** Vérifier que les 8 questions FAQ sont bien rendues côté serveur
9. **[IMP-08]** Ajouter un CTA en bas de `/a-propos`
10. **[IMP-09]** Harmoniser la page livraison (grille tarifaire indicative, délais cohérents)
11. **[IMP-10]** Vérifier le sitemap (115+ URLs attendues)
12. **[IMP-11]** Désactiver les locales EN/NL/DE ou ajouter avertissement livraison France seulement
13. **[IMP-12]** Passer l'image OG en ratio 1200×630

### Backlog (mois 2)

14. **[MIN-01]** Enrichir H2 homepage avec "fabrication italienne"
15. **[MIN-03]** Ajouter WebSite schema avec SearchAction
16. **[MIN-04]** Rationaliser les CTAs homepage (3 → 2 distincts)
17. **[MIN-06]** BreadcrumbList sur pages gamme
18. **[IMP-04]** Documenter l'état CSP assumé (unsafe-inline + upgrade-insecure-requests)

---

## Points positifs (ne pas casser)

- **Sécurité headers** : X-Frame-Options DENY, HSTS, nosniff, Referrer-Policy — tous en place et corrects
- **next/font** : Cormorant Garamond + DM Sans chargées via next/font/google — zéro render-blocking
- **next/image** : utilisé partout avec dimensions explicites — CLS maîtrisé
- **Fiche produit Rita Camel** : breadcrumb, galerie couleurs, pictos réassurance, description courte, accordéon entretien — tout fonctionne
- **Architecture URL** : double niveau modèle/couleur (`/catalogue/rita` + `/catalogue/rita-camel`) — conforme aux meilleures pratiques e-commerce
- **RLS Supabase** : 18 tables avec RLS activé selon ETAT.md — aucun secret NEXT_PUBLIC_
- **robots.txt** : `/studio` bloqué — correct
- **Schema.org Product** sur fiches couleur avec `BreadcrumbList` et `isVariantOf` — bien structuré
- **Mobile** : Nav hamburger, filtres drawer, boutons empilés sur mobile — corrigés en Phase 5 Fix 4/5
- **Contenu gamme Rita** : texte éditorial de qualité avec persona bien défini

---

*Généré : juin 2026 — à mettre à jour après chaque campagne de correction*
