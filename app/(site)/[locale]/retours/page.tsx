import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Retours et échanges - Sara Valenti',
  description: 'Politique de retour Sara Valenti : 14 jours pour changer d\'avis, procédure simple, remboursement rapide.',
  alternates: { canonical: '/retours' },
}

export default async function RetoursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl">Retours et échanges</h1>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl">Droit de rétractation</h2>
        <p className="text-sm leading-relaxed text-sv-mid">
          Conformément à la législation française (article L221-18 du Code de la consommation), vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier votre décision.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl">Conditions de retour</h2>
        <ul className="space-y-2 text-sm text-sv-mid">
          <li className="flex gap-2"><span aria-hidden="true">-</span>Le produit doit être retourné dans son état d'origine, non utilisé, avec ses emballages d'origine.</li>
          <li className="flex gap-2"><span aria-hidden="true">-</span>Les articles personnalisés ou endommagés par l'acheteur ne peuvent pas être retournés.</li>
          <li className="flex gap-2"><span aria-hidden="true">-</span>Les frais de retour sont à la charge du client, sauf erreur de notre part.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-2xl">Procédure de retour</h2>
        <ol className="space-y-4 text-sm text-sv-mid">
          {[
            'Contactez-nous par email à contact@saravalenti.fr avant de renvoyer l\'article pour obtenir l\'adresse de retour et un numéro de retour.',
            'Emballez soigneusement le produit dans son emballage d\'origine.',
            'Expédiez le colis avec un service de suivi à votre charge.',
            'Dès réception et vérification, nous procédons au remboursement sous 7 jours ouvrés.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 font-medium text-sv-black">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Remboursement</h2>
        <p className="text-sm leading-relaxed text-sv-mid">
          Le remboursement est effectué par le même moyen de paiement que celui utilisé lors de la commande, sous 7 jours ouvrés après réception et vérification du retour. Les frais de livraison initiaux sont remboursés uniquement en cas d'erreur de notre part.
        </p>
      </section>
    </div>
  )
}
