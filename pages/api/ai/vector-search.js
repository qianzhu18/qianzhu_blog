export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, topK = 5, matchThreshold = 0.2 } = req.body || {}
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query' })
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  const siliconflowKey = process.env.SILICONFLOW_API_KEY
  if (!supabaseUrl || !supabaseKey || !siliconflowKey) {
    return res.status(500).json({ error: 'Missing server configuration' })
  }

  const embeddingModel =
    process.env.SILICONFLOW_EMBEDDING_MODEL || 'Qwen/Qwen3-Embedding-8B'
  const baseUrl =
    process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'

  try {
    const embedResponse = await fetch(`${baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${siliconflowKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: embeddingModel,
        input: [query]
      })
    })

    if (!embedResponse.ok) {
      const errorText = await embedResponse.text()
      return res.status(502).json({ error: errorText })
    }

    const embedJson = await embedResponse.json()
    const embedding = embedJson?.data?.[0]?.embedding
    if (!embedding) {
      return res.status(502).json({ error: 'Embedding returned empty result' })
    }

    const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/match_documents`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: topK
      })
    })

    if (!rpcResponse.ok) {
      const errorText = await rpcResponse.text()
      return res.status(502).json({ error: errorText })
    }

    const matches = await rpcResponse.json()
    return res.status(200).json({ matches })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
