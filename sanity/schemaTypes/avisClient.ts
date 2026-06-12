import { defineField, defineType } from 'sanity'

export const avisClient = defineType({
  name: 'avisClient',
  title: 'Avis client',
  type: 'document',
  fields: [
    defineField({ name: 'texte', title: 'Texte', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'auteur', title: 'Auteur', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'note',
      title: 'Note (1 à 5)',
      type: 'number',
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({ name: 'produit', title: 'Produit', type: 'reference', to: [{ type: 'produit' }] }),
    defineField({ name: 'date', title: 'Date', type: 'datetime' }),
    defineField({ name: 'verifie', title: 'Achat vérifié', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'auteur', subtitle: 'texte' } },
})
