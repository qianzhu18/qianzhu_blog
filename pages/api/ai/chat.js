import { OpenAI } from 'openai'
import { getClientIp } from '@/lib/middleware/security'
import { globalRateLimiter } from '@/lib/utils/validation'

const FREE_CHAT_LIMIT = 8
const FREE_CHAT_WINDOW_MS = 10 * 60 * 1000

const getErrorPayload = (error, usingCustomApi) => {
  const message = error?.message || 'AI Error'
  const normalized = message.toLowerCase()
  if (
    normalized.includes('quota') ||
    normalized.includes('insufficient') ||
    normalized.includes('credit')
  ) {
    return {
      status: 402,
      error_code: 'INSUFFICIENT_QUOTA',
      user_message: usingCustomApi
        ? '当前 API 额度已用尽，请检查你的 Key 或账号余额。'
        : '当前服务额度已用尽，请稍后再试或配置自定义 API。',
      error: message
    }
  }
  if (
    normalized.includes('api key') ||
    normalized.includes('authentication') ||
    normalized.includes('unauthorized')
  ) {
    return {
      status: 401,
      error_code: 'MISSING_API_KEY',
      user_message: 'API Key 无效或未授权。',
      error: message
    }
  }
  return {
    status: 500,
    error_code: 'AI_ERROR',
    user_message: 'AI 服务暂时不可用，请稍后再试。',
    error: message
  }
}

const buildAnthropicEndpoint = baseURL => {
  const normalized = baseURL.replace(/\/+$/, '')
  if (normalized.endsWith('/v1/messages')) return normalized
  if (normalized.endsWith('/v1')) return `${normalized}/messages`
  return `${normalized}/v1/messages`
}

const formatAnthropicMessages = messages =>
  messages
    .filter(msg => msg?.role && msg?.content)
    .map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: String(msg.content)
    }))

const extractAnthropicContent = data => {
  if (Array.isArray(data?.content)) {
    return data.content
      .map(item => (typeof item?.text === 'string' ? item.text : ''))
      .join('')
  }
  if (typeof data?.content === 'string') return data.content
  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { messages = [], context, api, stream } = req.body || {}

  const customBaseUrl =
    typeof api?.baseUrl === 'string' ? api.baseUrl.trim() : ''
  const customApiKey = typeof api?.apiKey === 'string' ? api.apiKey.trim() : ''
  const customModel = typeof api?.model === 'string' ? api.model.trim() : ''

  const defaultBaseUrl =
    process.env.ZAI_API_BASE_URL ||
    process.env.AI_API_BASE_URL ||
    'https://api.z.ai/api/anthropic'
  const baseURL = /^https?:\/\//.test(customBaseUrl)
    ? customBaseUrl
    : defaultBaseUrl
  const apiKey =
    customApiKey ||
    process.env.ZAI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.OPENROUTER_API_KEY
  const model =
    customModel ||
    process.env.ZAI_MODEL ||
    process.env.AI_MODEL ||
    process.env.OPENROUTER_MODEL ||
    'GLM-4.7-FlashX'
  const usingCustomApi = Boolean(customApiKey)
  const shouldStream = stream !== false
  const usingAnthropic = /anthropic/i.test(baseURL)

  if (!apiKey) {
    return res.status(400).json({
      error_code: 'MISSING_API_KEY',
      user_message: 'AI 服务未配置或 Key 缺失。'
    })
  }

  if (!usingCustomApi) {
    const identifier = `${getClientIp(req)}:ai-chat`
    if (
      globalRateLimiter.isRateLimited(
        identifier,
        FREE_CHAT_LIMIT,
        FREE_CHAT_WINDOW_MS
      )
    ) {
      return res.status(429).json({
        error_code: 'RATE_LIMITED',
        user_message: '对话过于频繁，服务已暂时失效，请配置 API 后继续使用。',
        retry_after: Math.ceil(FREE_CHAT_WINDOW_MS / 1000)
      })
    }
  }

  const systemPrompt = `你是一个专业的中文阅读助手，帮助用户高质量理解文章并给出可执行建议。
${context ? `以下是用户引入的上下文，请优先基于它回答：\n"""${context}"""\n` : '如果没有提供上下文，请基于通用知识回答并标明不确定之处。\n'}
回答要求：
1. 先给结论或摘要，再给理由与细节（必要时用条列）。
2. 只引用上下文中存在的信息，不要编造；若信息不足，明确说明并提出 1-2 个澄清问题。
3. 语言专业、克制但不敷衍，避免过度简短。
4. 遇到操作/步骤类问题，给出清晰步骤或检查清单。`

  if (usingAnthropic) {
    const endpoint = buildAnthropicEndpoint(baseURL)
    const payload = {
      model,
      system: systemPrompt,
      max_tokens: 1024,
      messages: formatAnthropicMessages(messages)
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }

    if (!shouldStream) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        if (!response.ok) {
          const errorText = await response.text()
          const errorPayload = getErrorPayload(
            { message: errorText },
            usingCustomApi
          )
          return res.status(errorPayload.status).json(errorPayload)
        }
        const data = await response.json()
        return res.status(200).json({ reply: extractAnthropicContent(data) })
      } catch (error) {
        console.error('AI Error:', error)
        const errorPayload = getErrorPayload(error, usingCustomApi)
        return res.status(errorPayload.status).json(errorPayload)
      }
    }

    res.status(200)
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...payload, stream: true })
      })

      if (!response.ok || !response.body) {
        const errorText = await response.text()
        const errorPayload = getErrorPayload(
          { message: errorText },
          usingCustomApi
        )
        res.write(`data: ${JSON.stringify(errorPayload)}\n\n`)
        res.end()
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          const lines = part.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const dataText = line.replace(/^data:\s?/, '').trim()
            if (!dataText) continue
            try {
              const payload = JSON.parse(dataText)
              if (payload?.type === 'content_block_start') {
                const text = payload?.content_block?.text || ''
                if (text) {
                  res.write(`data: ${JSON.stringify({ delta: text })}\n\n`)
                }
              }
              if (payload?.type === 'content_block_delta') {
                const text = payload?.delta?.text || ''
                if (text) {
                  res.write(`data: ${JSON.stringify({ delta: text })}\n\n`)
                }
              }
              if (payload?.type === 'message_stop') {
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
              }
              if (payload?.error) {
                const errorPayload = getErrorPayload(
                  { message: payload?.error?.message || 'AI Error' },
                  usingCustomApi
                )
                res.write(`data: ${JSON.stringify(errorPayload)}\n\n`)
              }
            } catch (e) {
              // ignore invalid chunks
            }
          }
        }
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    } catch (error) {
      console.error('AI Error:', error)
      const payload = getErrorPayload(error, usingCustomApi)
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    } finally {
      res.end()
    }
    return
  }

  const openai = new OpenAI({
    apiKey,
    baseURL
  })

  if (!shouldStream) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages]
      })
      return res.status(200).json({ reply: completion.choices[0].message.content })
    } catch (error) {
      console.error('AI Error:', error)
      const payload = getErrorPayload(error, usingCustomApi)
      return res.status(payload.status).json(payload)
    }
  }

  res.status(200)
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  try {
    const completionStream = await openai.chat.completions.create({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true
    })

    for await (const chunk of completionStream) {
      const delta = chunk?.choices?.[0]?.delta?.content || ''
      if (delta) {
        res.write(`data: ${JSON.stringify({ delta })}\n\n`)
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  } catch (error) {
    console.error('AI Error:', error)
    const payload = getErrorPayload(error, usingCustomApi)
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  } finally {
    res.end()
  }
}
