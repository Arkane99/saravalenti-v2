import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Bouton } from '@/components/ui/Bouton'
import { client } from '@/sanity/lib/client'
import { REQUETE_MODELES_PHARES, REQUETE_AVIS } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/client'
import { formatPrix } from '@/lib/format'
import type { ProduitCarte, AvisClient } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Sacs en cuir italien Sara Valenti - Rita, Grazia, Mina',
  description:
    'Sacs en cuir italien fabriqués en Italie : cuir brossé, suède et grainé. Modèles Rita, Grazia, Mina, Grazita. Prix à partir de 109,90 EUR. Livraison France.',
  alternates: { canonical: '/' },
}

const MATIERES = [
  {
    nom: 'Cuir brossé',
    description:
      'Surface douce et légèrement satinée, résistante aux petites égratignures. Se patine avec l\'usage pour développer un caractère unique. Idéal pour les sacs du quotidien.',
    modeles: 'Rita, Lola, Teresa',
  },
  {
    nom: 'Cuir suède',
    description:
      'Face intérieure de la peau, veloutée et douce au toucher. Plus sensible à l\'eau que le cuir lisse, mais d\'un rendu exceptionnel. Avec un spray imperméabilisant, il dure des années.',
    modeles: 'Grazia, Mina, Grazita, Elia',
  },
  {
    nom: 'Cuir grainé',
    description:
      'Embossé d\'un motif en relief régulier, très résistant aux rayures et aux taches. Plus rigide que le suède, il conserve sa forme et son aspect dans le temps.',
    modeles: 'Grazia grainé, Daria, Serena',
  },
]

const ARGUMENTS = [
  {
    titre: 'Fabrication italienne',
    texte: 'Chaque sac est fabriqué en Italie dans des ateliers maroquiniers spécialisés dans le travail du cuir naturel.',
  },
  {
    titre: 'Cuir véritable',
    texte: 'Cuir naturel sélectionné pour sa souplesse et sa résistance. Brossé, suède ou grainé, chaque peau est choisie individuellement.',
  },
  {
    titre: 'Livraison soignée',
    texte: 'Expédition par Colissimo, Mondial Relay ou Chronopost selon votre choix. Suivi en temps réel, livraison partout en France.',
  },
  {
    titre: 'Retours sous 14 jours',
    texte: 'Vous avez 14 jours pour changer d\'avis. Retour simple, remboursement rapide. Pas de questions inutiles.',
  },
]

const FAQ_HOME = [
  {
    q: 'Les sacs Sara Valenti sont-ils en cuir véritable ?',
    r: 'Oui. Tous les sacs Sara Valenti sont fabriqués en cuir naturel d\'origine italienne : cuir brossé, cuir suède ou cuir grainé selon le modèle. Aucun cuir reconstitué ni matière synthétique n\'est utilisé dans la collection.',
  },
  {
    q: 'Où sont fabriqués les sacs Sara Valenti ?',
    r: 'Les sacs Sara Valenti sont fabriqués en Italie dans des ateliers maroquiniers spécialisés. La sélection des peaux est réalisée dans des tanneries italiennes. La marque est basée en France.',
  },
  {
    q: 'Quel est le prix des sacs Sara Valenti ?',
    r: 'Les sacs Sara Valenti sont proposés à partir de 109,90 EUR. Ce prix est identique pour tous les modèles de la collection, quelle que soit la couleur choisie. Aucun frais supplémentaire n\'est appliqué selon la variante.',
  },
  {
    q: 'Quelles gammes de sacs propose Sara Valenti ?',
    r: 'Sara Valenti propose trois gammes principales : le Rita (sac à main en cuir brossé, 5 couleurs), le Grazia (cuir suède ou grainé, 13 couleurs au total) et le Mina (sac porté épaule en cuir suède souple, 5 couleurs). La collection complète comprend une vingtaine de modèles.',
  },
]

const schemaFaqHome = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_HOME.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.r },
  })),
}

const schemaOrganisation = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.saravalenti.fr/#organisation',
      name: 'Sara Valenti',
      url: 'https://www.saravalenti.fr',
      description:
        'Marque française de sacs en cuir italien. Fabrication artisanale dans des ateliers italiens sélectionnés pour leur savoir-faire maroquinier.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'French',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.saravalenti.fr/#site',
      name: 'Sara Valenti',
      url: 'https://www.saravalenti.fr',
      publisher: { '@id': 'https://www.saravalenti.fr/#organisation' },
    },
  ],
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [modeles, avis] = await Promise.all([
    client.fetch<ProduitCarte[]>(REQUETE_MODELES_PHARES),
    client.fetch<AvisClient[]>(REQUETE_AVIS),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganisation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaqHome) }}
      />

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-sv-gold-dark">Fabrication italienne</p>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-balance md:text-5xl lg:text-6xl">
          Sacs en cuir italien
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-sv-mid">
          Fabriqués en Italie. Cuir véritable. Des pièces qui durent.
        </p>
        <Bouton href="/catalogue" className="mt-10">Découvrir la collection</Bouton>
      </section>

      {/* Section matières */}
      <section className="border-t border-sv-border bg-sv-warm-white py-20" aria-labelledby="titre-matieres">
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="titre-matieres" className="mb-3 font-serif text-3xl">Nos matières</h2>
          <p className="mb-10 max-w-2xl text-sm text-sv-mid">
            Trois familles de cuir, chacune avec ses propriétés spécifiques. Toutes d'origine italienne, sélectionnées pour leur qualité.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {MATIERES.map((m) => (
              <article key={m.nom} className="rounded border border-sv-border bg-sv-cream p-6">
                <h3 className="mb-3 font-serif text-xl">{m.nom}</h3>
                <p className="mb-4 text-sm leading-relaxed text-sv-mid">{m.description}</p>
                <p className="text-xs text-sv-mid">
                  <span className="font-medium text-sv-black">Modèles :</span> {m.modeles}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel modèles phares */}
      {modeles.length > 0 && (
        <section className="py-20" aria-labelledby="titre-modeles">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <h2 id="titre-modeles" className="font-serif text-3xl">Modèles phares</h2>
              <Link href="/catalogue" className="text-sm text-sv-mid underline-offset-2 hover:text-sv-gold-dark hover:underline">
                Voir tout le catalogue
              </Link>
            </div>
            <div
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none' }}
            >
              {modeles.map((p) => {
                const v = p.variantes[0]
                const photo = v?.photos?.[0]
                return (
                  <article
                    key={p._id}
                    className="group w-72 flex-shrink-0 snap-start"
                  >
                    <Link href={`/catalogue/${p.slug}`} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-sv-warm-white rounded">
                        {photo?.asset && (
                          <Image
                            src={urlFor(photo).width(600).height(750).fit('crop').url()}
                            alt={`${p.nom} ${v.couleur}`}
                            fill
                            sizes="288px"
                            placeholder={photo.lqip ? 'blur' : 'empty'}
                            blurDataURL={photo.lqip}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="font-serif text-xl">{p.nom}</p>
                        {v?.matiere && (
                          <p className="mt-1 text-xs text-sv-mid">{v.matiere}</p>
                        )}
                        {v?.prix && (
                          <p className="mt-1 text-sm font-medium">{formatPrix(v.promo ?? v.prix)}</p>
                        )}
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Avis clients */}
      {avis.length > 0 && (
        <section className="border-t border-sv-border bg-sv-warm-white py-20" aria-labelledby="titre-avis">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="titre-avis" className="mb-10 font-serif text-3xl">Ce qu'en disent nos clients</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {avis.slice(0, 3).map((a) => (
                <article key={a._id} className="rounded border border-sv-border bg-sv-cream p-6">
                  <div className="mb-3 flex gap-1" aria-label={`Note : ${a.note} étoiles sur 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < a.note ? 'text-sv-gold-dark' : 'text-sv-border'}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <blockquote className="mb-4 text-sm leading-relaxed text-sv-mid">
                    <p>"{a.texte}"</p>
                  </blockquote>
                  <footer className="text-xs font-medium text-sv-black">
                    {a.auteur}
                    {a.verifie && (
                      <span className="ml-2 text-green-700">Achat vérifié</span>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pourquoi Sara Valenti */}
      <section className="py-20" aria-labelledby="titre-arguments">
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="titre-arguments" className="mb-10 font-serif text-3xl">Pourquoi Sara Valenti</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ARGUMENTS.map((a) => (
              <article key={a.titre}>
                <h3 className="mb-2 font-medium">{a.titre}</h3>
                <p className="text-sm leading-relaxed text-sv-mid">{a.texte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-sv-border bg-sv-warm-white py-20" aria-labelledby="titre-faq-home">
        <div className="mx-auto max-w-3xl px-6">
          <h2 id="titre-faq-home" className="mb-10 font-serif text-3xl">Questions fréquentes</h2>
          <dl className="divide-y divide-sv-border">
            {FAQ_HOME.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="mb-3 font-medium">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-sv-mid">{item.r}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
