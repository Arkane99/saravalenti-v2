import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'À propos - Sara Valenti',
  description:
    'Sara Valenti : sacs en cuir italien fabriqués en Italie. Une marque française indépendante, des pièces pensées pour durer.',
  alternates: { canonical: '/a-propos' },
}

const schemaOrganisation = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sara Valenti',
  url: 'https://www.saravalenti.fr',
  description:
    'Sara Valenti est une marque française de sacs en cuir fabriqués en Italie dans des ateliers artisanaux. Cuir brossé, suède et grainé, des pièces intemporelles conçues pour durer.',
}

export default async function AProposPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganisation) }}
      />

      {/* Hero image */}
      <div className="relative h-64 overflow-hidden md:h-96">
        <Image
          src="/images/heroes/hero-apropos.webp"
          alt="Artisan maroquinier cousant du cuir à la main, Sara Valenti"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end px-8 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            À propos de Sara Valenti
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-14">
          <h1 className="text-balance font-serif text-4xl leading-tight md:text-5xl">
            Sara Valenti : l'élégance du cuir italien, sans compromis
          </h1>
        </header>

        <div className="space-y-6 text-sv-mid [&_p]:leading-relaxed [&_p]:text-sm md:[&_p]:text-base">
          <p>
            Sara Valenti est née en 2025 d'une conviction simple : il est possible de porter du vrai
            cuir italien, bien fabriqué, sans payer le prix d'une grande maison.
          </p>
          <p>
            Chaque sac de la collection est fabriqué dans des ateliers de maroquinerie italiens, dans
            une tradition artisanale qui privilégie la durabilité sur la rapidité. Cuir brossé, suède,
            grainé : des matières vivantes qui se patinent avec le temps et racontent votre histoire.
          </p>
          <p>
            Sara Valenti, c'est aussi un choix de valeurs. Pas de faux cuir vendu au prix du vrai.
            Pas de collection éphémère remplacée tous les mois. Des modèles pensés pour durer,
            sélectionnés pour leur qualité de fabrication et leur capacité à traverser les saisons
            sans vieillir.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">Comment nous sélectionnons nos modèles</h2>
          <p className="text-sm leading-relaxed text-sv-mid md:text-base">
            Chaque modèle est choisi selon trois critères : la qualité du cuir, la solidité des
            finitions, et la pertinence du format pour une utilisation quotidienne réelle. Avant
            d'entrer dans la collection, chaque sac est testé sur la durée. Ceux qui ne tiennent pas
            leurs promesses n'y restent pas.
          </p>
        </section>
      </div>

      {/* Blockquote pleine largeur */}
      <div className="bg-sv-black text-sv-cream py-16 px-8">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">
            &ldquo;Un sac qui dure dix ans coûte moins cher qu&rsquo;un sac remplacé tous les ans.&rdquo;
          </p>
        </blockquote>
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">Pourquoi le cuir italien</h2>
          <p className="text-sm leading-relaxed text-sv-mid md:text-base">
            L'Italie reste la référence mondiale pour la maroquinerie de qualité. Les ateliers
            italiens sont reconnus pour leur maîtrise du travail du cuir, leur sélection rigoureuse
            des peaux et leur attention aux finitions. C'est cette exigence que nous cherchons dans
            chaque pièce de la collection.
          </p>
        </section>

        <section className="mt-16 pb-20">
          <h2 className="mb-6 font-serif text-2xl">Une marque française, des produits italiens</h2>
          <p className="text-sm leading-relaxed text-sv-mid md:text-base">
            Sara Valenti est basée en France. Toutes nos commandes sont expédiées depuis la France,
            avec un service client disponible par email à contact@saravalenti.fr. Petite structure, grandes exigences : chaque
            commande est traitée avec soin, chaque question reçoit une vraie réponse.
          </p>
        </section>
      </div>

      {/* Chiffres clés */}
      <div className="bg-sv-warm-white py-16">
        <div className="mx-auto max-w-3xl px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-serif text-5xl text-sv-gold">2025</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-sv-mid">Année de création</p>
          </div>
          <div>
            <p className="font-serif text-5xl text-sv-gold">3</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-sv-mid">Types de cuir</p>
          </div>
          <div>
            <p className="font-serif text-5xl text-sv-gold">6</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-sv-mid">Pays de livraison</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-20">
        {/* Notre promesse */}
        <section className="border-t border-sv-border pt-16">
          <blockquote className="mx-auto text-center">
            <p className="font-serif text-xl italic leading-relaxed text-sv-black md:text-2xl">
              &ldquo;Un sac Sara Valenti n&rsquo;est pas un achat impulsif. C&rsquo;est un choix réfléchi, une pièce que
              vous porterez des années et que vous ne voudrez pas remplacer.&rdquo;
            </p>
            <footer className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-sv-gold-dark">
              Notre promesse
            </footer>
          </blockquote>
        </section>

        <div className="mt-12 text-center">
          <Link href="/catalogue" className="text-sv-mid underline underline-offset-4 hover:text-sv-black transition-colors">
            Découvrir la collection &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
