import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'

export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer()
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
}
