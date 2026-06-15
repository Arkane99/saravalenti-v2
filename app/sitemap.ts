import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { REQUETE_SLUGS } from '@/sanity/lib/queries'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch<string[]>(REQUETE_SLUGS)

  const produits: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/catalogue/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/catalogue`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/gamme/rita`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/gamme/grazia`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/gamme/mina`, changeFrequency: 'weekly', priority: 0.85 },
    ...produits,
    { url: `${BASE}/entretien-cuir`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/a-propos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/livraison`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/retours`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/cgv`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/mentions-legales`, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
