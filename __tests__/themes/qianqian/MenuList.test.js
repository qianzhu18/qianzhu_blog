import { render, screen } from '@testing-library/react'
import { MenuList } from '@/themes/qianqian/components/MenuList'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: jest.fn()
}))

jest.mock('@/themes/qianqian/components/MenuBarMobile', () => ({
  MenuBarMobile: () => null
}))

jest.mock('@/themes/qianqian/components/MenuItem', () => ({
  MenuItem: ({ link }) => <li>{link?.name || link?.title}</li>
}))

const { useRouter } = require('next/router')
const { siteConfig } = require('@/lib/config')
const { useGlobal } = require('@/lib/global')

describe('MenuList', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({ asPath: '/', route: '/' })
    useGlobal.mockReturnValue({
      locale: {
        NAV: { ARCHIVE: '归档', SEARCH: '搜索' },
        COMMON: { CATEGORY: '分类', TAGS: '标签' }
      }
    })
    siteConfig.mockImplementation((key, fallback) => {
      const map = {
        CUSTOM_MENU: true,
        HEO_MENU_ARCHIVE: true,
        HEO_MENU_SEARCH: true,
        HEO_MENU_CATEGORY: true,
        HEO_MENU_TAG: true
      }
      return key in map ? map[key] : fallback
    })
  })

  it('falls back to default links when custom menu is enabled but empty', () => {
    render(<MenuList customMenu={[]} customNav={[]} />)
    expect(screen.getByText('归档')).toBeInTheDocument()
    expect(screen.getByText('搜索')).toBeInTheDocument()
  })

  it('prefers custom menu when custom menu has items', () => {
    render(
      <MenuList
        customMenu={[{ name: '关于我', href: '/about' }]}
        customNav={[{ name: '旧导航', href: '/legacy' }]}
      />
    )

    expect(screen.getByText('关于我')).toBeInTheDocument()
    expect(screen.queryByText('归档')).not.toBeInTheDocument()
  })
})
