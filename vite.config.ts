import { defineConfig } from 'vite';

export default defineConfig({
  // Setting the root to 'src' tells Vite that index.html is located there
  root: 'src',
  build: {
    // This tells Vite where to output the build files (relative to the project root)
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      // With root set to 'src', the entry point is just 'index.html'
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
  },
});
