# SARA_VALENTI_DESIGN.md

Référentiel design spécifique au projet Sara Valenti V2.  
Basé sur l'analyse des références premium du secteur maroquinerie française.  
**Lire avant tout travail de composant, page ou section UI sur ce projet.**

Sources crawlées : Polène Paris, Sézane, Oh My Bag (juin 2026)

---

## 1. Analyse des références

### Polène Paris — référence absolue du positionnement

**Positionnement** : Maroquinerie parisienne premium, gamme 160–550 €. Le plus proche de Sara Valenti dans l'ADN (cuir, fabriqué en Europe, épuré).

**Hero**
Le plus enseignant : Polène ne met **jamais** de texte sur l'image hero. La photo éditoriale (modèle, mise en scène naturelle, mer/ciel) occupe tout l'écran. En dessous, sur fond blanc/crème, le texte de navigation catégorielle : "SACS / BIJOUX / PETITE MAROQUINERIE" en grande typographie serif centrée. Le résultat : l'image parle seule, le texte est toujours lisible, aucun problème de contraste.

**Grille produits**
- 4 colonnes sur desktop, 2 sur mobile
- Fond : blanc cassé (#F8F7F5 ou similaire) — jamais blanc pur, jamais fond coloré
- Aspect ratio : **portrait fixe, environ 3:4** — toutes les images ont exactement la même hauteur
- Informations sous l'image : label matière en gris très léger (`text-xs text-gray-400`), nom du modèle en uppercase bold, couleur en petit, prix
- Espacement entre cartes : `gap-4` (16px) — pas plus
- Aucun hover overlay de type "Aperçu rapide" ou "Ajouter au panier" — trop commercial pour ce positionnement

**Fiche produit**
- Navigation horizontale des modèles en pills au-dessus de la grille (très utile pour explorer)
- Chaque coloris = une carte séparée dans la grille (même approche que Sara Valenti — valider)
- Information minimale : matière → nom → couleur → prix. Pas de badges "NOUVEAU" ni "BEST SELLER"

**Typographie**
- Grand titre catégorie : serif élégant uppercase, grande taille (≥ 48px), centré
- Labels UI : sans-serif très léger, uppercase, tracking large
- Descriptions : sans-serif regular, petit corps (14px max), peu de texte

**Couleurs**
- Fond universel : blanc pur (#FFFFFF) dans les listes, blanc cassé/crème (#F8F7F5) dans les sections éditoriales
- Texte : noir profond (#1A1A1A ou équivalent) — jamais gris moyen sur fond blanc
- Zéro couleur d'accent — la couleur vient uniquement des produits

**CTAs**
- Wording : "VOIR LA COLLECTION", "VOIR PLUS", "DÉCOUVRIR" — jamais "Acheter maintenant"
- Style : uppercase, tracking large, souvent sans fond (text-only avec underline au hover)
- Un seul CTA par section, jamais d'empilement

**Mobile**
- Hero = photo pleine largeur (pas de texte dessus)
- Catégories en grand serif centré sous le hero
- 2 images éditoriales côte à côte en dessous
- Grille 2 colonnes avec le même gap que desktop (proportionnel)

---

### Sézane — référence éditoriale et typographique

**Positionnement** : Mode française accessible-premium, 80–350 €. Plus large catalog, plus éditorial que Polène.

**Hero**
Sézane utilise parfois du texte sur des images — mais uniquement sur des photos sombres : fonds de feuillages, ambiances studio, contre-jours. Le principe : **la sélection de la photo garantit le contraste, pas uniquement le gradient**. Jamais de texte blanc sur une zone lumineuse ou chaude (camel, beige, sable).

Sur la mosaïque de catégories, chaque tile a un fond naturellement sombre (ou la photo est recadrée sur la zone sombre). Le texte de catégorie ("SACS", "ROBES") en blanc uppercase y est toujours lisible.

**Grille produits**
- 3 à 4 colonnes desktop, 2 mobile
- Mix : photos produit sur fond neutre + photos lifestyle (modèle portant l'article)
- Aspect ratio : portrait fixe, environ 3:4
- Hover : légère mise en avant de l'image (pas d'overlay bouton)

**Typographie**
- Logo script calligraphie (signature) — très distinctif, non reproductible en Google Fonts
- Navigation : sans-serif regular, PAS d'uppercase
- Titres de section : sans-serif bold ou medium
- Contenu éditorial : serif pour les citations/articles

**CTAs**
- "DÉCOUVRIR", "VOIR LA COLLECTION" — uppercase, filled button noir ou outline selon le contexte
- Le CTA noir plein est bien plus visible que le CTA outline sur fond crème

**Mobile**
- Logo centré, hamburger gauche, panier droite — standard
- La grille passe proprement en 2 colonnes

---

### Oh My Bag — concurrent direct, positionnement plus commercial

**Positionnement** : Cuir italien accessible, 80–180 €. Même segment de prix que Sara Valenti mais tone of voice beaucoup plus commercial.

**Hero**
Le sac EST le hero — photo produit haute qualité avec décor méditerranéen, sans texte dessus. L'AnnouncementBar au-dessus (fond vert vif) porte les messages commerciaux (livraison offerte, 100% cuir). Résultat : le hero reste élégant, les arguments sont visibles.

**Grille produits**
- 4 colonnes desktop, 2 mobile
- Fond : blanc (#FFFFFF) — sacs sur fond blanc épuré
- Nommage très SEO : "Sac à main en cuir irisé SANDSTORM Noir glossy" → fort trafic organique mais manque de premium
- Prix en dessous, libellé catégorie au-dessus ("sac de rentrée")
- Hover : boutons "Aperçu rapide" et "Ajouter au panier" en overlay sur l'image — assez commercial, à éviter pour Sara Valenti

**Fiche produit**
- 2 colonnes : galerie gauche (images en stack vertical, grande taille), info droite
- CTA primaire : bouton plein noir "Ajouter au panier" — bien
- CTA secondaire : "Acheter avec Shop" (violet Shopify) — à ne pas reproduire, casse la cohérence
- Accordéons : NOTRE HISTOIRE / NOS CUIRS / SOIN & ENTRETIEN — même structure que Sara Valenti, valider
- Réassurance sous les boutons : "Retour gratuit" + "100% cuir véritable" en inline texte+icône — efficace et sobre

**Typographie**
- Sans-serif uniquement pour tout l'UI — manque de sophistication vs Polène/Sézane
- Les noms de produits mériteraient d'être en serif pour le positionnement premium

**Mobile**
- Logo en text vert, hamburger menu — identifiable mais pas premium
- Grille 2 colonnes propre
- Le header sticky est trop chargé (AnnouncementBar + nav + sous-nav)

---

## 2. Synthèse comparative

| Point | Polène | Sézane | Oh My Bag | Sara Valenti (actuel) |
|---|---|---|---|---|
| Texte sur hero | Jamais | Uniquement sur fonds sombres | Jamais | ❌ Blanc sur camel clair |
| Aspect ratio grille | 3:4 fixe | 3:4 fixe | ≈ carré | ❌ Variable |
| Fond grille | Blanc cassé | Neutre | Blanc pur | ✅ sv-cream correct |
| Colonnes desktop | 4 | 3–4 | 4 | ✅ 4 (modèles phares) |
| Hover overlay | ❌ Aucun | Image zoom | ✅ Bouton | Vérifier |
| CTA par section | 1 max | 1 max | 2+ | ❌ 3 CTAs similaires |
| Serif pour produits | ✅ | Partiel | ❌ | ✅ Cormorant Garamond |
| Police body | Sans léger | Sans medium | Sans | DM Sans ✅ |

---

## 3. Règles visuelles Sara Valenti

Ces règles prévalent sur toute autre convention générique. Elles sont issues de l'observation des meilleures pratiques du secteur appliquées au positionnement spécifique de Sara Valenti.

---

### 3.1 Hero — règle absolue

**Jamais de texte blanc sur une zone lumineuse de l'image.**

Le sac camel (le principal sujet photo) a une texture brossée chaude et claire. Le blanc n'y est pas lisible. Deux solutions acceptables :

**Option A (recommandée — Polène) :** Photo pleine largeur sans texte. Le H1 "Sacs en cuir italien" sur un panel `bg-sv-cream` en dessous.

```tsx
// Hero option A
<section>
  <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
    <Image src={hero} alt="Sara Valenti" fill className="object-cover" priority />
  </div>
  <div className="bg-sv-cream text-center py-12 px-4">
    <h1 className="font-cormorant text-5xl md:text-6xl text-sv-black">
      Sacs en cuir italien
    </h1>
    <p className="font-dm-sans text-sv-mid text-sm mt-3 tracking-widest uppercase">
      Fabriqués en Italie. Cuir véritable.
    </p>
    <Link href="/catalogue" className="...">Découvrir la collection</Link>
  </div>
</section>
```

**Option B (si overlay conservé) :** Gradient obligatoire couvrant la moitié basse de l'image, texte positionné dans cette zone.

```tsx
// Gradient OBLIGATOIRE si texte sur image
<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
// Le texte doit se trouver sur la partie couverte par from-black/55
// Vérifier le ratio avec https://webaim.org/resources/contrastchecker
```

Ne jamais positionner du texte blanc sur la zone centrale ou haute de l'image si le sujet photo est clair.

---

### 3.2 Aspect-ratio des images — règle universelle

**Toutes les images produit utilisent `aspect-[3/4]`** (portrait, ratio 3 largeur pour 4 hauteur).

Exception : les petites pièces (pochettes, porte-monnaies) qui sont intrinsèquement plus larges que hautes → `aspect-square` (1:1).

```tsx
// CarteProduit.tsx — wrapper image obligatoire
<div className="relative aspect-[3/4] overflow-hidden bg-sv-warm-white">
  <Image
    src={image}
    alt={nom}
    fill
    className={cn(
      "transition-transform duration-500",
      estSacStructure ? "object-cover" : "object-contain p-4"
    )}
  />
</div>
```

**Règle object-fit :**
- `object-cover` → sacs structurés (Rita, Grazia, Mina) : l'image remplit le cadre, le sac est recadré si nécessaire
- `object-contain` → petites pièces (Elia, pochettes, porte-monnaies) : le produit est visible en entier avec padding

**Fond du container :**
- `bg-sv-warm-white` (#faf8f5) — jamais `bg-white` pur
- Le fond chaud unifie l'ensemble même si les photos ont des backgrounds différents

---

### 3.3 Typographie — hiérarchie par usage

**Cormorant Garamond** (serif) pour :
- Nom de marque (logo SARA VALENTI → optionnel en script)
- Noms de modèles : "Rita Camel", "Grazia Bordeaux"
- Titres de sections éditoriales : "Nos matières", "Pourquoi Sara Valenti"
- Citations et accroches premium
- Taille minimum : `text-2xl` (24px)

**DM Sans** (sans-serif) pour :
- Prix : `text-base font-medium text-sv-black`
- Navigation et labels UI
- Métadonnées : type de cuir, disponibilité, catégorie
- Boutons : uppercase `tracking-wide`
- Corps de texte : descriptions, FAQ, contenu informatif

**Note** : Le fichier DESIGN_RULES.md studio-clave mentionne "Lato" pour Sara Valenti — c'est incorrect. Le projet utilise DM Sans (confirmé dans CLAUDE.md et importé via next/font).

**Règles typographiques :**

```
Nom modèle    : Cormorant Garamond, text-3xl md:text-4xl, font-normal (pas bold)
Prix          : DM Sans, text-xl, font-medium, text-sv-black
Type cuir     : DM Sans, text-xs, uppercase, tracking-widest, text-sv-mid
Titre section : Cormorant Garamond, text-3xl, font-normal (jamais bold en Cormorant)
Subtitle      : DM Sans, text-sm, text-sv-mid
Body          : DM Sans, text-base, leading-relaxed, max-w-prose
Eyebrow       : DM Sans, text-xs, uppercase, tracking-widest, text-sv-mid
```

---

### 3.4 Espacement vertical entre sections

**Règle : `py-16` desktop, `py-10` mobile. Jamais `py-24` entre sections de contenu.**

`py-24` (96px) est réservé uniquement au hero principal. Entre les sections de contenu, l'aération doit rester élégante sans devenir vide.

```tsx
// Template de section Sara Valenti
<section className="py-10 md:py-16 bg-sv-cream">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* contenu */}
  </div>
</section>
```

**Espacement interne aux sections :**
- Entre le titre de section et le sous-titre : `mb-2`
- Entre le bloc titre et la grille/contenu : `mt-8 md:mt-12`
- Entre les cards dans une grille : `gap-4` desktop, `gap-3` mobile (jamais `gap-6` dans une grille produit)
- Entre les informations d'une card (nom, type, prix) : `mt-2` entre chaque ligne

---

### 3.5 Grille catalogue — colonnes par breakpoint

```
mobile (< 640px)  : 2 colonnes   → grid-cols-2
sm (640px+)       : 2 colonnes   → sm:grid-cols-2
md (768px+)       : 3 colonnes   → md:grid-cols-3
lg (1024px+)      : 3 colonnes   → lg:grid-cols-3
xl (1280px+)      : 4 colonnes   → xl:grid-cols-4
```

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
```

**Sidebar filtres** : fixed width sur desktop (`w-56 shrink-0`), drawer sur mobile. Le contenu du catalogue prend l'espace restant.

---

### 3.6 Couleur du texte sur fond clair

**Jamais de texte blanc sur un fond sv-cream, sv-warm-white ou toute surface claire.**

| Contexte | Couleur texte | Token |
|---|---|---|
| Titre principal sur fond crème | Quasi-noir | `text-sv-black` (#0a0a0a) |
| Corps de texte sur fond crème | Quasi-noir | `text-sv-black` |
| Métadonnées, labels secondaires | Gris chaud | `text-sv-mid` (#5a5552) |
| Texte désactivé, placeholder | Gris très léger | `text-sv-border` (#e0d9d0) |
| Texte sur fond sv-black | Blanc cassé | `text-sv-cream` (#f5f0ea) |
| Texte sur fond sv-gold | Blanc uniquement si ratio ≥ 4.5:1 | vérifier |

Le `text-sv-mid` (#5a5552 — validé en phase 5e) passe le WCAG AA (4.5:1) sur `sv-cream` et `sv-warm-white`. Ne pas remonter à #6b6460 (l'ancienne valeur qui échouait).

---

### 3.7 Cards produit — états

```tsx
// CarteProduit.tsx — structure validée
<article className="group cursor-pointer">

  {/* IMAGE */}
  <div className="relative aspect-[3/4] overflow-hidden bg-sv-warm-white">
    <Image
      src={image}
      alt={`${nom} ${couleur}`}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  </div>

  {/* INFOS */}
  <div className="mt-3 space-y-0.5">
    <p className="font-dm-sans text-xs uppercase tracking-widest text-sv-mid">
      {typeCuir}
    </p>
    <h3 className="font-cormorant text-xl text-sv-black leading-tight">
      {nom}
    </h3>
    <p className="font-dm-sans text-base font-medium text-sv-black">
      {prix} €
    </p>
  </div>

</article>
```

**États :**
- Default : pas d'ombre, pas de bordure
- Hover image : `scale-[1.03]` avec `transition-transform duration-500` — subtil
- Hover card : pas d'ombre (trop commercial) — le zoom suffit
- Pas de bouton "Ajouter au panier" en overlay sur la grille
- Pas de badge "NOUVEAU" par défaut (sauf campagne promotionnelle explicite)

---

### 3.8 CTAs — un seul primaire par section

**Wording validé Sara Valenti :**
- "Découvrir la collection" (homepage)
- "Voir le catalogue" (sections produit)
- "Ajouter au panier" (fiche produit — seul CTA primaire)
- "Voir tous les coloris" ou "Voir la gamme Rita" (cross-sell)

**Jamais :** "Acheter maintenant", "Commander", "Acheter avec Shop"

**Style des CTAs :**

```tsx
// CTA Primaire (un seul par section/page)
<Link className="inline-flex items-center justify-center
  h-11 px-8
  bg-sv-black text-sv-cream
  font-dm-sans text-sm uppercase tracking-widest
  transition-opacity hover:opacity-80">
  Découvrir la collection
</Link>

// CTA Secondaire (contexte complémentaire)
<Link className="inline-flex items-center justify-center
  h-11 px-8
  border border-sv-black text-sv-black bg-transparent
  font-dm-sans text-sm uppercase tracking-widest
  transition-colors hover:bg-sv-black hover:text-sv-cream">
  Voir la gamme Rita
</Link>

// CTA Tertiaire (navigation discrète)
<Link className="font-dm-sans text-sm text-sv-mid
  underline underline-offset-4 hover:text-sv-black transition-colors">
  Voir tous les coloris →
</Link>
```

**Règle :** pas plus d'un CTA primaire (bg-sv-black) par section visible à l'écran. Si deux actions sont nécessaires, l'une est primaire, l'autre est tertiaire.

---

### 3.9 Fond des sections — alternance

Alterner les fonds pour créer du rythme sans couleur agressives :

```
Section 1 (hero)           : image + bg-sv-cream
Section 2 (matières)       : bg-sv-warm-white
Section 3 (modèles phares) : bg-sv-cream  ← légèrement plus foncé
Section 4 (réassurance)    : bg-sv-warm-white
Section 5 (FAQ)            : bg-sv-cream
Footer                     : bg-sv-black (avec texte sv-cream)
```

Jamais deux sections `bg-white` pur consécutives — créer la distinction uniquement avec `sv-cream` (#f5f0ea) vs `sv-warm-white` (#faf8f5). L'écart est subtil mais visible et évite la page plate.

---

### 3.10 Galerie fiche produit

**Desktop** : thumbnails à gauche en colonne verticale (≥ 5 thumbnails, ~72px × 90px chacun, `aspect-[4/5]`), grande image à droite (`aspect-[3/4]`). Thumbnail actif : ring `ring-1 ring-sv-black`.

**Mobile** : swipe horizontal sur les images principales (pas de thumbnails), indicateur dots en bas.

```tsx
// Thumbnail desktop
<button className={cn(
  "relative aspect-[4/5] overflow-hidden w-18 shrink-0",
  "ring-offset-2 transition-all",
  estActif ? "ring-1 ring-sv-black" : "opacity-70 hover:opacity-100"
)}>
  <Image src={thumb} alt="" fill className="object-cover" />
</button>
```

---

### 3.11 AnnouncementBar

Fond `bg-sv-black`, texte `text-sv-cream text-xs uppercase tracking-widest`. Séparateur : · (point médian, pas de tiret).

Contenu validé :
```
Livraison offerte dès 45 € · Cuir véritable · Fabrication italienne · Retours 14 jours
```

Hauteur : `h-9` (36px) — ni trop fin ni trop présent.

---

### 3.12 Footer

4 colonnes desktop, 1 colonne mobile avec accordéons.

```
Col 1 : SARA VALENTI (logo) + baseline + Instagram
Col 2 : BOUTIQUE (Catalogue, Rita, Grazia, Mina)
Col 3 : MON COMPTE (Connexion, Mes commandes, Mes favoris)
Col 4 : INFORMATIONS (À propos, Entretien du cuir, Livraison, Retours, CGV, Mentions légales, Politique de confidentialité)
```

**Politique de confidentialité obligatoire dans col 4** — actuellement absent, RGPD exige sa présence.

Fond : `bg-sv-black`. Textes : `text-sv-cream` pour les titres, `text-sv-cream/70` pour les liens (légèrement atténués). Hover liens : `hover:text-sv-cream transition-colors`.

---

## 4. Ce que Sara Valenti ne doit PAS faire

Observations directes sur ce que les références évitent et qui tirerait vers le bas :

**❌ Ne pas faire :**
- Overlay de boutons "Aperçu rapide" / "Ajouter au panier" sur les images de grille (Oh My Bag le fait — trop commercial pour Sara Valenti)
- Grille à hauteurs variables (aucun site premium ne fait ça)
- Texte blanc sur fond camel/beige/sable (risque systématique sur ce type de photo)
- "Acheter avec Shop" ou tout CTA de paiement externe dans la fiche produit
- Slider prix max à 1100 € alors que les prix vont jusqu'à 110 € (filtre catalogue actuel)
- Trois CTAs identiques sur la même page ("Voir le catalogue", "Voir tout le catalogue", "Découvrir la collection")
- Noms de produits très longs SEO-first ("Sac à main en cuir brossé camel fabriqué en Italie Rita") — Polène et Sézane misent sur des noms courts et mémorables

**✅ Ce qui distingue Sara Valenti vers le haut :**
- Cormorant Garamond sur les noms de modèles — aucun concurrent direct ne le fait aussi bien
- `sv-cream` et `sv-warm-white` comme fonds — plus chaleureux que le blanc pur Polène
- Les descriptions de gamme en 3 blocs (matière / port / entretien) — niveau éditorial comparable à Polène
- La section "Autres coloris" en bas de fiche produit — excellente UX cross-sell

---

## 5. Checklist avant tout commit de composant

- [ ] Les images produit ont `aspect-[3/4]` ou `aspect-square` (jamais hauteur libre)
- [ ] Le fond du container image est `bg-sv-warm-white` (pas `bg-white`, pas `bg-transparent`)
- [ ] `object-cover` sur les sacs, `object-contain p-4` sur les petites pièces
- [ ] Aucun texte blanc sur une zone d'image claire sans gradient `rgba(0,0,0,0.45)` minimum
- [ ] Un seul CTA `bg-sv-black` par section
- [ ] Titres de modèles en Cormorant Garamond, UI en DM Sans
- [ ] `py-16` entre sections desktop, `py-10` mobile (jamais `py-24` pour du contenu)
- [ ] Grille : `grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4`
- [ ] Texte secondaire en `text-sv-mid` (#5a5552), jamais en `text-gray-400` (pas dans la palette)

---

*Créé : juin 2026 — Sources : Polène Paris, Sézane, Oh My Bag (crawl direct)*  
*À relire avant tout travail UI sur saravalenti-v2. Complément de DESIGN_RULES.md (règles génériques Studio Clave).*
