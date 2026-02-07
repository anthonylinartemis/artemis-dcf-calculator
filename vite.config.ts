import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/artemis': {
          target: 'https://data-svc.artemisxyz.com',
          changeOrigin: true,
          rewrite: (path) => {
            const cleaned = path.replace(/^\/api\/artemis/, '')
            const separator = cleaned.includes('?') ? '&' : '?'
            return `${cleaned}${separator}APIKey=${env.ARTEMIS_API_KEY}`
          },
        },
      },
    },
  }
})
