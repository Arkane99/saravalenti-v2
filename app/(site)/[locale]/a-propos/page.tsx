import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'À propos - Sara Valenti',
  description:
    'Sara Valenti : sacs en cuir italien, fabrication artisanale. Une marque française indépendante, des pièces qui durent.',
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
          src="/images/produits/Sac-Rita-Camel-4-scaled.jpg"
          alt="Sac Rita camel en cuir brossé Sara Valenti"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-sv-black/25" />
        <div className="absolute inset-0 flex items-end px-8 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-sv-cream/80">À propos de Sara Valenti</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-14">
          <h1 className="font-serif text-4xl leading-tight text-balance md:text-5xl">
            Sara Valenti : l'élégance du cuir italien, sans compromis
          </h1>
        </header>

        <div className="space-y-8 text-sv-mid [&_p]:leading-relaxed">
          <p>
            Sara Valenti est née d'une conviction simple : une belle pièce en cuir ne devrait pas coûter une
            fortune, mais elle devrait durer toute une vie.
          </p>
          <p>
            Chaque sac de la collection est fabriqué en Italie, dans des ateliers qui travaillent le cuir
            depuis des générations. Cuir brossé, suède, grainé : des matières vivantes qui se patinent avec
            le temps et racontent votre histoire.
          </p>
          <p>
            Pas de logo ostentatoire. Pas de tendance éphémère. Des formes pensées pour durer, des finitions
            qui résistent à l'usage quotidien, et des coloris qui s'accordent à toutes les saisons.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">Pourquoi le cuir italien ?</h2>
          <p className="leading-relaxed text-sv-mid">
            L'Italie dispose d'une tradition maroquinière établie. Les tanneries italiennes sélectionnent les
            peaux pour leur souplesse, leur résistance et leur homogénéité. Chaque peau est choisie
            individuellement avant la fabrication de chaque modèle.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">Une petite entreprise française à votre service</h2>
          <p className="leading-relaxed text-sv-mid">
            Sara Valenti est une marque indépendante, basée en France. Petite structure, grandes exigences :
            chaque commande est traitée avec soin, chaque question reçoit une vraie réponse. Ici, pas de
            service client automatisé ni de formulaire qui disparaît dans le vide. Vous avez une question,
            vous obtenez une réponse.
          </p>
        </section>

        {/* Notre promesse — citation éditoriale */}
        <section className="mt-20 border-t border-sv-border pt-16">
          <blockquote className="mx-auto text-center">
            <p className="font-serif text-xl italic leading-relaxed text-sv-black md:text-2xl">
              "Un sac Sara Valenti n'est pas un achat impulsif. C'est un choix réfléchi, une pièce que vous
              porterez des années et que vous ne voudrez pas remplacer."
            </p>
            <footer className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-sv-gold-dark">
              Notre promesse
            </footer>
          </blockquote>
        </section>
      </div>
    </>
  )
}
