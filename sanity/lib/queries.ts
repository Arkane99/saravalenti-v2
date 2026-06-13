import { groq } from 'next-sanity'

/** Projection d'une variante : champs + photos avec LQIP pour le blur placeholder. */
const VARIANTE = groq`
  couleur, matiere, prix, promo, stock, reappro, sku, poids, dimensions,
  "photos": photos[]{ asset, "lqip": asset->metadata.lqip }
`

/** Tous les produits pour le catalogue, tries du plus recent au plus ancien. */
export const REQUETE_CATALOGUE = groq`*[_type == "produit"] | order(coalesce(date_creation, _createdAt) desc){
  _id, nom, "slug": slug.current, description_courte, est_page_gamme, date_creation,
  "type": type->nom,
  "variantes": variantes[]{ ${VARIANTE} }
}`

/** Un produit complet (fiche). */
export const REQUETE_PRODUIT = groq`*[_type == "produit" && slug.current == $slug][0]{
  _id, nom, "slug": slug.current, description_courte, description, est_page_gamme, date_creation,
  "type": type->nom,
  "variantes": variantes[]{ ${VARIANTE} },
  "produits_suggeres": produits_suggeres[]->{
    _id, nom, "slug": slug.current, est_page_gamme,
    "type": type->nom,
    "variantes": variantes[]{ ${VARIANTE} }
  }
}`

export const REQUETE_SLUGS = groq`*[_type == "produit" && defined(slug.current)].slug.current`

/** Produits d'une gamme : le modele principal (slug==gamme) + les variantes rattachees (gamme==slug). */
export const REQUETE_PRODUITS_GAMME = groq`*[_type == "produit" && (slug.current == $slug || gamme == $slug)] | order(coalesce(date_creation, _createdAt) asc){
  _id, nom, "slug": slug.current, description_courte, est_page_gamme, gamme,
  "type": type->nom,
  "variantes": variantes[]{ ${VARIANTE} }
}`

/** Modeles phares pour la homepage carousel. */
export const REQUETE_MODELES_PHARES = groq`*[_type == "produit" && slug.current in ["rita", "grazia", "elia", "grazita"]] | order(coalesce(date_creation, _createdAt) asc){
  _id, nom, "slug": slug.current, description_courte,
  "type": type->nom,
  "variantes": variantes[]{ ${VARIANTE} }
}`

/** Derniers avis clients valides. */
export const REQUETE_AVIS = groq`*[_type == "avisClient"] | order(date desc)[0...6]{
  _id, texte, auteur, note, verifie, date,
  "produit": produit->{ nom, "slug": slug.current }
}`
