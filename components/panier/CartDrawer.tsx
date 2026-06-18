'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { usePanier, totalPanier, nombreArticles, type LignePanier } from '@/lib/store/panier'
import { formatPrix } from '@/lib/format'

export function CartDrawer() {
  const { lignes, ouvert, setOuvert, retirerDuPanier, changerQuantite } = usePanier()
  const total = totalPanier(lignes)
  const nbArticles = nombreArticles(lignes)

  return (
    <>
      {/* Overlay */}
      {ouvert && (
        <div
          className="fixed inset-0 z-40 bg-sv-black/40"
          onClick={() => setOuvert(false)}
          aria-hidden="true"
        />
      )}

      {/* Panneau */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        aria-hidden={!ouvert}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-sv-cream shadow-2xl transition-transform duration-300 ${
          ouvert ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-sv-border px-6 py-5">
          <h2 className="font-serif text-xl">
            Panier
            {nbArticles > 0 && (
              <span className="ml-2 text-sm font-normal text-sv-mid">
                ({nbArticles} article{nbArticles > 1 ? 's' : ''})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setOuvert(false)}
            aria-label="Fermer le panier"
            className="text-sv-mid hover:text-sv-black"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lignes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sv-mid">Votre panier est vide.</p>
              <Link
                href="/catalogue"
                onClick={() => setOuvert(false)}
                className="mt-6 text-sm font-medium text-sv-gold-dark underline underline-offset-2"
              >
                Voir la collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-sv-border">
              {lignes.map((ligne) => (
                <LignePanierRow
                  key={ligne.sku}
                  ligne={ligne}
                  onRetirer={() => retirerDuPanier(ligne.sku)}
                  onChanger={(q) => changerQuantite(ligne.sku, q)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Pied */}
        {lignes.length > 0 && (
          <div className="border-t border-sv-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-sv-mid">Sous-total</span>
              <span className="font-medium">{formatPrix(total)}</span>
            </div>
            <p className="mb-4 text-xs text-sv-mid">Livraison calculee au moment du paiement.</p>
            <Link
              href="/checkout"
              onClick={() => setOuvert(false)}
              className="block w-full rounded bg-sv-black py-3 text-center text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black"
            >
              Passer la commande
            </Link>
            <Link
              href="/panier"
              onClick={() => setOuvert(false)}
              className="mt-3 block w-full py-2 text-center text-xs text-sv-mid underline-offset-2 hover:underline"
            >
              Voir le panier complet
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}

function LignePanierRow({
  ligne,
  onRetirer,
  onChanger,
}: {
  ligne: LignePanier
  onRetirer: () => void
  onChanger: (q: number) => void
}) {
  return (
    <li className="flex gap-4 py-4">
      {/* Miniature */}
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-sv-warm-white">
        {ligne.photoUrl && (
          <Image src={ligne.photoUrl} alt={`${ligne.nom} ${ligne.couleur}`} fill sizes="64px" className="object-cover" />
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="font-serif text-sm leading-tight">{ligne.nom}</p>
          <p className="mt-0.5 text-xs text-sv-mid">{ligne.couleur}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantite */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChanger(ligne.quantite - 1)}
              aria-label="Diminuer la quantite"
              className="flex h-6 w-6 items-center justify-center border border-sv-border text-sv-mid hover:border-sv-black hover:text-sv-black"
            >
              <span aria-hidden>-</span>
            </button>
            <span className="w-4 text-center text-sm">{ligne.quantite}</span>
            <button
              type="button"
              onClick={() => onChanger(ligne.quantite + 1)}
              aria-label="Augmenter la quantite"
              className="flex h-6 w-6 items-center justify-center border border-sv-border text-sv-mid hover:border-sv-black hover:text-sv-black"
            >
              <span aria-hidden>+</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{formatPrix(ligne.prix * ligne.quantite)}</span>
            <button
              type="button"
              onClick={onRetirer}
              aria-label={`Retirer ${ligne.nom} ${ligne.couleur} du panier`}
              className="text-sv-mid hover:text-sv-black"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
