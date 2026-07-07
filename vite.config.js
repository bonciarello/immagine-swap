import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4601', 10),
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4601', 10),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
});
