import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Mentions légales - Sara Valenti',
  description: 'Mentions légales du site Sara Valenti.',
  alternates: { canonical: '/mentions-legales' },
}

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl">Mentions légales</h1>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-sv-mid">
        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Éditeur du site</h2>
          <p>
            Le site <strong>www.saravalenti.fr</strong> est édité par Sara Valenti.<br />
            Contact : contact@saravalenti.fr<br />
            Directeur de la publication : Sara Valenti
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc.<br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
            Site web : vercel.com
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur le site (textes, images, photos, descriptions) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Données personnelles</h2>
          <p>
            Les informations collectées sur ce site sont utilisées exclusivement pour le traitement des commandes et la relation client. Conformément à la loi Informatique et Libertés du 6 janvier 1978 et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits : contact@saravalenti.fr.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Cookies</h2>
          <p>
            Le site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie publicitaire n'est déposé sans votre consentement.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl text-sv-black">Responsabilité</h2>
          <p>
            Sara Valenti s'efforce de maintenir les informations publiées à jour. Toutefois, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur le site. En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
          </p>
        </section>
      </div>
    </div>
  )
}
