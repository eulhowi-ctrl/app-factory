import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tasbih Counter — No Ads Dhikr Counter',
        short_name: 'Tasbih',
        description: 'Ad-free digital tasbih for dhikr. Big tap counter, after-salah tasbih, history and streaks. Works offline, no tracking.',
        display: 'standalone',
        start_url: '/',
        theme_color: '#0f5c4d',
        background_color: '#0f5c4d',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
  },
})
