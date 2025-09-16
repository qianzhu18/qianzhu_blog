import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const router = useRouter()

  if (!link || !link.show) {
    return null
  }
  const hasSubMenu = link?.subMenus?.length > 0
  const selected = router.pathname === link.href || router.asPath === link.href

  return (
    <li
      className='cursor-pointer list-none items-center h-full magzine-menu-item-wrapper'
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {hasSubMenu && (
        <div
          className={`magzine-menu-item ${
            selected ? 'magzine-menu-item--active' : ''
          }`}>
          <div className='items-center flex'>
            {link?.icon && <i className={`${link?.icon} pr-2`} />} {link?.name}
            <i
              className={`px-1 fas fa-chevron-down duration-500 transition-all ${
                show ? 'rotate-180' : ''
              }`}></i>
          </div>
        </div>
      )}

      {!hasSubMenu && (
        <div
          className={`magzine-menu-item ${
            selected ? 'magzine-menu-item--active' : ''
          }`}>
          <Link href={link?.href} target={link?.target}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
          </Link>
        </div>
      )}

      {hasSubMenu && (
        <ul
          className={`${
            show
              ? 'visible opacity-100 top-14 pointer-events-auto'
              : 'invisible opacity-0 top-20 pointer-events-none'
          } p-1 absolute transition-all duration-150 z-20 block rounded-lg magzine-submenu`}>
          {link?.subMenus?.map(sLink => {
            return (
              <li key={sLink.id} className='magzine-submenu-item'>
                <Link href={sLink.href} target={link?.target}>
                  <span className='text-sm ml-2 flex items-center gap-2'>
                    {sLink?.icon && <i className={`${sLink?.icon}`} />}
                    {sLink.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
