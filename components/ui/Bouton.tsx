import { Link } from '@/i18n/navigation'

type Variante = 'or' | 'contour' | 'noir'

const BASE =
  'inline-flex items-center justify-center rounded-[2px] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] transition-colors duration-200'

const STYLES: Record<Variante, string> = {
  or: 'bg-sv-gold text-white hover:bg-sv-gold-light',
  contour: 'border border-sv-black text-sv-black hover:bg-sv-black hover:text-sv-cream',
  noir: 'bg-sv-black text-sv-cream hover:bg-sv-gold',
}

interface Props {
  href: string
  variante?: Variante
  className?: string
  children: React.ReactNode
}

/** CTA du design system. Pour un vrai <button> (panier...), utiliser BoutonAction. */
export function Bouton({ href, variante = 'or', className = '', children }: Props) {
  return (
    <Link href={href} className={`${BASE} ${STYLES[variante]} ${className}`}>
      {children}
    </Link>
  )
}

interface ActionProps {
  onClick?: () => void
  type?: 'button' | 'submit'
  variante?: Variante
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export function BoutonAction({
  onClick,
  type = 'button',
  variante = 'or',
  disabled = false,
  className = '',
  children,
}: ActionProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE} ${STYLES[variante]} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}
