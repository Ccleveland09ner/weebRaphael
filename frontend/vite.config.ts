import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});