#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf('=')
    if (index === -1) return
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    value = value.replace(/\\n/g, '\n')
    if (!process.env[key]) process.env[key] = value
  })
}

function loadEnv() {
  const rootDir = path.resolve(__dirname, '..')
  loadEnvFile(path.join(rootDir, '.env.local'))
  loadEnvFile(path.join(rootDir, '.env'))
}

function parseNotionPageIds(raw) {
  if (!raw) return []
  return raw
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => (item.includes(':') ? item.split(':').pop() : item))
}

function getAllPageIds(
  collectionQuery,
  collectionId,
  collectionView,
  viewIds,
  index
) {
  if (!collectionQuery && !collectionView) return []
  let pageIds = []
  const safeIndex = Number.isInteger(index) ? index : 0
  const viewId =
    safeIndex < 0 ? viewIds?.[viewIds.length + safeIndex] : viewIds?.[safeIndex]

  try {
    const ids =
      collectionQuery?.[collectionId]?.[viewId]?.collection_group_results
        ?.blockIds || []
    if (ids?.length) {
      pageIds = [...ids]
    }
  } catch (error) {
    console.error('Failed to read collection view IDs', error)
  }

  if (pageIds.length === 0 && collectionQuery?.[collectionId]) {
    const pageSet = new Set()
    Object.values(collectionQuery[collectionId]).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id))
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  return pageIds
}

function getPropertyMap(schema, properties, getTextContent) {
  const map = {}
  if (!schema || !properties) return map
  Object.entries(schema).forEach(([propId, prop]) => {
    const rawValue = properties[propId]
    if (!rawValue) return
    const text = getTextContent(rawValue)
    if (text) {
      map[prop.name] = text
    }
  })
  return map
}

function getPropertyByName(propertyMap, name) {
  if (!name || !propertyMap) return null
  if (propertyMap[name] !== undefined) return propertyMap[name]
  const lowerName = name.toLowerCase()
  const matchKey = Object.keys(propertyMap).find(
    key => key.toLowerCase() === lowerName
  )
  return matchKey ? propertyMap[matchKey] : null
}

function getTitleValue(schema, properties, getTextContent, fallbackMap, titleKey) {
  if (properties?.title) {
    const direct = getTextContent(properties.title)
    if (direct) return direct
  }
  if (schema) {
    const titleEntry = Object.entries(schema).find(
      ([, prop]) => prop?.type === 'title'
    )
    if (titleEntry) {
      const [propId] = titleEntry
      const text = getTextContent(properties?.[propId])
      if (text) return text
    }
  }
  const fallback = getPropertyByName(fallbackMap, titleKey)
  return fallback || 'Untitled'
}

function findBreakpoint(text, start, end) {
  const breakChars = ['\n', '。', '！', '？', '.', '!', '?', ';', '；', ',', '，']
  const windowStart = Math.max(start, end - 120)
  for (let i = end - 1; i >= windowStart; i -= 1) {
    if (breakChars.includes(text[i])) {
      return i + 1
    }
  }
  return end
}

function splitText(text, chunkSize = 800, chunkOverlap = 100) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const chunks = []
  let start = 0
  while (start < normalized.length) {
    let end = Math.min(start + chunkSize, normalized.length)
    if (end < normalized.length) {
      const breakpoint = findBreakpoint(normalized, start, end)
      if (breakpoint > start) {
        end = breakpoint
      }
    }
    const chunk = normalized.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
    const nextStart = Math.max(end - chunkOverlap, 0)
    start = nextStart > start ? nextStart : end
  }
  return chunks
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatNotionError(error) {
  if (!error) return 'Unknown error'
  const status = error?.response?.status
  const statusText = error?.response?.statusText
  if (status) {
    return `${status} ${statusText || ''}`.trim()
  }
  return error.message || String(error)
}

async function main() {
  loadEnv()

  const rootDir = path.resolve(__dirname, '..')
  const BLOG = require(path.join(rootDir, 'blog.config.js'))

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  const siliconflowKey = process.env.SILICONFLOW_API_KEY
  if (!supabaseUrl || !supabaseKey || !siliconflowKey) {
    console.error(
      'Missing env vars: SUPABASE_URL, SUPABASE_ANON_KEY, SILICONFLOW_API_KEY'
    )
    process.exit(1)
  }

  const databaseIds = parseNotionPageIds(
    process.env.NOTION_PAGE_ID || BLOG.NOTION_PAGE_ID
  )
  if (!databaseIds.length) {
    console.error('Missing NOTION_PAGE_ID')
    process.exit(1)
  }

  const {
    NotionAPI
  } = await import('notion-client')
  const { getTextContent, idToUuid } = await import('notion-utils')
  const { getPageContentText } = await import(
    pathToFileURL(
      path.join(rootDir, 'lib/notion/getPageContentText.js')
    ).href
  )

  const notion = new NotionAPI({
    apiBaseUrl: BLOG.API_BASE_URL || 'https://www.notion.so/api/v3',
    activeUser: process.env.NOTION_ACTIVE_USER || BLOG.NOTION_ACTIVE_USER || null,
    authToken: process.env.NOTION_TOKEN_V2 || BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const propertyNames = BLOG.NOTION_PROPERTY_NAME || {}
  const statusKey = propertyNames.status || 'status'
  const statusPublished = propertyNames.status_publish || 'Published'
  const typeKey = propertyNames.type || 'type'
  const typePost = propertyNames.type_post || 'Post'
  const slugKey = propertyNames.slug || 'slug'
  const titleKey = propertyNames.title || 'title'
  const passwordKey = propertyNames.password || 'password'

  const embeddingModel =
    process.env.SILICONFLOW_EMBEDDING_MODEL || 'Qwen/Qwen3-Embedding-8B'
  const baseUrl =
    process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
  const chunkSize = Number(process.env.VECTOR_CHUNK_SIZE || 800)
  const chunkOverlap = Number(process.env.VECTOR_CHUNK_OVERLAP || 100)
  const embedBatchSize = Number(process.env.VECTOR_EMBED_BATCH_SIZE || 16)
  const upsertBatchSize = Number(process.env.VECTOR_UPSERT_BATCH_SIZE || 20)
  const interBatchDelay = Number(process.env.VECTOR_BATCH_DELAY_MS || 0)
  const deleteBeforeInsert =
    process.env.VECTOR_DELETE_BEFORE_INSERT !== 'false'

  async function fetchEmbeddings(inputs) {
    const response = await fetch(`${baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${siliconflowKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: embeddingModel,
        input: inputs
      })
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Embedding API failed (${response.status}): ${errorText}`
      )
    }
    const data = await response.json()
    return data?.data?.map(item => item.embedding) || []
  }

  async function embedTexts(texts) {
    const embeddings = []
    for (let i = 0; i < texts.length; i += embedBatchSize) {
      const batch = texts.slice(i, i + embedBatchSize)
      const batchEmbeddings = await fetchEmbeddings(batch)
      if (batchEmbeddings.length !== batch.length) {
        throw new Error('Embedding batch size mismatch')
      }
      embeddings.push(...batchEmbeddings)
      if (interBatchDelay > 0) {
        await sleep(interBatchDelay)
      }
    }
    return embeddings
  }

  async function upsertDocuments(rows) {
    if (!rows.length) return
    for (let i = 0; i < rows.length; i += upsertBatchSize) {
      const batch = rows.slice(i, i + upsertBatchSize)
      const url = new URL(`${supabaseUrl}/rest/v1/documents`)
      url.searchParams.set('on_conflict', 'source_id,chunk_index')
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(batch)
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Supabase upsert failed (${response.status}): ${errorText}`
        )
      }
    }
  }

  async function deleteDocuments(sourceId) {
    const url = new URL(`${supabaseUrl}/rest/v1/documents`)
    url.searchParams.set('source_id', `eq.${sourceId}`)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Supabase delete failed (${response.status}): ${errorText}`
      )
    }
  }

  let totalChunks = 0
  for (const databaseId of databaseIds) {
    console.log(`Fetching database: ${databaseId}`)
    const databaseRecordMap = await notion.getPage(databaseId)
    const collection = Object.values(databaseRecordMap.collection || {})[0]?.value
    const collectionId = collection?.id || Object.keys(databaseRecordMap.collection || {})[0]
    const schema = collection?.schema || {}
    const pageUuid = idToUuid(databaseId)
    const pageBlock = databaseRecordMap.block?.[pageUuid]?.value
    const viewIds = pageBlock?.view_ids || collection?.view_ids || []

    if (!collectionId) {
      console.warn('Skip database with missing collection ID')
      continue
    }

    const pageIds = getAllPageIds(
      databaseRecordMap.collection_query,
      collectionId,
      databaseRecordMap.collection_view,
      viewIds,
      Number(BLOG.NOTION_INDEX || 0)
    )

    console.log(`Found ${pageIds.length} pages in database`)

    for (const pageId of pageIds) {
      let pageRecordMap = null
      try {
        pageRecordMap = await notion.getPage(pageId)
      } catch (error) {
        console.warn(
          `Skip page ${pageId}: failed to fetch page blocks (${formatNotionError(
            error
          )})`
        )
        continue
      }
      const pageIdUuid = idToUuid(pageId)
      const pageValue = pageRecordMap.block?.[pageIdUuid]?.value
      if (!pageValue) {
        console.warn(
          `Skip page ${pageId}: missing page block (insufficient access or deleted page)`
        )
        continue
      }

      const propertyMap = getPropertyMap(
        schema,
        pageValue.properties,
        getTextContent
      )
      const status = getPropertyByName(propertyMap, statusKey)
      const type = getPropertyByName(propertyMap, typeKey)

      if (status && status !== statusPublished) {
        continue
      }
      if (type && type !== typePost) {
        continue
      }

      const title = getTitleValue(
        schema,
        pageValue.properties,
        getTextContent,
        propertyMap,
        titleKey
      )
      const slug = getPropertyByName(propertyMap, slugKey) || ''
      const password = getPropertyByName(propertyMap, passwordKey) || ''

      const post = {
        id: pageIdUuid,
        content: pageValue.content || [],
        password
      }
      const contentText = getPageContentText(post, pageRecordMap).trim()
      if (!contentText) {
        continue
      }

      const chunks = splitText(contentText, chunkSize, chunkOverlap)
      if (!chunks.length) {
        continue
      }

      console.log(`Embedding ${title} (${chunks.length} chunks)`)

      const embeddings = await embedTexts(chunks)
      const metadataBase = {
        notion_id: pageIdUuid,
        title,
        slug,
        last_edited_time: pageValue.last_edited_time || null
      }

      const rows = chunks.map((chunk, index) => ({
        source_id: pageIdUuid,
        chunk_index: index,
        content: chunk,
        metadata: { ...metadataBase, chunk_index: index },
        embedding: embeddings[index]
      }))

      if (deleteBeforeInsert) {
        await deleteDocuments(pageIdUuid)
      }
      await upsertDocuments(rows)
      totalChunks += rows.length
    }
  }

  console.log(`Done. Upserted ${totalChunks} chunks.`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
