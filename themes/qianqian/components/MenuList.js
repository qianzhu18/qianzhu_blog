import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { MenuItem } from './MenuItem'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

/**
 * 响应式 折叠菜单
 */
export const MenuList = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  const [showMenu, setShowMenu] = useState(false) // 控制菜单展开/收起状态
  const router = useRouter()
  const searchInputRef = useRef(null)
  const isComposing = useRef(false)
  const [searchKey, setSearchKey] = useState('')
  const searchModal = useRef(null)

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('HEO_MENU_ARCHIVE')
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('HEO_MENU_SEARCH')
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('HEO_MENU_CATEGORY')
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('HEO_MENU_TAG')
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU', BLOG.CUSTOM_MENU)) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu) // 切换菜单状态
  }

  useEffect(() => {
    setShowMenu(false)
  }, [router])

  // 锁定滚动，提升移动端抽屉体验
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = showMenu ? 'hidden' : ''
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = ''
    }
  }, [showMenu])

  const shouldShowSearch =
    !!siteConfig('ALGOLIA_APP_ID') &&
    !!siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY') &&
    !!siteConfig('ALGOLIA_INDEX')

  const triggerSearch = () => {
    const keyword = searchInputRef.current?.value?.trim()

    if (shouldShowSearch) {
      searchModal.current?.openSearch(keyword || '')
      setShowMenu(false)
      return
    }

    if (!keyword) {
      router.push('/search').then(() => setShowMenu(false))
      return
    }

    router
      .push(`/search/${encodeURIComponent(keyword)}`)
      .then(() => setShowMenu(false))
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !isComposing.current) {
      triggerSearch()
    }
  }

  const handleCompositionStart = () => {
    isComposing.current = true
  }

  const handleCompositionEnd = e => {
    isComposing.current = false
    setSearchKey(e.target.value)
  }

  const handleChange = e => {
    setSearchKey(e.target.value)
  }

  const clearSearch = () => {
    setSearchKey('')
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
      searchInputRef.current.focus()
    }
  }

  return (
    <div>
      {/* 移动端菜单切换按钮 */}
      <button
        id='navbarToggler'
        aria-controls='navbarCollapse'
        aria-expanded={showMenu}
        onClick={toggleMenu}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${
          showMenu ? 'navbarTogglerActive' : ''
        }`}>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
      </button>

      <nav
        id='navbarCollapse'
        className={`fixed inset-x-0 top-16 w-full max-h-[80vh] overflow-y-auto bg-white dark:bg-dark-2 border-t border-black/5 dark:border-white/10 px-2 py-3 shadow-xl lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none lg:border-0 lg:max-h-none lg:overflow-visible xl:px-6 ${
          showMenu ? 'block' : 'hidden lg:block'
        }`}>
        <ul className='block space-y-1 lg:flex lg:space-y-0 2xl:ml-20'>
          {links?.map((link, index) => (
            <MenuItem key={index} link={link} />
          ))}
          {shouldShowSearch && (
            <li className='group relative w-full lg:w-auto lg:ml-8'>
              <div className='flex w-full items-center rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5 lg:bg-white/10 lg:py-1 lg:px-3'>
                <input
                  ref={searchInputRef}
                  type='text'
                  value={searchKey}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  placeholder={locale.SEARCH?.ARTICLES}
                  className='w-full bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400'
                  aria-label={locale.SEARCH?.ARTICLES}
                />
                {searchKey && (
                  <button
                    type='button'
                    onClick={clearSearch}
                    className='ml-2 text-gray-400 transition hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100'
                    aria-label={locale.COMMON?.CLEAR || 'clear'}>
                    <i className='fas fa-times' />
                  </button>
                )}
                <button
                  type='button'
                  onClick={triggerSearch}
                  className='ml-2 text-gray-600 transition hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
                  aria-label={locale.NAV.SEARCH}>
                  <i className='fas fa-search' />
                </button>
              </div>
            </li>
          )}
        </ul>
      </nav>
      {shouldShowSearch && <AlgoliaSearchModal cRef={searchModal} {...props} />}
    </div>
  )
}
