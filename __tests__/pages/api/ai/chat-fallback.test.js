let createCalls = []

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(options => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockImplementation(args => {
              createCalls.push({ options, args })
              if (options.baseURL === 'https://open.bigmodel.cn/api/coding/paas/v4') {
                const err = new Error('rate limit')
                err.status = 429
                throw err
              }
              return Promise.resolve({
                choices: [{ message: { content: 'fallback-ok' } }]
              })
            })
          }
        }
      }
    })
  }
})

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

describe('/api/ai/chat fallback to openrouter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    createCalls = []
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('falls back to openrouter on ZAI rate limit', async () => {
    process.env.ZAI_API_KEY = 'test-zai-key'
    process.env.ZAI_API_BASE_URL = 'https://open.bigmodel.cn/api/coding/paas/v4'
    process.env.ZAI_MODEL = 'GLM-4.7'
    process.env.OPENROUTER_API_KEY = 'router-key'
    process.env.OPENROUTER_MODEL = 'moonshotai/kimi-k2-0905'

    const req = {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      }
    }
    const res = createRes()

    await handler(req, res)

    expect(createCalls.length).toBe(2)
    expect(createCalls[0].options.baseURL).toBe(
      'https://open.bigmodel.cn/api/coding/paas/v4'
    )
    expect(createCalls[1].options.baseURL).toBe(
      'https://openrouter.ai/api/v1'
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ reply: 'fallback-ok' })
  })
})
