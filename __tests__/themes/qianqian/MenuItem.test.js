import { render, screen } from '@testing-library/react'
import { MenuItem } from '@/themes/qianqian/components/MenuItem'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

const { useRouter } = require('next/router')

describe('MenuItem', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      route: '/',
      asPath: '/',
      prefetch: jest.fn()
    })
  })

  it('does not force active white text on non-home items when at home', () => {
    render(
      <MenuItem
        link={{ href: '/about', name: 'About' }}
        depth={0}
      />
    )

    const anchor = screen.getByText('About').closest('a')
    expect(anchor).toBeTruthy()
    expect(anchor.className).not.toContain('lg:text-white')
  })

  it('adds qianqian-nav-button class for top-level submenu buttons', () => {
    render(
      <MenuItem
        link={{
          name: 'Menu',
          subMenus: [{ name: 'Child', href: '/child' }]
        }}
        depth={0}
      />
    )

    const button = screen.getByRole('button', { name: /menu/i })
    expect(button.className).toContain('qianqian-nav-button')
  })
})
