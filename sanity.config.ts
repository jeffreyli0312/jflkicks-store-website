import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schema } from "./sanity/schemaTypes"

export default defineConfig({
  name: "default",
  title: "JFLKicks Studio",

  projectId: "9nvm022s",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema,
})
