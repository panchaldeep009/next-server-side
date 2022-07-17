import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactStack } from 'react-stack/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactStack(),
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
  ],
  build: {
    minify: false
  }
})
