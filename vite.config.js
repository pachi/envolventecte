import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";


// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    // which allows you to import from folders under the /src folder
    // import Button from '~/components/Button';
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // open browser on start
    open: true,
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    react(),
    // svgr options: https://react-svgr.com/docs/options/
    svgr({ svgrOptions: { icon: true } }),
  ],
})

