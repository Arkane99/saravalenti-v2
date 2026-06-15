import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { BoutonPanier } from './BoutonPanier'

/**
 * Header global : logo, navigation, compte + panier.
 * Le selecteur de langue arrivera quand EN/NL/DE seront activees (i18n/routing.ts).
 */
export async function Header() {
  const t = await getTranslations('nav')

  const liens = [
    { href: '/catalogue', label: t('catalogue') },
    { href: '/gamme/rita', label: t('gammeRita') },
    { href: '/gamme/grazia', label: t('gammeGrazia') },
    { href: '/a-propos', label: t('aPropos') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-sv-border bg-sv-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo typographique */}
        <Link href="/" className="font-serif text-2xl tracking-[0.22em] uppercase">
          Sara Valenti
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-10 md:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-[0.08em] text-sv-mid transition-colors hover:text-sv-gold-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions : compte + panier (placeholders fonctionnels en 5d) */}
        <div className="flex items-center gap-5">
          <Link href="/compte" aria-label={t('compte')} className="text-sv-black transition-colors hover:text-sv-gold-dark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <BoutonPanier />
        </div>
      </div>
    </header>
  )
}
