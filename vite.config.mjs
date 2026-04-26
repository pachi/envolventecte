import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";


// https://vitejs.dev/config/
export default defineConfig({
  // el base path del repositorio para que funcione en github pages como si estuviera en la raíz
  // del dominio debe ser '/envovlventecte/', pero para el desarrollo local debe ser '/'.
  // Establecemos la ruta para producción en el predeploy de package.json
  // Ver https://vite.dev/guide/static-deploy
  base: process.env.VITE_BASE || '/',
  resolve: {
    // which allows you to import from folders under the /src folder
    // import Button from '~/components/Button';
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // open browser on start
    open: true
    // proxy: {
    //   '/envolventecte': {
    //     target: 'http://localhost:5173/',
    //     // changeOrigin: true,
    //     // secure: false,
    //   },
    // }
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    wasm(),
    react(),
  ],
})

