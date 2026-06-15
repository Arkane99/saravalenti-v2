import { NextRequest, NextResponse } from 'next/server'

function isBrevoConfigured(): boolean {
  const key = process.env.BREVO_API_KEY ?? ''
  return key.length > 0 && !key.includes('PLACEHOLDER')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  if (!isBrevoConfigured()) {
    console.log('[newsletter mock] inscription:', email)
    return NextResponse.json({ ok: true, mock: true })
  }

  const listId = parseInt(process.env.BREVO_LIST_ID_NEWSLETTER ?? '1', 10)

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
  })

  if (!res.ok && res.status !== 204) {
    return NextResponse.json({ error: 'Erreur inscription newsletter' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
