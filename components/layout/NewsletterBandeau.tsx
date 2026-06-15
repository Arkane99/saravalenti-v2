'use client'

import { useEffect, useState } from 'react'

const CLE_REJET = 'sv-newsletter-dismissed'

export function NewsletterBandeau() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [statut, setStatut] = useState<'idle' | 'chargement' | 'succes' | 'erreur'>('idle')

  useEffect(() => {
    if (!localStorage.getItem(CLE_REJET)) {
      const t = setTimeout(() => setVisible(true), 4000)
      return () => clearTimeout(t)
    }
  }, [])

  function fermer() {
    setVisible(false)
    localStorage.setItem(CLE_REJET, '1')
  }

  async function inscrire(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const rgpd = (e.currentTarget.elements.namedItem('rgpd') as HTMLInputElement)?.checked
    if (!rgpd) return
    setStatut('chargement')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatut(res.ok ? 'succes' : 'erreur')
      if (res.ok) setTimeout(fermer, 2500)
    } catch {
      setStatut('erreur')
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Offres et nouveautes Sara Valenti"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-sv-border bg-sv-cream px-6 py-5 shadow-xl md:bottom-6 md:left-auto md:right-6 md:max-w-sm md:rounded-lg md:border"
    >
      <button
        onClick={fermer}
        aria-label="Fermer le bandeau newsletter"
        className="absolute right-4 top-4 text-sv-mid hover:text-sv-black"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
      </button>

      <p className="font-serif text-lg leading-tight">Offres et nouveautes</p>
      <p className="mt-1.5 text-xs text-sv-mid">
        Inscrivez-vous et recevez <strong>10&nbsp;% de remise</strong> sur votre premiere commande.
      </p>

      {statut === 'succes' ? (
        <p className="mt-4 text-sm font-medium text-green-700">
          Merci ! Votre code de remise arrive par email.
        </p>
      ) : (
        <form onSubmit={inscrire} className="mt-4 space-y-3" noValidate>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            aria-label="Adresse email"
            className="w-full rounded border border-sv-border bg-white px-3 py-2.5 text-sm outline-none focus:border-sv-black"
          />
          <label className="flex items-start gap-2 text-xs leading-relaxed text-sv-mid">
            <input
              type="checkbox"
              name="rgpd"
              required
              className="mt-0.5 shrink-0 accent-sv-black"
            />
            <span>
              J'accepte de recevoir des emails de Sara Valenti. Mes donnees ne sont jamais
              revendues.{' '}
              <a href="/mentions-legales" className="underline underline-offset-2 hover:text-sv-black">
                Confidentialite
              </a>
              .
            </span>
          </label>
          {statut === 'erreur' && (
            <p role="alert" className="text-xs text-red-700">
              Une erreur est survenue. Reessayez ou ecrivez-nous.
            </p>
          )}
          <button
            type="submit"
            disabled={statut === 'chargement'}
            className="w-full rounded bg-sv-black py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black disabled:opacity-50"
          >
            {statut === 'chargement' ? 'Inscription...' : 'Obtenir ma remise de 10 %'}
          </button>
        </form>
      )}
    </div>
  )
}
