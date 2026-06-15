'use client'

import { usePanier, nombreArticles } from '@/lib/store/panier'

export function BoutonPanier() {
  const { lignes, setOuvert } = usePanier()
  const nb = nombreArticles(lignes)

  return (
    <button
      type="button"
      onClick={() => setOuvert(true)}
      aria-label={nb > 0 ? `Ouvrir le panier (${nb} article${nb > 1 ? 's' : ''})` : 'Ouvrir le panier'}
      className="relative text-sv-black transition-colors hover:text-sv-gold-dark"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M6 7h12l1 14H5L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {nb > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sv-gold text-[10px] font-medium text-sv-black"
        >
          {nb > 9 ? '9+' : nb}
        </span>
      )}
    </button>
  )
}
