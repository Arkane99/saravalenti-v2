import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function Footer() {
  const tNav = await getTranslations('nav')
  const t = await getTranslations('footer')

  return (
    <footer className="border-t border-sv-border bg-sv-warm-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl tracking-[0.22em] uppercase">Sara Valenti</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-sv-mid">{t('baseline')}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sv-gold-dark">{t('boutique')}</p>
          <ul className="mt-4 space-y-2 text-sm text-sv-mid">
            <li><Link href="/catalogue" className="transition-colors hover:text-sv-gold-dark">{tNav('catalogue')}</Link></li>
            <li><Link href="/gamme/rita" className="transition-colors hover:text-sv-gold-dark">{tNav('gammeRita')}</Link></li>
            <li><Link href="/gamme/grazia" className="transition-colors hover:text-sv-gold-dark">{tNav('gammeGrazia')}</Link></li>
            <li><Link href="/gamme/mina" className="transition-colors hover:text-sv-gold-dark">{tNav('gammeMina')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-sv-gold-dark">{t('informations')}</p>
          <ul className="mt-4 space-y-2 text-sm text-sv-mid">
            <li><Link href="/a-propos" className="transition-colors hover:text-sv-gold-dark">{t('aPropos')}</Link></li>
            <li><Link href="/entretien-cuir" className="transition-colors hover:text-sv-gold-dark">{t('entretienCuir')}</Link></li>
            <li><Link href="/livraison" className="transition-colors hover:text-sv-gold-dark">{t('livraison')}</Link></li>
            <li><Link href="/retours" className="transition-colors hover:text-sv-gold-dark">{t('retours')}</Link></li>
            <li><Link href="/cgv" className="transition-colors hover:text-sv-gold-dark">{t('cgv')}</Link></li>
            <li><Link href="/mentions-legales" className="transition-colors hover:text-sv-gold-dark">{t('mentionsLegales')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sv-border py-5 text-center text-xs text-sv-mid">
        &copy; {new Date().getFullYear()} {t('copyright')}
      </div>
    </footer>
  )
}
