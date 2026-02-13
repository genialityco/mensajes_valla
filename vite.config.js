import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    // Asegurar que los archivos JSON se copien correctamente con UTF-8
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        send: resolve(__dirname, 'send.html'),
        qr: resolve(__dirname, 'qr-generator.html'),
        test: resolve(__dirname, 'test-firebase.html'),
      },
      output: {
        // Asegurar que los archivos de fuentes mantengan su estructura
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.json') && assetInfo.name.includes('Cinzel')) {
            return 'fonts/Cinzel/[name][extname]';
          }
          if (assetInfo.name.endsWith('.png') && assetInfo.name.includes('Cinzel')) {
            return 'fonts/Cinzel/[name][extname]';
          }
          if (assetInfo.name.endsWith('.ttf')) {
            return 'fonts/Cinzel/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
});
