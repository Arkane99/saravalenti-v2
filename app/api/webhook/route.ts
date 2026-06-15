import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { isStripeConfigured, isSupabaseConfigured } from '@/lib/supabase/helpers'
import Stripe from 'stripe'

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ received: true, mock: true })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] Signature invalide', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (isSupabaseConfigured()) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const lignes = JSON.parse(session.metadata?.lignes ?? '[]')
      const total = (session.amount_total ?? 0) / 100

      await supabase.from('commandes').upsert({
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string,
        statut: 'paye',
        total,
        sous_total: total - (parseFloat(session.metadata?.tarif_livraison ?? '0')),
        lignes,
        transporteur: session.metadata?.transporteur,
        email_client: session.customer_email,
        adresse_livraison: JSON.parse(session.metadata?.adresse ?? 'null'),
      })

      if (process.env.BREVO_API_KEY && !process.env.BREVO_API_KEY.includes('PLACEHOLDER')) {
        console.log('[brevo] TODO: envoyer email confirmation a', session.customer_email)
      }
    }
  }

  return NextResponse.json({ received: true })
}
