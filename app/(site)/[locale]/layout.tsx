import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/panier/CartDrawer'
import { NewsletterBandeau } from '@/components/layout/NewsletterBandeau'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import '@/app/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.saravalenti.fr'),
  title: {
    default: 'Sara Valenti - Sacs en cuir italien',
    template: '%s | Sara Valenti',
  },
  description:
    'Sacs en cuir italien, fabrication italienne. Cuir brossé, suède et grainé : des modèles intemporels, du sac à main à la banane.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Sara Valenti',
    images: [
      {
        url: '/images/produits/Sac-Rita-Camel-3-scaled.jpg',
        width: 1200,
        height: 900,
        alt: 'Sac à main Rita en cuir brossé camel - Sara Valenti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sara Valenti - Sacs en cuir italien',
    description:
      'Sacs en cuir italien, fabrication italienne. Cuir brossé, suède et grainé : des modèles intemporels, du sac à main à la banane.',
    images: ['/images/produits/Sac-Rita-Camel-3-scaled.jpg'],
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <NewsletterBandeau />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
