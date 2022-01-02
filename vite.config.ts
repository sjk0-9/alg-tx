import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      path: 'path-browserify',
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          polyfill: ['./src/polyfill.ts'],
          vendor: ['react', 'react-router-dom', 'react-dom'],
          algosdk: ['algosdk']
        }
      }
    },
    sourcemap: 'inline',
  }

})
