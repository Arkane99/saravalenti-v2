'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/client'
import { formatPrix } from '@/lib/format'
import { hexCouleur } from '@/lib/couleurs'
import { slugifier } from '@/lib/slugifier'
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { BoutonAction } from '@/components/ui/Bouton'
import { Link } from '@/i18n/navigation'
import { usePanier } from '@/lib/store/panier'
import { useFavoris, cléFavori } from '@/lib/store/favoris'
import type { ProduitDetail } from '@/lib/types'

// -- Entretien par matière -------------------------------------------------------

type CatEntretien = 'brosse' | 'suede' | 'graine' | 'irise' | 'defaut'

function categorieEntretien(matiere: string | undefined): CatEntretien {
  if (!matiere) return 'defaut'
  const m = matiere.toLowerCase()
  if (m.includes('irisé') || m.includes('irise') || m.includes('nacré')) return 'irise'
  if (m.includes('grainé') || m.includes('graine')) return 'graine'
  if (m.includes('suède') || m.includes('suede') || m.includes('daim') || m.includes('nubuck')) return 'suede'
  if (m.includes('brossé') || m.includes('brosse')) return 'brosse'
  return 'defaut'
}

const CONSEILS: Record<CatEntretien, string[]> = {
  brosse: [
    "Essuyez les taches légères avec un chiffon légèrement humide, séchez immédiatement à l'air libre.",
    'Deux fois par an, appliquez une crème incolore à base de cire pour nourrir la surface.',
    "Évitez l'exposition prolongée au soleil direct qui peut altérer la teinte.",
    'Rangez dans une housse en tissu, jamais en plastique.',
  ],
  suede: [
    'Protégez avant la première utilisation avec un spray imperméabilisant spécial suède.',
    'Utilisez une brosse à suède à poils doux pour enlever la poussière et remettre le velours debout.',
    'Pour les taches, tamponnez avec une gomme à suède spéciale, sans frotter.',
    "En cas de pluie, laissez sécher à l'air libre, jamais près d'une source de chaleur.",
  ],
  graine: [
    "Essuyez avec un chiffon légèrement humide pour les taches courantes, séchez à l'air libre.",
    'Deux fois par an, appliquez une crème hydratante incolore pour entretenir la souplesse.',
    'Le cuir grainé résiste naturellement aux rayures ; évitez cependant les surfaces abrasives.',
    'Rangez dans une housse en tissu pour protéger le relief.',
  ],
  irise: [
    'Nettoyez délicatement avec un chiffon doux sec ou très légèrement humide.',
    'Évitez tout produit chimique qui pourrait altérer les reflets nacrés.',
    "Protégez de la lumière directe prolongée pour conserver l'éclat.",
    "Rangez séparément pour éviter les rayures au contact d'autres matières.",
  ],
  defaut: [
    "Essuyez les taches légères avec un chiffon légèrement humide, séchez à l'air libre.",
    'Nourrissez le cuir deux fois par an avec une crème incolore adaptée.',
    "Évitez l'exposition prolongée au soleil direct et à l'humidité.",
    'Rangez dans une housse en tissu pour protéger la surface.',
  ],
}

function phraseMatiere(matiere: string | undefined): string | null {
  if (!matiere) return null
  const m = matiere.toLowerCase()
  if (m.includes('irisé') || m.includes('irise'))
    return 'Ses reflets nacrés changent selon la lumière pour un effet subtil et élégant.'
  if (m.includes('grainé') || m.includes('graine'))
    return "Sa surface texturée résiste naturellement aux marques d'usage et conserve sa forme dans le temps."
  if (m.includes('suède') || m.includes('suede') || m.includes('daim') || m.includes('nubuck'))
    return "Sa texture veloutée est douce au toucher. Un spray imperméabilisant est recommandé avant la première utilisation."
  if (m.includes('brossé') || m.includes('brosse'))
    return "Sa surface légèrement satinée se patine avec l'usage pour développer un caractère unique."
  return null
}

// -- Accordéon -------------------------------------------------------------------

function Accordeon({
  titre,
  ouvert,
  onToggle,
  id,
  children,
}: {
  titre: string
  ouvert: boolean
  onToggle: () => void
  id: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-sv-border pt-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={ouvert}
        aria-controls={id}
        className="flex w-full items-center justify-between pb-4 text-sm uppercase tracking-[0.12em]"
      >
        {titre}
        <span className="text-sv-gold-dark" aria-hidden="true">{ouvert ? '-' : '+'}</span>
      </button>
      {ouvert && (
        <div id={id} className="pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

// -- Composant principal ---------------------------------------------------------

export function FicheProduit({ produit, couleurSlug }: { produit: ProduitDetail; couleurSlug?: string }) {
  const v = couleurSlug
    ? (produit.variantes.find((va) => slugifier(va.couleur) === couleurSlug) ?? produit.variantes[0])
    : produit.variantes[0]
  const { ajouterAuPanier } = usePanier()
  const { toggleFavori, estFavori } = useFavoris()
  const [iPhoto, setIPhoto] = useState(0)
  const [acc1, setAcc1] = useState(true)
  const [acc2, setAcc2] = useState(false)
  const [acc3, setAcc3] = useState(false)

  const photos = v?.photos ?? []
  const photo = photos[iPhoto] ?? photos[0]
  const enPromo = v?.promo != null && v?.prix != null && v.promo < v.prix
  const epuise = (v?.stock ?? 0) <= 0 && !v?.reappro
  const dims = v?.dimensions
  const aDims = dims && (dims.longueur || dims.largeur || dims.hauteur)

  const stockLabel = v?.reappro
    ? 'En réapprovisionnement'
    : (v?.stock ?? 0) <= 0
      ? 'Épuisé'
      : v.stock <= 3
        ? `Dernières pièces (${v.stock})`
        : 'En stock'
  const stockClasse = v?.reappro ? 'text-sv-gold-dark' : epuise ? 'text-sv-mid' : 'text-green-700'

  const descPara1 = v?.description_courte || `Le ${produit.nom} ${v?.couleur ?? ''} est un sac en cuir fabriqué en Italie.`
  const descPara2 = phraseMatiere(v?.matiere)

  const caracts: { label: string; valeur: string }[] = [
    ...(aDims
      ? [{ label: 'Dimensions', valeur: `${dims?.longueur ?? '?'} x ${dims?.largeur ?? '?'} x ${dims?.hauteur ?? '?'} cm` }]
      : []),
    ...(v?.matiere ? [{ label: 'Matière', valeur: v.matiere }] : []),
    { label: 'Couleur', valeur: v?.couleur ?? '' },
    ...(v?.poids ? [{ label: 'Poids', valeur: `${v.poids} kg` }] : []),
    { label: 'Fabrication', valeur: 'Italie' },
  ]

  const conseils = CONSEILS[categorieEntretien(v?.matiere)]

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Galerie */}
      <div>
        <div className="relative aspect-[3/4] overflow-hidden bg-sv-warm-white">
          {photo?.asset && (
            <Image
              src={urlFor(photo).width(1000).height(1333).fit('crop').url()}
              alt={`${produit.nom} ${v.couleur}`}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              placeholder={photo.lqip ? 'blur' : 'empty'}
              blurDataURL={photo.lqip}
              className="object-cover"
              priority
            />
          )}
        </div>
        {photos.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {photos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIPhoto(idx)}
                aria-label={`Photo ${idx + 1}`}
                aria-pressed={idx === iPhoto}
                className={`relative h-24 w-20 shrink-0 overflow-hidden border ${idx === iPhoto ? 'border-sv-gold' : 'border-transparent'}`}
              >
                {p.asset && (
                  <Image src={urlFor(p).width(160).height(200).fit('crop').url()} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Infos */}
      <div>
        {produit.type && <p className="text-xs uppercase tracking-[0.18em] text-sv-gold-dark">{produit.type}</p>}
        <h1 className="mt-2 font-serif text-4xl">{produit.nom} {v.couleur}</h1>

        <p className="mt-3 text-xl">
          {enPromo && <span className="mr-2 text-sv-mid line-through">{formatPrix(v.prix)}</span>}
          <span className={enPromo ? 'text-sv-gold-dark' : ''}>{formatPrix(v?.promo ?? v?.prix)}</span>
        </p>

        {/* Sélecteur couleur — swatches = Links */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.1em] text-sv-mid">
            Couleur : <span className="text-sv-black">{v?.couleur}</span>
            {v?.matiere && <span className="text-sv-mid"> · {v.matiere}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {produit.variantes.map((va) => {
              const estActive = slugifier(va.couleur) === couleurSlug || (!couleurSlug && va === produit.variantes[0])
              return (
                <Link
                  key={va.sku || va.couleur}
                  href={`/catalogue/${produit.slug}-${slugifier(va.couleur)}`}
                  aria-label={va.couleur}
                  aria-current={estActive ? 'page' : undefined}
                  title={va.couleur}
                  className={`block h-7 w-7 rounded-full border transition hover:scale-110 ${
                    estActive ? 'border-sv-gold ring-1 ring-sv-gold ring-offset-1' : 'border-sv-border'
                  }`}
                  style={{ backgroundColor: hexCouleur(va.couleur) }}
                />
              )
            })}
          </div>
        </div>

        <p className={`mt-4 text-sm ${stockClasse}`}>{stockLabel}</p>

        {/* CTA panier + favoris */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <BoutonAction
            variante="noir"
            disabled={epuise}
            className="flex-1"
            onClick={() => {
              if (epuise || !v?.sku) return
              const ph = photos[0]
              ajouterAuPanier({
                slug: produit.slug,
                nom: produit.nom,
                couleur: v.couleur,
                sku: v.sku,
                prix: v.promo ?? v.prix ?? 0,
                photoUrl: ph?.asset ? urlFor(ph).width(200).height(250).fit('crop').url() : undefined,
              })
            }}
          >
            {epuise ? 'Épuisé' : 'Ajouter au panier'}
          </BoutonAction>
          <BoutonAction
            variante="contour"
            className="w-auto px-6"
            onClick={() => toggleFavori(cléFavori(produit.slug, v?.couleur ?? ''))}
            aria-pressed={estFavori(cléFavori(produit.slug, v?.couleur ?? ''))}
            aria-label={estFavori(cléFavori(produit.slug, v?.couleur ?? '')) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {estFavori(cléFavori(produit.slug, v?.couleur ?? '')) ? 'Favori' : 'Favoris'}
          </BoutonAction>
        </div>
        {/* Pictos rassurants */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-sv-mid">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 shrink-0" />
            <span>Livraison offerte dès 45 EUR</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Cuir naturel italien</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 shrink-0" />
            <span>Retours sous 14 jours</span>
          </div>
        </div>

        {/* Accordéons */}
        <div className="mt-8">
          <Accordeon titre="Description" ouvert={acc1} onToggle={() => setAcc1((o) => !o)} id="acc-desc">
            <div className="space-y-3 text-sm leading-relaxed text-sv-mid">
              <p>{descPara1}</p>
              {descPara2 && <p>{descPara2}</p>}
              <p>Fabriqué dans des ateliers italiens sélectionnés pour leur maîtrise de la maroquinerie.</p>
            </div>
          </Accordeon>

          <Accordeon titre="Caractéristiques" ouvert={acc2} onToggle={() => setAcc2((o) => !o)} id="acc-caract">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-sv-border">
                {caracts.map(({ label, valeur }) => (
                  <tr key={label}>
                    <td className="py-2 pr-4 text-sv-mid" style={{ width: '45%' }}>{label}</td>
                    <td className="py-2 text-sv-black">{valeur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordeon>

          <Accordeon titre="Entretien" ouvert={acc3} onToggle={() => setAcc3((o) => !o)} id="acc-entretien">
            <ul className="space-y-2 text-sm leading-relaxed text-sv-mid">
              {conseils.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs">
              <Link href="/entretien-cuir" className="text-sv-gold-dark underline underline-offset-2 hover:opacity-80">
                Guide complet d'entretien du cuir
              </Link>
            </p>
          </Accordeon>
        </div>

        {/* Autres coloris du même modèle */}
        {produit.variantes.length > 1 && (
          <div className="mt-10 border-t border-sv-border pt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-sv-gold-dark">
              Les autres coloris {produit.nom}
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {produit.variantes
                .filter((va) => slugifier(va.couleur) !== couleurSlug)
                .slice(0, 4)
                .map((va) => {
                  const photo = va.photos?.[0]
                  const href = `/catalogue/${produit.slug}-${slugifier(va.couleur)}`
                  const px = va.promo ?? va.prix
                  return (
                    <Link key={va.sku || va.couleur} href={href} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-sv-warm-white">
                        {photo?.asset && (
                          <Image
                            src={urlFor(photo).width(280).height(373).fit('crop').url()}
                            alt={`${produit.nom} ${va.couleur}`}
                            fill
                            sizes="(min-width:640px) 140px, 110px"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-sv-mid transition-colors group-hover:text-sv-gold-dark">
                        {va.couleur}
                      </p>
                      {px != null && (
                        <p className="text-xs text-sv-mid">{formatPrix(px)}</p>
                      )}
                    </Link>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
