'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { usePanier, totalPanier, type LignePanier } from '@/lib/store/panier'
import { formatPrix } from '@/lib/format'
import { setRequestLocale } from 'next-intl/server'

export default function PanierPage() {
  const { lignes, retirerDuPanier, changerQuantite, viderPanier } = usePanier()
  const total = totalPanier(lignes)

  if (lignes.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
        <p className="font-serif text-2xl">Votre panier est vide</p>
        <p className="mt-4 text-sv-mid">Vous n'avez pas encore ajoute d'articles.</p>
        <Link
          href="/catalogue"
          className="mt-8 inline-block rounded bg-sv-black px-8 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black"
        >
          Voir la collection
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 font-serif text-4xl">Votre panier</h1>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Liste articles */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-sv-border">
            {lignes.map((ligne) => (
              <LignePanierPageRow
                key={ligne.sku}
                ligne={ligne}
                onRetirer={() => retirerDuPanier(ligne.sku)}
                onChanger={(q) => changerQuantite(ligne.sku, q)}
              />
            ))}
          </ul>

          <button
            type="button"
            onClick={viderPanier}
            className="mt-6 text-xs text-sv-mid underline-offset-2 hover:underline"
          >
            Vider le panier
          </button>
        </div>

        {/* Recapitulatif */}
        <aside className="rounded border border-sv-border bg-sv-warm-white p-6">
          <h2 className="mb-6 font-serif text-xl">Recapitulatif</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-sv-mid">Sous-total</span>
              <span>{formatPrix(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sv-mid">Livraison</span>
              <span className="text-sv-mid">Calculee au paiement</span>
            </div>
          </div>

          <div className="my-4 border-t border-sv-border pt-4">
            <div className="flex justify-between font-medium">
              <span>Total estimé</span>
              <span>{formatPrix(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full rounded bg-sv-black py-3 text-center text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black"
          >
            Passer la commande
          </Link>

          <Link
            href="/catalogue"
            className="mt-4 block text-center text-xs text-sv-mid underline-offset-2 hover:underline"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  )
}

function LignePanierPageRow({
  ligne,
  onRetirer,
  onChanger,
}: {
  ligne: LignePanier
  onRetirer: () => void
  onChanger: (q: number) => void
}) {
  return (
    <li className="flex gap-6 py-6">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded bg-sv-warm-white">
        {ligne.photoUrl && (
          <Image src={ligne.photoUrl} alt={`${ligne.nom} ${ligne.couleur}`} fill sizes="96px" className="object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/catalogue/${ligne.slug}`} className="font-serif text-lg hover:text-sv-gold-dark">
              {ligne.nom}
            </Link>
            <p className="mt-1 text-sm text-sv-mid">{ligne.couleur}</p>
          </div>
          <button
            type="button"
            onClick={onRetirer}
            aria-label={`Retirer ${ligne.nom} du panier`}
            className="shrink-0 text-sv-mid hover:text-sv-black"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChanger(ligne.quantite - 1)}
              aria-label="Diminuer la quantite"
              className="flex h-7 w-7 items-center justify-center border border-sv-border hover:border-sv-black"
            >
              <span aria-hidden>-</span>
            </button>
            <span className="w-6 text-center text-sm">{ligne.quantite}</span>
            <button
              type="button"
              onClick={() => onChanger(ligne.quantite + 1)}
              aria-label="Augmenter la quantite"
              className="flex h-7 w-7 items-center justify-center border border-sv-border hover:border-sv-black"
            >
              <span aria-hidden>+</span>
            </button>
          </div>
          <span className="font-medium">{formatPrix(ligne.prix * ligne.quantite)}</span>
        </div>
      </div>
    </li>
  )
}
