import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { REQUETE_SLUGS, REQUETE_SLUGS_COULEURS } from '@/sanity/lib/queries'
import { slugifier } from '@/lib/slugifier'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, produitsAvecCouleurs] = await Promise.all([
    client.fetch<string[]>(REQUETE_SLUGS),
    client.fetch<{ slug: string; couleurs: string[] }[]>(REQUETE_SLUGS_COULEURS),
  ])

  // Pages modèle : /catalogue/rita (ProductGroup — index des couleurs)
  const produits: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/catalogue/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Pages couleur : /catalogue/rita-camel (Product — pages SEO principales)
  const couleurs: MetadataRoute.Sitemap = produitsAvecCouleurs.flatMap(({ slug, couleurs: cl }) =>
    (cl ?? []).map((couleur) => ({
      url: `${BASE}/catalogue/${slug}-${slugifier(couleur)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  )

  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/catalogue`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/gamme/rita`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/gamme/grazia`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/gamme/mina`, changeFrequency: 'weekly', priority: 0.85 },
    ...produits,
    ...couleurs,
    { url: `${BASE}/entretien-cuir`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/a-propos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/livraison`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/retours`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/cgv`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/mentions-legales`, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
