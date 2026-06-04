import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    sourcemap: false,
    rollupOptions: {
      input: 'src/index.html',
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
})
