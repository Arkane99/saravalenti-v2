import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client, urlFor } from '@/sanity/lib/client'
import { REQUETE_PRODUIT, REQUETE_SLUGS, REQUETE_SLUGS_COULEURS } from '@/sanity/lib/queries'
import { routing } from '@/i18n/routing'
import { FicheProduit } from '@/components/produit/FicheProduit'
import { CarteProduit } from '@/components/produit/CarteProduit'
import { Link } from '@/i18n/navigation'
import { slugifier } from '@/lib/slugifier'
import type { ProduitDetail } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export const revalidate = 60

/** Génère une page statique par combinaison modèle × couleur : /catalogue/rita-camel, /catalogue/grazia-graine-bordeaux… */
export async function generateStaticParams() {
  const produits = await client.fetch<{ slug: string; couleurs: string[] }[]>(REQUETE_SLUGS_COULEURS)
  const pages = produits.flatMap(({ slug: modelSlug, couleurs }) =>
    (couleurs ?? []).map((couleur) => ({ slug: `${modelSlug}-${slugifier(couleur)}` }))
  )
  return routing.locales.flatMap((locale) => pages.map(({ slug }) => ({ locale, slug })))
}

/** Décompose "grazia-graine-bordeaux" → { modelSlug: "grazia-graine", couleurSlug: "bordeaux" }. */
async function decomposerSlug(pageSlug: string): Promise<{ modelSlug: string; couleurSlug: string } | null> {
  const tousSlugsProduits = await client.fetch<string[]>(REQUETE_SLUGS)
  const modelSlug = tousSlugsProduits
    .filter((s) => pageSlug.startsWith(s + '-'))
    .sort((a, b) => b.length - a.length)[0]
  if (!modelSlug) return null
  return { modelSlug, couleurSlug: pageSlug.slice(modelSlug.length + 1) }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: pageSlug } = await params
  const decompose = await decomposerSlug(pageSlug)
  if (!decompose) return {}
  const { modelSlug, couleurSlug } = decompose
  const p = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug: modelSlug })
  if (!p) return {}
  const v = p.variantes.find((va) => slugifier(va.couleur) === couleurSlug)
  if (!v) return {}
  const titre = `${p.nom} ${v.couleur}`
  const description = v.description_courte || p.description_courte || `${titre}, sac en cuir italien Sara Valenti.`
  const ogPhoto = v.photos?.find((ph) => ph.asset)
  const ogImage = ogPhoto ? urlFor(ogPhoto).width(1200).height(900).fit('crop').url() : undefined
  return {
    title: titre,
    description,
    alternates: { canonical: `/catalogue/${pageSlug}` },
    openGraph: {
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 900, alt: titre }] } : {}),
    },
  }
}

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug: pageSlug } = await params
  setRequestLocale(locale)

  const decompose = await decomposerSlug(pageSlug)
  if (!decompose) notFound()
  const { modelSlug, couleurSlug } = decompose

  const produit = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug: modelSlug })
  if (!produit) notFound()

  const v = produit.variantes.find((va) => slugifier(va.couleur) === couleurSlug)
  if (!v) notFound()

  const photos = (v.photos ?? [])
    .slice(0, 8)
    .filter((p) => p.asset)
    .map((p) => urlFor(p).width(800).height(1000).fit('crop').url())

  const pageUrl = `${BASE}/catalogue/${pageSlug}`

  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${produit.nom} ${v.couleur}`,
    description: v.description_courte || produit.description_courte || `${produit.nom} ${v.couleur}, sac en cuir Sara Valenti.`,
    brand: { '@type': 'Brand', name: 'Sara Valenti' },
    ...(v.sku ? { sku: v.sku } : {}),
    ...(photos.length > 0 ? { image: photos } : {}),
    isVariantOf: {
      '@type': 'ProductGroup',
      productGroupID: modelSlug,
      name: produit.nom,
      url: `${BASE}/catalogue/${modelSlug}-${slugifier(produit.variantes[0]?.couleur ?? '')}`,
    },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      price: v.promo ?? v.prix,
      priceCurrency: 'EUR',
      availability:
        (v.stock ?? 0) > 0 || v.reappro
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE}/catalogue` },
      { '@type': 'ListItem', position: 3, name: produit.nom, item: `${BASE}/catalogue/${modelSlug}-${slugifier(produit.variantes[0]?.couleur ?? '')}` },
      { '@type': 'ListItem', position: 4, name: `${produit.nom} ${v.couleur}`, item: pageUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.12em] text-sv-mid">
          <Link href="/catalogue" className="hover:text-sv-gold">
            Catalogue
          </Link>
          <span className="mx-2">/</span>
          <span className="text-sv-black">{produit.nom} {v.couleur}</span>
        </nav>

        <FicheProduit produit={produit} couleurSlug={couleurSlug} />

        {produit.produits_suggeres && produit.produits_suggeres.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-2xl">Vous aimerez aussi</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">
              {produit.produits_suggeres.map((p) => (
                <CarteProduit key={p._id} produit={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
