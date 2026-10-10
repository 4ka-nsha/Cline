import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// KrishiFlow web dev server.
// Port 5173 serves the React app; /api is proxied to the Express backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});

