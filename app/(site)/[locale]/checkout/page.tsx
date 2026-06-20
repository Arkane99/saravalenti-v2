'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePanier, totalPanier } from '@/lib/store/panier'
import { formatPrix } from '@/lib/format'
import type { OptionLivraison } from '@/app/api/livraison/route'

interface AdresseForm {
  prenom: string
  nom: string
  email: string
  telephone: string
  rue: string
  complement: string
  code_postal: string
  ville: string
  pays: string
}

const ADRESSE_INITIALE: AdresseForm = {
  prenom: '', nom: '', email: '', telephone: '',
  rue: '', complement: '', code_postal: '', ville: '', pays: 'FR',
}

export default function CheckoutPage() {
  const { lignes, viderPanier } = usePanier()
  const router = useRouter()
  const [adresse, setAdresse] = useState<AdresseForm>(ADRESSE_INITIALE)
  const [options, setOptions] = useState<OptionLivraison[]>([])
  const [livraisonId, setLivraisonId] = useState<string>('')
  const [etape, setEtape] = useState<'adresse' | 'livraison' | 'paiement'>('adresse')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  const sousTotal = totalPanier(lignes)
  const livraisonChoisie = options.find((o) => o.id === livraisonId)
  const total = sousTotal + (livraisonChoisie?.prix ?? 0)

  if (lignes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="font-serif text-2xl">Votre panier est vide</p>
        <a href="/catalogue" className="mt-6 inline-block text-sm text-sv-gold-dark underline-offset-2 hover:underline">
          Retour au catalogue
        </a>
      </div>
    )
  }

  function champ(
    id: keyof AdresseForm,
    label: string,
    opts?: { type?: string; autoComplete?: string; required?: boolean; placeholder?: string }
  ) {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}{(opts?.required !== false) && <span className="text-red-600"> *</span>}
        </label>
        <input
          id={id}
          type={opts?.type ?? 'text'}
          value={adresse[id]}
          onChange={(e) => setAdresse((a) => ({ ...a, [id]: e.target.value }))}
          required={opts?.required !== false}
          autoComplete={opts?.autoComplete}
          placeholder={opts?.placeholder}
          className="w-full rounded border border-sv-border bg-sv-cream px-4 py-3 text-sm outline-none focus:border-sv-black"
        />
      </div>
    )
  }

  async function validerAdresse(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)
    setErreur('')
    try {
      const r = await fetch('/api/livraison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_postal: adresse.code_postal }),
      })
      const data = await r.json()
      setOptions(data.options ?? [])
      if (data.options?.length) setLivraisonId(data.options[0].id)
      setEtape('livraison')
    } catch {
      setErreur('Impossible de calculer les frais de livraison.')
    }
    setChargement(false)
  }

  async function validerLivraison(e: React.FormEvent) {
    e.preventDefault()
    if (!livraisonId) return
    setEtape('paiement')
  }

  async function lancerPaiement(e: React.FormEvent) {
    e.preventDefault()
    if (!livraisonChoisie) return
    setChargement(true)
    setErreur('')

    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lignes, adresse, livraison: livraisonChoisie }),
      })
      const data = await r.json()
      if (data.url) {
        if (data.mock) {
          viderPanier()
          router.push(data.url)
        } else {
          window.location.href = data.url
        }
      } else {
        setErreur('Erreur lors du paiement. Veuillez réessayer.')
      }
    } catch {
      setErreur('Erreur réseau. Veuillez réessayer.')
    }
    setChargement(false)
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 font-serif text-4xl">Paiement</h1>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-8">
          {/* Etape 1 : Adresse */}
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-serif text-xl">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${etape === 'adresse' ? 'bg-sv-black text-sv-cream' : 'bg-sv-border text-sv-mid'}`}>1</span>
              Adresse de livraison
            </h2>

            {etape === 'adresse' ? (
              <form onSubmit={validerAdresse} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {champ('prenom', 'Prénom', { autoComplete: 'given-name' })}
                  {champ('nom', 'Nom', { autoComplete: 'family-name' })}
                </div>
                {champ('email', 'Email', { type: 'email', autoComplete: 'email' })}
                {champ('telephone', 'Téléphone', { type: 'tel', autoComplete: 'tel', required: false })}
                {champ('rue', 'Adresse', { autoComplete: 'street-address' })}
                {champ('complement', 'Complément (bâtiment, étage...)', { required: false })}
                <div className="grid gap-4 sm:grid-cols-2">
                  {champ('code_postal', 'Code postal', { autoComplete: 'postal-code' })}
                  {champ('ville', 'Ville', { autoComplete: 'address-level2' })}
                </div>

                {erreur && <p role="alert" className="text-sm text-red-700">{erreur}</p>}

                <button
                  type="submit"
                  disabled={chargement}
                  className="rounded bg-sv-black px-8 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black disabled:opacity-50"
                >
                  {chargement ? 'Calcul...' : 'Continuer vers la livraison'}
                </button>
              </form>
            ) : (
              <div className="rounded border border-sv-border bg-sv-warm-white p-4 text-sm">
                <p className="font-medium">{adresse.prenom} {adresse.nom}</p>
                <p className="mt-1 text-sv-mid">{adresse.rue}{adresse.complement ? `, ${adresse.complement}` : ''}</p>
                <p className="text-sv-mid">{adresse.code_postal} {adresse.ville}</p>
                <button type="button" onClick={() => setEtape('adresse')} className="mt-2 text-xs text-sv-gold-dark underline-offset-2 hover:underline">
                  Modifier
                </button>
              </div>
            )}
          </section>

          {/* Etape 2 : Livraison */}
          {(etape === 'livraison' || etape === 'paiement') && (
            <section>
              <h2 className="mb-6 flex items-center gap-3 font-serif text-xl">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${etape === 'livraison' ? 'bg-sv-black text-sv-cream' : 'bg-sv-border text-sv-mid'}`}>2</span>
                Mode de livraison
              </h2>

              {etape === 'livraison' ? (
                <form onSubmit={validerLivraison} className="space-y-4">
                  <fieldset>
                    <legend className="sr-only">Choisir un mode de livraison</legend>
                    <div className="space-y-3">
                      {options.map((o) => (
                        <label
                          key={o.id}
                          className={`flex cursor-pointer items-center justify-between rounded border p-4 ${livraisonId === o.id ? 'border-sv-black bg-sv-warm-white' : 'border-sv-border'}`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="livraison"
                              value={o.id}
                              checked={livraisonId === o.id}
                              onChange={() => setLivraisonId(o.id)}
                              className="accent-sv-black"
                            />
                            <div>
                              <p className="text-sm font-medium">{o.service}</p>
                              <p className="text-xs text-sv-mid">{o.transporteur} · {o.delai}</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium">{formatPrix(o.prix)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={!livraisonId}
                    className="rounded bg-sv-black px-8 py-3 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black disabled:opacity-50"
                  >
                    Continuer vers le paiement
                  </button>
                </form>
              ) : (
                <div className="rounded border border-sv-border bg-sv-warm-white p-4 text-sm">
                  <p className="font-medium">{livraisonChoisie?.service}</p>
                  <p className="text-sv-mid">{formatPrix(livraisonChoisie?.prix ?? 0)}</p>
                  <button type="button" onClick={() => setEtape('livraison')} className="mt-2 text-xs text-sv-gold-dark underline-offset-2 hover:underline">
                    Modifier
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Etape 3 : Paiement */}
          {etape === 'paiement' && (
            <section>
              <h2 className="mb-6 flex items-center gap-3 font-serif text-xl">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sv-black text-sm text-sv-cream">3</span>
                Paiement
              </h2>

              <div className="rounded border border-sv-border bg-sv-warm-white p-5 text-sm text-sv-mid">
                <p>Vous allez être redirigé vers Stripe pour effectuer le paiement en toute sécurité.</p>
                <p className="mt-2">Cartes acceptées : Visa, Mastercard, American Express.</p>
              </div>

              {erreur && <p role="alert" className="mt-4 text-sm text-red-700">{erreur}</p>}

              <form onSubmit={lancerPaiement} className="mt-4">
                <button
                  type="submit"
                  disabled={chargement}
                  className="w-full rounded bg-sv-black py-4 text-sm font-medium text-sv-cream transition-colors hover:bg-sv-gold hover:text-sv-black disabled:opacity-50"
                >
                  {chargement ? 'Redirection...' : `Payer ${formatPrix(total)}`}
                </button>
              </form>
            </section>
          )}
        </div>

        {/* Recapitulatif commande */}
        <aside className="self-start rounded border border-sv-border bg-sv-warm-white p-6">
          <h2 className="mb-5 font-serif text-xl">Votre commande</h2>
          <ul className="divide-y divide-sv-border text-sm">
            {lignes.map((l) => (
              <li key={l.sku} className="flex justify-between gap-2 py-3">
                <span className="text-sv-mid">
                  {l.nom} {l.couleur} <span className="font-medium text-sv-black">x{l.quantite}</span>
                </span>
                <span className="shrink-0">{formatPrix(l.prix * l.quantite)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-sv-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-sv-mid">Sous-total</span>
              <span>{formatPrix(sousTotal)}</span>
            </div>
            {livraisonChoisie && (
              <div className="flex justify-between">
                <span className="text-sv-mid">Livraison</span>
                <span>{formatPrix(livraisonChoisie.prix)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-sv-border pt-2 font-medium">
              <span>Total</span>
              <span>{formatPrix(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
