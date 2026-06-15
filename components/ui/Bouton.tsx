import { Link } from '@/i18n/navigation'

type Variante = 'or' | 'contour' | 'noir'

const BASE =
  'inline-flex items-center justify-center rounded-[2px] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] transition-colors duration-200'

// Texte fonce sur les fonds gold (contraste AA : noir sur #b8935a = 6.9:1, blanc echouait a 2.85:1).
const STYLES: Record<Variante, string> = {
  or: 'bg-sv-gold text-sv-black hover:bg-sv-gold-light',
  contour: 'border border-sv-black text-sv-black hover:bg-sv-black hover:text-sv-cream',
  noir: 'bg-sv-black text-sv-cream hover:bg-sv-gold hover:text-sv-black',
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
  'aria-pressed'?: boolean
  'aria-label'?: string
  children: React.ReactNode
}

export function BoutonAction({
  onClick,
  type = 'button',
  variante = 'or',
  disabled = false,
  className = '',
  'aria-pressed': ariapressed,
  'aria-label': arialabel,
  children,
}: ActionProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ariapressed}
      aria-label={arialabel}
      className={`${BASE} ${STYLES[variante]} disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}
