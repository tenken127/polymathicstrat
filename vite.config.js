import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
  },
});
