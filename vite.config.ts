import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Safely replace API_KEY with the string value or empty string to prevent build errors
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ''),
      // Defines a polyfill for process.env for libraries that rely on it
      'process.env': {},
    },
    build: {
      outDir: 'dist',
    }
  };
});