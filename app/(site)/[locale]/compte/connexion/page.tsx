'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function ConnexionPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur('')

    if (!isSupabaseConfigured()) {
      setErreur('Service d\'authentification non configure. Revenez plus tard.')
      return
    }

    setChargement(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })

    if (error) {
      setErreur(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : 'Une erreur est survenue. Veuillez reessayer.'
      )
      setChargement(false)
    } else {
      router.push('/compte')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-8 font-serif text-3xl">Se connecter</h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-sv-border bg-sv-cream px-4 py-3 text-sm outline-none focus:border-sv-black"
            placeholder="votre@email.fr"
          />
        </div>

        <div>
          <label htmlFor="motDePasse" className="mb-1.5 block text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="motDePasse"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded border border-sv-border bg-sv-cream px-4 py-3 text-sm outline-none focus:border-sv-black"
          />
        </div>

        {erreur && (
          <p role="alert" className="text-sm text-red-700">
            {erreur}
          </p>
        )}

        <button
          type="submit"
          disabled={chargement}
          className="w-full rounded bg-sv-black py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black disabled:opacity-50"
        >
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-sv-mid">
        Pas encore de compte ?{' '}
        <Link href="/compte/inscription" className="font-medium text-sv-black underline-offset-2 hover:underline">
          Creer un compte
        </Link>
      </p>
    </div>
  )
}
