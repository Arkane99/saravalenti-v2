import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Sara Valenti',
  description: 'Politique de confidentialité et protection des données personnelles Sara Valenti.',
  alternates: { canonical: '/politique-de-confidentialite' },
}

export default async function PolitiqueConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl">Politique de confidentialité</h1>
        <p className="mt-3 text-sm text-sv-mid">Dernière mise à jour : juin 2026</p>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-sv-mid">
        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">1. Responsable du traitement</h2>
          <p>
            Sara Valenti est responsable du traitement de vos données personnelles. Contact : contact@saravalenti.fr
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">2. Données collectées</h2>
          <p>
            Nous collectons les données suivantes lors de vos interactions avec le site :
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><span aria-hidden="true">-</span>Données de compte : adresse email, mot de passe chiffré.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Données de commande : nom, prénom, adresse de livraison, téléphone.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Données de navigation : adresse IP, pages visitées (via cookies techniques uniquement).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">3. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><span aria-hidden="true">-</span>Traiter et livrer vos commandes.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Gérer votre compte client.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Vous envoyer des confirmations de commande par email.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Améliorer le fonctionnement du site (cookies techniques).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur l'exécution du contrat de vente (commandes), votre consentement (newsletter), et notre intérêt légitime (sécurité du site).
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">5. Destinataires des données</h2>
          <p>
            Vos données sont transmises aux prestataires nécessaires à l'exécution de la commande : Stripe (paiement), transporteurs (livraison), Supabase (hébergement des données), Brevo (emails transactionnels). Ces prestataires traitent vos données uniquement pour le service concerné.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">6. Durée de conservation</h2>
          <p>
            Les données de compte sont conservées jusqu'à la suppression du compte. Les données de commande sont conservées 5 ans à compter de la transaction (obligation légale comptable). Les données de navigation sont conservées 13 mois maximum.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><span aria-hidden="true">-</span>Droit d'accès : obtenir une copie de vos données.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Droit de rectification : corriger des données inexactes.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Droit à l'effacement : demander la suppression de vos données.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Droit à la portabilité : recevoir vos données dans un format structuré.</li>
            <li className="flex gap-2"><span aria-hidden="true">-</span>Droit d'opposition : vous opposer à un traitement basé sur l'intérêt légitime.</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits : contact@saravalenti.fr. Vous pouvez également déposer une réclamation auprès de la CNIL (cnil.fr).
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">8. Cookies</h2>
          <p>
            Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement (session, panier, préférences de langue). Aucun cookie publicitaire ou de suivi tiers n'est déposé sans votre consentement explicite.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">9. Sécurité</h2>
          <p>
            Vos données sont hébergées sur des serveurs sécurisés (Supabase, Vercel). Les mots de passe sont chiffrés. Les paiements transitent par Stripe et ne sont jamais stockés sur nos serveurs.
          </p>
        </section>
      </div>
    </div>
  )
}
