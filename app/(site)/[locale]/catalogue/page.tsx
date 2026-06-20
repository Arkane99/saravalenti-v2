import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { REQUETE_CATALOGUE } from '@/sanity/lib/queries'
import { CatalogueClient } from '@/components/catalogue/CatalogueClient'
import type { ProduitCarte } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Sacs en cuir italien - Sara Valenti',
  description: 'Collection complète Sara Valenti : sacs en cuir italien brossé, suède et grainé. Rita, Grazia, Mina et bien d\'autres modèles. Prix à partir de 109,90 EUR. Fabrication italienne.',
  alternates: { canonical: '/catalogue' },
}

export default async function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams])
  setRequestLocale(locale)

  const produits = await client.fetch<ProduitCarte[]>(REQUETE_CATALOGUE)

  // Normalise searchParams (string[] → première valeur) pour initialiser les filtres côté serveur
  const initialParams: Record<string, string> = {}
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string') initialParams[k] = v
    else if (Array.isArray(v) && v.length > 0) initialParams[k] = v[0]
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl">Sacs en cuir italien</h1>
        <p className="mt-2 text-sv-mid">{produits.length} modèles, fabrication italienne.</p>
      </header>
      {/* Rendu direct sans Suspense : les produits sont présents dans le HTML initial (SSR) */}
      <CatalogueClient produits={produits} initialParams={initialParams} />
    </div>
  )
}
