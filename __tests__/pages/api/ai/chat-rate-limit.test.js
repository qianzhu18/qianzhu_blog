import handler from '@/pages/api/ai/chat'

const createRes = () => {
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
  res.send = jest.fn(payload => {
    res.body = payload
    return res
  })
  res.write = jest.fn()
  res.end = jest.fn()
  return res
}

describe('/api/ai/chat rate limit handling', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns RATE_LIMIT with 429 status for rate limit responses', async () => {
    process.env.ZAI_API_KEY = 'test-zai-key'
    process.env.ZAI_API_BASE_URL = 'https://api.z.ai/api/anthropic'
    process.env.OPENROUTER_API_KEY = ''
    process.env.OPENAI_API_KEY = ''

    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'rate limit'
    })

    const req = {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      }
    }
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error_code: 'RATE_LIMIT' })
    )
  })

  it('does not mention free quota in insufficient balance message', async () => {
    process.env.ZAI_API_KEY = 'test-zai-key'
    process.env.ZAI_API_BASE_URL = 'https://api.z.ai/api/anthropic'
    process.env.OPENROUTER_API_KEY = ''
    process.env.OPENAI_API_KEY = ''

    global.fetch.mockResolvedValue({
      ok: false,
      status: 402,
      text: async () => 'quota exceeded'
    })

    const req = {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      }
    }
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(402)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error_code: 'INSUFFICIENT_QUOTA',
        user_message: expect.not.stringContaining('免费额度')
      })
    )
  })
})
