import { defineField, defineType } from 'sanity'

/** Page editoriale d'une gamme (Rita, Grazia...) : SEO longue traine. */
export const pageGamme = defineType({
  name: 'pageGamme',
  title: 'Page Gamme',
  type: 'document',
  fields: [
    defineField({
      name: 'modele',
      title: 'Modèle',
      type: 'reference',
      to: [{ type: 'produit' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'titre', title: 'Titre', type: 'string' }),
        defineField({ name: 'accroche', title: 'Accroche', type: 'text', rows: 2 }),
        defineField({ name: 'photo_hero', title: 'Photo hero', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Contenu éditorial',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'variantes_en_bas',
      title: 'Afficher les couleurs en bas de page',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'hero.titre', media: 'hero.photo_hero' } },
})

export const pageCatalog = defineType({
  name: 'pageCatalog',
  title: 'Page Catalogue',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
})

/** About, CGV, mentions legales, livraison, retours... */
export const pageStatique = defineType({
  name: 'pageStatique',
  title: 'Page statique',
  type: 'document',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titre' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'contenu',
      title: 'Contenu',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
})
