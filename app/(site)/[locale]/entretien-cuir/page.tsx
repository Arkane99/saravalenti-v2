import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Comment entretenir un sac en cuir : guide complet',
  description:
    'Guide pratique d\'entretien du cuir : cuir brossé, suède, grainé et irisé. Conseils par type de tache, produits recommandés, erreurs à éviter.',
  alternates: { canonical: '/entretien-cuir' },
}

const FAQ_ENTRETIEN = [
  {
    q: 'Peut-on laver un sac en cuir à l\'eau ?',
    r: 'Non. L\'eau en grande quantité abime le cuir naturel : elle dessèche la fibre, laisse des auréoles et peut déformer la structure. Pour les taches, tamponnez avec un chiffon légèrement humide, puis séchez immédiatement. Pour un nettoyage profond, utilisez un produit nettoyant spécifique au cuir.',
  },
  {
    q: 'Comment enlever une tache de stylo sur du cuir ?',
    r: 'Tamponnez immédiatement avec de l\'alcool à 70° sur un coton, en effectuant des mouvements du centre vers l\'extérieur de la tache pour éviter d\'agrandir. N\'attendez pas : plus la tache sèche, plus elle pénètre. Testez d\'abord sur une zone non visible. Terminez avec une crème hydratante pour le cuir.',
  },
  {
    q: 'Comment protéger un sac en cuir avant de l\'utiliser pour la première fois ?',
    r: 'Pour le cuir suède et grainé : appliquez un spray imperméabilisant à 30 cm, laissez sécher 30 minutes, renouvelez. Pour le cuir brossé : une crème nourrissante incolore suffit. Pour tous les cuirs : évitez la première sortie sous la pluie et les environnements très humides les premiers jours.',
  },
  {
    q: 'Quelle crème utiliser pour le cuir ?',
    r: 'Une crème incolore à base de cire naturelle (cire d\'abeille ou carnauba) convient à la plupart des cuirs lisses. Évitez les produits contenant des solvants ou des colorants. Pour le suède, n\'utilisez pas de crème : une bombe imperméabilisante et une brosse à suède sont les seuls outils nécessaires.',
  },
  {
    q: 'Comment ranger un sac en cuir ?',
    r: 'Rembourrez l\'intérieur avec du papier de soie pour conserver la forme. Rangez dans une housse en tissu (jamais en plastique, le cuir doit respirer). Ne superposez pas les sacs. Éloignez des sources de chaleur directe et de la lumière du soleil prolongée, qui dessèche et décolore le cuir.',
  },
  {
    q: 'Le cuir suède résiste-t-il à la pluie ?',
    r: 'Avec un spray imperméabilisant, le suède supporte une pluie légère. Pour une pluie intense, protégez-le. En cas de mouillage, laissez sécher à l\'air libre et à température ambiante, puis brossez délicatement avec une brosse à suède une fois sec. N\'utilisez jamais un sèche-cheveux ou une source de chaleur directe.',
  },
]

const GUIDES = [
  {
    type: 'Cuir brossé',
    produits: ['Chiffon microfibre', 'Crème nourrissante incolore (cire naturelle)', 'Chiffon doux pour le polissage'],
    routine: [
      'Après chaque utilisation : essuyez avec un chiffon sec pour retirer la poussière.',
      'En cas de tache : tamponnez avec un chiffon légèrement humide, séchez immédiatement.',
      'Tous les 2-3 mois : appliquez une crème nourrissante incolore en couche fine, laissez pénétrer 10 minutes, polissez avec un chiffon doux.',
      'Stockage : housse en tissu, rembourré, à l\'abri du soleil direct.',
    ],
    erreurs: [
      'Savon ordinaire ou liquide vaisselle (dessèche le cuir).',
      'Sèche-cheveux ou radiateur pour sécher une pièce mouillée.',
      'Alcool pur en grande quantité (décolore).',
      'Crèmes colorées sur cuir clair.',
    ],
  },
  {
    type: 'Cuir suède',
    produits: ['Brosse à suède à poils de laiton ou synthétiques', 'Gomme à suède', 'Spray imperméabilisant spécial suède'],
    routine: [
      'Avant la première utilisation : appliquez un spray imperméabilisant, laissez sécher, renouvelez.',
      'Après chaque utilisation : brossez doucement pour remettre le velours debout.',
      'En cas de tache sèche : utilisez la gomme à suède par mouvements circulaires.',
      'En cas de tache humide : laissez sécher complètement avant de traiter, n\'essuyez pas.',
      'Tous les mois : spray imperméabilisant pour maintenir la protection.',
    ],
    erreurs: [
      'Eau ou chiffon humide directement sur une tache (agrandit l\'auréole).',
      'Crème pour cuir lisse (obstrue les pores du suède).',
      'Brosse à poils durs qui arrache les fibres.',
      'Séchage près d\'une source de chaleur.',
    ],
  },
  {
    type: 'Cuir grainé',
    produits: ['Chiffon microfibre', 'Crème nourrissante incolore', 'Spray imperméabilisant (optionnel)'],
    routine: [
      'Après chaque utilisation : essuyez avec un chiffon sec.',
      'En cas de tache : chiffon humide, séchage immédiat.',
      'Tous les 3-4 mois : crème nourrissante incolore en couche légère.',
      'Le grainé est le plus résistant aux taches et rayures : l\'entretien est minimal.',
    ],
    erreurs: [
      'Produits abrasifs qui gommeraient le grain embossé.',
      'Crèmes en excès qui obstruent la texture.',
    ],
  },
  {
    type: 'Cuir irisé',
    produits: ['Chiffon microfibre très doux', 'Crème très légère ou huile de jojoba pure'],
    routine: [
      'Essuyez délicatement avec un chiffon microfibre sec après chaque utilisation.',
      'Évitez les produits commerciaux classiques : ils peuvent ternir l\'effet nacré.',
      'En cas de tache, testez d\'abord sur une zone cachée avant tout traitement.',
      'Stockage à l\'abri de la lumière (l\'irisé est sensible aux UV).',
    ],
    erreurs: [
      'Cires dures qui ternissent le reflet nacré.',
      'Frottement appuyé qui raye la surface.',
      'Exposition prolongée au soleil direct.',
    ],
  },
]

const schemaHowTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment entretenir un sac en cuir',
  description:
    'Guide complet pour l\'entretien des sacs en cuir : cuir brossé, suède, grainé et irisé. Routine d\'entretien, produits recommandés et erreurs à éviter.',
  supply: [
    { '@type': 'HowToSupply', name: 'Chiffon microfibre' },
    { '@type': 'HowToSupply', name: 'Crème nourrissante incolore' },
    { '@type': 'HowToSupply', name: 'Brosse à suède (pour cuir suède)' },
    { '@type': 'HowToSupply', name: 'Spray imperméabilisant (pour cuir suède et grainé)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Identifier le type de cuir',
      text: 'Vérifiez si votre sac est en cuir brossé, suède, grainé ou irisé. Les soins varient selon la matière.',
    },
    {
      '@type': 'HowToStep',
      name: 'Protéger avant la première utilisation',
      text: 'Pour le cuir suède et grainé : appliquez un spray imperméabilisant. Pour le cuir brossé : une crème nourrissante incolore.',
    },
    {
      '@type': 'HowToStep',
      name: 'Entretien quotidien',
      text: 'Essuyez avec un chiffon sec après chaque utilisation. Pour le suède, brossez délicatement pour remettre le velours debout.',
    },
    {
      '@type': 'HowToStep',
      name: 'Traiter les taches rapidement',
      text: 'Pour le cuir lisse : chiffon légèrement humide, séchage immédiat. Pour le suède : laissez sécher, puis gomme à suède.',
    },
    {
      '@type': 'HowToStep',
      name: 'Nourrir le cuir régulièrement',
      text: 'Tous les 2-3 mois : crème nourrissante incolore sur cuir lisse, spray imperméabilisant sur suède.',
    },
    {
      '@type': 'HowToStep',
      name: 'Ranger correctement',
      text: 'Rembourrez de papier de soie, rangez dans une housse en tissu, à l\'abri de la chaleur et du soleil direct.',
    },
  ],
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ENTRETIEN.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.r },
  })),
}

export default async function EntretienCuirPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      {/* Hero image — cuir brossé Rita camel */}
      <div className="relative h-48 overflow-hidden md:h-64">
        <Image
          src="/images/produits/sac-a-main-cuir-brosse-rita-camel-2.png"
          alt="Détail du cuir brossé, sac Rita Sara Valenti"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-sv-black/20" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-sv-gold-dark">Guide</p>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">
            Comment entretenir un sac en cuir : guide complet
          </h1>
          <p className="mt-6 text-base leading-relaxed text-sv-mid">
            Un sac en cuir bien entretenu dure des décennies. Ce guide couvre les quatre types de cuir de la
            collection Sara Valenti : brossé, suède, grainé et irisé. Routines, produits recommandés et
            erreurs à éviter.
          </p>
        </header>

        {/* Guides par type de cuir */}
        <div className="mb-20 space-y-16">
          {GUIDES.map((guide) => (
            <section key={guide.type} aria-labelledby={`titre-${guide.type.replace(/\s/g, '-').toLowerCase()}`}>
              <h2
                id={`titre-${guide.type.replace(/\s/g, '-').toLowerCase()}`}
                className="mb-6 font-serif text-2xl"
              >
                {guide.type}
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded border border-sv-border bg-sv-warm-white p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-sv-gold-dark">Produits nécessaires</h3>
                  <ul className="space-y-1 text-sm text-sv-mid">
                    {guide.produits.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden="true">-</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border border-sv-border bg-sv-warm-white p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-sv-gold-dark">Routine d'entretien</h3>
                  <ol className="space-y-2 text-sm text-sv-mid">
                    {guide.routine.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 font-medium text-sv-black">{i + 1}.</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded border border-red-100 bg-red-50 p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-red-700">Erreurs à éviter</h3>
                  <ul className="space-y-1 text-sm text-red-800">
                    {guide.erreurs.map((e) => (
                      <li key={e} className="flex gap-2">
                        <span aria-hidden="true">x</span>{e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <section aria-labelledby="titre-faq">
          <h2 id="titre-faq" className="mb-8 font-serif text-3xl">Questions fréquentes sur l'entretien du cuir</h2>
          <dl className="divide-y divide-sv-border">
            {FAQ_ENTRETIEN.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="mb-3 font-medium">{item.q}</dt>
                <dd className="text-sm leading-relaxed text-sv-mid">{item.r}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA vers catalogue */}
        <div className="mt-16 rounded border border-sv-border bg-sv-warm-white px-6 py-8 text-center">
          <p className="mb-4 font-serif text-xl">Vous cherchez votre prochain sac ?</p>
          <Link
            href="/catalogue"
            className="inline-block rounded border border-sv-black bg-sv-black px-6 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black hover:border-sv-gold"
          >
            Voir la collection
          </Link>
        </div>
      </div>
    </>
  )
}
