/** Root layout du groupe (studio) : hors i18n, hors design system du site. */
export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
