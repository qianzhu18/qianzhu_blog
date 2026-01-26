import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

/**
 * 菜单链接
 * @param {*} param0
 * @returns
 */
export const MenuItem = ({ link, depth = 0 }) => {
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()
  const prefetchedRef = useRef(false)

  // 管理子菜单的展开状态
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const toggleSubMenu = () => {
    setIsSubMenuOpen(prev => !prev) // 切换子菜单状态
  }

  const prefetchRoutes = () => {
    if (prefetchedRef.current) return
    prefetchedRef.current = true

    const targets = hasSubMenu ? link.subMenus : [link]
    targets?.forEach(item => {
      const href = item?.href
      if (typeof href === 'string' && href.startsWith('/')) {
        router.prefetch(href)
      }
    })
  }

  const label = link?.name || link?.title || link?.label
  const isRoot = depth === 0
  const baseItemClass = isRoot
    ? 'flex items-center gap-2 min-h-[44px] w-full rounded-lg px-4 py-3 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5 lg:inline-flex lg:w-auto lg:px-0 lg:py-3 lg:text-sm lg:rounded-none lg:hover:bg-transparent'
    : 'flex items-center gap-2 min-h-[44px] w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
  const isHomeRoute = router.route === '/'
  const isHomeLink = link?.href === '/'
  const activeClass =
    isRoot && isHomeRoute && isHomeLink
      ? 'lg:text-emerald-700 lg:group-hover:text-emerald-700 dark:lg:text-emerald-300 dark:lg:group-hover:text-emerald-300'
      : ''
  const submenuPositionClass = depth > 0 ? 'lg:left-full lg:top-0 lg:ml-2' : 'lg:left-0 lg:top-full'

  return (
    <>
      {/* 普通 MenuItem */}
      {!hasSubMenu && (
        <li className='group relative'>
          <Link
            href={link?.href}
            target={link?.target}
            onMouseEnter={prefetchRoutes}
            onFocus={prefetchRoutes}
            onTouchStart={prefetchRoutes}
            className={`${baseItemClass} ${activeClass} ${isRoot ? 'lg:mx-8 lg:group-hover:opacity-70' : ''} faa-tada animated-hover`}>
            {link?.icon && <i className={link.icon + ' my-auto'} />}
            <span className='whitespace-nowrap'>{label}</span>
          </Link>
        </li>
      )}

      {/* 有子菜单的 MenuItem */}
      {hasSubMenu && (
        <li className='submenu-item group relative'>
          <button
            onClick={toggleSubMenu}
            onMouseEnter={prefetchRoutes}
            onFocus={prefetchRoutes}
            onTouchStart={prefetchRoutes}
            className={`nav-dropdown-trigger w-full text-left cursor-pointer flex items-center justify-between min-h-[44px] px-4 py-3 text-base font-semibold text-gray-900 dark:text-gray-100 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${isRoot ? 'qianqian-nav-button lg:ml-8 lg:mr-0 lg:inline-flex lg:w-auto lg:px-0 lg:py-3 lg:text-sm lg:rounded-none lg:hover:bg-transparent lg:group-hover:opacity-70 xl:ml-10' : ''} ${activeClass} faa-tada animated-hover`}>
            <span className='flex items-center gap-2'>
              {link?.icon && <i className={link.icon + ' my-auto'} />}
              <span className='whitespace-nowrap'>{label}</span>
            </span>

            <svg
              className='ml-2 fill-current'
              width='16'
              height='20'
              viewBox='0 0 16 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M7.99999 14.9C7.84999 14.9 7.72499 14.85 7.59999 14.75L1.84999 9.10005C1.62499 8.87505 1.62499 8.52505 1.84999 8.30005C2.07499 8.07505 2.42499 8.07505 2.64999 8.30005L7.99999 13.525L13.35 8.25005C13.575 8.02505 13.925 8.02505 14.15 8.25005C14.375 8.47505 14.375 8.82505 14.15 9.05005L8.39999 14.7C8.27499 14.825 8.14999 14.9 7.99999 14.9Z' />
            </svg>
          </button>

          {/* 子菜单：移动端默认展开；桌面端点击展开 */}
          <div
            className={`menus_item_child submenu transition-all duration-300 lg:absolute ${submenuPositionClass} lg:w-[280px] lg:rounded-xl lg:bg-white lg:p-4 lg:dark:bg-dark-2 lg:shadow-lg dark:border-gray-600 static w-full bg-transparent p-0 mt-1 ${isSubMenuOpen ? 'is-open' : ''}`}>
            <ul className='space-y-1'>
              {link.subMenus.map((sLink, index) => (
                <MenuItem key={index} link={sLink} depth={depth + 1} />
              ))}
            </ul>
          </div>
        </li>
      )}
    </>
  )
}
