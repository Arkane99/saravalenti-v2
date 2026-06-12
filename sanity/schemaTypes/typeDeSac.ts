import { defineField, defineType } from 'sanity'

export const typeDeSac = defineType({
  name: 'typeDeSac',
  title: 'Type de sac',
  type: 'document',
  fields: [
    defineField({ name: 'nom', title: 'Nom', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nom' },
      validation: (r) => r.required(),
    }),
  ],
})
