import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("react")) return "vendor";
            if (id.includes("recharts")) return "charts";
            if (id.includes("firebase")) return "firebase";
            if (id.includes("exceljs")) return "exceljs";
          }
        },
      },
    },
  },
})
