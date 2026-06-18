import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
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
    r: 'Oui. Tous nos sacs sont fabriqués en cuir naturel d\'origine italienne : cuir brossé, cuir suède ou cuir grainé selon le modèle. Aucun cuir reconstitué ni matière synthétique n\'est utilisé dans la collection.',
  },
  {
    q: 'Où sont fabriqués les sacs Sara Valenti ?',
    r: 'Les sacs Sara Valenti sont fabriqués dans des ateliers de maroquinerie italiens, sélectionnés pour leur maîtrise du travail du cuir et la qualité de leurs finitions.',
  },
  {
    q: 'Quel est le prix des sacs Sara Valenti ?',
    r: 'Les sacs sont proposés à partir de 19,90 EUR. Les modèles principaux de la collection (Rita, Grazia) sont à 109,90 EUR. Le prix est identique pour toutes les couleurs d\'un même modèle.',
  },
  {
    q: 'La livraison est-elle gratuite ?',
    r: 'Oui, la livraison est offerte à partir de 45 EUR d\'achat. En dessous de ce montant, les frais sont calculés selon le transporteur choisi (Colissimo, Mondial Relay ou Chronopost).',
  },
  {
    q: 'Quelle est la différence entre le Rita, le Grazia et le Mina ?',
    r: 'Le Rita est un sac à main structuré en cuir brossé, disponible en 5 coloris. Le Grazia est un grand sac souple en cuir suède ou grainé, disponible en 13 coloris au total. Le Mina est un sac porté épaule en cuir suède souple, plus léger et plus décontracté.',
  },
  {
    q: 'Comment choisir entre cuir brossé et cuir suède ?',
    r: 'Le cuir brossé est plus résistant et développe une patine avec l\'usage. Le cuir suède est plus doux au toucher mais demande un entretien régulier (spray imperméabilisant). Consultez notre guide complet pour choisir selon votre usage.',
  },
  {
    q: 'Un sac Sara Valenti peut-il se porter en hiver ?',
    r: 'Oui. Le cuir brossé et le cuir grainé résistent bien au froid et aux variations d\'humidité légères. Pour le suède, nous recommandons un spray imperméabilisant avant la saison hivernale.',
  },
  {
    q: 'Les sacs Sara Valenti sont-ils disponibles en boutique ?',
    r: 'Sara Valenti est une marque exclusivement en ligne. Cela nous permet de proposer des prix justes sans intermédiaire, et d\'expédier directement depuis la France.',
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

  const ritaModel = modeles.find((m) => m.slug === 'rita')
  const camelV = ritaModel?.variantes?.find((v) => v.couleur.toLowerCase().includes('camel'))
  const heroPhotoV = camelV ?? ritaModel?.variantes?.[0]
  const heroPhoto = heroPhotoV?.photos?.[0]
  const heroSrc = heroPhoto?.asset
    ? urlFor(heroPhoto).width(1920).height(1080).fit('crop').url()
    : '/images/produits/Sac-Rita-Camel-4-scaled.jpg'

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

      {/* Hero full-screen — photo Rita Camel depuis Sanity */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[500px] max-h-[900px] overflow-hidden">
        <Image
          src={heroSrc}
          alt="Sac Rita en cuir camel Sara Valenti"
          fill
          sizes="100vw"
          className="object-cover object-[center_20%]"
          priority
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-[8%] left-[8%]">
          <h1
            className="font-serif font-light text-white text-balance"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', letterSpacing: '-0.02em' }}
          >
            Sacs en cuir italien
          </h1>
          <p className="mt-4 text-sm font-light text-white/80">
            Fabriqués en Italie. Cuir véritable.
          </p>
          <Link
            href="/catalogue"
            className="mt-6 inline-block text-sm uppercase tracking-widest text-white underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Découvrir la collection →
          </Link>
        </div>
      </section>

      {/* Mobile: modèles phares first, matières second. Desktop: DOM order (matières first). */}
      <div className="flex flex-col md:block">
        <section className="order-2 border-t border-sv-border bg-sv-warm-white py-20" aria-labelledby="titre-matieres">
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
        <section className="order-1 py-20" aria-labelledby="titre-modeles">
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
      </div>

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
