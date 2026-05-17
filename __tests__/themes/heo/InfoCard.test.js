import { fireEvent, render, screen } from '@testing-library/react'
import { InfoCard, normalizeGreetingList } from '@/themes/heo/components/InfoCard'
import { siteConfig } from '@/lib/config'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/'
  }))
}))

jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: function MockLazyImage({ alt }) {
    return <div aria-label={alt} />
  }
}))

jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>
}))

jest.mock('@/themes/heo/components/Announcement', () => ({
  __esModule: true,
  default: () => <div>announcement</div>
}))

jest.mock('@/themes/heo/components/Card', () => ({
  __esModule: true,
  default: ({ children, className }) => <div className={className}>{children}</div>
}))

describe('heo InfoCard greetings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'HEO_INFOCARD_GREETINGS') {
        return "['12', '23', '34']"
      }
      if (key === 'AUTHOR') {
        return 'Tester'
      }
      return defaultVal
    })
  })

  it('normalizes single-quoted greeting arrays from Notion config', () => {
    expect(normalizeGreetingList("['12', '23', '34']")).toEqual([
      '12',
      '23',
      '34'
    ])
  })

  it('renders parsed greetings and rotates between entries', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99)

    render(
      <InfoCard
        siteInfo={{ icon: '/avatar.png' }}
        notice={null}
      />
    )

    const greetingButton = screen.getByText('12')
    fireEvent.click(greetingButton)

    expect(screen.getByText('34')).toBeInTheDocument()

    randomSpy.mockRestore()
  })
})
