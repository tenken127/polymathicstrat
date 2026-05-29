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
        leadReactivation: resolve(__dirname, 'pages/lead-reactivation.html'),
        reputation: resolve(__dirname, 'pages/reputation-management.html'),
        websiteOpt: resolve(__dirname, 'pages/website-optimization.html'),
        paidAds: resolve(__dirname, 'pages/paid-ads.html'),
        aiReceptionists: resolve(__dirname, 'pages/ai-receptionists.html'),
      }
    }
  },
});
