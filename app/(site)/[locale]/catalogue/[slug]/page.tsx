import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { client, urlFor } from '@/sanity/lib/client'
import { REQUETE_PRODUIT, REQUETE_SLUGS, REQUETE_SLUGS_COULEURS } from '@/sanity/lib/queries'
import { routing } from '@/i18n/routing'
import { FicheProduit } from '@/components/produit/FicheProduit'
import { CarteProduit } from '@/components/produit/CarteProduit'
import { Link } from '@/i18n/navigation'
import { slugifier } from '@/lib/slugifier'
import { formatPrix } from '@/lib/format'
import type { ProduitDetail } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'

export const revalidate = 60

/** Génère 27 pages modèles + 88 pages couleurs = 115 pages statiques. */
export async function generateStaticParams() {
  const produits = await client.fetch<{ slug: string; couleurs: string[] }[]>(REQUETE_SLUGS_COULEURS)

  const pagesModeles = produits.map(({ slug }) => ({ slug }))
  const pagesCouleurs = produits.flatMap(({ slug: modelSlug, couleurs }) =>
    (couleurs ?? []).map((couleur) => ({ slug: `${modelSlug}-${slugifier(couleur)}` }))
  )

  const toutes = [...pagesModeles, ...pagesCouleurs]
  return routing.locales.flatMap((locale) => toutes.map(({ slug }) => ({ locale, slug })))
}

/** Décompose "grazia-graine-bordeaux" → { modelSlug: "grazia-graine", couleurSlug: "bordeaux" }. */
function decomposerSlug(
  pageSlug: string,
  tousSlugsProduits: string[]
): { modelSlug: string; couleurSlug: string } | null {
  const modelSlug = tousSlugsProduits
    .filter((s) => pageSlug.startsWith(s + '-'))
    .sort((a, b) => b.length - a.length)[0]
  if (!modelSlug) return null
  return { modelSlug, couleurSlug: pageSlug.slice(modelSlug.length + 1) }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: pageSlug } = await params
  const tousSlugsProduits = await client.fetch<string[]>(REQUETE_SLUGS)

  // Page modèle
  if (tousSlugsProduits.includes(pageSlug)) {
    const p = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug: pageSlug })
    if (!p) return {}
    return {
      title: `${p.nom} — tous les coloris | Sara Valenti`,
      description:
        p.description_courte ||
        `${p.nom}, sac en cuir italien Sara Valenti. ${p.variantes.length} coloris disponibles.`,
      alternates: { canonical: `/catalogue/${pageSlug}` },
    }
  }

  // Page couleur
  const decompose = decomposerSlug(pageSlug, tousSlugsProduits)
  if (!decompose) return {}
  const { modelSlug, couleurSlug } = decompose
  const p = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug: modelSlug })
  if (!p) return {}
  const v = p.variantes.find((va) => slugifier(va.couleur) === couleurSlug)
  if (!v) return {}
  const titre = `${p.nom} ${v.couleur}`
  const description = v.description_courte || `${titre}, sac en cuir italien Sara Valenti.`
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

// ─────────────────────────────────────────────────────────────────────────────
// Page modèle : /catalogue/rita  (ProductGroup — tous les coloris)
// ─────────────────────────────────────────────────────────────────────────────

function PageModele({ produit }: { produit: ProduitDetail }) {
  const modelSlug = produit.slug
  const modelUrl = `${BASE}/catalogue/${modelSlug}`
  const premiereVariante =
    produit.variantes.find((v) => (v.stock ?? 0) > 0) ?? produit.variantes[0]

  const schemaProductGroup = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: produit.nom,
    description:
      produit.description_courte ||
      `${produit.nom}, sac en cuir italien Sara Valenti. ${produit.variantes.length} coloris disponibles.`,
    brand: { '@type': 'Brand', name: 'Sara Valenti' },
    productGroupID: modelSlug,
    url: modelUrl,
    variesBy: 'color',
    hasVariant: produit.variantes.map((v) => ({
      '@type': 'Product',
      name: `${produit.nom} ${v.couleur}`,
      url: `${BASE}/catalogue/${modelSlug}-${slugifier(v.couleur)}`,
      ...(v.sku ? { sku: v.sku } : {}),
      offers: {
        '@type': 'Offer',
        price: v.promo ?? v.prix,
        priceCurrency: 'EUR',
        availability:
          (v.stock ?? 0) > 0 || v.reappro
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
    })),
  }

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE}/catalogue` },
      { '@type': 'ListItem', position: 3, name: produit.nom, item: modelUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProductGroup) }}
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

        <header className="mb-12">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">{produit.nom}</h1>
          {produit.description_courte && (
            <p className="mt-4 max-w-2xl leading-relaxed text-sv-mid">{produit.description_courte}</p>
          )}
          {premiereVariante && (
            <Link
              href={`/catalogue/${modelSlug}-${slugifier(premiereVariante.couleur)}`}
              className="mt-6 inline-block rounded border border-sv-black bg-sv-black px-6 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black hover:border-sv-gold"
            >
              Voir {premiereVariante.couleur}
            </Link>
          )}
        </header>

        {/* Grille des coloris */}
        <section>
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-sv-mid">
            {produit.variantes.length} coloris
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
            {produit.variantes.map((v) => {
              const photo = v.photos?.[0]
              const prixActuel = v.promo ?? v.prix
              const enPromo = v.promo != null && v.prix != null && v.promo < v.prix
              const epuise = (v.stock ?? 0) <= 0 && !v.reappro
              const href = `/catalogue/${modelSlug}-${slugifier(v.couleur)}`
              return (
                <article key={v.sku || v.couleur} className="group">
                  <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-sv-warm-white">
                    {photo?.asset && (
                      <Image
                        src={urlFor(photo).width(700).height(875).fit('crop').url()}
                        alt={`${produit.nom} ${v.couleur}`}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                    {epuise && (
                      <span className="absolute right-3 top-3 bg-sv-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sv-cream">
                        Epuise
                      </span>
                    )}
                  </Link>
                  <div className="mt-3">
                    <Link href={href}>
                      <p className="font-medium transition-colors group-hover:text-sv-gold-dark">
                        {v.couleur}
                      </p>
                    </Link>
                    {prixActuel != null && (
                      <p className="mt-1 text-sm">
                        {enPromo && (
                          <span className="mr-1 text-sv-mid line-through">{formatPrix(v.prix)}</span>
                        )}
                        <span className={enPromo ? 'text-sv-gold-dark' : 'text-sv-mid'}>
                          {formatPrix(prixActuel)}
                        </span>
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page composant principal
// ─────────────────────────────────────────────────────────────────────────────

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug: pageSlug } = await params
  setRequestLocale(locale)

  const tousSlugsProduits = await client.fetch<string[]>(REQUETE_SLUGS)

  // ── Page modèle (/catalogue/rita) ─────────────────────────
  if (tousSlugsProduits.includes(pageSlug)) {
    const produit = await client.fetch<ProduitDetail | null>(REQUETE_PRODUIT, { slug: pageSlug })
    if (!produit) notFound()
    return <PageModele produit={produit} />
  }

  // ── Page couleur (/catalogue/rita-camel) ──────────────────
  const decompose = decomposerSlug(pageSlug, tousSlugsProduits)
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
  const modelUrl = `${BASE}/catalogue/${modelSlug}`

  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${produit.nom} ${v.couleur}`,
    description:
      v.description_courte ||
      `${produit.nom} ${v.couleur}, sac en cuir Sara Valenti.`,
    brand: { '@type': 'Brand', name: 'Sara Valenti' },
    ...(v.sku ? { sku: v.sku } : {}),
    ...(photos.length > 0 ? { image: photos } : {}),
    isVariantOf: {
      '@type': 'ProductGroup',
      productGroupID: modelSlug,
      name: produit.nom,
      url: modelUrl,
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
      { '@type': 'ListItem', position: 3, name: produit.nom, item: modelUrl },
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
        <nav className="mb-6 text-xs uppercase tracking-[0.12em] text-sv-mid">
          <Link href="/catalogue" className="hover:text-sv-gold">
            Catalogue
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/catalogue/${modelSlug}`} className="hover:text-sv-gold">
            {produit.nom}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-sv-black">{v.couleur}</span>
        </nav>

        <p className="mb-6 text-xs text-sv-mid">
          <Link
            href={`/catalogue/${modelSlug}`}
            className="underline underline-offset-2 hover:text-sv-gold-dark"
          >
            Voir tous les coloris {produit.nom}
          </Link>
        </p>

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
