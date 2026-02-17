import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/start': 'http://localhost:5000',
      '/step': 'http://localhost:5000',
      '/reset': 'http://localhost:5000',
      '/update_workload': 'http://localhost:5000',
      '/set_policy': 'http://localhost:5000',
      '/inject_spike': 'http://localhost:5000',
    }
  }
})
