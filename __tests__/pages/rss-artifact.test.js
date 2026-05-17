import { getServerSideProps } from '@/pages/rss/[artifact]'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  buildRssArtifacts,
  readRssArtifactFromDisk
} from '@/lib/utils/rss'

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/lib/utils/rss', () => {
  return {
    getRssArtifactMeta: jest.fn(name => {
      if (name === 'feed.xml') {
        return {
          contentType: 'application/rss+xml; charset=utf-8'
        }
      }
      return null
    }),
    buildRssArtifacts: jest.fn(),
    readRssArtifactFromDisk: jest.fn()
  }
})

describe('RSS artifact route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a 404 for unknown artifacts', async () => {
    const res = {
      end: jest.fn(),
      setHeader: jest.fn(),
      statusCode: 200
    }

    const result = await getServerSideProps({
      params: { artifact: 'unknown.txt' },
      locale: 'zh-CN',
      res
    })

    expect(result).toEqual({ props: {} })
    expect(res.statusCode).toBe(404)
    expect(res.end).toHaveBeenCalledWith('Not Found')
    expect(fetchGlobalAllData).not.toHaveBeenCalled()
  })

  it('serves generated feed content when static RSS files are missing', async () => {
    const res = {
      end: jest.fn(),
      setHeader: jest.fn(),
      statusCode: 200
    }

    readRssArtifactFromDisk.mockReturnValue(null)
    fetchGlobalAllData.mockResolvedValue({ latestPosts: [] })
    buildRssArtifacts.mockResolvedValue({
      'feed.xml': '<rss>generated</rss>'
    })

    const result = await getServerSideProps({
      params: { artifact: 'feed.xml' },
      locale: 'zh-CN',
      res
    })

    expect(result).toEqual({ props: {} })
    expect(fetchGlobalAllData).toHaveBeenCalledWith({
      from: 'rss:feed.xml',
      locale: 'zh-CN'
    })
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/rss+xml; charset=utf-8'
    )
    expect(res.end).toHaveBeenCalledWith('<rss>generated</rss>')
  })

  it('serves static RSS files without rebuilding them', async () => {
    const res = {
      end: jest.fn(),
      setHeader: jest.fn(),
      statusCode: 200
    }

    readRssArtifactFromDisk.mockReturnValue('<rss>static</rss>')

    const result = await getServerSideProps({
      params: { artifact: 'feed.xml' },
      locale: 'zh-CN',
      res
    })

    expect(result).toEqual({ props: {} })
    expect(fetchGlobalAllData).not.toHaveBeenCalled()
    expect(buildRssArtifacts).not.toHaveBeenCalled()
    expect(res.end).toHaveBeenCalledWith('<rss>static</rss>')
  })
})
