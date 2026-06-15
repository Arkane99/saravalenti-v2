'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function InscriptionPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)
  const [chargement, setChargement] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur('')

    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }
    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caracteres.')
      return
    }
    if (!isSupabaseConfigured()) {
      setErreur('Service d\'inscription non configure. Revenez plus tard.')
      return
    }

    setChargement(true)
    const supabase = supabaseBrowser()
    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: { emailRedirectTo: `${window.location.origin}/compte` },
    })

    if (error) {
      setErreur('Une erreur est survenue. Cet email est peut-etre deja utilise.')
      setChargement(false)
    } else {
      setSucces(true)
    }
  }

  if (succes) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="font-serif text-2xl">Verifiez votre email</p>
        <p className="mt-4 text-sv-mid">
          Un lien de confirmation a ete envoye a <strong>{email}</strong>. Cliquez dessus pour activer votre compte.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-sv-gold-dark underline-offset-2 hover:underline">
          Retour a l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-8 font-serif text-3xl">Creer un compte</h1>

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
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded border border-sv-border bg-sv-cream px-4 py-3 text-sm outline-none focus:border-sv-black"
            placeholder="8 caracteres minimum"
          />
        </div>

        <div>
          <label htmlFor="confirmation" className="mb-1.5 block text-sm font-medium">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmation"
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
            autoComplete="new-password"
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
          {chargement ? 'Creation...' : 'Creer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-sv-mid">
        Deja un compte ?{' '}
        <Link href="/compte/connexion" className="font-medium text-sv-black underline-offset-2 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
