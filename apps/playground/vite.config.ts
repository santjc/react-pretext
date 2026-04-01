import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@santjc/react-pretext/editorial',
        replacement: fileURLToPath(new URL('../../packages/react-pretext/src/editorial.ts', import.meta.url)),
      },
      {
        find: '@santjc/react-pretext/pretext',
        replacement: fileURLToPath(new URL('../../packages/react-pretext/src/pretext.ts', import.meta.url)),
      },
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
