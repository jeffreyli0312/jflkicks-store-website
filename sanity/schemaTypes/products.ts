import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),

    defineField({
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
            {
            type: 'image',
            options: { hotspot: true },
            },
        ],
        validation: (r) => r.required().min(1),
    }),


    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (r) => r.required(),
    }),
  ],
})
