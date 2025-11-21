import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Permite probar la instalación en desarrollo
      },
      manifest: {
        name: 'Power Service Manager',
        short_name: 'PowerService',
        description: 'Herramienta de mejora continua John Deere',
        theme_color: '#367C2B', // Verde JD
        background_color: '#F3F4F6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/5968/5968260.png', // Icono temporal (engranaje)
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/5968/5968260.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})