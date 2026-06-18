import type { PortableTextBlock } from '@portabletext/types'

export interface PhotoSanity {
  asset?: { _ref: string; _type?: string }
  lqip?: string
}

export interface Variante {
  couleur: string
  description_courte?: string
  matiere?: string
  prix?: number
  promo?: number
  stock: number
  reappro: boolean
  sku?: string
  poids?: number
  dimensions?: { longueur?: number; largeur?: number; hauteur?: number }
  photos?: PhotoSanity[]
}

export interface ProduitCarte {
  _id: string
  nom: string
  slug: string
  type?: string
  description_courte?: string
  est_page_gamme?: boolean
  date_creation?: string
  variantes: Variante[]
}

export interface ProduitDetail extends ProduitCarte {
  description?: PortableTextBlock[]
  produits_suggeres?: ProduitCarte[]
  gamme?: string
}

export interface AvisClient {
  _id: string
  texte: string
  auteur: string
  note: number
  verifie?: boolean
  date?: string
  produit?: { nom: string; slug: string }
}
