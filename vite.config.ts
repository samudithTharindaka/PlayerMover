import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber'],
    exclude: ['@react-three/drei'],
  },
})
