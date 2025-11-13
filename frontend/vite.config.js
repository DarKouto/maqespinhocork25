// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // NOVO: Secção de configuração do servidor de desenvolvimento
    proxy: {
      // 1. Redireciona chamadas para /api/ para o Flask
      '/api': 'http://127.0.0.1:5000',
      // 2. Redireciona chamadas para /contactos para o Flask (do componente Contactos.jsx)
      '/contactos': 'http://127.0.0.1:5000',
      // 3. Redireciona chamadas para /admin (login, dashboard, CRUD) para o Flask
      '/admin': 'http://127.0.0.1:5000',
    }
  }
})