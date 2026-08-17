import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vite binds ::1 only by default, which leaves http://127.0.0.1:5173 dead.
  // Listening on every interface makes both loopback spellings work.
  server: { port: 5173, host: true },
})
