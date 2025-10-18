import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MenuItem } from './MenuItem'

/**
 * 响应式 折叠菜单
 */
export const MenuList = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  const [showMenu, setShowMenu] = useState(false) // 控制菜单展开/收起状态
  const router = useRouter()

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

  return (
    <div>
      {/* 移动端菜单切换按钮 */}
      <button
        id='navbarToggler'
        aria-controls='navbarCollapse'
        aria-expanded={showMenu}
        onClick={toggleMenu}
        className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${
          showMenu ? 'navbarTogglerActive' : ''
        }`}>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
        <span className='relative my-[6px] block h-[2px] w-[30px] bg-white duration-200 transition-all'></span>
      </button>

      <nav
        id='navbarCollapse'
        className={`fixed inset-x-0 top-16 w-full max-h-[80vh] overflow-y-auto bg-white dark:bg-dark-2 border-t border-black/5 dark:border-white/10 px-2 py-3 shadow-xl lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none lg:border-0 xl:px-6 ${
          showMenu ? 'block' : 'hidden lg:block'
        }`}>
        <ul className='block space-y-1 lg:flex lg:space-y-0 2xl:ml-20'>
          {links?.map((link, index) => (
            <MenuItem key={index} link={link} />
          ))}
        </ul>
      </nav>
    </div>
  )
}
