import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ensures relative paths for assets
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional, useful for imports
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // allows access from LAN
  },
  build: {
    outDir: 'dist', // default build folder
    sourcemap: false, // optional
  },
});
