import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/user_login.html'),
        profile: resolve(__dirname, 'src/profile.html'),
        forgot: resolve(__dirname, 'src/forgot_password.html'),
        reset: resolve(__dirname, 'src/reset_password.html'),
      },
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },

    chunkSizeWarningLimit: 1200,
  },

  server: {
    port: 3000,
  },

  resolve: {
    alias: {},
  },

  optimizeDeps: {
    include: ['three', '@supabase/supabase-js'],
  },

  define: {
    'process.env': {},
  },
});