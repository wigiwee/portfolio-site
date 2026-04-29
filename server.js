import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const DIST_DIR = path.join(process.cwd(), 'dist')
const UPTIME_ENDPOINT = 'https://uptime.wigiwee.com/api/status-page/heartbeat/selfhosted'
const GITHUB_REPOS_ENDPOINT = 'https://api.github.com/users/wigiwee/repos?sort=updated&direction=desc&per_page=6'
const GITHUB_EVENTS_ENDPOINT = 'https://api.github.com/users/wigiwee/events/public?per_page=8'
const LEETCODE_ENDPOINT = 'https://leetcode.com/graphql'
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

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const send = (response, statusCode, headers = {}, body = '') => {
  response.writeHead(statusCode, headers)
  response.end(body)
}

const handleJsonProxy = async (request, response, endpoint, errorMessage, maxAge = 60) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    send(response, 405, { Allow: 'GET, HEAD' })
    return
  }

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'wigiwee-portfolio-site',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!upstream.ok) {
      throw new Error(`Endpoint returned ${upstream.status}`)
    }

    const body = request.method === 'HEAD' ? '' : await upstream.text()
    send(response, 200, {
      'Cache-Control': `public, max-age=${maxAge}`,
      'Content-Type': 'application/json; charset=utf-8',
    }, body)
  } catch (error) {
    send(response, 502, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    }, JSON.stringify({ error: errorMessage }))
  }
}

const handleLeetCode = async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    send(response, 405, { Allow: 'GET, HEAD' })
    return
  }

  try {
    const upstream = await fetch(LEETCODE_ENDPOINT, {
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
    send(response, 200, {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json; charset=utf-8',
    }, body)
  } catch {
    send(response, 502, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    }, JSON.stringify({ error: 'Unable to fetch LeetCode stats' }))
  }
}

const getStaticFilePath = async (pathname) => {
  const decodedPath = decodeURIComponent(pathname)
  const normalizedPath = path.normalize(decodedPath)
  const staticPath = normalizedPath === '/' ? '/index.html' : normalizedPath
  let filePath = path.join(DIST_DIR, staticPath)
  const relativePath = path.relative(DIST_DIR, filePath)

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null
  }

  try {
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    return filePath
  } catch {
    return path.join(DIST_DIR, 'index.html')
  }
}

const handleStatic = async (request, response, url) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    send(response, 405, { Allow: 'GET, HEAD' })
    return
  }

  const filePath = await getStaticFilePath(url.pathname)

  if (!filePath) {
    send(response, 403)
    return
  }

  try {
    const extension = path.extname(filePath)
    const body = request.method === 'HEAD' ? '' : await readFile(filePath)

    send(response, 200, {
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
    }, body)
  } catch {
    send(response, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found')
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)

  if (url.pathname === '/api/uptime') {
    await handleJsonProxy(request, response, UPTIME_ENDPOINT, 'Unable to fetch uptime status', 30)
    return
  }

  if (url.pathname === '/api/github/repos') {
    await handleJsonProxy(request, response, GITHUB_REPOS_ENDPOINT, 'Unable to fetch GitHub repositories', 300)
    return
  }

  if (url.pathname === '/api/github/events') {
    await handleJsonProxy(request, response, GITHUB_EVENTS_ENDPOINT, 'Unable to fetch GitHub activity', 120)
    return
  }

  if (url.pathname === '/api/leetcode') {
    await handleLeetCode(request, response)
    return
  }

  await handleStatic(request, response, url)
})

server.listen(PORT, () => {
  console.log(`Portfolio server listening on http://localhost:${PORT}`)
})
