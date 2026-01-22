import { OpenAI } from 'openai'

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
        : '免费额度已用尽，请联系开发者或填写自定义 API。',
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { messages = [], context, api, stream } = req.body || {}

  const customBaseUrl =
    typeof api?.baseUrl === 'string' ? api.baseUrl.trim() : ''
  const customApiKey = typeof api?.apiKey === 'string' ? api.apiKey.trim() : ''
  const customModel = typeof api?.model === 'string' ? api.model.trim() : ''

  const defaultBaseUrl = 'https://openrouter.ai/api/v1'
  const baseURL = /^https?:\/\//.test(customBaseUrl)
    ? customBaseUrl
    : defaultBaseUrl
  const apiKey = customApiKey || process.env.OPENROUTER_API_KEY
  const model =
    customModel || process.env.OPENROUTER_MODEL || 'z-ai/glm-4.7-flash'
  const usingCustomApi = Boolean(customApiKey)
  const shouldStream = stream !== false

  if (!apiKey) {
    return res.status(400).json({
      error_code: 'MISSING_API_KEY',
      user_message: 'AI 服务未配置或 Key 缺失。'
    })
  }

  const openai = new OpenAI({
    apiKey,
    baseURL
  })

  const systemPrompt = `你是一个专业的中文阅读助手，帮助用户高质量理解文章并给出可执行建议。
${context ? `以下是用户引入的上下文，请优先基于它回答：\n"""${context}"""\n` : '如果没有提供上下文，请基于通用知识回答并标明不确定之处。\n'}
回答要求：
1. 先给结论或摘要，再给理由与细节（必要时用条列）。
2. 只引用上下文中存在的信息，不要编造；若信息不足，明确说明并提出 1-2 个澄清问题。
3. 语言专业、克制但不敷衍，避免过度简短。
4. 遇到操作/步骤类问题，给出清晰步骤或检查清单。`

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
