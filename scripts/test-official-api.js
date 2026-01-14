#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

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

function toPlainText(richText = []) {
  if (!Array.isArray(richText)) return ''
  return richText.map(item => item?.plain_text || '').join('')
}

function normalizeId(id) {
  if (!id || typeof id !== 'string') return ''
  return id.replace(/-/g, '').toLowerCase()
}

function formatNotionId(id) {
  const raw = normalizeId(id)
  if (!raw) return ''
  if (raw.length !== 32) return id
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(
    12,
    16
  )}-${raw.slice(16, 20)}-${raw.slice(20)}`
}

function getDatabaseTitle(db) {
  const title = db?.title || db?.name || []
  if (Array.isArray(title)) return toPlainText(title) || 'Untitled'
  if (typeof title === 'string') return title || 'Untitled'
  return 'Untitled'
}

async function fetchBlockText(notion, blockId, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) return []
  const texts = []
  let cursor = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 50
    })
    cursor = response.has_more ? response.next_cursor : undefined

    for (const block of response.results) {
      const blockType = block.type
      const blockValue = block[blockType]
      if (blockValue?.rich_text) {
        const text = toPlainText(blockValue.rich_text).trim()
        if (text) texts.push(text)
      }

      if (block.has_children) {
        const children = await fetchBlockText(
          notion,
          block.id,
          depth + 1,
          maxDepth
        )
        if (children.length) texts.push(...children)
      }
    }
  } while (cursor)

  return texts
}

async function main() {
  loadEnv()

  let NotionClient = null
  try {
    ;({ Client: NotionClient } = require('@notionhq/client'))
  } catch (error) {
    console.error(
      'Missing dependency: @notionhq/client. Install with: npm i @notionhq/client'
    )
    process.exit(1)
  }

  const token = process.env.NOTION_ACCESS_TOKEN
  const databaseId = formatNotionId(process.env.NOTION_PAGE_ID)
  const dataSourceIdEnv = formatNotionId(process.env.NOTION_DATA_SOURCE_ID)
  if (!token || (!databaseId && !dataSourceIdEnv)) {
    console.error(
      'Missing env vars: NOTION_ACCESS_TOKEN, and one of NOTION_PAGE_ID or NOTION_DATA_SOURCE_ID'
    )
    process.exit(1)
  }

  const notion = new NotionClient({ auth: token })

  try {
    const me = await notion.users.me()
    console.log(
      `Authenticated as: ${me?.name || 'Unknown'} (${me?.type || 'unknown'})`
    )
  } catch (error) {
    console.warn('Failed to fetch integration identity:', error?.message || error)
  }

  try {
    let search = null
    try {
      search = await notion.search({
        filter: { property: 'object', value: 'data_source' },
        page_size: 10
      })
    } catch (error) {
      search = await notion.search({
        filter: { property: 'object', value: 'database' },
        page_size: 10
      })
    }
    const results = Array.isArray(search?.results) ? search.results : []
    if (results.length === 0) {
      console.warn(
        'No databases/data sources visible to this integration. Check workspace and sharing permissions.'
      )
    } else {
      console.log('Databases/data sources visible to this integration (sample):')
      results.forEach(result => {
        console.log(
          `- ${getDatabaseTitle(result)} (${result.object}: ${result.id})`
        )
      })
    }
    const targetId = dataSourceIdEnv || databaseId
    if (targetId) {
      const found = results.some(
        result => normalizeId(result.id) === normalizeId(targetId)
      )
      if (!found) {
        console.warn(
          'Target ID not found in search results. It may be a linked view or not shared.'
        )
      }
    }
  } catch (error) {
    console.warn('Database search failed:', error?.message || error)
  }

  let dataSourceId = null
  if (!dataSourceIdEnv) {
    try {
      const db = await notion.databases.retrieve({ database_id: databaseId })
      dataSourceId =
        db?.data_source_id ||
        db?.data_source ||
        (Array.isArray(db?.data_sources) ? db.data_sources[0]?.id : null)
    } catch (error) {
      console.error(
        'Failed to retrieve database. Ensure the integration is shared to this database.'
      )
      throw error
    }
  } else {
    dataSourceId = dataSourceIdEnv
  }

  let query = null
  if (notion.databases?.query) {
    query = await notion.databases.query({
      database_id: databaseId,
      page_size: 5
    })
  } else if (notion.dataSources?.query) {
    if (!dataSourceId) {
      console.error('No data source ID found for this database.')
      process.exit(1)
    }
    query = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 5
    })
  } else {
    console.error('Notion client does not support database query methods.')
    process.exit(1)
  }
  const firstPage = query.results?.[0]
  if (!firstPage) {
    console.error('No pages found in the database.')
    process.exit(1)
  }

  console.log(`Fetched ${query.results.length} pages. Testing first page...`)

  const blocksText = await fetchBlockText(notion, firstPage.id)
  if (!blocksText.length) {
    console.log('No block text found.')
    return
  }

  console.log('--- Page Text Preview ---')
  console.log(blocksText.join('\n'))
}

main().catch(error => {
  console.error('Test failed:', error?.message || error)
  process.exit(1)
})
