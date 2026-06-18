import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { supabaseServer } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Mon compte - Sara Valenti' }

export default async function ComptePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  let email = 'client@demo.fr'
  let createdAt: string | null = null

  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      email = user.email ?? email
      createdAt = user.created_at ?? null
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Mon compte</h1>

      <div className="rounded border border-sv-border bg-sv-warm-white p-6">
        <p className="text-sm text-sv-mid">Connecté en tant que</p>
        <p className="mt-1 font-medium">{email}</p>
        {createdAt && (
          <p className="mt-1 text-xs text-sv-mid">
            Membre depuis le{' '}
            {new Date(createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        {!isSupabaseConfigured() && (
          <p className="mt-2 text-xs text-amber-700">Mode démonstration -- Supabase non configuré.</p>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/compte/commandes"
          className="rounded border border-sv-border p-5 transition-colors hover:border-sv-gold hover:bg-sv-warm-white"
        >
          <p className="font-medium">Mes commandes</p>
          <p className="mt-1 text-sm text-sv-mid">Suivre et consulter vos commandes</p>
        </Link>
        <Link
          href="/compte/favoris"
          className="rounded border border-sv-border p-5 transition-colors hover:border-sv-gold hover:bg-sv-warm-white"
        >
          <p className="font-medium">Mes favoris</p>
          <p className="mt-1 text-sm text-sv-mid">Les modèles que vous avez sauvegardés</p>
        </Link>
      </div>

      {isSupabaseConfigured() && (
        <form action="/api/auth/deconnexion" method="POST" className="mt-10">
          <button
            type="submit"
            className="text-sm text-sv-mid underline-offset-2 hover:text-sv-black hover:underline"
          >
            Se déconnecter
          </button>
        </form>
      )}
    </div>
  )
}
