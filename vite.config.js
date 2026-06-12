import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/actionmodel-quiz/',
  plugins: [react()],
})
