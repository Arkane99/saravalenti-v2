# ETAT.md — Sara Valenti V2

Fichier de suivi de l'état du projet. Mis à jour au fil des sessions.

---

## ROADMAP PRODUIT POST-LANCEMENT

### Bijoux Sara Valenti

Décision : intégration dans saravalenti.fr (pas de site séparé) — même domaine, même autorité SEO.

Architecture URL prévue :
- /catalogue?categorie=sacs (existant, filtre à ajouter)
- /catalogue?categorie=bijoux (à créer)
- /gamme/[slug] pour les gammes bijoux (même structure que les sacs)

Actions à faire quand les photos sont prêtes :

1. Ajouter champ "categorie" dans le schema Sanity produit (valeurs : sacs / bijoux)
2. Ajouter filtre catégorie dans CatalogueClient (select tabs ou dropdown)
3. Ajouter "Bijoux" dans la navigation (mega-menu ou lien simple selon volume)
4. Créer les gammes bijoux dans Sanity avec photos et descriptions
5. Section bijoux en homepage si gamme suffisamment étoffée (5+ modèles minimum)

SEO : ne pas créer de contenu bijoux avant d'avoir les vraies photos — les pages vides
ou avec images de mauvaise qualité nuisent au crawl et à la perception de la marque.

---

## Photos manquantes (placeholder en production)

Ces images sont actuellement des placeholders (copies de photos existantes).
A remplacer par de vraies photos au prochain shooting :

- /public/images/matieres/cuir-brosse.webp : close-up cuir brossé lumière rasante
- /public/images/matieres/suede.webp : close-up suède lumière diffuse douce
- /public/images/matieres/graine.webp : close-up cuir grainé fond neutre
- /public/images/heroes/artisan-atelier.webp : mains artisan ou atelier maroquinerie
- /public/images/heroes/hero-home.webp : photo lifestyle (remplacer par shooting Sara V)

---

## Roadmap post go-prod

- Configurer Boxtal pour BE/NL/DE/CH/LU (tarifs et délais réels)
- Configurer le flow Brevo pour la promesse -10% newsletter
- Traduire les pages EN/NL/DE correctement (hreflang par pays et pas seulement par langue)
- Hreflang par pays : nl-BE, de-DE, de-CH
- Vérifier NEXT_PUBLIC_SITE_URL dans les variables Vercel (actuellement fallback dans le code)
