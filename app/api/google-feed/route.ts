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

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function disponibilite(v: VarianteFeed): string {
  return (v.stock ?? 0) > 0 || v.reappro ? 'in stock' : 'out of stock'
}

export async function GET() {
  const produits = await client.fetch<ProduitFeed[]>(REQUETE_FEED)

  const items: string[] = []

  for (const p of produits) {
    for (const v of p.variantes) {
      if (!v.prix) continue

      const titre = escape(`${p.nom} ${v.couleur}`)
      const description = escape(
        p.description_courte ?? `${p.nom} en cuir ${v.couleur.toLowerCase()}, marque Sara Valenti.`
      )
      const lien = `${BASE}/catalogue/${p.slug}?couleur=${encodeURIComponent(v.couleur)}`
      const prix = `${(v.promo ?? v.prix).toFixed(2)} EUR`
      const imageUrl = v.premierPhoto?.asset
        ? urlFor(v.premierPhoto).width(800).height(1000).fit('crop').url()
        : ''

      items.push(`    <item>
      <g:id>${escape(v.sku ?? `${p.slug}-${v.couleur}`)}</g:id>
      <g:title>${titre}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escape(lien)}</g:link>
      ${imageUrl ? `<g:image_link>${escape(imageUrl)}</g:image_link>` : ''}
      <g:price>${prix}</g:price>
      <g:availability>${disponibilite(v)}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Sara Valenti</g:brand>
      <g:item_group_id>${escape(p.slug)}</g:item_group_id>
      <g:google_product_category>Vetements et accessoires &gt; Sacs a main, portefeuilles et etuis &gt; Sacs a main</g:google_product_category>
    </item>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Sara Valenti</title>
    <link>${BASE}</link>
    <description>Sacs en cuir italien Sara Valenti</description>
${items.join('\n')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
