import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {product} from './sanity/schemaTypes/products'

// We’ll add the actual product schema file.
const schemaTypes = [product]

export default defineConfig({
  name: 'default',
  title: 'JFLKicks Studio',

  projectId: "9nvm022s",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
