import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer'; // Use rollup-plugin-visualizer directly

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotli',
      ext: '.br',
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    visualizer({
      filename: './dist/stats.html',
      open: true,
    }),
  ],
  base: '/lp/',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  server: {
    proxy: {
      '/geo': {
        target: 'https://ipapi.co/json/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo/, ''),
      },
    },
  },
});
