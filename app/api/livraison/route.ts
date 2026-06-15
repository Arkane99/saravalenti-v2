import { NextResponse } from 'next/server'

export interface OptionLivraison {
  id: string
  transporteur: string
  service: string
  delai: string
  prix: number
}

/**
 * Retourne les options de livraison.
 * En production, ce endpoint appellera l'API Boxtal avec les dimensions et poids du colis.
 * Pour l'instant : mock avec tarifs fixes.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code_postal, poids = 0.5 } = body as { code_postal?: string; poids?: number }

    const optionsMock: OptionLivraison[] = [
      {
        id: 'colissimo',
        transporteur: 'La Poste',
        service: 'Colissimo',
        delai: '2 a 5 jours ouvres',
        prix: poids > 0.5 ? 6.99 : 5.49,
      },
      {
        id: 'mondial_relay',
        transporteur: 'Mondial Relay',
        service: 'Point Relais',
        delai: '3 a 5 jours ouvres',
        prix: 3.99,
      },
      {
        id: 'chronopost',
        transporteur: 'Chronopost',
        service: 'Chronopost 1 jour',
        delai: '1 jour ouvre',
        prix: 9.99,
      },
    ]

    return NextResponse.json({ options: optionsMock, mock: true })
  } catch {
    return NextResponse.json({ error: 'Erreur livraison' }, { status: 500 })
  }
}
