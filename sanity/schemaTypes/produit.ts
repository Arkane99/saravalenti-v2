import { defineArrayMember, defineField, defineType } from 'sanity'

export const MATIERES = ['Cuir brossé', 'Cuir suède', 'Cuir grainé', 'Cuir irisé']

/** Une variante = une couleur d'un modele (ex-produit "simple" WooCommerce). */
const variante = defineArrayMember({
  name: 'variante',
  title: 'Variante',
  type: 'object',
  fields: [
    defineField({ name: 'couleur', title: 'Couleur', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'matiere',
      title: 'Matière',
      type: 'string',
      options: { list: MATIERES },
    }),
    defineField({ name: 'prix', title: 'Prix (EUR)', type: 'number', validation: (r) => r.required().positive() }),
    defineField({ name: 'promo', title: 'Prix promo (EUR)', type: 'number' }),
    defineField({ name: 'stock', title: 'Stock', type: 'number', initialValue: 0 }),
    defineField({
      name: 'reappro',
      title: 'En réapprovisionnement (backorder)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'photos',
      title: 'Photos (galerie de cette couleur)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'sku', title: 'SKU (UGS)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'poids', title: 'Poids (kg)', type: 'number' }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions (cm)',
      type: 'object',
      fields: [
        defineField({ name: 'longueur', title: 'Longueur', type: 'number' }),
        defineField({ name: 'largeur', title: 'Largeur', type: 'number' }),
        defineField({ name: 'hauteur', title: 'Hauteur', type: 'number' }),
      ],
      options: { columns: 3 },
    }),
  ],
  preview: {
    select: { title: 'couleur', subtitle: 'sku', media: 'photos.0' },
  },
})

export const produit = defineType({
  name: 'produit',
  title: 'Produit',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom du modèle', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nom' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'type', title: 'Type de sac', type: 'reference', to: [{ type: 'typeDeSac' }] }),
    defineField({
      name: 'description_courte',
      title: 'Description courte (cards catalogue)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description (page produit)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'variantes',
      title: 'Variantes (couleurs)',
      type: 'array',
      of: [variante],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'produits_suggeres',
      title: 'Vous aimerez aussi',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'produit' }] }],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'est_page_gamme',
      title: 'A une page Gamme dédiée',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'gamme',
      title: 'Rattaché à la gamme (slug)',
      type: 'string',
      description: 'Slug du modèle gamme parent (ex. "grazia"). Regroupe ce produit sur la page /gamme/[slug].',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'date_creation', title: 'Date de création', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'nom', variantes: 'variantes', media: 'variantes.0.photos.0' },
    prepare({ title, variantes, media }) {
      const nb = Array.isArray(variantes) ? variantes.length : 0
      return { title, subtitle: `${nb} couleur${nb > 1 ? 's' : ''}`, media }
    },
  },
})
