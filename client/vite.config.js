import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    // Warn if any chunk exceeds 1MB
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor bundles for better caching
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  }
})
