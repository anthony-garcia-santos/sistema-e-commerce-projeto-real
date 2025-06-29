import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    command === 'serve' && basicSsl()
  ].filter(Boolean),
  optimizeDeps: {
    include: ['@stripe/react-stripe-js', '@stripe/stripe-js']
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    https: false
  }
}))
