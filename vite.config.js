import { defineConfig } from 'vite';

export default defineConfig({
  base: '/polymathicstrat/',
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
  },
});
