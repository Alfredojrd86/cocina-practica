import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32x32.png', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: '¿Qué comemos?',
        short_name: 'Comemos',
        description: 'Comidas saludables según tu enfoque (3x1, animal-based, balanceado).',
        lang: 'es',
        theme_color: '#2F3D2E',
        background_color: '#F4EEE2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // El SW nuevo toma control de inmediato y limpia cachés viejas:
        // así los cambios se ven al reabrir, sin tener que vaciar caché a mano.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // No cachear la función de IA: siempre debe ir a la red.
        navigateFallbackDenylist: [/^\/\.netlify\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
})
