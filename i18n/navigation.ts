import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** Link, redirect, usePathname, useRouter conscients de la locale. A utiliser partout a la place de next/link. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
