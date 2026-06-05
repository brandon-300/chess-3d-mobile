import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Source files are in src/
  root: 'src',

  build: {
    // Output to dist/ (relative to project root)
    outDir: '../dist',
    emptyOutDir: true,

    // Multi-page: all HTML files are entry points
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/user_login.html'),
        profile: resolve(__dirname, 'src/profile.html'),
        forgot: resolve(__dirname, 'src/forgot_password.html'),
        reset: resolve(__dirname, 'src/reset_password.html'),
      },
      output: {
        // Keep the HTML file names, don't hash them
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },

    // Increase chunk size warning limit (Three.js is ~600KB)
    chunkSizeWarningLimit: 1200,
  },

  server: {
    port: 3000,
  },

  // Bundle these instead of loading from CDN
  resolve: {
    alias: {
      // No aliases needed — Three.js and Supabase come from npm
    },
  },

  // Optimize deps for dev server
  optimizeDeps: {
    include: ['three', '@supabase/supabase-js'],
  },

  // Define global constants
  define: {
    // Capacitor uses import.meta.env, not process.env
    'process.env': {},
  },
});