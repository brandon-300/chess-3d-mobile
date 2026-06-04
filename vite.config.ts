import { defineConfig } from 'vite'

export default defineConfig({
  // root: 'src', // Remove or comment out this line
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
