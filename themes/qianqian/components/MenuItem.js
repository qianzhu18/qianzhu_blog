import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 菜单链接
 * @param {*} param0
 * @returns
 */
export const MenuItem = ({ link }) => {
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()

  // 管理子菜单的展开状态
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const toggleSubMenu = () => {
    setIsSubMenuOpen(prev => !prev) // 切换子菜单状态
  }

  return (
    <>
      {/* 普通 MenuItem */}
      {!hasSubMenu && (
        <li className='group relative'>
          <Link
            href={link?.href}
            target={link?.target}
            className={`block w-full px-4 py-3 text-base font-medium text-gray-900 dark:text-gray-100 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 lg:mx-8 lg:inline-flex lg:w-auto lg:px-0 lg:py-3 lg:text-sm lg:rounded-none lg:hover:bg-transparent ${
              router.route === '/'
                ? 'lg:text-white lg:group-hover:text-white'
                : ''
            } lg:group-hover:opacity-70`}>
            {link?.icon && <i className={link.icon + ' mr-2 my-auto'} />}
            {link?.name}
          </Link>
        </li>
      )}

      {/* 有子菜单的 MenuItem */}
      {hasSubMenu && (
        <li className='submenu-item group relative'>
          <button
            onClick={toggleSubMenu}
            className={`w-full text-left cursor-pointer flex items-center justify-between px-4 py-3 text-base font-semibold text-gray-900 dark:text-gray-100 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 lg:ml-8 lg:mr-0 lg:inline-flex lg:w-auto lg:px-0 lg:py-3 lg:text-sm lg:rounded-none lg:hover:bg-transparent ${
              router.route === '/'
                ? 'lg:text-white lg:group-hover:text-white'
                : ''
            } lg:group-hover:opacity-70 xl:ml-10`}>
            <span>
              {link?.icon && <i className={link.icon + ' mr-2 my-auto'} />}
              {link?.name}
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
            className={`submenu transition-all duration-300 lg:absolute lg:left-0 lg:top-full lg:w-[260px] lg:rounded-sm lg:bg-white lg:p-4 lg:dark:bg-dark-2 lg:shadow-lg dark:border-gray-600 
            block opacity-100 visible static w-full bg-transparent p-0 mt-1 ${
              isSubMenuOpen ? 'lg:block lg:opacity-100 lg:visible' : 'lg:hidden lg:opacity-0 lg:invisible'
            } lg:group-hover:block lg:group-hover:opacity-100 lg:group-hover:visible`}>
            {link.subMenus.map((sLink, index) => (
              <Link
                key={index}
                href={sLink.href}
                target={link?.target}
                className='block w-full pl-10 pr-4 py-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 lg:text-sm lg:rounded-none'>
                {/* 子菜单 SubMenuItem */}
                <span className='text-md whitespace-nowrap'>
                  {link?.icon && <i className={sLink.icon + ' mr-2 my-auto'} />}
                  {sLink.title}
                </span>
              </Link>
            ))}
          </div>
        </li>
      )}
    </>
  )
}
