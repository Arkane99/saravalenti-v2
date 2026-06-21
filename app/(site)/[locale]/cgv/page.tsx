import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - Sara Valenti',
  description: 'Conditions générales de vente Sara Valenti.',
  alternates: { canonical: '/cgv' },
}

export default async function CgvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl">Conditions Générales de Vente</h1>
        <p className="mt-3 text-sm text-sv-mid">Dernière mise à jour : juin 2026</p>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-sv-mid">
        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 1 - Objet</h2>
          <p>
            Les présentes conditions générales de vente régissent les relations contractuelles entre Sara Valenti (ci-après "le Vendeur") et toute personne physique ou morale (ci-après "le Client") souhaitant procéder à un achat via le site internet <strong>www.saravalenti.fr</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 2 - Produits</h2>
          <p>
            Les produits proposés à la vente sont les sacs en cuir présentés sur le site, fabriqués en Italie. Les photographies sont aussi fidèles que possible, mais ne peuvent pas assurer une similitude parfaite avec le produit, notamment en ce qui concerne les couleurs. Les caractéristiques essentielles des produits sont présentées dans chaque fiche produit.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 3 - Prix</h2>
          <p>
            Les prix sont indiqués en euros TTC. Le Vendeur se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 4 - Commande</h2>
          <p>
            La validation de la commande vaut acceptation des présentes CGV. Le Client reçoit un email de confirmation récapitulant sa commande. La vente est réputée conclue à réception de la confirmation de paiement.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 5 - Paiement</h2>
          <p>
            Le paiement s'effectue par carte bancaire (Visa, Mastercard, American Express) via la plateforme sécurisée Stripe. Les données bancaires ne sont pas conservées par le Vendeur.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 6 - Livraison</h2>
          <p>
            Les livraisons sont effectuées en France, Belgique, Pays-Bas, Allemagne, Suisse et Luxembourg. Les délais et tarifs de livraison sont indiqués sur la page Livraison. Le Vendeur ne peut être tenu responsable des retards imputables au transporteur.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 7 - Droit de rétractation</h2>
          <p>
            Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation. Les conditions sont détaillées sur la page Retours.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 8 - Garantie légale</h2>
          <p>
            Tous les produits bénéficient de la garantie légale de conformité (articles L217-4 à L217-14 du Code de la consommation) et de la garantie des vices cachés (articles 1641 à 1648 du Code civil).
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 9 - Données personnelles</h2>
          <p>
            Les données personnelles collectées lors de la commande sont utilisées uniquement pour son traitement et sa livraison. Elles ne sont pas transmises à des tiers sans le consentement du Client, sauf obligation légale ou nécessité de la livraison.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Article 10 - Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. A défaut, les tribunaux français seront compétents.
          </p>
        </section>
      </div>
    </div>
  )
}
