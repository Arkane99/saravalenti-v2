import { defineRouting } from 'next-intl/routing'

/**
 * FR seul actif pour l'instant (regle projet : FR parfait avant les autres).
 * Pour activer EN/NL/DE : ajouter la locale ici + creer messages/<locale>.json.
 * 'as-needed' : le FR vit sur les URLs nues (/catalogue), les autres seront prefixees (/en/...).
 */
export const routing = defineRouting({
  locales: ['fr'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})
