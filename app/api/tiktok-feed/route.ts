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

function csvCell(value: string): string {
  const s = String(value).replace(/"/g, '""')
  return `"${s}"`
}

export async function GET() {
  const produits = await client.fetch<ProduitFeed[]>(REQUETE_FEED)

  const entetes = [
    'sku_id',
    'title',
    'description',
    'price',
    'currency',
    'availability',
    'image_url',
    'brand',
    'category',
    'item_group_id',
    'condition',
    'link',
  ]

  const lignes: string[] = [entetes.join(',')]

  for (const p of produits) {
    for (const v of p.variantes) {
      if (!v.prix) continue

      const imageUrl = v.premierPhoto?.asset
        ? urlFor(v.premierPhoto).width(800).height(1000).fit('crop').url()
        : ''

      const disponible = (v.stock ?? 0) > 0 || v.reappro ? 'IN_STOCK' : 'OUT_OF_STOCK'

      const ligne = [
        csvCell(v.sku ?? `${p.slug}-${v.couleur}`),
        csvCell(`${p.nom} ${v.couleur}`),
        csvCell(
          p.description_courte ??
            `${p.nom} en cuir ${v.couleur.toLowerCase()}, marque Sara Valenti.`
        ),
        csvCell((v.promo ?? v.prix).toFixed(2)),
        csvCell('EUR'),
        csvCell(disponible),
        csvCell(imageUrl),
        csvCell('Sara Valenti'),
        csvCell('Handbags'),
        csvCell(p.slug),
        csvCell('new'),
        csvCell(`${BASE}/catalogue/${p.slug}?couleur=${encodeURIComponent(v.couleur)}`),
      ].join(',')

      lignes.push(ligne)
    }
  }

  return new NextResponse(lignes.join('\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  })
}
