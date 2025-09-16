import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { MenuItemCollapse } from './MenuItemCollapse'

/**
 * 移动端菜单
 */
export const MenuBarMobile = props => {
  const { customMenu, customNav } = props
  const { locale } = useGlobal()

  let links = [
    {
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('MAGZINE_MENU_CATEGORY')
    },
    {
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('MAGZINE_MENU_TAG')
    },
    {
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('MAGZINE_MENU_ARCHIVE')
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav id='nav' className='text-md magzine-mobile-nav'>
      {links?.map((link, index) => (
        <MenuItemCollapse
          onHeightChange={props.onHeightChange}
          key={index}
          link={link}
        />
      ))}
    </nav>
  )
}
