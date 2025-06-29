import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    command === 'serve' && basicSsl()  // só no dev
  ].filter(Boolean),
  server: {
    host: true,
    port: 5173,
    open: true,
    https: false
  }
}))
