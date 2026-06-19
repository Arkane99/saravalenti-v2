# Audit textuel Sara Valenti — 19 juin 2026

## Résumé exécutif

Le contenu éditorial est globalement solide : ton premium cohérent, argumentaires bien écrits, FAQ riche. Trois zones de risque pré-lancement : (1) la meta description homepage annonce "à partir de 109,90 EUR" alors que la FAQ sur la même page dit "à partir de 19,90 EUR" — contradiction factuelle visible dans les résultats Google ; (2) les mentions légales contiennent deux placeholders non renseignés obligatoires RGPD ; (3) le checkout affiche des textes utilisateur sans accents (Prenom, Telephone, reessayer, redirige) qui cassent la crédibilité premium. Ces trois points bloquent le go-prod.

---

## URGENT (à corriger avant mise en ligne)

### 1. Contradiction prix — meta description vs FAQ homepage

- **Page(s)** : `app/(site)/[locale]/page.tsx` ligne 16 (meta description) et ligne 71 (FAQ)
- **Problème** : La meta description dit **"Prix à partir de 109,90 EUR"** alors que la FAQ sur la même page dit **"Les sacs sont proposés à partir de 19,90 EUR"**. Ces deux textes apparaissent dans les SERP Google (meta) et sur la page (FAQ) — la contradiction est immédiatement visible et trompeuse.
- **Texte exact fautif** : `'Sacs en cuir italien fabriqués en Italie : cuir brossé, suède et grainé. Modèles Rita, Grazia, Mina, Grazita. Prix à partir de 109,90 EUR. Livraison France.'`
- **Correction proposée** : `'Sacs en cuir italien fabriqués en Italie : cuir brossé, suède et grainé. Modèles Rita, Grazia, Mina, Grazita. Prix à partir de 19,90 EUR. Livraison France.'`

---

### 2. Mentions légales — placeholders RGPD non renseignés

- **Page(s)** : `app/(site)/[locale]/mentions-legales/page.tsx` lignes 25, 26, 49
- **Problème** : Deux placeholders littéraux s'affichent sur la page publique. C'est une obligation légale (RGPD, article L122-1 Code de la consommation) et un signal de site non finalisé visible par les clients.
  - Ligne 25 : `Contact : [adresse email à renseigner]`
  - Ligne 26 : `Directeur de la publication : [à renseigner]`
  - Ligne 49 : `Pour exercer ces droits : [email à renseigner]`
- **Correction proposée** : Renseigner l'email de contact réel de Sara Valenti (ex: contact@saravalenti.fr) et le nom du directeur de publication (Sarah Es-Soudaiki).

---

### 3. CGV — moyen de paiement mentionné mais non disponible (PayPal)

- **Page(s)** : `app/(site)/[locale]/cgv/page.tsx` ligne 53, `app/(site)/[locale]/checkout/page.tsx` ligne 248
- **Problème** : Les CGV indiquent **"par carte bancaire (Visa, Mastercard) ou PayPal"** mais le checkout redirige uniquement vers Stripe (pas d'option PayPal implémentée). Cela constitue une information contractuelle inexacte.
- **Texte exact fautif** : `Le paiement s'effectue par carte bancaire (Visa, Mastercard) ou PayPal via une plateforme sécurisée.`
- **Correction proposée** : `Le paiement s'effectue par carte bancaire (Visa, Mastercard, American Express) via une plateforme sécurisée Stripe.` — ou implémenter PayPal avant mise en ligne.

---

### 4. Page retours — email de contact manquant

- **Page(s)** : `app/(site)/[locale]/retours/page.tsx` ligne 40
- **Problème** : La procédure de retour demande de contacter Sara Valenti "par email" pour obtenir l'adresse de retour et un numéro de retour, mais aucun email n'est fourni nulle part sur le site (le seul endroit qui devrait en avoir un — les mentions légales — est lui-même un placeholder). Un client qui veut retourner sa commande ne peut pas le faire.
- **Texte exact** : `Contactez-nous par email avant de renvoyer l'article pour obtenir l'adresse de retour et un numéro de retour.`
- **Correction proposée** : Ajouter l'email après cette phrase — ex: `Écrivez-nous à contact@saravalenti.fr` — ou créer une page /contact.

---

### 5. Règle dure violée — tiret cadratin dans des métadonnées et alt text publics

- **Page(s)** :
  - `app/(site)/[locale]/catalogue/[slug]/page.tsx` lignes 57 et 76
  - `app/(site)/[locale]/entretien-cuir/page.tsx` ligne 180
- **Problème** : La règle absolue du projet interdit le tiret cadratin (—) dans le code et les contenus. Il apparaît dans :
  - `title: \`${p.nom} — tous les coloris | Sara Valenti\`` (ligne 57) → affiché dans l'onglet browser et les SERP
  - `\`${titre} — sac en cuir italien Sara Valenti.\`` (ligne 76) → meta description de fallback
  - `alt="Détail du cuir brossé — sac Rita Sara Valenti"` (ligne 180) → alt text accessible
- **Correction proposée** : Remplacer par un tiret court ou une virgule :
  - `${p.nom} - tous les coloris | Sara Valenti`
  - `${titre}, sac en cuir italien Sara Valenti.`
  - `Détail du cuir brossé, sac Rita Sara Valenti`

---

### 6. Checkout — textes utilisateur sans accents (page transactionnelle critique)

- **Page(s)** : `app/(site)/[locale]/checkout/page.tsx` lignes 122, 125, 147, 151, 248
- **Problème** : La page checkout est la page la plus critique du parcours e-commerce. Plusieurs textes visibles manquent leurs accents :
  - Ligne 147 : label `'Prenom'` (affiché comme label de champ)
  - Ligne 151 : label `'Telephone'`
  - Ligne 122 : message d'erreur `'Veuillez reessayer.'`
  - Ligne 125 : message d'erreur `'Erreur reseau. Veuillez reessayer.'`
  - Ligne 248 : `'Vous allez etre redirige vers Stripe pour effectuer le paiement en toute securite.'`
- **Correction proposée** :
  - `'Prénom'`, `'Téléphone'`
  - `'Veuillez réessayer.'`, `'Erreur réseau. Veuillez réessayer.'`
  - `'Vous allez être redirigé vers Stripe pour effectuer le paiement en toute sécurité.'`

---

### 7. Règle dure violée — "cuir pleine surface" dans la gamme Mina

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 135
- **Problème** : Le texte de la section Mina contient `"par rapport au cuir pleine surface"`. "Cuir pleine surface" est un terme technique ambigu et proche de "cuir pleine fleur" (expression interdite dans CLAUDE.md). De plus, cette expression n'est pas claire pour le consommateur : elle ne correspond à aucune matière nommée dans la collection (brossé, suède, grainé, irisé).
- **Texte exact** : `Sa légèreté relative par rapport au cuir pleine surface en fait un choix idéal pour les sacs portés longtemps.`
- **Correction proposée** : `Sa légèreté relative par rapport au cuir structuré ou grainé en fait un choix idéal pour les sacs portés longtemps.`

---

## IMPORTANT (améliore la cohérence et la conversion)

### 8. Grazia — sous-titre hero inexact (suède uniquement alors que c'est suède ET grainé)

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 80
- **Problème** : Le sous-titre hero de la page Grazia est `'Sac en cuir suède, 13 coloris'`. Grazia existe en cuir suède (6 coloris) ET en cuir grainé (7 coloris) — le sous-titre occulte complètement la version grainée, qui représente 7 des 13 coloris.
- **Correction proposée** : `'Sac en cuir suède et grainé, 13 coloris'`

---

### 9. Grazia — H1 et meta title inexacts (même problème)

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` lignes 75-76
- **Problème** :
  - H1 : `'Sac Grazia en cuir suède : 13 couleurs disponibles'` — omet le grainé
  - Meta title : `'Sac Grazia en cuir suède - 13 couleurs - Sara Valenti'` — idem
  - Meta description : `'Le sac Grazia en cuir suède italien : 13 couleurs disponibles, cuir suède et grainé.'` — le début est trompeur, la correction est dans la fin de phrase
- **Correction proposée** :
  - H1 : `'Sac Grazia en cuir suède et grainé : 13 coloris disponibles'`
  - Meta title : `'Sac Grazia suède et grainé - 13 coloris - Sara Valenti'`
  - Meta description : `'Le sac Grazia en cuir italien : 13 coloris, disponible en cuir suède (6 couleurs) et cuir grainé (7 couleurs). Fabriqué en Italie, livraison France.'`

---

### 10. Rita FAQ — couleurs non existantes mentionnées ("marron", "miel")

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 62
- **Problème** : La FAQ Rita dit `"Le noir et le marron sont les plus polyvalents"` et `"Les tons chauds (camel, miel)"`. Or les 5 couleurs Rita selon le brief sont : noir, camel, marine, chocolat, taupe. "Marron" n'existe pas (c'est chocolat), "miel" n'existe pas.
- **Texte exact fautif** : `Le noir et le marron sont les plus polyvalents pour le quotidien. Les tons chauds (camel, miel) mettent en valeur le grain du cuir brossé.`
- **Correction proposée** : `Le noir et le chocolat sont les plus polyvalents pour le quotidien. Les tons chauds (camel) mettent en valeur le grain du cuir brossé. Le taupe offre une neutralité élégante qui s'adapte à toutes les tenues.`

---

### 11. Grazia FAQ — couleurs non existantes mentionnées ("caramel", "gris perle")

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 112
- **Problème** : La FAQ Grazia dit `"Le caramel et le cognac mettent le mieux en valeur la texture du suède"` et `"Les tons neutres (gris perle, taupe)"`. Le brief liste les couleurs Grazia comme : noir, taupe, chocolat, camel, beige, bordeaux, kaki, moka, cognac... "Caramel" et "gris perle" n'existent pas dans la collection.
- **Correction proposée** : `Le cognac et le camel mettent le mieux en valeur la texture du suède. Le noir est le plus polyvalent. Les tons neutres (taupe, beige) s'accordent à toutes les tenues.`

---

### 12. Politique de confidentialité manquante — RGPD obligatoire

- **Page(s)** : `components/layout/Footer.tsx`, `app/(site)/[locale]/mentions-legales/`
- **Problème** : SARA_VALENTI_DESIGN.md section 3.12 indique explicitement : **"Politique de confidentialité obligatoire dans col 4 — actuellement absent, RGPD exige sa présence."** Il n'existe pas de page `/politique-de-confidentialite` ni de lien dans le footer. Les mentions légales abordent rapidement les données personnelles mais sans la page dédiée requise par le RGPD (article 13).
- **Correction proposée** : Créer `app/(site)/[locale]/politique-de-confidentialite/page.tsx` et l'ajouter dans la colonne INFORMATIONS du footer.

---

### 13. Footer — fond incorrect vs design system

- **Page(s)** : `components/layout/Footer.tsx` ligne 9
- **Problème** : Le footer utilise `bg-sv-warm-white` mais SARA_VALENTI_DESIGN.md spécifie explicitement `bg-sv-black` pour le footer (section 3.9 : "Footer : bg-sv-black (avec texte sv-cream)" et section 3.12 : "Fond : bg-sv-black. Textes : text-sv-cream"). Le fond clair casse l'alternance et l'ancrage visuel de la page.
- **Correction proposée** : `<footer className="border-t border-sv-border bg-sv-black">` avec adaptation des classes texte en `text-sv-cream` et `text-sv-cream/70`.

---

### 14. Homepage — argument "Retour simple" vs politique réelle (frais à la charge du client)

- **Page(s)** : `app/(site)/[locale]/page.tsx` ligne 56
- **Problème** : L'argument de réassurance dit `'Retour simple, remboursement rapide. Pas de questions inutiles.'` mais la page retours précise que les frais de retour sont à la charge du client. "Retour simple" peut laisser croire à une politique de retour sans frais, ce qui n'est pas le cas. Ce n'est pas un mensonge, mais c'est trompeur par omission.
- **Correction proposée** : `'14 jours pour changer d'avis. Procédure simple, remboursement sous 7 jours ouvrés. Frais de retour à votre charge.'` — ou reformuler en restant honnête : `'14 jours pour retourner votre sac. Procédure par email, remboursement rapide.'`

---

### 15. Page catalogue — H1 générique sans mots-clés

- **Page(s)** : `app/(site)/[locale]/catalogue/page.tsx` ligne 26-27
- **Problème** : Le H1 est simplement `'Catalogue'` suivi de `'{produits.length} modèles, fabrication italienne.'` C'est factuel mais SEO-faible. Un H1 cible "sacs en cuir" dès la page catalogue, qui est la page de catégorie principale.
- **Correction proposée** : `'Sacs en cuir italien'` ou `'Collection de sacs en cuir'` avec le sous-titre conservé.

---

### 16. Catalogue — meta description trop courte et générique

- **Page(s)** : `app/(site)/[locale]/catalogue/page.tsx` ligne 12-13
- **Problème** : La meta description dit `'Tous les sacs en cuir italien Sara Valenti : sacs à main, bandoulière, bananes et plus, en cuir brossé, suède et grainé.'` (environ 110 caractères). Elle pourrait être renforcée avec les modèles phares et le prix d'entrée pour améliorer le taux de clic.
- **Correction proposée** : `'Collection complète Sara Valenti : sacs en cuir italien brossé, suède et grainé. Rita, Grazia, Mina et 24 autres modèles. Prix à partir de 19,90 EUR. Fabrication italienne.'`

---

### 17. Textes avec accents manquants dans d'autres pages visibles

- **Page(s)** :
  - `app/(site)/[locale]/checkout/confirmation/page.tsx` ligne 37 : `'Un email de confirmation vous a ete envoye.'`
  - `app/(site)/[locale]/checkout/confirmation/page.tsx` ligne 42 : `'Mode demonstration -- aucun paiement reel n'a ete effectue.'` (aussi tiret double — règle dure)
  - `app/(site)/[locale]/(auth-guard)/compte/commandes/page.tsx` ligne 49 : `'Mode demonstration -- Supabase non configure.'`
  - `app/(site)/[locale]/compte/inscription/page.tsx` ligne 54 : `<p>Verifiez votre email</p>`
  - `components/produit/FicheProduit.tsx` ligne 252 : `'Epuise'` (bouton CTA)
  - `app/(site)/[locale]/catalogue/[slug]/page.tsx` ligne 198 : `Epuise` (badge grille)
- **Correction proposée** :
  - `'Un email de confirmation vous a été envoyé.'`
  - `'Mode démonstration - aucun paiement réel n'a été effectué.'`
  - `'Mode démonstration - Supabase non configuré.'`
  - `'Vérifiez votre email'`
  - `'Épuisé'` (partout, cohérence avec FicheProduit.tsx ligne 136 qui l'a déjà avec accent)

---

### 18. AnnouncementBar — "100% cuir véritable" vs "cuir naturel"

- **Page(s)** : `components/layout/AnnouncementBar.tsx` ligne 2
- **Problème** : Le texte défilant dit `'100% cuir véritable'` et la FicheProduit le répète (ligne 273). C'est factuellement correct mais "cuir véritable" est le terme du bas de gamme (utilisé par les marques mass-market). Les textes éditoriaux utilisent correctement "cuir naturel" ou "cuir d'origine italienne". Il y a une incohérence de registre : le bandeau (visible en haut de chaque page) utilise le terme le moins premium.
- **Correction proposée** : `'Livraison offerte dès 45 EUR · Cuir naturel italien · Fabrication artisanale · Retours 14 jours'`

---

## MINEUR (polish et optimisation)

### 19. Rita gamme — mention imprécise du format ("environ 30 x 22 cm")

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 51
- **Problème** : Le format Rita est décrit comme `"environ 30 x 22 cm"` avec "environ" mais sans préciser s'il s'agit de L x H ou L x l. La fiche produit montrera les vraies dimensions depuis Sanity (longueur x largeur x hauteur), mais la page gamme est vague.
- **Correction proposée** : Attendre les données exactes du CSV/Sanity, puis préciser `"30 x 22 x 12 cm"` ou retirer la dimension pour ne pas créer de contradictions avec les fiches.

---

### 20. Mina — FAQ dit "format A5" sans dimensions précises

- **Page(s)** : `app/(site)/[locale]/gamme/[slug]/page.tsx` ligne 146
- **Problème** : La FAQ Mina dit `"Le Mina peut contenir un format A5, un portefeuille..."` ce qui est une bonne précision UX, mais sans les dimensions du sac pour que l'acheteur puisse vérifier par lui-même.
- **Correction proposée** : Ajouter une phrase du type `"Dimensions : environ XX x XX cm."` une fois les données Sanity confirmées.

---

### 21. À propos — H1 avec tiret cadratin dans le texte visible

- **Page(s)** : `app/(site)/[locale]/a-propos/page.tsx` ligne 54
- **Problème** : Le H1 est `'Sara Valenti : l'élégance du cuir italien, sans compromis'`. Ce n'est pas un tiret cadratin — c'est correct. Mais c'est la seule page avec un H1 sous forme de slogan (toutes les autres ont un H1 descriptif). Le colon est conforme à la règle, mais la structure de titre est moins SEO-friendly.
- **Correction proposée** : Conserver tel quel — c'est une page "brand", pas SEO. Ou : `'À propos de Sara Valenti : sacs en cuir italien fabriqués artisanalement'`.

---

### 22. Homepage — texte de la section "Nos matières" : Grazia classé sous suède uniquement

- **Page(s)** : `app/(site)/[locale]/page.tsx` lignes 31, 37
- **Problème** : La section Nos matières liste "Cuir suède" avec les modèles `'Grazia, Mina, Grazita, Elia'` et "Cuir grainé" avec `'Grazia grainé, Daria, Serena'`. C'est exact mais peut surprendre les visiteurs : Grazia apparaît dans deux catégories différentes. Il n'y a pas de confusion factuelle, mais l'UX pourrait être clarifiée avec une note entre parenthèses.
- **Correction proposée** : `modeles: 'Mina, Grazita, Elia (Grazia aussi en version suède)'` et `modeles: 'Grazia grainé, Daria, Serena'` — ou ajouter une note sous les cards.

---

### 23. Footer — liens "Mon compte" visibles sans être connecté

- **Page(s)** : `components/layout/Footer.tsx` lignes 28-33
- **Problème** : La colonne "Mon compte" affiche "Connexion", "Mes commandes", "Mes favoris". L'utilisateur non connecté qui clique "Mes commandes" est redirigé vers la connexion — ce n'est pas bloquant mais "Mes commandes" implique des commandes existantes. Le libellé "Commandes" serait plus neutre.
- **Correction proposée** : Conserver l'ordre mais renommer : "Connexion", "Mes commandes", "Mes favoris" est standard pour le e-commerce — ne pas modifier.

---

### 24. Newsletter — promesse de "10 % de remise" sans code confirmé

- **Page(s)** : `components/layout/NewsletterBandeau.tsx` ligne 58
- **Problème** : Le bandeau newsletter promet `'Inscrivez-vous et recevez 10 % de remise sur votre première commande.'` et le message de succès dit `'Merci ! Votre code de remise arrive par email.'` La route API `/api/newsletter` envoie l'email à Brevo mais sans logique de génération/envoi de code promo (c'est un stub). Le code promo devra être configuré dans Brevo avant mise en ligne, sinon les clients s'inscriront sans recevoir leur remise.
- **Correction proposée** : Vérifier que le flow Brevo envoie bien un code promo. Si non configuré à la mise en ligne, changer le wording en `'Inscrivez-vous pour recevoir nos actualités et offres exclusives.'` sans promettre de remise.

---

### 25. À propos — absence d'email ou moyen de contact visible

- **Page(s)** : `app/(site)/[locale]/a-propos/page.tsx` ligne 99
- **Problème** : La page à-propos dit `"avec un service client disponible par email"` mais sans donner l'email. Un client qui cherche à contacter Sara Valenti avant d'acheter ne trouve aucun email, aucun formulaire, aucune page /contact.
- **Correction proposée** : Ajouter l'email de contact dans la section "Une marque française" — ex: `contact@saravalenti.fr`. Ou créer une page /contact simple (email + formulaire).

---

## Règles dures violées

| Règle | Violation | Localisation |
|---|---|---|
| Jamais de tiret cadratin dans le code ou les contenus | `— tous les coloris` dans un titre `<title>` | `catalogue/[slug]/page.tsx` ligne 57 |
| Jamais de tiret cadratin dans le code ou les contenus | `— sac en cuir italien Sara Valenti.` dans une meta description | `catalogue/[slug]/page.tsx` ligne 76 |
| Jamais de tiret cadratin dans le code ou les contenus | `— sac Rita Sara Valenti` dans un `alt=""` accessible | `entretien-cuir/page.tsx` ligne 180 |
| Jamais de tiret cadratin dans le code ou les contenus | `--` (double tiret) dans textes visibles mode démo | `checkout/confirmation/page.tsx` ligne 42, `compte/commandes/page.tsx` ligne 49 |
| "cuir pleine fleur" interdit | Formulation proche : "cuir pleine surface" | `gamme/[slug]/page.tsx` ligne 135 |

---

## Points forts à conserver

- **Ton éditorial des pages gamme** : les textes Rita, Grazia, Mina sont bien écrits, premium, sans jargon commercial. Les sections "matière qui dure", "patine unique", "velours naturel" sont du niveau des références Polène/Sézane.
- **FAQ homepage (8 questions)** : exhaustive, bien structurée, répond aux vraies questions d'achat. Le Schema.org FAQPage associé est en place.
- **Arguments de réassurance** : le choix de 4 arguments ciblés (fabrication, cuir, livraison, retour) est pertinent et concis.
- **Section entretien du cuir** : le guide `/entretien-cuir` est une ressource SEO solide et valorise l'expertise de la marque. La structure par type de cuir (produits / routine / erreurs) est claire et actionnable.
- **Page à propos** : le texte "Sara Valenti est née en 2025 d'une conviction simple..." est honnête, direct et bien dans le ton de la marque — sans prétention excessive.
- **Description de la Grazia** : la nuance "Le suède est la matière la plus douce de notre collection, et la plus mal comprise" est excellente — elle anticipe les objections et convertit.
- **Cohérence des délais** : "14 jours" pour les retours est cité de manière cohérente dans l'AnnouncementBar, la FicheProduit, la page retours et les CGV.
- **Règle des CTAs** : le wording "Découvrir la collection", "Voir le catalogue", "Ajouter au panier" est globalement respecté. Pas de "Acheter maintenant" trouvé.
- **Liens guide entretien** : correctement croisés depuis les pages gamme et les fiches produit.
