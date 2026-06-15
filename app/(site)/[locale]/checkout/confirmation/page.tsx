'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import { usePanier } from '@/lib/store/panier'
import { formatPrix } from '@/lib/format'

function ConfirmationContenu() {
  const params = useSearchParams()
  const mock = params.get('mock') === 'true'
  const sessionId = params.get('session_id')
  const totalParam = params.get('total')
  const transporteurParam = params.get('transporteur')

  const { viderPanier } = usePanier()

  useEffect(() => {
    if (sessionId || mock) {
      viderPanier()
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      {/* Icone succes */}
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-700" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl">Commande confirmee</h1>

      <p className="mt-4 text-sv-mid">
        Merci pour votre achat. Un email de confirmation vous a ete envoye.
      </p>

      {mock && (
        <div className="mt-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Mode demonstration -- aucun paiement reel n'a ete effectue.
        </div>
      )}

      {(totalParam || transporteurParam) && (
        <div className="mt-8 rounded border border-sv-border bg-sv-warm-white p-5 text-sm text-left">
          {totalParam && (
            <div className="flex justify-between">
              <span className="text-sv-mid">Total paye</span>
              <span className="font-medium">{formatPrix(parseFloat(totalParam))}</span>
            </div>
          )}
          {transporteurParam && (
            <div className="mt-2 flex justify-between">
              <span className="text-sv-mid">Livraison</span>
              <span>{decodeURIComponent(transporteurParam)}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/compte/commandes"
          className="rounded border border-sv-black px-6 py-3 text-sm font-medium transition-colors hover:bg-sv-black hover:text-sv-cream"
        >
          Voir mes commandes
        </Link>
        <Link
          href="/catalogue"
          className="rounded bg-sv-black px-6 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sv-mid">Chargement...</div>}>
      <ConfirmationContenu />
    </Suspense>
  )
}
