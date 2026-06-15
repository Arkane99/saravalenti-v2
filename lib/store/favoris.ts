'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavorisStore {
  items: string[]
  toggleFavori: (key: string) => void
  estFavori: (key: string) => boolean
}

export const useFavoris = create<FavorisStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavori: (key) =>
        set((state) => ({
          items: state.items.includes(key)
            ? state.items.filter((k) => k !== key)
            : [...state.items, key],
        })),
      estFavori: (key) => get().items.includes(key),
    }),
    { name: 'sara-valenti-favoris', version: 1 }
  )
)

export function cléFavori(slug: string, couleur: string): string {
  return `${slug}:${couleur}`
}
