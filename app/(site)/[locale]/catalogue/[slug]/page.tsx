import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client, urlFor } from '@/sanity/lib/client'
import { REQUETE_PRODUIT, REQUETE_SLUGS } from '@/sanity/lib/queries'
import { routing } from '@/i18n/routing'
import { FicheProduit } from '@/components/produit/FicheProduit'
import { CarteProduit } from '@/components/produit/CarteProduit'
import { Link } from '@/i18n/navigation'
import type { ProduitDetail } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(REQUETE_SLUGS)
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug })
  if (!p) return {}
  return {
    title: p.nom,
    description: p.description_courte || `${p.nom}, sac en cuir italien Sara Valenti.`,
    alternates: { canonical: `/catalogue/${slug}` },
  }
}

export default async function ProduitPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const sp = await searchParams

  const produit = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug })
  if (!produit) notFound()

  const couleurInitiale = typeof sp.couleur === 'string' ? sp.couleur : undefined

  const variantesAvecPrix = produit.variantes.filter((v) => v.prix)
  const prixMin = variantesAvecPrix.length
    ? Math.min(...variantesAvecPrix.map((v) => v.promo ?? v.prix!))
    : null
  const prixMax = variantesAvecPrix.length
    ? Math.max(...variantesAvecPrix.map((v) => v.prix!))
    : null

  const photos = produit.variantes
    .flatMap((v) => v.photos ?? [])
    .slice(0, 8)
    .filter((p) => p.asset)
    .map((p) => urlFor(p).width(800).height(1000).fit('crop').url())

  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produit.nom,
    description:
      produit.description_courte ?? `${produit.nom}, sac en cuir italien Sara Valenti.`,
    brand: { '@type': 'Brand', name: 'Sara Valenti' },
    ...(photos.length > 0 ? { image: photos } : {}),
    ...(prixMin !== null
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: prixMin,
            highPrice: prixMax,
            offerCount: variantesAvecPrix.length,
            offers: variantesAvecPrix.map((v) => ({
              '@type': 'Offer',
              name: v.couleur,
              price: v.promo ?? v.prix,
              priceCurrency: 'EUR',
              availability:
                (v.stock ?? 0) > 0 || v.reappro
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              url: `${BASE}/catalogue/${produit.slug}?couleur=${encodeURIComponent(v.couleur)}`,
            })),
          },
        }
      : {}),
  }

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE}/catalogue` },
      {
        '@type': 'ListItem',
        position: 3,
        name: produit.nom,
        item: `${BASE}/catalogue/${produit.slug}`,
      },
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
        <span className="text-sv-black">{produit.nom}</span>
      </nav>

      <FicheProduit produit={produit} couleurInitiale={couleurInitiale} />

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
