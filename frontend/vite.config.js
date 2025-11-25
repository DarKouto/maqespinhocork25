// frontend/vite.config.js - Corrigido

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    proxy: {
      // Apenas encaminhamos o PONTO DE ENTRADA DA API. 
      // Todas as chamadas do frontend devem usar API_URL/rota.
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    }
  }
})