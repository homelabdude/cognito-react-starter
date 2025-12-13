import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin('all')
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  },
  define: {
    'process.env': {}
  }
})