import type { Metadata } from 'next'
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

      <div className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-sv-gold-dark">À propos</p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Sara Valenti : l'élégance du cuir italien, sans compromis
          </h1>
        </header>

        <div className="prose prose-sm max-w-none space-y-10 text-sv-mid [&_p]:leading-relaxed">
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
            L'Italie reste la référence mondiale pour la maroquinerie de qualité. Les tanneries italiennes
            sont reconnues pour leur savoir-faire artisanal et la qualité de leur sélection. Chaque peau est
            choisie pour sa souplesse, sa résistance et son caractère.
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

        <section className="mt-16 rounded border border-sv-border bg-sv-warm-white p-8">
          <h2 className="mb-4 font-serif text-2xl">Notre promesse</h2>
          <p className="leading-relaxed text-sv-mid">
            Un sac Sara Valenti n'est pas un achat impulsif. C'est un choix réfléchi, une pièce que vous
            porterez des années et que vous ne voudrez pas remplacer.
          </p>
        </section>
      </div>
    </>
  )
}
