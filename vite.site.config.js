import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist-site',
    rollupOptions: {
      input: {
        main: './isper-site.html'
      }
    }
  },
  server: {
    port: 3001,
    open: '/isper-site.html'
  }
});