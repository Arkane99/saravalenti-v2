'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { CarteProduit } from '@/components/produit/CarteProduit'
import { hexCouleur } from '@/lib/couleurs'
import { formatPrix } from '@/lib/format'
import type { ProduitCarte } from '@/lib/types'

type Tri = 'nouveautes' | 'prix-asc' | 'prix-desc'

function prixMini(p: ProduitCarte): number {
  return Math.min(...p.variantes.map((v) => v.promo ?? v.prix ?? Infinity))
}

export function CatalogueClient({ produits }: { produits: ProduitCarte[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // Options derivees du catalogue
  const { couleurs, matieres, types, prixPlafond } = useMemo(() => {
    const c = new Set<string>()
    const m = new Set<string>()
    const t = new Set<string>()
    let max = 0
    for (const p of produits) {
      if (p.type) t.add(p.type)
      for (const v of p.variantes) {
        if (v.couleur) c.add(v.couleur)
        if (v.matiere) m.add(v.matiere)
        const prix = v.promo ?? v.prix
        if (prix != null) max = Math.max(max, prix)
      }
    }
    const cmp = (a: string, b: string) => a.localeCompare(b, 'fr')
    return {
      couleurs: [...c].sort(cmp),
      matieres: [...m].sort(cmp),
      types: [...t].sort(cmp),
      prixPlafond: Math.ceil(max),
    }
  }, [produits])

  // Etat initialise depuis l'URL (partageable / bookmarkable)
  const [selCouleurs, setSelCouleurs] = useState<string[]>(() => sp.get('couleur')?.split(',').filter(Boolean) ?? [])
  const [selMatieres, setSelMatieres] = useState<string[]>(() => sp.get('matiere')?.split(',').filter(Boolean) ?? [])
  const [selTypes, setSelTypes] = useState<string[]>(() => sp.get('type')?.split(',').filter(Boolean) ?? [])
  const [prixMax, setPrixMax] = useState<number>(() => Number(sp.get('prixMax')) || prixPlafond)
  const [enStock, setEnStock] = useState<boolean>(() => sp.get('stock') === '1' || sp.get('stock') === 'reappro')
  const [inclureReappro, setInclureReappro] = useState<boolean>(() => sp.get('stock') === 'reappro')
  const [tri, setTri] = useState<Tri>(() => (sp.get('tri') as Tri) || 'nouveautes')

  // Synchronisation vers l'URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (selCouleurs.length) params.set('couleur', selCouleurs.join(','))
    if (selMatieres.length) params.set('matiere', selMatieres.join(','))
    if (selTypes.length) params.set('type', selTypes.join(','))
    if (prixMax < prixPlafond) params.set('prixMax', String(prixMax))
    if (enStock) params.set('stock', inclureReappro ? 'reappro' : '1')
    if (tri !== 'nouveautes') params.set('tri', tri)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [selCouleurs, selMatieres, selTypes, prixMax, enStock, inclureReappro, tri, pathname, prixPlafond, router])

  const bascule = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])

  const resultats = useMemo(() => {
    const r = produits.filter((p) => {
      if (selTypes.length && !(p.type && selTypes.includes(p.type))) return false
      if (selCouleurs.length && !p.variantes.some((v) => selCouleurs.includes(v.couleur))) return false
      if (selMatieres.length && !p.variantes.some((v) => v.matiere && selMatieres.includes(v.matiere))) return false
      if (!p.variantes.some((v) => (v.promo ?? v.prix ?? Infinity) <= prixMax)) return false
      if (enStock && !p.variantes.some((v) => v.stock > 0 || (inclureReappro && v.reappro))) return false
      return true
    })
    if (tri === 'prix-asc') r.sort((a, b) => prixMini(a) - prixMini(b))
    else if (tri === 'prix-desc') r.sort((a, b) => prixMini(b) - prixMini(a))
    return r
  }, [produits, selTypes, selCouleurs, selMatieres, prixMax, enStock, inclureReappro, tri])

  const reinitialiser = () => {
    setSelCouleurs([])
    setSelMatieres([])
    setSelTypes([])
    setPrixMax(prixPlafond)
    setEnStock(false)
    setInclureReappro(false)
    setTri('nouveautes')
  }
  const nbActifs =
    selCouleurs.length + selMatieres.length + selTypes.length + (prixMax < prixPlafond ? 1 : 0) + (enStock ? 1 : 0)

  return (
    <div className="grid gap-10 md:grid-cols-[230px_1fr]">
      <aside className="space-y-8 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sv-gold">Filtres</p>
          {nbActifs > 0 && (
            <button onClick={reinitialiser} className="text-xs text-sv-mid underline hover:text-sv-gold">
              Tout effacer ({nbActifs})
            </button>
          )}
        </div>

        {/* Couleur */}
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.12em] text-sv-mid">Couleur</legend>
          <div className="flex flex-wrap gap-2">
            {couleurs.map((c) => {
              const actif = selCouleurs.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => bascule(selCouleurs, setSelCouleurs, c)}
                  aria-pressed={actif}
                  aria-label={c}
                  title={c}
                  className={`h-6 w-6 rounded-full border transition ${
                    actif ? 'border-sv-gold ring-1 ring-sv-gold ring-offset-1' : 'border-sv-border hover:scale-110'
                  }`}
                  style={{ backgroundColor: hexCouleur(c) }}
                />
              )
            })}
          </div>
        </fieldset>

        {/* Matiere */}
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.12em] text-sv-mid">Matière</legend>
          <div className="space-y-2">
            {matieres.map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={selMatieres.includes(m)} onChange={() => bascule(selMatieres, setSelMatieres, m)} className="accent-sv-gold" />
                {m}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Type */}
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.12em] text-sv-mid">Type de sac</legend>
          <div className="space-y-2">
            {types.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={selTypes.includes(t)} onChange={() => bascule(selTypes, setSelTypes, t)} className="accent-sv-gold" />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Prix */}
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.12em] text-sv-mid">Prix maximum</legend>
          <input
            type="range"
            min={0}
            max={prixPlafond}
            step={5}
            value={prixMax}
            onChange={(e) => setPrixMax(Number(e.target.value))}
            className="w-full accent-sv-gold"
          />
          <p className="mt-1 text-xs text-sv-mid">Jusqu&apos;à {formatPrix(prixMax)}</p>
        </fieldset>

        {/* Stock */}
        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.12em] text-sv-mid">Disponibilité</legend>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={enStock} onChange={(e) => setEnStock(e.target.checked)} className="accent-sv-gold" />
            En stock uniquement
          </label>
          <label className={`mt-2 flex items-center gap-2 ${enStock ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}>
            <input
              type="checkbox"
              checked={inclureReappro}
              disabled={!enStock}
              onChange={(e) => setInclureReappro(e.target.checked)}
              className="accent-sv-gold"
            />
            Inclure le réapprovisionnement
          </label>
        </fieldset>
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-sv-mid">
            {resultats.length} résultat{resultats.length > 1 ? 's' : ''}
          </p>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className="border border-sv-border bg-transparent px-3 py-2 text-sm focus:border-sv-gold focus:outline-none"
            aria-label="Trier"
          >
            <option value="nouveautes">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>

        {resultats.length === 0 ? (
          <p className="py-24 text-center text-sv-mid">
            Aucun produit ne correspond.{' '}
            <button onClick={reinitialiser} className="underline hover:text-sv-gold">
              Réinitialiser les filtres
            </button>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-3">
            {resultats.map((p) => (
              <CarteProduit key={p._id} produit={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
