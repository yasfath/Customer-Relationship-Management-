import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiTarget = process.env.VITE_API_BASE_URL || "http://10.93.186.12:8080";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    global: "window"
  },

  server: {
    host: true,
    port: 5173,

    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
