import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/SITAS_OFFICIAL_WENSITE/',
  plugins: [react(), tailwindcss()],
})
