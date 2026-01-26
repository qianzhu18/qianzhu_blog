let lastCreateArgs
let lastClientOptions

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(options => {
      lastClientOptions = options
      return {
        chat: {
          completions: {
            create: jest.fn().mockImplementation(args => {
              lastCreateArgs = args
              return Promise.resolve({
                choices: [{ message: { content: 'ok' } }]
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

describe('/api/ai/chat model selection', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    lastCreateArgs = undefined
    lastClientOptions = undefined
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('uses ZAI_MODEL when ZAI key is set for BigModel OpenAI endpoint', async () => {
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

    expect(lastClientOptions.baseURL).toBe(
      'https://open.bigmodel.cn/api/coding/paas/v4'
    )
    expect(lastCreateArgs.model).toBe('GLM-4.7')
  })
})
