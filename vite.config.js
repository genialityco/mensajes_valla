import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        send: resolve(__dirname, 'send.html'),
        qr: resolve(__dirname, 'qr-generator.html'),
        test: resolve(__dirname, 'test-firebase.html'),
      },
    },
  },
});
