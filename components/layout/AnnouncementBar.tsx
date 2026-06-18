const TEXTE =
  'Livraison offerte dès 45 EUR · 100% cuir véritable · Fabrication italienne · Retours sous 14 jours'

export function AnnouncementBar() {
  return (
    <div className="h-8 overflow-hidden bg-sv-black" aria-label="Informations livraison">
      <div className="animate-marquee h-full items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="shrink-0 px-12 font-sans text-xs uppercase tracking-widest text-white"
          >
            {TEXTE}
          </span>
        ))}
      </div>
    </div>
  )
}
