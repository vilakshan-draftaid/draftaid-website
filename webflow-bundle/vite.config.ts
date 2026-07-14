import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Library build: one self-contained IIFE that registers <draftaid-button>.
// React + all styles are bundled in so a single <script> tag works in Webflow.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Library mode doesn't replace this by default, so bundled React would hit
  // an undefined `process` at runtime. Pin it to production.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      name: "DraftaidUI",
      formats: ["iife"],
      fileName: () => "draftaid-ui.js",
    },
  },
})
