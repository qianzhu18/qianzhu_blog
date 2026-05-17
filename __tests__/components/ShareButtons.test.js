jest.mock('next/dynamic', () => () => function MockDynamicComponent() {
  return null
})

import { SHARE_ICON_CLASS } from '@/components/ShareButtons'

describe('ShareButtons icon mapping', () => {
  it('uses a twitter icon class that exists in the bundled Font Awesome version', () => {
    expect(SHARE_ICON_CLASS.twitter).toBe('fab fa-twitter')
  })
})
