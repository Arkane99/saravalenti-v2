'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'

interface Lien {
  href: string
  label: string
}

export function NavMobile({ liens }: { liens: Lien[] }) {
  const [ouvert, setOuvert] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOuvert(false)
  }, [pathname])

  useEffect(() => {
    if (ouvert) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [ouvert])

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        className="flex flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span className="block h-px w-5 bg-sv-black transition-all" />
        <span className="block h-px w-5 bg-sv-black transition-all" />
        <span className="block h-px w-3.5 bg-sv-black transition-all" />
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 bg-sv-black/40 md:hidden"
          aria-hidden="true"
          onClick={() => setOuvert(false)}
        />
      )}

      <nav
        id="menu-mobile"
        aria-label="Menu principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sv-cream shadow-xl transition-transform duration-300 md:hidden ${
          ouvert ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-sv-border px-6">
          <span className="font-serif text-xl tracking-[0.22em] uppercase">Sara Valenti</span>
          <button
            type="button"
            onClick={() => setOuvert(false)}
            aria-label="Fermer le menu"
            className="text-sv-mid hover:text-sv-black"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M1 1l16 16M17 1L1 17" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto py-8">
          {liens.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block px-6 py-3.5 text-sm tracking-[0.08em] text-sv-mid transition-colors hover:bg-sv-warm-white hover:text-sv-gold-dark"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
