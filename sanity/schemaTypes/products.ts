import { defineField, defineType } from 'sanity'

// This fils is used to define the Sanity schema for products

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
            name: 'brand',
            title: 'Brand',
            type: 'string',
            validation: (r) => r.required(),
        }),

        defineField({
            name: 'condition',
            title: 'Condition',
            type: 'string',
            validation: (r) => r.required(),
        }),

        defineField({
            name: 'size',
            title: 'Size',
            type: 'number',
            validation: (r) => r.required().min(0),
        }),

        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (r) => r.required().min(0),
        }),

        defineField({
            name: 'hide',
            title: 'Hide',
            type: 'boolean',
            initialValue: false,
            description: 'Set true to hide this item from the storefront',
        }),

        defineField({
            name: 'sold',
            title: 'Sold',
            type: 'boolean',
            initialValue: false,
            description: 'Set as sold on the website',
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
