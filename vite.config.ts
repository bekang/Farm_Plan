import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative path for local filesystem check
  server: {
    host: true, // Allow external access (0.0.0.0)
    proxy: {
      '/api/nongsaro': {
        target: 'http://api.nongsaro.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nongsaro/, ''),
      },
      '/api/ncpms': {
        target: 'https://ncpms.rda.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ncpms/, ''),
      },
      '/api/public': {
        target: 'http://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/public/, ''),
      },
      '/api/weather': { // Alternative if needed
         target: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
      '/api/kamis': {
        target: 'http://www.kamis.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kamis/, ''),
      },
      '/api/garak': {
        target: 'http://www.garak.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/garak/, ''),
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
