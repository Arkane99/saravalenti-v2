'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LignePanier {
  slug: string
  nom: string
  couleur: string
  sku: string
  prix: number
  quantite: number
  photoUrl?: string
}

interface PanierStore {
  lignes: LignePanier[]
  ouvert: boolean
  ajouterAuPanier: (item: Omit<LignePanier, 'quantite'> & { quantite?: number }) => void
  retirerDuPanier: (sku: string) => void
  changerQuantite: (sku: string, q: number) => void
  viderPanier: () => void
  setOuvert: (v: boolean) => void
}

export const usePanier = create<PanierStore>()(
  persist(
    (set) => ({
      lignes: [],
      ouvert: false,
      ajouterAuPanier: (item) =>
        set((state) => {
          const existant = state.lignes.find((l) => l.sku === item.sku)
          if (existant) {
            return {
              lignes: state.lignes.map((l) =>
                l.sku === item.sku
                  ? { ...l, quantite: l.quantite + (item.quantite ?? 1) }
                  : l
              ),
              ouvert: true,
            }
          }
          return {
            lignes: [...state.lignes, { ...item, quantite: item.quantite ?? 1 }],
            ouvert: true,
          }
        }),
      retirerDuPanier: (sku) =>
        set((state) => ({ lignes: state.lignes.filter((l) => l.sku !== sku) })),
      changerQuantite: (sku, q) =>
        set((state) => ({
          lignes:
            q <= 0
              ? state.lignes.filter((l) => l.sku !== sku)
              : state.lignes.map((l) => (l.sku === sku ? { ...l, quantite: q } : l)),
        })),
      viderPanier: () => set({ lignes: [] }),
      setOuvert: (v) => set({ ouvert: v }),
    }),
    {
      name: 'sara-valenti-panier',
      version: 1,
    }
  )
)

export function totalPanier(lignes: LignePanier[]): number {
  return lignes.reduce((sum, l) => sum + l.prix * l.quantite, 0)
}

export function nombreArticles(lignes: LignePanier[]): number {
  return lignes.reduce((sum, l) => sum + l.quantite, 0)
}
