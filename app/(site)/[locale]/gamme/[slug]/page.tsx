import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { client, urlFor } from '@/sanity/lib/client'
import { REQUETE_PRODUITS_GAMME } from '@/sanity/lib/queries'
import { slugifier } from '@/lib/slugifier'
import { formatPrix } from '@/lib/format'
import type { ProduitCarte } from '@/lib/types'

export const revalidate = 60

interface FaqItem {
  q: string
  r: string
}

interface GammeConfig {
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  sections: { titre: string; texte: string }[]
  faq: FaqItem[]
  heroTitre: string
  heroSousTitre: string
  heroCouleur: string
}

const GAMMES: Record<string, GammeConfig> = {
  rita: {
    h1: 'Sac à main Rita en cuir brossé : la gamme complète',
    metaTitle: 'Sac à main Rita en cuir brossé - Sara Valenti',
    metaDescription:
      'Découvrez la gamme Rita : sac à main en cuir brossé italien, disponible en plusieurs couleurs. Fabriqué en Italie, livré en France.',
    heroTitre: 'Rita',
    heroSousTitre: 'Sac à main en cuir brossé',
    heroCouleur: 'camel',
    intro:
      'Le Rita est un sac à main structuré en cuir brossé, conçu pour le port quotidien. Poignée courte et bandoulière amovible permettent deux façons de le porter selon la situation.',
    sections: [
      {
        titre: 'Le cuir brossé : une matière qui dure',
        texte:
          "Le cuir brossé a une qualité que peu de matières possèdent : il s'améliore avec le temps. Les légères marques d'usage qui apparaissent au fil des mois ne sont pas des défauts, c'est la patine, unique à chaque sac, unique à chaque utilisatrice. Le Rita que vous aurez dans 5 ans ne ressemblera à aucun autre.",
      },
      {
        titre: 'Comment porter le Rita',
        texte:
          'Le Rita se porte à la main grâce à ses poignées courtes, ou à l\'épaule avec la bandoulière amovible incluse. Son format (environ 30 x 22 cm) convient à une utilisation quotidienne : portefeuille, téléphone, clés et petits accessoires. Il n\'est pas adapté au transport d\'un ordinateur portable.',
      },
      {
        titre: 'Entretien du cuir brossé',
        texte:
          'Le cuir brossé s\'entretient facilement. Essuyez les taches superficielles avec un chiffon légèrement humide puis séchez immédiatement. Deux fois par an, nourrissez le cuir avec une crème incolore à base de cire naturelle. Évitez l\'exposition prolongée au soleil direct et la pluie intense. Pour l\'entretien complet, consultez notre guide.',
      },
    ],
    faq: [
      {
        q: 'Quelle couleur de Rita choisir ?',
        r: 'Le noir et le chocolat sont les plus polyvalents pour le quotidien. Les tons chauds (camel) mettent en valeur le grain du cuir brossé. Le taupe offre une neutralité élégante qui s\'adapte à toutes les tenues. En cas de doute, consultez les photos de détail pour voir le rendu de la matière par couleur.',
      },
      {
        q: 'Comment entretenir le cuir brossé ?',
        r: 'Essuyez avec un chiffon légèrement humide pour les taches superficielles. Nourrissez deux fois par an avec une crème incolore à base de cire naturelle. Évitez l\'exposition prolongée au soleil et la pluie directe. Rangez dans une housse en tissu, jamais en plastique, pour que le cuir respire.',
      },
      {
        q: 'Quelle est la différence entre cuir brossé et cuir grainé ?',
        r: 'Le cuir brossé a une surface douce et légèrement satinée, qui patine avec l\'usage et développe du caractère. Le cuir grainé est embossé d\'un motif en relief régulier, plus résistant aux rayures visibles. Les deux sont du cuir véritable d\'origine italienne fabriqué dans des tanneries reconnues.',
      },
    ],
  },
  grazia: {
    h1: 'Sac Grazia en cuir suède et grainé : 13 coloris disponibles',
    metaTitle: 'Sac Grazia suède et grainé - 13 coloris - Sara Valenti',
    metaDescription:
      'Le sac Grazia en cuir italien : 13 coloris disponibles en suède (6 couleurs) et grainé (7 couleurs). Fabriqué en Italie par des artisans maroquiniers. Livraison France.',
    heroTitre: 'Grazia',
    heroSousTitre: 'Sac en cuir suède et grainé, 13 coloris',
    heroCouleur: 'noir',
    intro:
      'La gamme Grazia regroupe le sac Grazia en cuir suède (6 couleurs), le Grazia en cuir grainé (7 couleurs), et le Grazita, version compacte en suède. Trois déclinaisons d\'un même esprit : souplesse, élégance, fabrication italienne.',
    sections: [
      {
        titre: 'Le cuir suède : velours naturel',
        texte:
          "Le suède est la matière la plus douce de notre collection, et la plus mal comprise. On le dit fragile. En réalité, un suède bien entretenu résiste mieux que beaucoup de cuirs lisses. La texture veloutée du Grazia capte la lumière différemment selon l'angle, donnant au sac une profondeur que les photos ne rendent pas complètement.",
      },
      {
        titre: 'Grazia suède, Grazia grainé, Grazita : les différences',
        texte:
          'Le Grazia suède et le Grazia grainé partagent la même forme et les mêmes dimensions. La différence est uniquement dans la matière : suède pour un rendu velours, cuir grainé pour une surface structurée plus résistante aux rayures. Le Grazita reprend le design du Grazia en version compacte, uniquement en cuir suède. Les trois modèles sont fabriqués dans les mêmes ateliers italiens.',
      },
      {
        titre: 'Polyvalence du Grazia',
        texte:
          'Le Grazia est un sac du quotidien par excellence : porté à la main ou à l\'épaule selon la bandoulière choisie, il convient aussi bien à une tenue décontractée qu\'à une occasion plus habillée. Son format s\'adapte à un usage actif sans encombrer.',
      },
    ],
    faq: [
      {
        q: 'Comment nettoyer un sac en cuir suède ?',
        r: 'Utilisez une brosse à suède à poils doux pour enlever la poussière et remettre le velours debout. Pour les taches, tamponnez avec une gomme à suède spéciale. Protégez impérativement avec un spray imperméabilisant avant la première utilisation, et renouvelez-le tous les deux mois en usage régulier.',
      },
      {
        q: 'Le cuir suède est-il fragile ?',
        r: 'Le suède est plus sensible à l\'eau et aux taches que le cuir lisse, mais pas fragile si bien entretenu. Un spray imperméabilisant appliqué régulièrement et une brosse à suède pour l\'entretien quotidien permettent de conserver l\'aspect velours plusieurs années. En cas de pluie, laissez sécher à l\'air libre, jamais près d\'une source de chaleur.',
      },
      {
        q: 'Quelle couleur de Grazia choisir ?',
        r: 'Le cognac et le camel mettent le mieux en valeur la texture du suède. Le noir est le plus polyvalent. Les tons neutres (taupe, beige) s\'accordent à toutes les tenues. Les couleurs vives demandent plus d\'attention à l\'entretien car les taches y sont plus visibles. Consultez les photos en détail avant de choisir.',
      },
    ],
  },
  mina: {
    h1: 'Sac porté épaule Mina en cuir suède souple',
    metaTitle: 'Sac porté épaule Mina en cuir suède - Sara Valenti',
    metaDescription:
      'Le sac Mina : porté épaule en cuir suède souple, fabrication italienne. Bandoulière réglable, format quotidien. Livraison France.',
    heroTitre: 'Mina',
    heroSousTitre: 'Sac porté épaule en cuir suède souple',
    heroCouleur: '',
    intro:
      "Le Mina est fait pour les journées où vous portez tout. Sa bandoulière réglable permet de l'adapter à votre morphologie : court sur l'épaule pour un look structuré, long en bandoulière croisée pour les mains libres. Le cuir suède souple ne déforme pas, il épouse votre contenu sans perdre sa silhouette.",
    sections: [
      {
        titre: 'Un sac pour le quotidien actif',
        texte:
          'Le Mina est pensé pour les journées chargées. Son format généreux permet d\'emporter l\'essentiel d\'une journée complète sans être encombrant. La souplesse du cuir suède lui permet de s\'adapter au contenu sans déformer la silhouette. Bandoulière réglable et fermeture sécurisée en font un sac pratique en milieu urbain.',
      },
      {
        titre: 'Le cuir suède souple : caractéristiques',
        texte:
          'La variété de cuir suède utilisée sur le Mina est sélectionnée pour sa souplesse particulière. Ce cuir s\'assouplit encore avec l\'usage, épousant les habitudes de port. Sa légèreté relative par rapport au cuir structuré ou grainé en fait un choix idéal pour les sacs portés longtemps. Les tanneries italiennes sélectionnent les peaux pour leur uniformité et leur résistance au déchirement.',
      },
      {
        titre: 'Entretien du Mina',
        texte:
          'Mêmes soins que pour tout sac en cuir suède : spray imperméabilisant avant utilisation, brosse à suède pour l\'entretien courant. Le Mina étant un sac du quotidien, prévoyez un entretien plus régulier (mensuel) pour maintenir l\'aspect velours. Consultez notre guide complet pour les conseils détaillés par type de tache.',
      },
    ],
    faq: [
      {
        q: 'Quelle est la capacité du sac Mina ?',
        r: 'Le Mina peut contenir un format A5, un portefeuille, des clés, un téléphone et des petits accessoires. Il n\'est pas prévu pour un ordinateur portable mais convient pour une journée complète sans bagages supplémentaires. Idéal pour le travail si vous n\'avez pas besoin d\'un laptop.',
      },
      {
        q: 'Le Mina convient-il pour le travail ?',
        r: 'Oui, pour les usages sans ordinateur portable. Son format discret et son cuir suède lui donnent une allure professionnelle sobre. Le port à l\'épaule est pratique en déplacement urbain. Il convient aussi bien à une tenue professionnelle qu\'à une sortie du week-end.',
      },
      {
        q: 'Comment régler la bandoulière du Mina ?',
        r: 'La bandoulière du Mina est réglable par une boucle coulissante. Elle peut se porter à l\'épaule ou en travers du corps selon votre stature. La longueur s\'adapte du port court (épaule haute) au port long (bandoulière croisée). Un ajustement simple, sans outil.',
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(GAMMES).map((slug) => ({ slug }))
}

const OG_IMAGES: Record<string, string> = {
  rita: '/images/produits/Sac-Rita-Camel-3-scaled.jpg',
  grazia: '/images/produits/Sac-a-main-Grazia-en-cuir-graine-bordeaux-1.png',
  mina: '/images/produits/sac-cuir-suede-daim-nubuck-mina-camel-1-scaled.jpg',
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const g = GAMMES[slug]
  if (!g) return {}
  const ogImg = OG_IMAGES[slug]
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/gamme/${slug}` },
    openGraph: {
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 900, alt: g.metaTitle }] } : {}),
    },
  }
}

export default async function PageGamme({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const g = GAMMES[slug]
  if (!g) notFound()

  const produits = await client.fetch<ProduitCarte[]>(REQUETE_PRODUITS_GAMME, { slug })

  const schemaProductGroup = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: g.h1,
    description: g.intro,
    brand: { '@type': 'Brand', name: 'Sara Valenti' },
    productGroupID: slug,
    variesBy: 'color',
    hasVariant: produits.flatMap((p) =>
      (p.variantes ?? []).map((v) => ({
        '@type': 'Product',
        name: `${p.nom} ${v.couleur}`,
        sku: v.sku ?? undefined,
        offers: {
          '@type': 'Offer',
          price: v.promo ?? v.prix,
          priceCurrency: 'EUR',
          availability:
            (v.stock ?? 0) > 0 || v.reappro
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
      }))
    ),
  }

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.r },
    })),
  }

  // Trouver la photo hero depuis les données Sanity
  const heroCouleur = g.heroCouleur
  let heroPhotoUrl: string | undefined
  for (const p of produits) {
    const v = heroCouleur
      ? (p.variantes.find((va) => va.couleur.toLowerCase().includes(heroCouleur)) ?? p.variantes[0])
      : p.variantes[0]
    const photo = v?.photos?.[0]
    if (photo?.asset) {
      heroPhotoUrl = urlFor(photo).width(1920).height(1080).fit('crop').url()
      break
    }
  }
  // Fallback sur les images statiques si Sanity ne répond pas
  const HERO_FALLBACK: Record<string, string> = {
    rita: '/images/heroes/hero-rita.webp',
    grazia: '/images/heroes/hero-grazia.webp',
    mina: '/images/heroes/hero-mina.webp',
  }
  // TEMP PLACEHOLDER — remplacer par image Sanity après shooting
  const heroSrc = HERO_FALLBACK[slug] ?? heroPhotoUrl

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProductGroup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      {/* Hero 60vh — photo Sanity, titre centré */}
      {heroSrc && (
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={heroSrc}
            alt={g.heroTitre}
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1
              className="font-serif font-light text-white text-balance"
              style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              {g.heroTitre}
            </h1>
            <p className="mt-4 text-sm font-light text-white/70 uppercase tracking-widest">
              {g.heroSousTitre}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="mb-10 text-xs text-sv-mid">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-sv-gold-dark">Accueil</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-sv-black">{g.h1.split(' : ')[0]}</li>
          </ol>
        </nav>

        {/* Intro éditoriale */}
        <header className="mb-14 max-w-3xl">
          <p className="text-base leading-relaxed text-sv-mid">{g.intro}</p>
        </header>

        {/* Sections éditoriales */}
        <div className="mb-16 grid gap-10 md:grid-cols-3">
          {g.sections.map((s) => (
            <section key={s.titre}>
              <h2 className="mb-3 font-serif text-xl">{s.titre}</h2>
              <p className="text-sm leading-relaxed text-sv-mid">{s.texte}</p>
            </section>
          ))}
        </div>

        {/* Lien guide entretien */}
        <div className="mb-16 rounded border border-sv-border bg-sv-warm-white px-6 py-4 text-sm">
          <span className="text-sv-mid">Pour l'entretien de vos sacs en cuir :</span>{' '}
          <Link href="/entretien-cuir" className="font-medium text-sv-gold-dark underline-offset-2 hover:underline">
            consulter notre guide complet
          </Link>
        </div>

        {/* Grille coloris */}
        {produits.length > 0 && (
          <section aria-labelledby="titre-produits">
            <h2 id="titre-produits" className="mb-8 font-serif text-3xl">Les coloris disponibles</h2>

            {slug === 'grazia' ? (
              /* Grazia : 3 sections par matière */
              <div className="space-y-24">
                {(
                  [
                    { modelSlug: 'grazia', titre: 'Grazia suède', sous: 'La version originale, au toucher velouté' },
                    { modelSlug: 'grazia-graine', titre: 'Grazia grainé', sous: 'La version structurée, plus résistante' },
                    { modelSlug: 'grazita', titre: 'Grazita', sous: 'La version compacte' },
                  ] as { modelSlug: string; titre: string; sous: string }[]
                ).map(({ modelSlug, titre, sous }) => {
                  const sectionProduits = produits.filter((p) => p.slug === modelSlug)
                  if (!sectionProduits.length) return null
                  return (
                    <section key={modelSlug}>
                      <div className="mb-8 border-t border-sv-border pt-8">
                        <h2 className="font-serif font-light text-2xl">{titre}</h2>
                        <p className="mt-1 text-sm text-sv-mid">{sous}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                        {sectionProduits.flatMap((p) =>
                          (p.variantes ?? []).map((v, vIdx) => {
                            const photo = v.photos?.[0]
                            const prixActuel = v.promo ?? v.prix
                            const epuise = (v.stock ?? 0) <= 0 && !v.reappro
                            const href = `/catalogue/${p.slug}-${slugifier(v.couleur)}`
                            return (
                              <article key={v.sku || `${p._id}-${vIdx}`} className="group">
                                <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-sv-warm-white">
                                  {photo?.asset && (
                                    <Image
                                      src={urlFor(photo).width(600).height(800).fit('crop').url()}
                                      alt={`${p.nom} ${v.couleur}`}
                                      fill
                                      sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                                      priority={vIdx < 4}
                                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                  )}
                                  {epuise && (
                                    <span className="absolute right-3 top-3 bg-sv-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sv-cream">
                                      Épuisé
                                    </span>
                                  )}
                                </Link>
                                <div className="mt-3">
                                  <Link href={href}>
                                    <p className="font-serif text-lg leading-tight transition-colors group-hover:text-sv-gold-dark">
                                      {v.couleur}
                                    </p>
                                  </Link>
                                  {prixActuel != null && (
                                    <p className="mt-1 text-sm text-sv-mid">{formatPrix(prixActuel)}</p>
                                  )}
                                </div>
                              </article>
                            )
                          })
                        )}
                      </div>
                    </section>
                  )
                })}
              </div>
            ) : (
              /* Rita, Mina : grille unique */
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
                {produits.flatMap((p) =>
                  (p.variantes ?? []).map((v, vIdx) => {
                    const photo = v.photos?.[0]
                    const prixActuel = v.promo ?? v.prix
                    const epuise = (v.stock ?? 0) <= 0 && !v.reappro
                    const href = `/catalogue/${p.slug}-${slugifier(v.couleur)}`
                    return (
                      <article key={v.sku || `${p._id}-${vIdx}`} className="group">
                        <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-sv-warm-white">
                          {photo?.asset && (
                            <Image
                              src={urlFor(photo).width(600).height(800).fit('crop').url()}
                              alt={`${p.nom} ${v.couleur}`}
                              fill
                              sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                              priority={vIdx < 4}
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          )}
                          {epuise && (
                            <span className="absolute right-3 top-3 bg-sv-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sv-cream">
                              Épuisé
                            </span>
                          )}
                        </Link>
                        <div className="mt-3">
                          <Link href={href}>
                            <p className="font-serif text-lg leading-tight transition-colors group-hover:text-sv-gold-dark">
                              {v.couleur}
                            </p>
                          </Link>
                          {prixActuel != null && (
                            <p className="mt-1 text-sm text-sv-mid">{formatPrix(prixActuel)}</p>
                          )}
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        <section aria-labelledby="titre-faq" className="mt-20 max-w-3xl">
          <h2 id="titre-faq" className="mb-8 font-serif text-3xl">Questions fréquentes</h2>
          <dl className="divide-y divide-sv-border">
            {g.faq.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="mb-3 font-medium">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-sv-mid">{item.r}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}
