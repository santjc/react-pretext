import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@santjc/react-pretext',
        replacement: fileURLToPath(new URL('../../packages/react-pretext/src/index.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
  },
})
