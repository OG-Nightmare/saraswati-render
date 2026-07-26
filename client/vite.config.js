import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://saraswati-final.parikshitkapoor2.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
