import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/client'
import { REQUETE_FEED } from '@/sanity/lib/queries'

export const revalidate = 3600

interface VarianteFeed {
  couleur: string
  prix?: number
  promo?: number
  stock?: number
  reappro?: boolean
  sku?: string
  premierPhoto?: { asset: unknown } | null
}

interface ProduitFeed {
  _id: string
  nom: string
  slug: string
  description_courte?: string
  type?: string
  variantes: VarianteFeed[]
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export async function GET() {
  const produits = await client.fetch<ProduitFeed[]>(REQUETE_FEED)

  const data: Record<string, unknown>[] = []

  for (const p of produits) {
    for (const v of p.variantes) {
      if (!v.prix) continue

      const imageUrl = v.premierPhoto?.asset
        ? urlFor(v.premierPhoto).width(800).height(1000).fit('crop').url()
        : undefined

      data.push({
        id: v.sku ?? `${p.slug}-${v.couleur}`,
        title: `${p.nom} ${v.couleur}`,
        description:
          p.description_courte ??
          `${p.nom} en cuir ${v.couleur.toLowerCase()}, marque Sara Valenti.`,
        link: `${BASE}/catalogue/${p.slug}?couleur=${encodeURIComponent(v.couleur)}`,
        ...(imageUrl ? { image_link: imageUrl } : {}),
        price: `${(v.promo ?? v.prix).toFixed(2)} EUR`,
        availability: (v.stock ?? 0) > 0 || v.reappro ? 'in stock' : 'out of stock',
        condition: 'new',
        brand: 'Sara Valenti',
        item_group_id: p.slug,
        google_product_category:
          'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
      })
    }
  }

  return NextResponse.json({ data })
}
