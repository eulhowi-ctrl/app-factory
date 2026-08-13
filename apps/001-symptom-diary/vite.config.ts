import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Symptomly',
        short_name: 'Symptomly',
        description: 'Symptom & medication diary for chronic illness — export a clear summary for your doctor.',
        display: 'standalone',
        start_url: '/',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
  },
})
