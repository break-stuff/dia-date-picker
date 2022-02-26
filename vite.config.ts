import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      fileName: (format) => `index.${format}.js`,
    },
    minify: true,
    sourcemap: true,
    cssCodeSplit: true
  },
  optimizeDeps: {
    include: ['@open-wc/testing']
  }
});