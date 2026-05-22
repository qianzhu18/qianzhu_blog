const ORIGINAL_TOKEN = process.env.REVALIDATE_TOKEN

const createRes = (revalidateImpl) => {
  const res = {}
  res.statusCode = 200
  res.headers = {}
  res.status = jest.fn(code => {
    res.statusCode = code
    return res
  })
  res.setHeader = jest.fn((key, value) => {
    res.headers[key] = value
  })
  res.json = jest.fn(payload => {
    res.body = payload
    return res
  })
  res.revalidate = revalidateImpl
  return res
}

describe('/api/revalidate', () => {
  let handler

  beforeEach(() => {
    jest.resetModules()
    process.env.REVALIDATE_TOKEN = 'test-token'
    handler = require('@/pages/api/revalidate').default
  })

  afterAll(() => {
    if (ORIGINAL_TOKEN === undefined) {
      delete process.env.REVALIDATE_TOKEN
    } else {
      process.env.REVALIDATE_TOKEN = ORIGINAL_TOKEN
    }
  })

  it('returns 503 when token is not configured', async () => {
    delete process.env.REVALIDATE_TOKEN
    jest.resetModules()
    handler = require('@/pages/api/revalidate').default

    const req = { method: 'POST', query: {}, headers: {} }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(503)
    expect(res.body.ok).toBe(false)
  })

  it('returns 401 when token is missing', async () => {
    const req = { method: 'POST', query: { path: '/' }, headers: {} }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(401)
  })

  it('returns 401 when token is wrong', async () => {
    const req = {
      method: 'POST',
      query: { path: '/', token: 'wrong' },
      headers: {}
    }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(401)
  })

  it('rejects unsupported methods', async () => {
    const req = {
      method: 'DELETE',
      query: { token: 'test-token', path: '/' },
      headers: {}
    }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(405)
    expect(res.headers['Allow']).toBe('GET, POST')
  })

  it('returns 400 when no path is provided', async () => {
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: {}
    }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(400)
  })

  it('rejects path traversal attempts', async () => {
    const req = {
      method: 'POST',
      query: { token: 'test-token', path: '/../etc/passwd' },
      headers: {}
    }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/invalid path/i)
  })

  it('rejects paths that do not start with /', async () => {
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: { paths: ['no-leading-slash'] }
    }
    const res = createRes(jest.fn())
    await handler(req, res)

    expect(res.statusCode).toBe(400)
  })

  it('revalidates a single path via query string', async () => {
    const revalidate = jest.fn().mockResolvedValue()
    const req = {
      method: 'POST',
      query: { token: 'test-token', path: '/article/foo' },
      headers: {}
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(revalidate).toHaveBeenCalledWith('/article/foo')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.revalidated).toBe(1)
  })

  it('accepts token via x-revalidate-token header', async () => {
    const revalidate = jest.fn().mockResolvedValue()
    const req = {
      method: 'POST',
      query: { path: '/' },
      headers: { 'x-revalidate-token': 'test-token' }
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(res.statusCode).toBe(200)
    expect(revalidate).toHaveBeenCalledWith('/')
  })

  it('revalidates multiple paths via JSON body', async () => {
    const revalidate = jest.fn().mockResolvedValue()
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: { paths: ['/', '/archive', '/category'] }
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(revalidate).toHaveBeenCalledTimes(3)
    expect(res.body.revalidated).toBe(3)
    expect(res.body.failed).toBe(0)
  })

  it('deduplicates repeated paths', async () => {
    const revalidate = jest.fn().mockResolvedValue()
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: { paths: ['/', '/', '/archive'] }
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(revalidate).toHaveBeenCalledTimes(2)
  })

  it('returns 207 partial success when some paths fail', async () => {
    const revalidate = jest.fn(path =>
      path === '/bad' ? Promise.reject(new Error('boom')) : Promise.resolve()
    )
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: { paths: ['/', '/bad'] }
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(res.statusCode).toBe(207)
    expect(res.body.ok).toBe(false)
    expect(res.body.revalidated).toBe(1)
    expect(res.body.failed).toBe(1)
    expect(res.body.results.find(r => r.path === '/bad').error).toMatch(/boom/)
  })

  it('caps the number of paths per request', async () => {
    const revalidate = jest.fn().mockResolvedValue()
    const tooMany = Array.from({ length: 51 }, (_, i) => `/p${i}`)
    const req = {
      method: 'POST',
      query: { token: 'test-token' },
      headers: {},
      body: { paths: tooMany }
    }
    const res = createRes(revalidate)
    await handler(req, res)

    expect(res.statusCode).toBe(400)
    expect(revalidate).not.toHaveBeenCalled()
  })
})
