/**
 * 通用 ISR 主动刷新端点
 *
 * 调用示例：
 *   curl -X POST 'https://your-site.com/api/revalidate?path=/' \
 *        -H 'x-revalidate-token: YOUR_TOKEN'
 *
 *   curl -X POST 'https://your-site.com/api/revalidate' \
 *        -H 'Content-Type: application/json' \
 *        -H 'x-revalidate-token: YOUR_TOKEN' \
 *        -d '{"paths": ["/", "/article/foo", "/category"]}'
 *
 * 用途：在 Notion 编辑文章后立刻刷新对应页面，无需等待 ISR 60s 间隔。
 */

const MAX_PATHS_PER_REQUEST = 50

function getTokenFromRequest(req) {
  const queryToken = Array.isArray(req.query?.token)
    ? req.query.token[0]
    : req.query?.token
  const headerToken =
    req.headers['x-revalidate-token'] ||
    req.headers['x-contribution-trigger-token'] ||
    ''
  return String(queryToken || headerToken || '')
}

function collectRequestedPaths(req) {
  const fromQuerySingle = Array.isArray(req.query?.path)
    ? req.query.path
    : req.query?.path
      ? [req.query.path]
      : []

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const fromBodyPath = body.path ? [body.path] : []
  const fromBodyPaths = Array.isArray(body.paths) ? body.paths : []

  const all = [...fromQuerySingle, ...fromBodyPath, ...fromBodyPaths]
    .map(p => String(p || '').trim())
    .filter(Boolean)

  return Array.from(new Set(all))
}

function isValidPath(p) {
  if (typeof p !== 'string' || !p.startsWith('/')) return false
  if (p.includes('..')) return false
  if (p.length > 512) return false
  if (/[\s\r\n]/.test(p)) return false
  return true
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method || '')) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  const expectedToken = process.env.REVALIDATE_TOKEN || ''
  if (!expectedToken) {
    return res.status(503).json({
      ok: false,
      message:
        'Revalidate endpoint is disabled: set REVALIDATE_TOKEN environment variable to enable.'
    })
  }

  const receivedToken = getTokenFromRequest(req)
  if (!receivedToken || receivedToken !== expectedToken) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  if (typeof res.revalidate !== 'function') {
    return res.status(501).json({
      ok: false,
      message: 'res.revalidate is not available in this runtime.'
    })
  }

  const requestedPaths = collectRequestedPaths(req)
  if (requestedPaths.length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'No path provided. Use ?path=/ or POST { paths: ["/"] }.'
    })
  }
  if (requestedPaths.length > MAX_PATHS_PER_REQUEST) {
    return res.status(400).json({
      ok: false,
      message: `Too many paths in one request (max ${MAX_PATHS_PER_REQUEST}).`
    })
  }

  const invalid = requestedPaths.filter(p => !isValidPath(p))
  if (invalid.length > 0) {
    return res.status(400).json({
      ok: false,
      message: `Invalid path(s): ${invalid.slice(0, 5).join(', ')}`
    })
  }

  const results = await Promise.all(
    requestedPaths.map(async path => {
      try {
        await res.revalidate(path)
        return { path, ok: true }
      } catch (error) {
        return { path, ok: false, error: String(error?.message || error) }
      }
    })
  )

  const succeeded = results.filter(r => r.ok).length
  const failed = results.length - succeeded

  return res.status(failed === 0 ? 200 : 207).json({
    ok: failed === 0,
    revalidated: succeeded,
    failed,
    results
  })
}
