import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/lp/', // Adjust base if deploying in a subfolder
  build: {
    // Minimize output
    minify: 'terser', // Use Terser for better JS minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
    // Split code into smaller chunks (for better caching and lazy loading)
    chunkSizeWarningLimit: 500, // Increase chunk size limit (in KB)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split vendor libraries into their own chunk
        },
      },
    },
  },
});
