jest.mock('@/lib/db/getSiteData', () => ({
  getPostBlocks: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/plugins/algolia', () => ({
  uploadDataToAlgolia: jest.fn()
}))

jest.mock('@/lib/notion/getPageTableOfContents', () => ({
  getPageTableOfContents: jest.fn(() => [])
}))

jest.mock('@/lib/notion/getPageContentText', () => ({
  getPageContentText: jest.fn(() => '')
}))

const { getPostBlocks } = require('@/lib/db/getSiteData')
const { siteConfig } = require('@/lib/config')
const { processPostData } = require('@/lib/utils/post')

describe('processPostData', () => {
  beforeEach(() => {
    siteConfig.mockImplementation((_, fallback) => fallback)
  })

  it('degrades invalid post id to null without requesting notion blocks', async () => {
    const props = {
      post: {
        id: 1,
        slug: 'oops',
        type: 'Post',
        status: 'Published'
      },
      allPages: []
    }

    await processPostData(props, 'slug-props-oops')

    expect(getPostBlocks).not.toHaveBeenCalled()
    expect(props.post).toBeNull()
    expect(props.prev).toBeNull()
    expect(props.next).toBeNull()
    expect(props.recommendPosts).toEqual([])
    expect(props.allPages).toBeUndefined()
  })
})
