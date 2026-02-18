import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                // ✅ REMOVED rewrite: (path) => path.replace(/^\/api/, '')
                // This ensures /api/auth/login stays /api/auth/login when hitting Express
            }
        }
    }
});
