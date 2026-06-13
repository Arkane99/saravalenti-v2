import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { REQUETE_CATALOGUE } from '@/sanity/lib/queries'
import { CatalogueClient } from '@/components/catalogue/CatalogueClient'
import type { ProduitCarte } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Tous les sacs en cuir italien Sara Valenti : sacs à main, bandoulière, bananes et plus, en cuir brossé, suède et grainé.',
  alternates: { canonical: '/catalogue' },
}

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const produits = await client.fetch<ProduitCarte[]>(REQUETE_CATALOGUE)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl">Catalogue</h1>
        <p className="mt-2 text-sv-mid">{produits.length} modèles, fabrication italienne.</p>
      </header>
      <Suspense fallback={<p className="text-sv-mid">Chargement…</p>}>
        <CatalogueClient produits={produits} />
      </Suspense>
    </div>
  )
}
