import { OpenAI } from 'openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { messages = [], context } = req.body || {}

  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  })

  const systemPrompt = `你是一个博客阅读助手。
${context ? `用户当前选中了以下内容作为上下文：\n"""${context}"""\n请基于此回答用户问题。` : ''}
请用简洁凝练的中文回复。`

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'moonshotai/kimi-k2-0905',
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })

    res.status(200).json({ reply: completion.choices[0].message.content })
  } catch (error) {
    console.error('AI Error:', error)
    res.status(500).json({ error: error.message })
  }
}
