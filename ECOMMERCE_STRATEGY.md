# Stratégie e-commerce Sara Valenti

Sources : Baymard Institute (200 000+ h de recherche UX), Shopify, Nielsen Norman Group, Klaviyo, Ahrefs, SEMrush, Google Merchant Center, Meta Catalog. Dernière mise à jour : juin 2026.

---

## 1. Conversion — fondamentaux

### Les 10 frictions checkout les plus coûteuses (Baymard)

1. **Frais cachés révélés en fin de tunnel** — cause n°1 d'abandon. Afficher shipping + taxes dès la page panier.
2. **Création de compte obligatoire** — guest checkout non négociable. Sara Valenti l'a déjà ; le conserver.
3. **Processus trop long ou complexe** — chaque étape supplémentaire coûte des conversions. Le tunnel actuel (adresse → livraison → paiement) est correct ; ne pas y ajouter d'étapes.
4. **Manque de confiance sur le paiement** — afficher logos Visa/MC/Amex + cadenas SSL + mention Stripe au-dessus du bouton payer.
5. **Estimation de livraison absente** — indiquer "livré entre le J et J+3" dès la page panier.
6. **Erreurs de formulaire mal gérées** — signaler l'erreur en ligne, sous le champ concerné, avec message clair.
7. **Champs inutiles** — supprimer tout champ non indispensable à la livraison. "Complément" déjà en optionnel : correct.
8. **Impossible d'éditer le panier depuis le checkout** — permettre modification quantité/suppression sans revenir en arrière.
9. **Paiement mobile non optimisé** — Apple Pay / Google Pay réduisent l'abandon mobile de 20–35%.
10. **Aucun récapitulatif de commande avant paiement** — toujours afficher le résumé produit + prix total avant le bouton "Payer".

### Règles page produit qui convertissent (NNG)

- **Nom produit descriptif** : modèle + matière + couleur (`Sac Rita en cuir brossé camel`), pas seulement `Rita`.
- **Prix all-in visible** : prix + mention "livraison offerte dès 45 EUR" avant le CTA.
- **Disponibilité par variante** : afficher rupture avant que l'utilisateur clique "Ajouter au panier".
- **Description : commencer par le plus critique** — les utilisateurs ne lisent pas jusqu'au bout.
- **Pas de jargon sans explication** : "cuir brossé", "suède" — toujours définir au premier usage.
- **Multiple angles photo** : minimum 4 photos (face, dos, détail cuir, porté main ou épaule).
- **Confirmation add-to-cart explicite** : feedback visible (mini-panier, notification), pas seulement une mise à jour silencieuse du compteur.
- **Afficher les avis au-dessus de la ligne de flottaison** — note + nombre d'avis visible dès l'entête fiche.

### Signaux de confiance obligatoires

| Signal | Emplacement | Priorité |
|--------|-------------|----------|
| Note étoiles + nombre d'avis | Entête fiche produit | Critique |
| Logos paiement (Visa/MC/Amex) | Zone CTA checkout | Critique |
| Mention "Fabrication italienne" | Fiche produit + home | Haute |
| Politique de retour 14 jours | Fiche produit + footer | Haute |
| Livraison offerte dès 45 EUR | AnnouncementBar + panier | Haute |
| Email contact visible | À propos + footer | Haute |
| Avis clients vérifiés | Page home + fiche | Haute |
| HTTPS + cadenas | Partout (Vercel/HTTPS) | Standard |

### Urgence et rareté sans manipuler

- **Niveau de stock réel** : `Plus que 3 en stock` uniquement si vrai. Jamais inventé.
- **Rupture approchante** : `En cours de réapprovisionnement` sur les variantes `reappro: true`.
- **Délai de livraison précis** : `Commandez avant 14h → expédié aujourd'hui` si logistique le permet.
- **Jamais de countdown artificiel** — détruit la confiance premium.

### Abandon panier — causes et remèdes

| Cause | Fréquence | Remède Sara Valenti |
|-------|-----------|---------------------|
| Coûts de livraison surprenants | 49% | Afficher seuil 45 EUR dès la home + panier |
| "Juste curieux, pas prêt" | 37% | Email abandon panier J+2 avec rappel + photo |
| Compte obligatoire | 24% | Guest checkout en place ✓ |
| Processus trop long | 18% | Tunnel 3 étapes max ✓ |
| Pas de confiance paiement | 17% | Logos + Stripe badge |
| Délais trop longs | 16% | Indiquer délai estimé dès la fiche |
| Retours compliqués | 11% | 14 jours, procédure claire ✓ |

**Séquence email abandon panier (Klaviyo — 69% de commandes supplémentaires vs email unique) :**
- Email 1 — J+0, 2 à 4h après : rappel simple, photo produit, lien direct panier.
- Email 2 — J+1, 24h après : ajouter la livraison offerte si panier > 35 EUR (sous le seuil 45).
- Email 3 — J+3 : recommandations alternatives si pas de retour.

### Mobile checkout — spécificités

- **Apple Pay / Google Pay** : réduisent les abandons mobile de 20–35%. À implémenter via Stripe Elements (déjà sur Stripe — activer dans le dashboard).
- **Clavier adapté** : `type="tel"` pour téléphone, `inputmode="numeric"` pour code postal — déjà en place ✓.
- **Bouton CTA** : minimum 44×44px, pleine largeur sur mobile.
- **Autofill** : `autoComplete` sur tous les champs adresse — déjà en place ✓.
- **72% des abandons mobile** viennent d'un formulaire trop lent ou mal typé. Tester avec un vrai téléphone, pas seulement en responsive Chrome.

---

## 2. Pricing psychology

### Anchoring (prix barré, prix de référence)

- **Montrer le prix original barré** à côté du prix promos : `~~129,90 EUR~~ 99,90 EUR`.
- L'ancrage fonctionne même quand l'utilisateur sait que c'est du marketing — l'effet est cognitif, pas rationnel.
- **Pour Sara Valenti** : ne jamais inventer un prix de référence fictif. Le prix barré = prix catalogue historique.
- Placer le prix original en premier (gauche/haut), le prix réduit en grand à côté.

### Charm pricing (19,90 vs 20,00)

- **Règle du chiffre gauche** : `19,90` est perçu significativement moins cher que `20,00` car le cerveau lit de gauche à droite et s'ancre sur `19`.
- **Pour le premium** : le prestige pricing (chiffres ronds) signale le luxe. `110 EUR` plutôt que `109,90 EUR` pour les modèles phares.
- **Compromis Sara Valenti** : les prix actuels (109,90 EUR) sont des charm prices — conviennent pour le positionnement accessible-premium. Ne pas changer sauf décision stratégique.

### Bundle et upsell sans brader

- **Bundle cohérent** : `Sac + spray imperméabilisant` ou `Sac + pochette coordonnée` — valeur ajoutée sans dévaluer.
- **Upsell** : proposer la version grainée (plus résistante) comme upgrade au moment de la fiche suède — "Le Grazia grainé résiste mieux aux rayures pour +0 EUR".
- **Cross-sell** : `Vous aimerez aussi` — 4 modèles max, pertinents par usage ou matière.
- **Règle absolue** : ne jamais réduire le prix d'un produit premium sans raison narrative (collection précédente, fin de série). La remise sans histoire détruit la perception de valeur.

### Livraison gratuite comme levier (seuil 45 EUR Sara Valenti)

- **Barre de progression panier** : `Plus que 8,90 EUR pour la livraison offerte` — afficher en temps réel dans le mini-panier.
- **Le seuil 45 EUR est bien calibré** : au-dessus du prix d'un sac Grazita ou Elia (petits modèles) mais atteignable facilement.
- La livraison offerte résout 39% des abandons panier (Klaviyo data).
- **Email abandon panier J+1** : proposer la livraison offerte comme incentive si le panier est entre 35 et 45 EUR.

### Promotions sans dévaluer la marque premium

- **Règle Sara Valenti** : jamais de remise > 20% sur un produit de la collection principale.
- **Formater les promos** comme des événements (fin de collection, anniversaire de la marque) pas comme une routine.
- **Éviter** les codes promo publics (Google/Instagram) — training des clients à attendre.
- **Préférer** : livraison offerte, kit cadeau, produit de soin offert pour les paniers > X EUR.
- Polène et Sézane ne soldent jamais. Référence à suivre.

---

## 3. Email flows obligatoires e-commerce

### Email bienvenue — séquence 3 emails

**Objectif** : transformer l'abonné newsletter en premier acheteur.

| Email | Délai | Contenu | Objet |
|-------|-------|---------|-------|
| #1 | J+0 (immédiat) | Histoire de la marque + 3 meilleurs produits. Pas de discount. | "Bienvenue chez Sara Valenti" |
| #2 | J+3 | Preuves sociales : avis clients vérifiés + fabrication italienne. | "Ce que nos clientes disent" |
| #3 | J+7 | Incentive doux : livraison offerte sur première commande (pas de % remise). | "Votre première commande" |

**Ton** : personnel, direct, premium. Pas de caps lock, pas d'emojis, pas de "SOLDES". Voir `BRAND_VOICE.md`.

### Email abandon panier — séquence 2–3 emails

| Email | Délai | Contenu | Note |
|-------|-------|---------|------|
| #1 | J+0, 2–4h | Photo du produit abandonné + lien direct panier + CTA "Revenir à mon panier". Pas de discount. | Simple et direct |
| #2 | J+1, 24h | Même produit + lever l'objection principale (matière, entretien, retours). Livraison offerte si panier < 45 EUR. | Incentive raisonné |
| #3 | J+3 | Produits alternatifs (autre coloris, modèle similaire). Dernière relance. | Pivot |

**Règle** : ne jamais envoyer un discount dans l'email #1 abandon — cela entraîne les clients à abandonner intentionnellement pour attendre la remise.

### Post-achat — flux complet

| Trigger | Délai | Contenu |
|---------|-------|---------|
| Commande confirmée | Immédiat | Récapitulatif complet, numéro de suivi dès dispo, contact SAV |
| Expédition | Dès tracking dispo | Lien suivi colis, délai estimé, conseils si absence |
| Livraison | J+1 après livraison | Félicitations + rappel entretien (lien guide entretien-cuir) |
| Satisfaction | J+7 après livraison | Demande d'avis (Google / Trustpilot). Remercier sans menacer. |
| Upsell | J+21 | Suggérer produit complémentaire (spray imperméabilisant, autre modèle) |

**Règle critique** : demander un avis après J+7 minimum (temps de recevoir, utiliser, avoir un avis réel). Jamais après l'expédition.

### Réactivation clients inactifs

- **Définition** : aucun achat depuis 12 mois (LTV-driven, pas ouverture email).
- Email 1 : `"Ça fait un moment..."` — rappel marque, nouvelle collection.
- Email 2 (J+14 si pas de réponse) : `"On a quelque chose pour vous"` — offre exclusive une fois par an.
- Email 3 (J+30) : nettoyage liste — `"Voulez-vous rester en contact ?"`. Si pas d'engagement → supprimer.
- **Ne pas réactiver avec des remises agressives** — entraîne une base de clients price-sensitive.

### Anniversaire / fidélité

- Email le jour de l'anniversaire (si collecté) : message chaleureux + livraison offerte sur prochaine commande (valable 30 jours).
- Après 2ème achat : email de bienvenue dans le "club" — aucune mécanique de points, juste reconnaissance.

### Règles de timing et fréquence

| Règle | Valeur |
|-------|--------|
| Fréquence newsletter max | 2 emails/mois (ne pas bruler la liste) |
| Meilleur envoi newsletter | Mardi ou jeudi, 10h–11h |
| Pas d'email promotionnel < 3 jours après achat | Respecter le post-achat d'abord |
| Jamais 2 emails le même jour | Toujours espacer les flows |
| Désabonnement | 1 clic, immédiat, sans confirmation agressive |

---

## 4. Pages et contenus qui convertissent

### Structure page produit optimale

```
[Fil d'Ariane]
[Galerie photos — minimum 4, zoom, carrousel mobile]
[Nom produit — modèle + matière + couleur]          ← H1
[Note étoiles + nombre d'avis]                       ← lien ancre vers avis
[Prix — promo visible si applicable]
[Sélecteur couleur — swatches avec nom couleur au survol]
[Disponibilité par variante]
[CTA principal — "Ajouter au panier" — pleine largeur mobile]
[Icônes réassurance — livraison, cuir naturel, retours]
[Accordéon : Description / Caractéristiques / Entretien]
[Lien guide entretien]
[Autres coloris disponibles]
[Vous aimerez aussi — 4 produits max]
[Avis clients — avec possibilité de filtrer]
```

### FAQ comme outil de conversion

- **Les questions FAQ répondent aux objections d'achat** — pas aux questions de support.
- Questions les plus utiles : matière (vraiment du vrai cuir ?), fabrication (vraiment en Italie ?), entretien (fragile ?), retours (comment ça marche vraiment ?), taille (est-ce que ça rentre dedans ?).
- Ajouter le Schema.org `FAQPage` pour les rich snippets SERP (déjà en place ✓).
- Chaque réponse = réponse à une objection qui bloque l'achat. Tester les vraies questions reçues par email.

### Avis clients — comment les collecter

1. **Email J+7 après livraison** (voir flow post-achat) avec lien direct Google Business / Trustpilot.
2. **Ne pas demander "5 étoiles"** — demander un avis honnête. Les avis authentiques convertissent mieux.
3. **Minimum pour crédibilité** : 10 avis avant go-prod. Sans avis = signal de risque pour le nouveau client.
4. **Sur la fiche produit** : afficher les avis négatifs (2–3 étoiles) aussi — leur présence rend les positifs plus crédibles (Baymard).
5. **Ne jamais acheter d'avis** — risque déréférencement Google + signalement Trustpilot.

**Plan de lancement 0→10 avis :**
- Demander aux premiers 10 acheteurs (réseau, famille, premiers clients) un avis sincère.
- Offrir la livraison sur leur prochaine commande en remerciement (pas un échange avis contre remise).

### Page "À propos" comme page de conversion

La page À propos a un taux de visite élevé avant premier achat — c'est une page de décision, pas juste de présentation.

**Ce qu'elle doit contenir :**
- Qui est Sara Valenti (histoire, conviction, fondatrice).
- Pourquoi le cuir italien (preuve de compétence, pas juste du storytelling).
- Comment les produits sont sélectionnés (critère qualité, test durée).
- Un moyen de contact visible.
- Un CTA vers le catalogue.

**Ce qu'elle ne doit pas faire :**
- Parler de "passion" sans preuve concrète.
- Être une liste de valeurs marketing sans substance.

### Blog/guides comme SEO et nurturing

- **Guide entretien cuir** : déjà en place ✓ — cible les requêtes "comment entretenir sac en cuir" (volume moyen, intention achat indirecte).
- **Prochaines priorités** :
  - "Cuir brossé vs cuir suède : lequel choisir ?" (comparatif, intention achat directe)
  - "Comment choisir la taille de son sac ?" (BoFu, résout une objection fiche produit)
  - "Sac en cuir véritable : comment reconnaître la qualité ?" (éducation + SEO)
- **Règle** : chaque guide doit se terminer par un lien vers un ou plusieurs produits pertinents.

---

## 5. KPIs e-commerce à suivre

### Tableau de bord minimal

| KPI | Définition | Cible Sara Valenti (an 1) | Fréquence |
|-----|-----------|--------------------------|-----------|
| **Taux de conversion** | Commandes / Sessions | 1,5%–2,5% | Hebdo |
| **Panier moyen (AOV)** | CA / Nb commandes | 110–130 EUR | Hebdo |
| **Taux d'abandon checkout** | Sessions checkout sans commande | < 70% | Hebdo |
| **LTV (12 mois)** | CA total / Nb clients | > 150 EUR | Mensuel |
| **CAC** | Dépenses marketing / Nb nouveaux clients | < 25 EUR | Mensuel |
| **Taux de retour produit** | Retours / Commandes | < 8% | Mensuel |
| **NPS** | Net Promoter Score (enquête) | > 50 | Trimestriel |
| **Taux ouverture emails** | Emails ouverts / Emails envoyés | > 30% | Par campagne |
| **Revenue per recipient** | CA email / Nb destinataires | > 0,50 EUR | Par campagne |

### Benchmarks secteur (Shopify 2025)

- Conversion mode/sacs : **3,06%** en moyenne, **0,94%** pour le luxe pur.
- Sara Valenti cible le mid-premium — objectif réaliste : **1,5%–2,5%**.
- Mobile = 78% du trafic, 70% des commandes — taux de conversion mobile inférieur de 30–40% au desktop.

### Segmenter systématiquement par

- Source (Google organique / direct / email / paid social)
- Device (mobile vs desktop)
- Nouveau vs client récurrent
- Catégorie de produit (Rita vs Grazia vs Mina)

### LTV et répétition d'achat

- **Dans le luxe accessible, la répétition est rare la première année** — objectif : 1 réachat sur 4 clients.
- Levier principal : email post-achat de qualité + guide entretien (maintient l'engagement).
- Une cliente qui achète 2 fois a une LTV 5× supérieure à une mono-acheteuse.

---

## 6. Marketplaces et flux produits

### Google Merchant Center — champs obligatoires

| Champ | Limite | Règle critique |
|-------|--------|----------------|
| `id` | 50 chars | Stable, unique. Ne jamais changer après indexation. |
| `title` | 150 chars | `Sac Rita en cuir brossé camel - Sara Valenti`. Pas de majuscules partout. |
| `description` | 5 000 chars | Identique à la page produit. Pas de liens, pas de comparaisons concurrents. |
| `link` | — | URL canonique de la fiche. Domaine vérifié dans GMC. |
| `image_link` | — | Min 500×500px (règle janv. 2027). JPEG ou WebP. Pas de watermark. |
| `price` | — | Prix TTC, devise EUR. Identique à la page checkout. `109.90 EUR` |
| `availability` | enum | `in_stock`, `out_of_stock`, `preorder`, `backorder` |
| `brand` | 70 chars | `Sara Valenti` |
| `item_group_id` | 50 chars | Même valeur pour toutes les variantes d'un modèle. Ex: `rita` |
| `color` | 100 chars | Couleur principale en premier. `Camel/Doré` |
| `condition` | — | `new` pour tous |
| `google_product_category` | — | `166` (Handbags, Wallets & Cases → Handbags) |

**Champs recommandés (performances) :**
- `sale_price` + `sale_price_effective_date` pour les promos
- `additional_image_link` (jusqu'à 10 images)
- `material` : `cuir brossé` / `cuir suède` / `cuir grainé`
- `product_highlights` : 2–4 bullet points, 150 chars max chacun

### Meta Commerce Manager — différences clés vs Google

| Point de différence | Google | Meta |
|--------------------|--------|------|
| Availability values | `in_stock` (underscore) | `in stock` (espace) |
| Condition | Optionnel si neuf | **Obligatoire** même pour neuf |
| Format prix | `109.90 EUR` (séparé) | `109.90 EUR` (inline) |
| Image recommandée | 500×500 min | 1024×1024 recommandé |

**Champs Meta spécifiques :**
- `fb_product_category` : catégorie Meta taxonomy (en plus de `google_product_category`)
- `gender` : `female` pour tous les sacs Sara Valenti
- `age_group` : `adult`

### Comment optimiser un flux produit

1. **Titre** : Modèle + matière + couleur + marque. `Sac Grazia en cuir suède noir - Sara Valenti`.
2. **Description** : Commencer par les caractéristiques (matière, fabrication), finir par l'usage.
3. **Images** : Photo sur fond blanc ou neutre pour GMC. Photo en contexte pour Meta (meilleur engagement pub).
4. **Prix** : Synchroniser en temps réel. Un écart entre le flux et la page = rejet immédiat.
5. **Disponibilité** : Mettre à jour au moins une fois par jour. Produit `out_of_stock` qui apparaît dans Shopping = clic perdu + mauvais signal qualité.
6. **GTIN** : Sara Valenti n'a pas de codes EAN — utiliser le champ `mpn` avec le SKU interne à la place.

### Erreurs fréquentes qui font rejeter les produits

| Erreur | Conséquence | Fix |
|--------|-------------|-----|
| Prix flux ≠ prix page | Rejet immédiat | Synchronisation temps réel via API |
| Image < 500×500px | Rejet | Générer depuis Sanity avec dimensions garanties |
| `title` trop générique (`Sac noir`) | Mauvaise perf | Ajouter modèle + matière + marque |
| `availability` texte libre | Rejet | Utiliser enum strict |
| `item_group_id` absent | Variantes non groupées | Champ obligatoire pour tous les modèles avec plusieurs couleurs |
| Watermark sur image | Rejet Google | Générer images propres depuis Sanity |
| GTIN inventé | Rejet + suspension compte | Ne pas soumettre de GTIN si pas d'EAN officiel |

---

## 7. Règles spécifiques Sara Valenti

### Positionnement premium vs mass market

**Ce que Sara Valenti est :**
- Marque DTC (Direct-to-Consumer) française, cuir italien réel, prix accessible-premium (100–120 EUR).
- Cible : femme 25–45 ans, CSP+, sensible à la qualité mais pas au logo.
- Comparables : Oh My Bag (même segment prix), Polène (niveau au-dessus, référence aspiration).

**Ce que Sara Valenti n'est pas :**
- Une marque de fast fashion avec des remises permanentes.
- Une marque de luxe avec des prix > 500 EUR.
- Une marque mass-market qui fait des promotions -50%.

**Règles de positionnement :**
- Jamais de remise > 20% sur les modèles principaux (Rita, Grazia, Mina).
- Jamais de code promo public permanent ("SARA10" sur Instagram → dévalue).
- Les soldes = événements rares, narrativisés ("Fin de série", "Derniers coloris").
- La communication visuelle reste minimale, premium, pas de composition chargée.

### Ton dans les emails transactionnels

- **Vouvoiement systématique**.
- **Phrases courtes, directes** — comme dans les textes gamme/fiche.
- **Pas d'emojis** dans les emails transactionnels (confirmation, expédition, retour).
- **Possible dans la newsletter** : 1 emoji max, en fin de sujet.
- **Pas de caps lock**, pas de `!!!`, pas de "INCROYABLE OFFRE".
- Ton : chaleureux mais pas familier, confiant mais pas arrogant.

**Exemple objet email bienvenue :**
- ✓ `"Bienvenue chez Sara Valenti"`
- ✗ `"🎉 Bienvenue ! Votre code de -15% vous attend !!!"`

### Stratégie de lancement — le problème des 0 avis

Lancer un e-commerce sans avis = taux de conversion très faible. Le risque perçu est maximal pour le nouveau visiteur.

**Plan 0 → 10 avis avant go-prod :**
1. Envoyer 10 produits à des acheteurs de confiance (réseau, famille, amies de Sarah) à prix coûtant.
2. Attendre 7–10 jours de réception et d'usage.
3. Envoyer un email simple : `"Votre avis nous aide à lancer Sara Valenti. 2 minutes sur Google ?"`.
4. Ajouter les avis sur Google Business + potentiellement en dur sur la fiche (avec mention "avis recueilli avant lancement public").
5. Jamais mentir sur la provenance des avis.

**Objectif mois 1 post-lancement :** 25+ avis Google, 10+ avis Trustpilot.

### Plan des 90 premiers jours post-lancement

**Semaines 1–2 : Validation**
- Tester une vraie commande (Stripe production, vrai paiement, remboursement).
- Vérifier tous les emails transactionnels (envoi réel depuis Brevo).
- Surveiller le taux d'erreur checkout, les abandons, les allers-retours SAV.
- Aucune pub payante avant que la conversion organique soit validée.

**Semaines 3–6 : Acquisition organique**
- Publier 3–5 posts Instagram par semaine (produit, coulisses, guide matières).
- Activer Google Shopping dès que le flux est validé.
- Mettre en ligne le guide entretien cuir (SEO long terme).
- Début du flow welcome email + abandon panier.

**Semaines 7–12 : Amplification**
- Analyser les 50 premières commandes : couleurs, modèles, source de trafic, panier moyen.
- Premiers retours clients → ajuster les fiches produit (FAQ, descriptions).
- Envisager une première campagne Meta Ads (budget ≥ 500 EUR/mois).
- Retargeting : Meta Pixel + Google Tag pour les abandons de panier.

### Saisonnalité sacs en cuir

| Période | Pic | Action |
|---------|-----|--------|
| Rentrée (août-sept) | Fort | Collection automne, nouvelles couleurs, mise en avant cuir brossé |
| Noël (nov-déc) | Très fort | Emballage cadeau, guides cadeaux, livraison express, idées cadeaux |
| Soldes (jan + juil) | Variable | Fin de série uniquement — jamais -50% |
| Saint-Valentin (fév) | Moyen | Email thématique, mise en avant coloris doux |
| Fête des mères (mai) | Fort | Idée cadeau, packaging soin |
| Été (juin-août) | Creux | Cuir grainé (résiste mieux à la chaleur), petits formats vacances |

### Cibles prioritaires (femme 25–45 ans, CSP+)

**Persona principal :**
- 28–40 ans, active professionnellement, Paris et grandes métropoles.
- Budget sac 80–150 EUR. Achète qualité > quantité.
- Connaît le cuir, se méfie du simili, cherche une alternative aux marques trop connues.
- Découverte via Instagram ou recommandation.

**Persona secondaire :**
- 40–55 ans, cadre ou profession libérale.
- Budget plus élevé (100–200 EUR).
- Cherche durabilité + discrétion + artisanat.
- Découverte via Google (recherche "sac cuir véritable français").

**Implications produit :**
- Couleurs : noir, camel, taupe dominent les conversions (tous segments).
- Les couleurs vives (bordeaux, kaki) : public plus jeune, CSP+.
- Format : Rita (structuré, quotidien pro) pour 35–50 ans. Mina (souple, casual) pour 25–38 ans.

---

## 8. Checklist go-prod e-commerce

### Tunnel de commande

- [ ] Passer une commande réelle avec un produit en stock (Stripe production)
- [ ] Vérifier le paiement débité sur le relevé bancaire
- [ ] Vérifier la commande apparaît dans Supabase (`commandes` table)
- [ ] Rembourser la commande via Stripe Dashboard — vérifier le statut dans Supabase
- [ ] Tester avec un produit `out_of_stock` — bouton désactivé, pas d'ajout au panier possible
- [ ] Tester avec un panier > 45 EUR — livraison offerte bien calculée
- [ ] Tester avec un panier < 45 EUR — frais Boxtal corrects
- [ ] Tester les 3 transporteurs Boxtal (Colissimo, Mondial Relay, Chronopost)
- [ ] Vérifier l'adresse de livraison dans l'email de confirmation Brevo

### Emails transactionnels (Brevo)

- [ ] Email confirmation commande reçu < 5 min après paiement
- [ ] Email expédition déclenché par webhook Boxtal ou mise à jour manuelle
- [ ] Email abandon panier déclenché 2–4h après (tester via un panier laissé sans paiement)
- [ ] Email welcome newsletter reçu immédiatement après inscription
- [ ] Vérifier que les emails arrivent en boîte principale (pas spam) sur Gmail, Outlook, Apple Mail
- [ ] Vérifier le rendu mobile de chaque email (iPhone + Android)
- [ ] Vérifier les liens dans chaque email (lien colis, lien panier, lien catalogue)

### Mobile (test sur appareils réels)

- [ ] iPhone Safari : page home, fiche produit, checkout complet
- [ ] Android Chrome : même parcours
- [ ] iPad : vérifier que le layout tablette est acceptable
- [ ] Tester Apple Pay si activé dans Stripe
- [ ] Vérifier la galerie photo mobile (swipe, zoom)
- [ ] Vérifier que les boutons CTA sont accessibles (pas masqués par la barre Safari)

### SEO et flux

- [ ] Sitemap.xml accessible et soumis à Google Search Console
- [ ] Robots.txt : ne bloque pas les pages importantes (tester via GSC)
- [ ] Google Merchant Center : flux validé sans erreurs (< 5 avertissements)
- [ ] Meta Commerce Manager : catalogue synchronisé, 0 rejets
- [ ] Schema.org Product valide sur 5 fiches produit (tester via Rich Results Test)
- [ ] Schema.org FAQPage valide sur homepage et gamme
- [ ] Open Graph vérifiée sur 5 pages (titre, description, image)
- [ ] Balises hreflang : FR défaut + EN/NL/DE (si activés)

### Sécurité et légal

- [ ] Mentions légales complètes (email + directeur publication renseignés) ✓
- [ ] CGV sans PayPal (Stripe uniquement) ✓
- [ ] Politique de confidentialité visible dans le footer ✓
- [ ] Politique de retour 14 jours conforme à l'article L221-18 ✓
- [ ] Webhook Stripe configuré et vérifié (secret STRIPE_WEBHOOK_SECRET en env Vercel)
- [ ] RLS Supabase activé sur toutes les tables (`commandes`, `favoris`, `profils`)
- [ ] Variables d'environnement en production (pas de .env local oublié)
- [ ] CSP headers validés (Payload admin + studio)
- [ ] Test injection XSS sur le formulaire checkout (champ "Complément")

### Performance

- [ ] PageSpeed Insights score > 70 sur mobile (tester avec URL de prod)
- [ ] Largest Contentful Paint (LCP) < 2,5s sur la homepage
- [ ] Images WebP sur toutes les pages critiques (home, catalogue, fiche)
- [ ] Lazy loading sur les images below-the-fold
- [ ] Premier chargement < 3s sur connexion 4G simulée

### Derniers contrôles avant DNS

- [ ] URL de preview fonctionne parfaitement sur tous les tests ci-dessus
- [ ] Confirmer avec Sarah Es-Soudaiki les infos mentions légales (email, directeur)
- [ ] Code promo newsletter 10% configuré dans Brevo (ou wording changé)
- [ ] Avis clients : minimum 10 avis collectés
- [ ] Google Business Profile créé et vérifié (pour recueillir des avis)
- [ ] Stock Sanity à jour (81 en stock, 6 rupture, 1 réappro) conforme CSV
- [ ] Redirections 301 depuis les anciennes URLs WooCommerce planifiées
- [ ] DNS Ionos pointé vers Vercel uniquement quand tout ce qui précède est vert

---

*Document de référence stratégique — à relire avant toute décision de conversion, pricing ou marketing. Mettre à jour après chaque test A/B significatif.*
