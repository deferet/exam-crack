import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: true,         // nasłuchuj na 0.0.0.0 wewnątrz kontenera
    port: 5173,
    strictPort: true,
    proxy: {
      // wszystkie /v1/* będą przekierowane do backendu
      '/v1': {
        target: 'http://backend:4000',
        changeOrigin: true,
        secure: false,    // nie sprawdzaj certyfikatu
        rewrite: (path) => path.replace(/^\/v1/, '/v1'),
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  },
})
