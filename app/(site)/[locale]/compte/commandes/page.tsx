import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { supabaseServer } from '@/lib/supabase/server'
import { formatPrix } from '@/lib/format'

export const metadata: Metadata = { title: 'Mes commandes - Sara Valenti' }

interface Commande {
  id: string
  created_at: string
  statut: string
  total: number
  lignes: Array<{ nom: string; couleur: string; quantite: number; prix: number }>
  transporteur?: string
}

const LIBELLE_STATUT: Record<string, string> = {
  en_attente: 'En attente',
  paye: 'Paye',
  expedition: 'En cours d\'expedition',
  livre: 'Livre',
  annule: 'Annule',
  rembourse: 'Rembourse',
}

export default async function CommandesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  let commandes: Commande[] = []

  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer()
    const { data } = await supabase
      .from('commandes')
      .select('id, created_at, statut, total, lignes, transporteur')
      .order('created_at', { ascending: false })
    commandes = (data as Commande[]) ?? []
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Mes commandes</h1>

      {!isSupabaseConfigured() && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Mode demonstration -- Supabase non configure. Les commandes reelles apparaitront ici.
        </div>
      )}

      {commandes.length === 0 ? (
        <div className="rounded border border-sv-border bg-sv-warm-white p-10 text-center">
          <p className="text-sv-mid">Vous n'avez pas encore passe de commande.</p>
          <Link
            href="/catalogue"
            className="mt-6 inline-block text-sm font-medium text-sv-gold-dark underline-offset-2 hover:underline"
          >
            Decouvrir la collection
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {commandes.map((c) => (
            <li key={c.id} className="rounded border border-sv-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-sv-mid">
                    Commande du{' '}
                    {new Date(c.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="mt-0.5 font-medium">{formatPrix(c.total)}</p>
                </div>
                <span className="rounded bg-sv-warm-white px-3 py-1 text-xs">
                  {LIBELLE_STATUT[c.statut] ?? c.statut}
                </span>
              </div>

              {c.lignes.length > 0 && (
                <ul className="mt-4 divide-y divide-sv-border">
                  {c.lignes.map((l, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm text-sv-mid">
                      <span>
                        {l.nom} {l.couleur} x{l.quantite}
                      </span>
                      <span>{formatPrix(l.prix * l.quantite)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {c.transporteur && (
                <p className="mt-3 text-xs text-sv-mid">Transporteur : {c.transporteur}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
