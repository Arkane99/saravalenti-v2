import { defineField, defineType } from 'sanity'

/** Objet SEO reutilisable : meta + slugs par langue (traduction contextuelle, FR d'abord). */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'titre', title: 'Titre meta', type: 'string', validation: (r) => r.max(70) }),
    defineField({ name: 'description', title: 'Description meta', type: 'text', rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: 'og_image', title: 'Image de partage (og:image)', type: 'image' }),
    defineField({ name: 'slug_fr', title: 'Slug FR', type: 'string' }),
    defineField({ name: 'slug_en', title: 'Slug EN', type: 'string' }),
    defineField({ name: 'slug_nl', title: 'Slug NL', type: 'string' }),
    defineField({ name: 'slug_de', title: 'Slug DE', type: 'string' }),
  ],
  options: { collapsible: true, collapsed: true },
})
