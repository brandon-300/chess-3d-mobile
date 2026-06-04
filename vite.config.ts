import { defineConfig } from 'vite';

export default defineConfig({
  // 'root' is removed so it defaults to the project root
  build: {
    // Ensuring it outputs to the 'dist' folder
    outDir: 'dist', 
    sourcemap: false,
    rollupOptions: {
      // Explicitly pointing to where index.html is actually located
      input: 'src/index.html', 
    },
  },
  server: {
    port: 3000,
  },
});
