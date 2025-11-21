import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  // ДОБАВЬ ЭТО ДЛЯ VERCEL
  base: './',
  build: {
    outDir: 'dist'
  }
})