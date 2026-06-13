import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { REQUETE_PRODUIT, REQUETE_SLUGS } from '@/sanity/lib/queries'
import { routing } from '@/i18n/routing'
import { FicheProduit } from '@/components/produit/FicheProduit'
import { CarteProduit } from '@/components/produit/CarteProduit'
import { Link } from '@/i18n/navigation'
import type { ProduitDetail } from '@/lib/types'

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

  return (
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
  )
}
