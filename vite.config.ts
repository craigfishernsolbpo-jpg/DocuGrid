import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Safely replace API_KEY with the string value.
      // Priority: Vercel System Env > Local .env > Empty String
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || ''),
      
      // Polyfill `process.env` to prevent crashes in libraries that access it directly
      'process.env': JSON.stringify({}),
    },
    build: {
      outDir: 'dist',
    }
  };
});