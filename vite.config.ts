import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript'
import { clientHookReplacementTransformer } from './lib/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        secure: false,
        ws: false,
      }
    }
  },
  plugins: [
    typescript({
      transformers: {
        before: [clientHookReplacementTransformer]
      }
    }),
    react({
      jsxRuntime: 'classic',
      exclude: /\.stories\.(t|j)sx?$/,
    }),
  ],
  build: {
    minify: false,
  }
})
