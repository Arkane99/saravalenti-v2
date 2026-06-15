'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useFavoris } from '@/lib/store/favoris'
import { CarteProduit } from '@/components/produit/CarteProduit'
import type { ProduitCarte } from '@/lib/types'

export default function FavorisPage() {
  const { items } = useFavoris()
  const [produits, setProduits] = useState<ProduitCarte[]>([])
  const [chargement, setChargement] = useState(true)

  const slugs = [...new Set(items.map((k) => k.split(':')[0]))]

  useEffect(() => {
    if (slugs.length === 0) {
      setChargement(false)
      return
    }

    fetch(`/api/produits?slugs=${slugs.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        setProduits(data)
        setChargement(false)
      })
      .catch(() => setChargement(false))
  }, [items.join(',')])

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Mes favoris</h1>

      {chargement ? (
        <p className="text-sv-mid">Chargement...</p>
      ) : slugs.length === 0 ? (
        <div className="rounded border border-sv-border bg-sv-warm-white p-10 text-center">
          <p className="text-sv-mid">Vous n'avez pas encore de favoris.</p>
          <Link
            href="/catalogue"
            className="mt-6 inline-block text-sm font-medium text-sv-gold-dark underline-offset-2 hover:underline"
          >
            Decouvrir la collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produits.map((p) => (
            <CarteProduit key={p._id} produit={p} />
          ))}
        </div>
      )}
    </div>
  )
}
