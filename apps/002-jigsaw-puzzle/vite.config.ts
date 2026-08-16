import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// 앱마다 수정할 것: manifest의 name/short_name/description/theme_color
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jigsaw Puzzle',
        short_name: 'Jigsaw',
        description: 'A relaxing jigsaw puzzle game with real interlocking pieces.',
        display: 'standalone',
        start_url: '/',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
  },
})
