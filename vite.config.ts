import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
})
