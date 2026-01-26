import { OpenAI } from 'openai'

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

const getErrorPayload = (error, usingCustomApi) => {
  const status = error?.status || error?.response?.status || error?.statusCode
  const message =
    error?.message ||
    error?.error?.message ||
    error?.response?.data?.error?.message ||
    'AI Error'
  const normalized = String(message).toLowerCase()
  if (
    status === 429 ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests')
  ) {
    return {
      status: 429,
      error_code: 'RATE_LIMIT',
      user_message: '请求过多，请稍后再试。',
      error: message
    }
  }
  if (
    status === 402 ||
    normalized.includes('quota') ||
    normalized.includes('insufficient') ||
    normalized.includes('credit')
  ) {
    return {
      status: 402,
      error_code: 'INSUFFICIENT_QUOTA',
      user_message: '服务暂时不可用，请稍后再试。',
      error: message
    }
  }
  if (
    status === 401 ||
    status === 403 ||
    normalized.includes('api key') ||
    normalized.includes('authentication') ||
    normalized.includes('unauthorized') ||
    normalized.includes('user not found') ||
    normalized.includes('invalid api key') ||
    normalized.includes('invalid token')
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

const isRateLimitError = error => {
  const status = error?.status || error?.response?.status || error?.statusCode
  const message =
    error?.message ||
    error?.error?.message ||
    error?.response?.data?.error?.message ||
    ''
  const normalized = String(message).toLowerCase()
  return (
    status === 429 ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests') ||
    normalized.includes('concurrent') ||
    normalized.includes('并发')
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { messages = [], context, api, stream } = req.body || {}

  const customBaseUrl =
    typeof api?.baseUrl === 'string' ? api.baseUrl.trim() : ''
  const customApiKey = typeof api?.apiKey === 'string' ? api.apiKey.trim() : ''
  const customModel = typeof api?.model === 'string' ? api.model.trim() : ''

  const openrouterKey = process.env.OPENROUTER_API_KEY || ''
  const openrouterBase =
    process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  const zaiKey = process.env.ZAI_API_KEY || process.env.AI_API_KEY || ''
  const zaiBase =
    process.env.ZAI_API_BASE_URL ||
    process.env.AI_API_BASE_URL ||
    'https://api.z.ai/api/anthropic'
  const openaiKey = process.env.OPENAI_API_KEY || ''
  const openaiBase =
    process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const hasCustomApi =
    Boolean(customApiKey) && /^https?:\/\//.test(customBaseUrl)

  const baseURL = hasCustomApi
    ? customBaseUrl
    : zaiKey
      ? zaiBase
      : openrouterKey
        ? openrouterBase
        : openaiBase
  const apiKey = hasCustomApi
    ? customApiKey
    : zaiKey || openrouterKey || openaiKey
  const usingCustomApi = Boolean(customApiKey)
  const usingAnthropic = /anthropic|z\.ai/i.test(baseURL)
  const usingOpenAI = /api\.openai\.com/i.test(baseURL)
  const defaultModel = usingAnthropic
    ? process.env.ZAI_MODEL || process.env.AI_MODEL || 'GLM-4.7-FlashX'
    : zaiKey
      ? process.env.ZAI_MODEL || process.env.AI_MODEL || 'GLM-4.7'
      : usingOpenAI
        ? process.env.OPENAI_MODEL || 'gpt-4o-mini'
        : process.env.OPENROUTER_MODEL || 'z-ai/glm-4.7-flash'
  const model = customModel || defaultModel
  const shouldStream = stream !== false

  if (!apiKey) {
    return res.status(400).json({
      error_code: 'MISSING_API_KEY',
      user_message: 'AI 服务未配置或 Key 缺失。'
    })
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
            { message: errorText, status: response.status },
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
          { message: errorText, status: response.status },
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
  const canFallbackToOpenRouter =
    !usingCustomApi && Boolean(openrouterKey) && baseURL !== openrouterBase
  const openrouterModel =
    process.env.OPENROUTER_MODEL || 'z-ai/glm-4.7-flash'
  const buildOpenAiClient = (key, url) =>
    new OpenAI({
      apiKey: key,
      baseURL: url
    })

  if (!shouldStream) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages]
      })
      return res.status(200).json({ reply: completion.choices[0].message.content })
    } catch (error) {
      if (canFallbackToOpenRouter && isRateLimitError(error)) {
        try {
          const fallbackClient = buildOpenAiClient(
            openrouterKey,
            openrouterBase
          )
          const completion = await fallbackClient.chat.completions.create({
            model: openrouterModel,
            messages: [{ role: 'system', content: systemPrompt }, ...messages]
          })
          return res
            .status(200)
            .json({ reply: completion.choices[0].message.content })
        } catch (fallbackError) {
          console.error('AI Error:', fallbackError)
          const payload = getErrorPayload(fallbackError, usingCustomApi)
          return res.status(payload.status).json(payload)
        }
      }
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

  let hasStreamed = false
  const streamWithClient = async (client, streamModel) => {
    const completionStream = await client.chat.completions.create({
      model: streamModel,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true
    })

    for await (const chunk of completionStream) {
      const delta = chunk?.choices?.[0]?.delta?.content || ''
      if (delta) {
        hasStreamed = true
        res.write(`data: ${JSON.stringify({ delta })}\n\n`)
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  }

  try {
    await streamWithClient(openai, model)
  } catch (error) {
    if (canFallbackToOpenRouter && !hasStreamed && isRateLimitError(error)) {
      try {
        const fallbackClient = buildOpenAiClient(
          openrouterKey,
          openrouterBase
        )
        await streamWithClient(fallbackClient, openrouterModel)
      } catch (fallbackError) {
        console.error('AI Error:', fallbackError)
        const payload = getErrorPayload(fallbackError, usingCustomApi)
        res.write(`data: ${JSON.stringify(payload)}\n\n`)
      }
    } else {
      console.error('AI Error:', error)
      const payload = getErrorPayload(error, usingCustomApi)
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }
  } finally {
    res.end()
  }
}
