'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/client'
import { formatPrix } from '@/lib/format'
import { hexCouleur } from '@/lib/couleurs'
import { BoutonAction } from '@/components/ui/Bouton'
import { Link } from '@/i18n/navigation'
import { usePanier } from '@/lib/store/panier'
import { useFavoris, cléFavori } from '@/lib/store/favoris'
import type { ProduitDetail } from '@/lib/types'

export function FicheProduit({ produit, couleurInitiale }: { produit: ProduitDetail; couleurInitiale?: string }) {
  const idxInit = couleurInitiale ? produit.variantes.findIndex((v) => v.couleur === couleurInitiale) : 0
  const [iVar, setIVar] = useState(idxInit < 0 ? 0 : idxInit)
  const { ajouterAuPanier } = usePanier()
  const { toggleFavori, estFavori } = useFavoris()
  const [iPhoto, setIPhoto] = useState(0)
  const [descOuverte, setDescOuverte] = useState(false)

  const v = produit.variantes[iVar]
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

  function choisirVariante(i: number) {
    setIVar(i)
    setIPhoto(0)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Galerie */}
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-sv-warm-white">
          {photo?.asset && (
            <Image
              src={urlFor(photo).width(1000).height(1250).fit('crop').url()}
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
        <h1 className="mt-2 font-serif text-4xl">{produit.nom}</h1>

        <p className="mt-3 text-xl">
          {enPromo && <span className="mr-2 text-sv-mid line-through">{formatPrix(v.prix)}</span>}
          <span className={enPromo ? 'text-sv-gold-dark' : ''}>{formatPrix(v?.promo ?? v?.prix)}</span>
        </p>

        {produit.description_courte && <p className="mt-4 leading-relaxed text-sv-mid">{produit.description_courte}</p>}

        {/* Selecteur couleur */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.1em] text-sv-mid">
            Couleur : <span className="text-sv-black">{v?.couleur}</span>
            {v?.matiere && <span className="text-sv-mid"> · {v.matiere}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {produit.variantes.map((va, idx) => (
              <button
                key={va.sku || `${va.couleur}-${idx}`}
                type="button"
                onClick={() => choisirVariante(idx)}
                aria-label={va.couleur}
                aria-pressed={idx === iVar}
                title={va.couleur}
                className={`h-7 w-7 rounded-full border transition ${
                  idx === iVar ? 'border-sv-gold ring-1 ring-sv-gold ring-offset-1' : 'border-sv-border hover:scale-110'
                }`}
                style={{ backgroundColor: hexCouleur(va.couleur) }}
              />
            ))}
          </div>
        </div>

        <p className={`mt-4 text-sm ${stockClasse}`}>{stockLabel}</p>

        {aDims && (
          <p className="mt-2 text-sm text-sv-mid">
            Dimensions : {dims?.longueur ?? '?'} x {dims?.largeur ?? '?'} x {dims?.hauteur ?? '?'} cm
            {v?.poids ? ` · ${v.poids} kg` : ''}
          </p>
        )}

        {/* CTA panier + favoris */}
        <div className="mt-6 flex flex-wrap gap-3">
          <BoutonAction
            variante="noir"
            disabled={epuise}
            className="flex-1"
            onClick={() => {
              if (epuise || !v?.sku) return
              const photo = photos[0]
              ajouterAuPanier({
                slug: produit.slug,
                nom: produit.nom,
                couleur: v.couleur,
                sku: v.sku,
                prix: v.promo ?? v.prix ?? 0,
                photoUrl: photo?.asset ? urlFor(photo).width(200).height(250).fit('crop').url() : undefined,
              })
            }}
          >
            {epuise ? 'Epuise' : 'Ajouter au panier'}
          </BoutonAction>
          <BoutonAction
            variante="contour"
            onClick={() => toggleFavori(cléFavori(produit.slug, v?.couleur ?? ''))}
            aria-pressed={estFavori(cléFavori(produit.slug, v?.couleur ?? ''))}
            aria-label={estFavori(cléFavori(produit.slug, v?.couleur ?? '')) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {estFavori(cléFavori(produit.slug, v?.couleur ?? '')) ? 'Favori' : 'Favoris'}
          </BoutonAction>
        </div>
        <p className="mt-4 text-xs text-sv-mid">
          <Link href="/entretien-cuir" className="underline underline-offset-2 hover:text-sv-gold-dark">
            Guide d'entretien du cuir
          </Link>
        </p>

        {/* Description longue en accordeon */}
        {produit.description && produit.description.length > 0 && (
          <div className="mt-8 border-t border-sv-border pt-4">
            <button
              type="button"
              onClick={() => setDescOuverte((o) => !o)}
              aria-expanded={descOuverte}
              aria-controls="desc-panneau"
              className="flex w-full items-center justify-between text-sm uppercase tracking-[0.12em]"
            >
              Description
              <span className="text-sv-gold-dark" aria-hidden="true">{descOuverte ? '–' : '+'}</span>
            </button>
            {descOuverte && (
              <div id="desc-panneau" className="mt-4 space-y-3 text-sm leading-relaxed text-sv-mid [&_ul]:list-disc [&_ul]:pl-5">
                <PortableText value={produit.description} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
