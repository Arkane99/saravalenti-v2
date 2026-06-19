'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { urlFor } from '@/sanity/lib/client'
import { formatPrix } from '@/lib/format'
import { hexCouleur } from '@/lib/couleurs'
import type { ProduitCarte } from '@/lib/types'

/** Carte catalogue : image qui change au survol/clic des swatches couleur. */
export function CarteProduit({ produit, prioritaire = false }: { produit: ProduitCarte; prioritaire?: boolean }) {
  const [i, setI] = useState(0)
  const v = produit.variantes[i] ?? produit.variantes[0]
  if (!v) return null

  const photo = v.photos?.[0]
  const prixActuel = v.promo ?? v.prix
  const enPromo = v.promo != null && v.prix != null && v.promo < v.prix
  const epuise = (v.stock ?? 0) <= 0 && !v.reappro
  const href = `/catalogue/${produit.slug}`

  return (
    <article className="group">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-sv-warm-white">
        {photo?.asset && (
          <Image
            src={urlFor(photo).width(600).height(800).fit('crop').url()}
            alt={`${produit.nom} ${v.couleur}`}
            fill
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
            placeholder={photo.lqip ? 'blur' : 'empty'}
            blurDataURL={photo.lqip}
            priority={prioritaire}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {produit.est_page_gamme && (
          <span className="absolute left-3 top-3 bg-sv-cream/90 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sv-gold-dark">
            Gamme
          </span>
        )}
        {epuise && (
          <span className="absolute right-3 top-3 bg-sv-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sv-cream">
            Épuisé
          </span>
        )}
      </Link>

      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <Link href={href}>
            <h3 className="font-serif text-lg leading-tight transition-colors group-hover:text-sv-gold-dark">{produit.nom}</h3>
          </Link>
          <p className="shrink-0 text-sm">
            {enPromo && <span className="mr-1 text-sv-mid line-through">{formatPrix(v.prix)}</span>}
            <span className={enPromo ? 'text-sv-gold-dark' : ''}>{formatPrix(prixActuel)}</span>
          </p>
        </div>

        {produit.type && <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-sv-mid">{produit.type}</p>}

        {produit.variantes.length > 1 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {produit.variantes.map((va, idx) => (
              <button
                key={va.sku || `${va.couleur}-${idx}`}
                type="button"
                onMouseEnter={() => setI(idx)}
                onFocus={() => setI(idx)}
                onClick={() => setI(idx)}
                aria-label={`Voir en ${va.couleur}`}
                aria-pressed={idx === i}
                title={va.couleur}
                className={`h-4 w-4 rounded-full border transition-transform hover:scale-110 ${
                  idx === i ? 'border-sv-gold ring-1 ring-sv-gold' : 'border-sv-border'
                }`}
                style={{ backgroundColor: hexCouleur(va.couleur) }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
