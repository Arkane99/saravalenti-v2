import { NextResponse } from 'next/server'
import { isStripeConfigured } from '@/lib/supabase/helpers'
import { stripe } from '@/lib/stripe'
import { formatPrix } from '@/lib/format'

interface LigneCommande {
  slug: string
  nom: string
  couleur: string
  sku: string
  prix: number
  quantite: number
  photoUrl?: string
}

interface CorpsCheckout {
  lignes: LigneCommande[]
  adresse: {
    nom: string
    prenom: string
    rue: string
    complement?: string
    code_postal: string
    ville: string
    pays: string
    telephone?: string
    email: string
  }
  livraison: {
    id: string
    transporteur: string
    service: string
    prix: number
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CorpsCheckout
    const { lignes, adresse, livraison } = body

    if (!lignes?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const sousTotal = lignes.reduce((s, l) => s + l.prix * l.quantite, 0)
    const total = sousTotal + livraison.prix

    if (!isStripeConfigured()) {
      return NextResponse.json({
        url: `${siteUrl}/checkout/confirmation?mock=true&total=${total.toFixed(2)}&transporteur=${encodeURIComponent(livraison.service)}`,
        mock: true,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      line_items: [
        ...lignes.map((l) => ({
          quantity: l.quantite,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(l.prix * 100),
            product_data: {
              name: `${l.nom} - ${l.couleur}`,
              metadata: { sku: l.sku ?? '', slug: l.slug },
              ...(l.photoUrl ? { images: [l.photoUrl] } : {}),
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(livraison.prix * 100),
            product_data: { name: `Livraison - ${livraison.service}` },
          },
        },
      ],
      customer_email: adresse.email,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'NL', 'DE'] },
      metadata: {
        lignes: JSON.stringify(lignes),
        transporteur: livraison.service,
        adresse: JSON.stringify(adresse),
      },
      success_url: `${siteUrl}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
