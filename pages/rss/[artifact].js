import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  buildRssArtifacts,
  getRssArtifactMeta,
  readRssArtifactFromDisk
} from '@/lib/utils/rss'

const RUNTIME_CACHE_TTL_MS = 10 * 60 * 1000
const runtimeArtifactCache = new Map()

function getCacheKey(locale) {
  return locale || 'default'
}

function getCachedArtifacts(locale) {
  const cached = runtimeArtifactCache.get(getCacheKey(locale))
  if (!cached) {
    return null
  }

  if (Date.now() - cached.createdAt >= RUNTIME_CACHE_TTL_MS) {
    runtimeArtifactCache.delete(getCacheKey(locale))
    return null
  }

  return cached.artifacts
}

function setCachedArtifacts(locale, artifacts) {
  runtimeArtifactCache.set(getCacheKey(locale), {
    createdAt: Date.now(),
    artifacts
  })
}

export async function getServerSideProps(ctx) {
  const { locale, params, res } = ctx
  const artifact = params?.artifact
  const artifactMeta = getRssArtifactMeta(artifact)

  if (!artifactMeta) {
    res.statusCode = 404
    res.end('Not Found')
    return { props: {} }
  }

  try {
    let content = readRssArtifactFromDisk(artifact)

    if (!content) {
      const cachedArtifacts = getCachedArtifacts(locale)
      let artifacts = cachedArtifacts

      if (!artifacts) {
        const props = await fetchGlobalAllData({
          from: `rss:${artifact}`,
          locale
        })
        artifacts = await buildRssArtifacts(props)
        setCachedArtifacts(locale, artifacts)
      }

      content = artifacts?.[artifact] || null
    }

    if (!content) {
      res.statusCode = 404
      res.end('Not Found')
      return { props: {} }
    }

    res.setHeader('Content-Type', artifactMeta.contentType)
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    )
    res.end(content)
  } catch (error) {
    console.error(`[RSS] Failed to serve ${artifact}:`, error)
    res.statusCode = 500
    res.end('Internal Server Error')
  }

  return { props: {} }
}

export default function RssArtifact() {
  return null
}
