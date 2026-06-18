import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Livraison et délais - Sara Valenti',
  description: 'Informations de livraison Sara Valenti : Colissimo, Mondial Relay, Chronopost. Délais et tarifs pour la France.',
  alternates: { canonical: '/livraison' },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quels sont les délais de livraison ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les commandes sont expédiées sous 24 à 48 heures ouvrées. Le délai de livraison dépend ensuite du transporteur choisi : 2 à 5 jours ouvrés pour Colissimo et Mondial Relay, 1 jour ouvré pour Chronopost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Livrez-vous en dehors de France ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Actuellement, nous livrons uniquement en France métropolitaine et en Corse. La livraison à l\'international sera disponible prochainement.',
      },
    },
  ],
}

export default async function LivraisonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl">Livraison et délais</h1>
        </header>

        <section className="mb-10 rounded border border-sv-gold/40 bg-sv-warm-white px-6 py-5">
          <p className="text-sm font-medium text-sv-black">
            Livraison offerte à partir de 45 EUR d'achat.
          </p>
          <p className="mt-1 text-xs text-sv-mid">
            En dessous de ce montant, les frais de port sont calculés au moment du paiement selon le transporteur choisi et le poids de la commande.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Transporteurs</h2>
          <p className="mb-6 text-sm leading-relaxed text-sv-mid">
            Les commandes Sara Valenti sont expédiées via Boxtal, qui sélectionne le meilleur tarif parmi nos transporteurs partenaires.
          </p>
          <div className="divide-y divide-sv-border rounded border border-sv-border">
            {[
              { nom: 'Colissimo (La Poste)', delai: '2 à 5 jours ouvrés', tarif: 'Calculé à la commande' },
              { nom: 'Mondial Relay', delai: '3 à 5 jours ouvrés', tarif: 'Calculé à la commande' },
              { nom: 'Chronopost', delai: '1 jour ouvré', tarif: 'Calculé à la commande' },
            ].map((t) => (
              <div key={t.nom} className="grid grid-cols-3 gap-4 px-4 py-4 text-sm">
                <span className="font-medium text-sv-black">{t.nom}</span>
                <span className="text-sv-mid">{t.delai}</span>
                <span className="text-sv-mid">{t.tarif}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-sv-mid">
            Les tarifs exacts sont calculés lors du passage en caisse en fonction du poids de la commande et de l'adresse de livraison.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Délais de traitement</h2>
          <p className="text-sm leading-relaxed text-sv-mid">
            Les commandes passées avant 12h sont généralement expédiées le jour même (hors week-end et jours fériés). Les commandes passées après 12h ou le week-end sont expédiées le prochain jour ouvré.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Suivi de commande</h2>
          <p className="text-sm leading-relaxed text-sv-mid">
            Un email de confirmation contenant votre numéro de suivi vous est envoyé dès l'expédition. Vous pouvez suivre votre colis directement sur le site du transporteur.
          </p>
        </section>

        <section>
          <h2 className="mb-6 font-serif text-2xl">Questions fréquentes</h2>
          <dl className="divide-y divide-sv-border">
            <div className="py-5">
              <dt className="mb-2 font-medium">Quels sont les délais de livraison ?</dt>
              <dd className="text-sm leading-relaxed text-sv-mid">Les commandes sont expédiées sous 24 à 48 heures ouvrées. Le délai de livraison dépend ensuite du transporteur choisi : 2 à 5 jours ouvrés pour Colissimo et Mondial Relay, 1 jour ouvré pour Chronopost.</dd>
            </div>
            <div className="py-5">
              <dt className="mb-2 font-medium">Livrez-vous en dehors de France ?</dt>
              <dd className="text-sm leading-relaxed text-sv-mid">Actuellement, nous livrons uniquement en France métropolitaine et en Corse. La livraison à l'international sera disponible prochainement.</dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  )
}
