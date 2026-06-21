# SARA_VALENTI_DESIGN.md

Référentiel design spécifique au projet Sara Valenti V2.  
Basé sur l'analyse des références premium du secteur maroquinerie française.  
**Lire avant tout travail de composant, page ou section UI sur ce projet.**

Sources crawlées : Polène Paris, Sézane, Oh My Bag (juin 2026) — Polène Paris, Oh My Bag, Baggu, Lyst, Awwwards e-commerce (juin 2026, §7)

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

---

## 6. IMAGE_SELECTION — Quel type d'image pour chaque page

*Sources crawlées : Polène Paris, Sézane, ARKET, Cuyana, Mansur Gavriel — juin 2026.*

### 6.1 Synthèse des références

| Marque | Hero | Traitement lumière | Position sujet | Texte sur image |
|---|---|---|---|---|
| Polène | Lifestyle — modèle en extérieur (bord de mer rocheux) | Doux, brumeux, tons désaturés | Légèrement décentré droite | Aucun (overlay produit bas-gauche) |
| Sézane | Lifestyle — modèle sur terrasse méditerranéenne | Chaud, lumineux, estival | Légèrement gauche | CTA centré, texte blanc |
| ARKET | Editorial — très gros plan, corps/vêtement | High-key, désaturé, fond gris | Centré (mais crop très serré) | Aucun |
| Cuyana | Split — lifestyle gauche + still life droit | Backlight lifestyle, ombres dures still life | Tiers-gauche règle des tiers | Bottom-left, blanc sans gradient |
| Mansur Gavriel | Still life — sac sur surface bois sombre/rouge | Lumière directionnelle, ombres portées | Décentré, beaucoup d'espace négatif | Aucun (texte hors image) |

**Pattern commun aux 5 références :** le texte n'est jamais positionné sur une zone claire. Soit pas de texte sur l'image, soit le texte est dans une zone naturellement sombre (ombre, fond bois, ciel nuageux).

---

### 6.2 Homepage hero

**Contexte :** image pleine hauteur (`h-[calc(100vh-5rem)]`), texte bottom-left avec titre h1 blanc et sous-titre.

**NON :**
- Photo produit studio sur fond gris neutre — trop froid, pas d'émotion
- Sac camel posé sur fond clair sans surface texturée — cuir clair sur fond clair = contraste texte impossible même avec gradient
- Photo trop lumineuse et uniforme — le gradient ne peut pas créer une zone sombre si toute l'image est exposée identiquement
- Même photo que la page gamme Rita

**OUI :**
- Photo lifestyle en extérieur : sac Rita porté par une personne, arrière-plan naturel (pavés, végétation sombre, intérieur boisé)
- Photo still life avec surface texturée sombre : sac camel sur marbre sombre, bois brut ou tissu texturé brun/gris
- Zone naturellement sombre dans le tiers bas-gauche (là où se positionne le texte)
- Ambiance Polène/Cuyana : lumière naturelle légèrement contre-jour ou rasante, pas de lumière de studio plate
- Sujet décalé à droite ou centré-haut, tiers bas-gauche libre pour le texte

```
Composition idéale homepage :
  [     espace libre     | sac / modèle  ]
  [                                      ]
  [  H1 "Sacs en cuir"  |               ]  ← zone sombre naturelle ici
```

---

### 6.3 Page gamme Rita (`/gamme/rita`)

**Contexte :** hero 60vh, texte centré ou bottom, "Rita / SAC À MAIN EN CUIR BROSSÉ".

**NON :**
- Même photo que la homepage
- Photo identique à la photo principale du catalogue Rita
- Plan d'ensemble du sac seul sur fond uni : trop catalogue, pas assez éditorial

**OUI :**
- Détail texture cuir brossé en lumière rasante : lumière venant d'un côté à ~15-30°, grain visible, reflets subtils sur la peau
- Photo du sac ouvert montrant l'intérieur et les coutures : valorise l'artisanat
- Sac porté en situation : femme marchant, sac en mouvement, flou d'arrière-plan
- Zone d'ombre ou fond foncé dans le quart bas de l'image pour le texte

**Référence technique :**
```
Cuir brossé en lumière rasante : la lumière rasante (< 30° de l'axe de l'objectif)
révèle les micro-reliefs du cuir brossé que la lumière frontale aplatirait.
Résultat : l'image communique la matière, pas juste la couleur.
```

---

### 6.4 Page gamme Grazia (`/gamme/grazia`)

**Contexte :** hero 60vh, "Grazia / SAC EN CUIR SUÈDE ET GRAINÉ", 13 coloris.

**NON :**
- Lumière dure / flash direct : le suède absorbe la lumière, un flash l'aplatit et le fait ressembler à du tissu bon marché
- Fond blanc pur : le suède perd toute profondeur sur blanc

**OUI :**
- Lumière douce diffuse (ciel couvert, intérieur près d'une fenêtre) : révèle le velouté du suède
- Fond dans les tons de la matière : beige chaud, gris doux, tissu lin
- Photo avec légère sous-exposition intentionnelle : le suède est sombre et chaleureux, pas lumineux
- Détail couture ou doublure visible si possible : signature qualité artisanale

---

### 6.5 Page À propos (`/a-propos`)

**Contexte :** hero 40vh, petit texte eyebrow "À PROPOS DE SARA VALENTI" en bas.

**NON :**
- Photo de sac (c'est une page marque, pas produit)
- Photo catalogue réutilisée depuis la homepage ou le catalogue

**OUI (par ordre de préférence) :**
1. Mains d'un artisan travaillant le cuir — aiguille et fil, couture à la main, ou découpe d'une peau
2. Atelier de maroquinerie : outils épars, peaux brutes, lumière naturelle par une grande fenêtre
3. Peau de cuir brute dépliée sur une surface de travail
4. Portrait de la fondatrice en contexte (pas pose studio)

**Référence Mansur Gavriel :** leur page About montre systématiquement l'atelier et les mains — jamais un sac fini seul.

---

### 6.6 Page catalogue (`/catalogue`)

**Contexte :** pas de hero, grille de cartes produit `aspect-[3/4]`.

**Images de grille — OUI :**
- Fond `bg-sv-warm-white` (#faf8f5) — jamais blanc pur
- Sac centré avec espace autour, modèle Mansur Gavriel (sac seul, bien éclairé, fond neutre)
- Éclairage de 3/4 avant (léger angle) : révèle la forme 3D sans aplatir
- Couleur sac fidèle : ne pas surexposer les clairs (camel) ni sous-exposer les sombres (noir, brun)

**Images de grille — NON :**
- Fond gris froid (#e0e0e0) — pas dans la palette Sara Valenti
- Recadrage différent d'un sac à l'autre : toute la grille doit avoir la même logique de cadrage
- Ombres portées dures : `box-shadow` ou ombre studio exagérée déséquilibre la grille

---

### 6.7 Fiche produit (`/catalogue/[slug]`)

**Contexte :** galerie principale `aspect-[3/4]` desktop gauche, mini-galerie de vignettes en bas.

**Photo principale (index 0) :**
- Face 3/4 avant : montre la forme, les anses, les coutures et le corps du sac
- Fond `bg-sv-warm-white`, éclairage diffus frontal légèrement décalé

**Photos secondaires (index 1-5) :**
- Index 1 : profil ou 3/4 arrière
- Index 2 : intérieur du sac ouvert (doublure, poches, logo)
- Index 3 : détail fermeture/couture, matière en gros plan
- Index 4 : porté par une personne (lifestyle contextuel)
- Index 5 : photo de détail hardware (rivets, zip, anneau)

**NON :**
- Toutes les photos avec le même angle
- Photo floue ou sous-exposée en vignette
- Lifestyle en photo principale — difficile à lire en miniature

---

### 6.8 Règles transversales

```
JAMAIS :
- Deux heros avec la même photo (homepage ≠ gamme Rita ≠ gamme Grazia ≠ à-propos)
- Cuir clair sur fond clair sans gradient from-black/55 minimum
- Photo de sac noir sur fond noir ou très sombre (illisible)
- Flash direct sur suède (aplatit la matière)

TOUJOURS :
- Zone sombre naturelle là où se positionne le texte — le gradient est un filet de sécurité,
  pas la première ligne de défense
- Sujet décalé pour laisser respirer le texte : règle des tiers, jamais centré sur un hero
- Ratio hero desktop : 16:9 ou 21:9 (max-h-[900px])
- Ratio hero mobile : 3:4 natif ou crop 4:5 (jamais 16:9 sur mobile)
- Cohérence colorimétrique dans la même page : si deux photos côte à côte,
  même température de blanc

CONTRASTE WCAG AA (obligatoire sur toute image avec texte blanc) :
- bg-black/25 seul : environ 1.8:1 — INSUFFISANT
- bg-black/55 : environ 3.2:1 — minimum acceptable (texte large)
- bg-gradient-to-t from-black/55 via-black/20 to-transparent : 4:1+ dans la zone de texte — OK
- Solution préférable : choisir une image avec zone naturellement sombre ≥ 50% luminosité
  dans la zone de texte, puis ajouter le gradient comme filet de sécurité
```

---

### 6.9 Brief photographique (pour brief à une photographe)

```
AMBIANCE GÉNÉRALE : cuir artisanal, lumière naturelle, espace, matière.
Références : Polène (poésie), Cuyana (clarté), Mansur Gavriel (minimalisme).
Éviter : H&M, Zara (lumière de studio synthétique, poses figées).

ÉCLAIRAGE : lumière naturelle en priorité. Fenêtre nord (lumière diffuse stable)
ou extérieur par ciel légèrement couvert. Pas de flash. Réflecteur si besoin.

FONDS : bois naturel non verni (chêne, acacia), marbre gris/blanc, lin écru,
asphalte mouillé, pavés parisiens, végétation sombre. Éviter : fond papier blanc.

TENUE DU MODÈLE : tons neutres (beige, blanc cassé, gris anthracite, noir).
Jamais de couleur vive qui entre en concurrence avec le sac.

ANGLES À COUVRIR PAR SAC : (1) 3/4 avant, (2) profil, (3) intérieur, 
(4) détail matière ×2, (5) lifestyle porté.
```

---

## §7 — Patterns visuels e-commerce premium (crawl juin 2026)

Sources : Polène Paris (re-crawl), Oh My Bag, Baggu, Lyst, Awwwards e-commerce winners.  
Mobbin.com et godly.website sont derrière authentification — non accessibles en crawl automatique.

---

### 7.1 Hero section — ce que font les meilleurs

**Pattern convergent sur tous les sites premium crawlés :**

```
POLÈNE  : Photo éditoriale plein écran SANS texte dessus.
          Texte de navigation catégorielle SOUS le hero, sur fond blanc.
          Tagline courte ("L'intemporel reprend son élan") — jamais de sous-titre.

OH MY BAG : Carrousel full-width avec overlay CTA minimal.
            Wording de collection ("DÉCOUVRIR NOS RAPHIA") — pas de prix dans le hero.

BAGGU   : Carrousel navigable (counter 0/0), pleine largeur.
          Aucun header texte sur l'image — produits parlent seuls.
```

**Règle extraite pour Sara Valenti :**
- Le texte sur le hero est toléré UNIQUEMENT si la zone est naturellement sombre (> §6.8)
- Préférence : hero photo seule + H1 et CTA SOUS l'image sur fond `sv-cream`
- Jamais de sous-titre long dans le hero — 3 à 6 mots max ou rien

---

### 7.2 Grille produit — patterns à adopter

**Ce que font Polène et Oh My Bag :**

| Pattern | Polène | Oh My Bag | Sara Valenti actuel |
|---------|--------|-----------|---------------------|
| Colonnes desktop | 4 | 4 | 3 (md) / 2 (base) |
| Ratio image | Portrait 3:4 fixe | Portrait 2:3 | Variable |
| Infos sous image | Matière / Nom / Couleur / Prix | Nom / "+ de couleurs" / Prix | Nom / Prix / swatches |
| Hover state | Aucun overlay | Aucun overlay | Aucun overlay ✓ |
| Fond carte | Blanc cassé | Blanc | sv-cream ✓ |
| Badge NOUVEAU | Non | Oui ("Nouveautés") | Non ✓ |
| Badge BEST SELLER | Non | Oui ("Best-sellers") | Non ✓ |

**Actions pour Sara Valenti :**
- Passer à 4 colonnes sur `xl:` (actuellement `lg:grid-cols-3`)
- Forcer le ratio portrait sur toutes les images catalogue (`aspect-[3/4]`)
- Ajouter label matière en `text-xs text-sv-mid` au-dessus du nom produit dans `CarteProduit`

---

### 7.3 Navigation — mega-menu vs navigation plate

**Pattern dominant chez les références premium :**

```
POLÈNE  : Mega-menu avec visuels de collection au survol
          "Bestsellers | Sacs → sous-catégories | Savoir-Faire"
          Regroupement par collections nommées (Cyme, Numéro Neuf...)

OH MY BAG : Mega-menu "Sacs | Accessoires | À propos"
            Filtres par style dans le menu (breadcrumb hiérarchique)
            "Retour" sur mobile (navigation arborescente)
```

**Priorités pour Sara Valenti (post go-prod) :**
1. Mega-menu desktop avec miniature de chaque gamme au survol
2. Navigation mobile : drawer avec "Retour" sur chaque niveau
3. Regrouper par collections nommées dès que 3+ gammes actives

---

### 7.4 Fiche produit — signaux premium observés

**Convergence Polène + Oh My Bag :**

```
GALERIE    : Minimum 4 angles (3/4 avant, profil, détail matière, lifestyle porté)
             Dual-view dans la grille (deux photos au scroll ou au hover)
             Polène : 2000x2800px — haute résolution assumée

PRIX       : Affiché clairement, seul, sans rayure/promo visible (Polène)
             Prix habituel en premier, prix barré si solde (Oh My Bag)
             Jamais de countdown timer ou badge "offre limitée"

STOCK      : "En rupture de stock" → CTA "M'alerter" (Polène)
             Pas de chiffre de stock affiché ("Plus que 2" = pression masse)

CTAs       : Un seul CTA principal par écran : "Ajouter au panier"
             Favori (coeur) en secondaire, discret
             Jamais "ACHETER MAINTENANT" — trop e-commerce généraliste
```

**Signaux à ajouter sur FicheProduit Sara Valenti :**
- Dual-view dans CarteProduit (2e photo au hover sur desktop)
- Alertes stock épuisé (formulaire email simple)
- Label matière cliquable renvoyant vers `/entretien-cuir`

---

### 7.5 Typographie — tendances Awwwards 2025-2026

Analyse des sites primés sur Awwwards (e-commerce mode/luxe) :

```
SERIF      : Cormorant Garamond, EB Garamond, Caslon — Sara Valenti ✓ (Cormorant)
             Grande taille (56-80px) sur desktop pour les titres héros
             Italic pour les collections ("La collection Rita")

SANS-SERIF : DM Sans, GT America, Futura — Sara Valenti ✓ (DM Sans)
             Uppercase + tracking large pour les labels UI (filtres, boutons)
             Regular 14px pour les descriptions produit

CONTRASTE  : Jamais deux serif sur la même page (titre + sous-titre)
             Serif = éditorial uniquement, jamais pour les prix ou les labels
```

**Pattern à adopter :** Les sites primés combinent un serif fort (grand, italic, poétique) avec un sans-serif neutre minimal. C'est exactement Cormorant + DM Sans — valider que le ratio serif/sans est respecté dans tous les composants.

---

### 7.6 Micro-interactions — ce qui différencie les meilleurs

D'après Awwwards (GSAP, Framer Motion) et crawl des sites premium :

```
TRANSITIONS PAGE   : Fade ou slide horizontal doux (200-300ms) — pas de flash blanc
HOVER PRODUIT      : Swap d'image (packshot → lifestyle) — PAS d'overlay "Aperçu rapide"
SCROLL ANIMATIONS  : Apparition progressive des cards (stagger 50ms) mais JAMAIS
                     de parallax sur les images produit (dérange le shopping)
BOUTONS            : State hover = inversion couleur fond/texte (100ms) ou underline
                     Jamais de scale transform sur un bouton d'achat
FILTRES            : Instant filtering (sans rechargement) — déjà en place ✓
SWATCHES           : Changement d'image immédiat au survol/clic — déjà en place ✓
```

**À implémenter :**
- Swap d'image au hover sur CarteProduit (2e photo Sanity si disponible)
- Stagger d'apparition sur la grille catalogue (framer-motion ou CSS animate-in)

---

### 7.7 Social proof — ce que font les références

```
POLÈNE     : Aucun avis client visible en page produit. Présence Instagram en footer.
             Stratégie : le produit justifie son prix par le savoir-faire, pas les étoiles.

OH MY BAG  : Section "Vu dans..." (Marie Claire, ELLE, Le Parisien)
             -10% newsletter first order
             Notation 4.9/5 avec 341 avis (mise en avant dans le header)

BAGGU      : Posts Instagram intégrés "@BAGGU" dans le footer
             Pas d'avis inline sur les fiches
```

**Recommandation Sara Valenti :**
- Phase 1 (go-prod) : section "Vu dans..." dès qu'une presse est obtenue
- Phase 2 (J+30) : avis clients collectés via Brevo J+7 et J+14 après livraison
- Phase 3 (J+90) : notation inline sur fiche produit si ≥ 10 avis collectés
- Ne jamais afficher 0 avis — attendre le seuil de 10 avant d'activer l'affichage

---

### 7.8 Collections nommées vs catégories génériques

**Pattern Polène et Oh My Bag — critique pour le positionnement premium :**

```
POLÈNE     : Collections nommées (Cyme, Numéro Neuf, Mokki, Solé Nomade)
             Navigation par nom de collection, jamais "Sac à main > Taille M"

OH MY BAG  : Collections saisonnières ("RIVIERA", "HÉLIOS", "CÉRÉMONIE", "SANDSTORM")
             Uppercase, dans le hero, chaque saison = une identité visuelle

LYST       : Tri "Newest | Recommended | Price" — standard marketplace
             Pas adapté au positionnement éditorial
```

**Pour Sara Valenti :**
- Les gammes (Rita, Grazia, Mina) SONT les "collections nommées" — ne jamais les appeler "catégories"
- Dans la navigation : "Gammes" → "Rita | Grazia | Mina" (pas "Sacs à main | Sacs portés")
- Préparer des noms de collections saisonnières dès qu'une 2e campagne photo est prévue

---

### 7.9 Ce que Sara Valenti fait déjà bien (conformité avec les meilleurs)

```
✓ Pas de badge "NOUVEAU" ou "BEST SELLER" dans la grille
✓ Pas d'overlay "Aperçu rapide" sur les cartes produit
✓ CTA "Ajouter au panier" seul, sans CTA concurrent
✓ Fond sv-cream (blanc cassé) — jamais blanc pur
✓ Pas de prix barré/promo permanente
✓ Cormorant Garamond + DM Sans — combo validé par Awwwards
✓ URLs propres (/catalogue/rita-camel) sans paramètres UTM dans le canonical
✓ Filtres instantanés côté client (UX premium)
✓ Label matière visible (AnnouncementBar "Cuir naturel italien")
```

---

### 7.10 Prochaines évolutions recommandées (par priorité UX/conversion)

```
P1 — Impact fort, effort moyen
  [ ] Dual-view image au hover dans CarteProduit (swap packshot→lifestyle)
  [ ] 4e colonne xl: dans la grille catalogue
  [ ] Aspect-ratio portrait forcé (3:4) sur toutes les images

P2 — Impact moyen, effort moyen
  [ ] Alerte stock épuisé (email) sur FicheProduit
  [ ] Label matière cliquable → /entretien-cuir
  [ ] Stagger d'apparition des cartes catalogue (CSS animation-delay)

P3 — Impact fort, effort élevé
  [ ] Mega-menu desktop avec miniatures gamme
  [ ] Section "Vu dans..." dès première presse obtenue
  [ ] Avis clients inline (activer après 10 avis)
  [ ] Collections saisonnières nommées (campagne photo 2)
```
