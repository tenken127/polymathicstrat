import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        strategies: resolve(__dirname, 'strategies.html'),
      }
    }
  },
});
