import BLOG from '@/blog.config'
import algoliasearch from 'algoliasearch'
import { getPageContentText } from '@/lib/notion/getPageContentText'

// 全局初始化 Algolia 客户端和索引
let algoliaClient
let algoliaIndex

const initAlgolia = () => {
  if (!algoliaClient) {
    if (
      !BLOG.ALGOLIA_APP_ID ||
      !BLOG.ALGOLIA_ADMIN_APP_KEY ||
      !BLOG.ALGOLIA_INDEX
    ) {
      console.warn('Algolia configuration is missing')
    }
    algoliaClient = algoliasearch(
      BLOG.ALGOLIA_APP_ID,
      BLOG.ALGOLIA_ADMIN_APP_KEY
    )
    algoliaIndex = algoliaClient.initIndex(BLOG.ALGOLIA_INDEX)
  }
  return { client: algoliaClient, index: algoliaIndex }
}

// 初始化全局实例
initAlgolia()

/**
 * 生成全文索引
 * @param {*} allPages
 */
const generateAlgoliaSearch = ({ allPages, force = false }) => {
  allPages?.forEach(p => {
    // 判断这篇文章是否需要重新创建索引
    if (p && !p.password) {
      uploadDataToAlgolia(p)
    }
  })
}

/**
 * 检查数据是否需要从algolia删除
 * @param {*} props
 */
export const checkDataFromAlgolia = async props => {
  const { allPages } = props
  const deletions = (allPages || [])
    .map(p => {
      if (p && (p.password || p.status === 'Draft')) {
        return deletePostDataFromAlgolia(p)
      }
    })
    .filter(Boolean) // 去除 undefined
  await Promise.all(deletions)
}

/**
 * 删除数据
 * @param post
 */
const deletePostDataFromAlgolia = async post => {
  if (!post) {
    return
  }

  // 检查是否有索引
  let existed
  try {
    existed = await algoliaIndex.getObject(`${post.id}-0`)
  } catch (error) {
    // 通常是不存在索引
  }

  try {
    if (existed?.chunkCount) {
      const objectIDs = Array.from(
        { length: existed.chunkCount },
        (_, index) => `${post.id}-${index}`
      )
      await algoliaIndex.deleteObjects(objectIDs).wait()
    } else {
      await algoliaIndex.deleteObject(`${post.id}-0`).wait()
    }
    await algoliaIndex.deleteObject(post.id).wait()
    console.log('Algolia索引删除成功')
  } catch (err) {
    console.log('Algolia异常', err)
  }
}

/**
 * 上传数据
 * 根据上次修改文章日期和上次更新索引数据判断是否需要更新algolia索引
 */
const uploadDataToAlgolia = async post => {
  if (!post) {
    return
  }

  // 检查是否有索引
  let existed
  let needUpdateIndex = false
  try {
    existed = await algoliaIndex.getObject(`${post.id}-0`)
  } catch (error) {
    // 通常是不存在索引
  }

  if (!existed || !existed?.lastEditedDate || !existed?.lastIndexDate) {
    needUpdateIndex = true
  } else {
    const lastEditedDate = new Date(post.lastEditedDate)
    const lastIndexDate = new Date(existed.lastIndexDate)
    if (lastEditedDate.getTime() > lastIndexDate.getTime()) {
      needUpdateIndex = true
    }
  }

  // 如果需要更新搜索
  if (needUpdateIndex) {
    const rawContent = getPageContentText(post, post.blockMap)
    const normalizedContent = normalizeContent(rawContent)
    const contentChunks = splitContentIntoChunks(normalizedContent)
    const safeChunks =
      contentChunks.length > 0
        ? contentChunks
        : [post.summary || post.title || '']
    const chunkCount = safeChunks.length

    const records = safeChunks.map((chunk, index) => ({
      objectID: `${post.id}-${index}`,
      postId: post.id,
      title: post.title,
      slug: post.slug,
      content: chunk,
      category: post.category,
      tags: post.tags,
      summary: post.summary,
      lastEditedDate: post.lastEditedDate,
      lastIndexDate: new Date(),
      chunkCount
    }))

    try {
      if (existed?.chunkCount) {
        const objectIDs = Array.from(
          { length: existed.chunkCount },
          (_, index) => `${post.id}-${index}`
        )
        await algoliaIndex.deleteObjects(objectIDs).wait()
      }
      await algoliaIndex.saveObjects(records).wait()
      console.log('Algolia索引更新')
    } catch (err) {
      console.log('Algolia异常', err)
    }
  }
}

/**
 * 限制内容字节数
 * @param {*} str
 * @param {*} maxBytes
 * @returns
 */
function truncate(str, maxBytes) {
  let count = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code <= 0x7f) {
      count += 1
    } else if (code <= 0x7ff) {
      count += 2
    } else if (code <= 0xffff) {
      count += 3
    } else {
      count += 4
    }
    if (count <= maxBytes) {
      result += str[i]
    } else {
      break
    }
  }
  return result
}

function normalizeContent(content) {
  if (!content) return ''
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}

function splitContentIntoChunks(content, maxLength = 1200) {
  if (!content) return []
  const rawChunks = content
    .split('\n')
    .map(chunk => chunk.trim())
    .filter(Boolean)
  const chunks = rawChunks.length > 0 ? rawChunks : [content.trim()]
  const result = []
  chunks.forEach(chunk => {
    if (chunk.length <= maxLength) {
      result.push(chunk)
      return
    }
    for (let i = 0; i < chunk.length; i += maxLength) {
      result.push(chunk.slice(i, i + maxLength))
    }
  })
  return result
}

export { uploadDataToAlgolia, generateAlgoliaSearch }
