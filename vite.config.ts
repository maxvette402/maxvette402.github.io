import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Automatically find all HTML entry points in the project root
const htmlEntries = Object.fromEntries(
  readdirSync(__dirname)
    .filter(file => file.endsWith('.html'))
    .map(file => [file.replace('.html', ''), resolve(__dirname, file)])
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: htmlEntries,
    },
  },
})
