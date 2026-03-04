import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // ─── Dev server — your existing proxy preserved exactly ──────────
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // ✅ No rewrite — /api/auth/login stays /api/auth/login when hitting Express
      }
    }
  },

  // ─── Build optimisations for Lighthouse Performance score ────────
  build: {
    // Target modern browsers → smaller output, no legacy polyfills
    target: 'es2020',

    // Warn only if a chunk exceeds 600 kB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libs into separate cacheable chunks.
        // Deploying a new feature won't bust the React or Leaflet cache.
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-map':    ['leaflet', 'react-leaflet'],
          'vendor-socket': ['socket.io-client'],
          'vendor-icons':  ['lucide-react'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
});
