import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Bouton } from '@/components/ui/Bouton'

/** Home placeholder : la vraie homepage editoriale arrive en phase 5c. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-sv-gold">Fabrication italienne</p>
      <h1 className="mt-6 text-5xl leading-tight md:text-6xl">{t('heroTitre')}</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-sv-mid">{t('heroAccroche')}</p>
      <Bouton href="/catalogue" className="mt-10">{t('heroCta')}</Bouton>
    </section>
  )
}
