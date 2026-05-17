import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import { getPostBlocks } from '@/lib/db/SiteDataApi'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'
import ReactDOMServer from 'react-dom/server'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

export const RSS_ARTIFACT_META = {
  'feed.xml': {
    contentType: 'application/rss+xml; charset=utf-8',
    render: feed => feed.rss2()
  },
  'atom.xml': {
    contentType: 'application/atom+xml; charset=utf-8',
    render: feed => feed.atom1()
  },
  'feed.json': {
    contentType: 'application/feed+json; charset=utf-8',
    render: feed => feed.json1()
  }
}

export function shouldGenerateRssForLocale({
  locale,
  defaultLocale = BLOG.LANG
} = {}) {
  return !locale || locale === defaultLocale
}

export function getRssArtifactMeta(name) {
  return RSS_ARTIFACT_META[name] || null
}

export function getRssArtifactPath(name) {
  return path.join(process.cwd(), 'public', 'rss', name)
}

export function readRssArtifactFromDisk(name) {
  const meta = getRssArtifactMeta(name)
  if (!meta) {
    return null
  }

  try {
    return fs.readFileSync(getRssArtifactPath(name), 'utf8')
  } catch (error) {
    return null
  }
}

/**
 * 生成RSS内容
 * @param {*} post
 * @returns
 */
const createFeedContent = async post => {
  // 加密的文章内容只返回摘要
  if (post.password && post.password !== '') {
    return post.summary
  }
  const blockMap = await getPostBlocks(post.id, 'rss-content')
  if (blockMap) {
    post.blockMap = blockMap
    // Notion修改了数据格式再次做统一兼容
    post.blockMap = adapterNotionBlockMap(post.blockMap)
    // 格式化内容，部分的样式字段格式在此处理
    if (post.blockMap?.block) {
      post.blockMap.block = formatNotionBlock(post.blockMap.block)
    }

    const content = ReactDOMServer.renderToString(<NotionPage post={post} />)
    const regexExp =
      /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  }
}

/**
 * 生成RSS数据
 * @param {*} props
 */
export async function generateRss(props) {
  // 检查 feed 文件是否在10分钟内更新过
  if (isFeedRecentlyUpdated(getRssArtifactPath('feed.xml'), 10)) {
    return
  }

  console.log('[RSS订阅] 生成/rss/feed.xml')
  const artifacts = await buildRssArtifacts(props)

  try {
    fs.mkdirSync(path.join(process.cwd(), 'public', 'rss'), { recursive: true })
    for (const [name, content] of Object.entries(artifacts)) {
      fs.writeFileSync(getRssArtifactPath(name), content)
    }
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
    // RSS被高频词访问将大量消耗服务端资源，故作为静态文件
  }
}

export async function buildRssArtifacts(props) {
  const { NOTION_CONFIG, siteInfo, latestPosts = [] } = props
  const TITLE = siteInfo?.title
  const DESCRIPTION = siteInfo?.description
  const LINK = siteInfo?.link
  const AUTHOR = NOTION_CONFIG?.AUTHOR || BLOG.AUTHOR
  const LANG = NOTION_CONFIG?.LANG || BLOG.LANG
  const SUB_PATH = NOTION_CONFIG?.SUB_PATH || BLOG.SUB_PATH
  const CONTACT_EMAIL = decryptEmail(
    NOTION_CONFIG?.CONTACT_EMAIL || BLOG.CONTACT_EMAIL
  )
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: TITLE,
    description: DESCRIPTION,
    link: `${LINK}/${SUB_PATH}`,
    language: LANG,
    favicon: `${LINK}/favicon.png`,
    copyright: `All rights reserved ${year}, ${AUTHOR}`,
    author: {
      name: AUTHOR,
      email: CONTACT_EMAIL,
      link: LINK
    }
  })

  const items = await Promise.all(latestPosts.map(async post => ({
    title: post.title,
    link: `${LINK}/${post.slug}`,
    description: post.summary,
    content: await createFeedContent(post),
    date: new Date(post?.publishDay)
  })))

  for (const item of items) {
    feed.addItem(item)
  }

  return Object.fromEntries(
    Object.entries(RSS_ARTIFACT_META).map(([name, meta]) => [
      name,
      meta.render(feed)
    ])
  )
}

/**
 * 检查上次更新，如果60分钟内更新过就不操作。
 * @param {*} filePath
 * @param {*} intervalMinutes
 * @returns
 */
function isFeedRecentlyUpdated(filePath, intervalMinutes = 60) {
  try {
    const stats = fs.statSync(filePath)
    const now = new Date()
    const lastModified = new Date(stats.mtime)
    const timeDifference = (now - lastModified) / (1000 * 60) // 转换为分钟
    return timeDifference < intervalMinutes
  } catch (error) {
    // 如果文件不存在，我们需要创建它
    return false
  }
}
