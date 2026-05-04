import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const LEETCODE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        reputation
        starRating
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentAcSubmissionList(username: $username, limit: 6) {
      id
      title
      titleSlug
      timestamp
    }
  }
`

const leetcodeProxyPlugin = () => ({
  name: 'leetcode-dev-proxy',
  configureServer(server) {
    server.middlewares.use('/api/leetcode', async (request, response) => {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' })
        response.end()
        return
      }

      try {
        const upstream = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com/u/wigiwee/',
            'User-Agent': 'wigiwee-portfolio-site',
          },
          body: JSON.stringify({
            query: LEETCODE_QUERY,
            variables: { username: 'wigiwee' },
          }),
          signal: AbortSignal.timeout(8000),
        })

        if (!upstream.ok) {
          throw new Error(`LeetCode returned ${upstream.status}`)
        }

        const body = request.method === 'HEAD' ? '' : await upstream.text()
        response.writeHead(200, {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json; charset=utf-8',
        })
        response.end(body)
      } catch {
        response.writeHead(502, {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json; charset=utf-8',
        })
        response.end(JSON.stringify({ error: 'Unable to fetch LeetCode stats' }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), leetcodeProxyPlugin()],
  server: {
    proxy: {
      '/api/uptime': {
        target: 'https://uptime.wigiwee.com',
        changeOrigin: true,
        rewrite: () => '/api/status-page/heartbeat/selfhosted',
      },
      '/api/github/repos': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: () => '/users/wigiwee/repos?sort=updated&direction=desc&per_page=6',
      },
      '/api/github/events': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: () => '/users/wigiwee/events/public?per_page=8',
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL ?? 'http://backend:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
