import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      redirect('/compte/connexion')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Sidebar */}
        <aside>
          <nav aria-label="Navigation compte">
            <ul className="space-y-1 text-sm">
              {[
                { href: '/compte', label: 'Mon compte' },
                { href: '/compte/commandes', label: 'Mes commandes' },
                { href: '/compte/favoris', label: 'Mes favoris' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded px-3 py-2 text-sv-mid transition-colors hover:bg-sv-warm-white hover:text-sv-black"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Contenu */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}
