const FMT_EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatPrix(n?: number | null): string {
  if (n == null || !Number.isFinite(n)) return ''
  return FMT_EUR.format(n)
}
