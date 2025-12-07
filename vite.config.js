import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@tools': '/src/tools',
      '@pages': '/src/pages',
      '@data': '/src/data',
      '@hooks': '/src/hooks',
      '@context': '/src/context'
    }
  }
})
