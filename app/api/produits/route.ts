import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const VARIANTE = groq`couleur, matiere, prix, promo, stock, reappro, sku, poids, dimensions,
  "photos": photos[]{ asset, "lqip": asset->metadata.lqip }`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slugsParam = searchParams.get('slugs')

  if (!slugsParam) {
    return NextResponse.json([])
  }

  const slugs = slugsParam.split(',').filter(Boolean).slice(0, 50)

  const produits = await client.fetch(
    groq`*[_type == "produit" && slug.current in $slugs]{
      _id, nom, "slug": slug.current, description_courte, est_page_gamme,
      "type": type->nom,
      "variantes": variantes[]{ ${VARIANTE} }
    }`,
    { slugs }
  )

  return NextResponse.json(produits)
}
