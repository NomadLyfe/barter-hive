import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
   proxy: {
    '/api': {
      target: 'http://localhost:8000',
      // target: 'https://b93b-136-55-63-220.ngrok-free.app/',
      changeOrigin: true
    },
   },
  }
})
