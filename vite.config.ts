import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, '.'),
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
})
