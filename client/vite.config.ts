import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shadcn-vue-style': fileURLToPath(new URL('./node_modules/shadcn-vue/dist/style.css', import.meta.url))
    },
  },
})