import { defineConfig } from 'vite';
import minifyHTML from 'rollup-plugin-minify-html-literals';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      fileName: format => `index.${format}.js`,
    },
    minify: true,
    sourcemap: true,
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['@open-wc/testing'],
  },
  plugins: [
    minifyHTML()
  ]
});
