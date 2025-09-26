import { defineConfig } from 'vite'

export default defineConfig({
  // Configure for Single Page Application
  server: {
    historyApiFallback: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})