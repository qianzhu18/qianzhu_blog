import Collapse from '@/components/Collapse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 折叠菜单
 */
export const MenuItemCollapse = props => {
  const { link, onHeightChange } = props
  const [isOpen, setOpen] = useState(false)
  const router = useRouter()

  if (!link || !link.show) {
    return null
  }

  const hasSubMenu = link?.subMenus?.length > 0
  const selected = router.pathname === link.href || router.asPath === link.href

  useEffect(() => {
    setOpen(false)
  }, [router])

  const toggleOpenSubMenu = () => {
    if (hasSubMenu) {
      setOpen(!isOpen)
    }
  }

  return (
    <>
      <div
        className={`px-7 w-full text-left duration-200 magzine-menu-item ${
          selected ? 'magzine-menu-item--active' : ''
        }`}>
        {!hasSubMenu && (
          <Link
            href={link?.href}
            target={link?.target}
            className='py-2 w-full flex items-center justify-between text-sm group'>
            <div className='flex items-center gap-x-3'>
              {link?.icon && <i className={`${link?.icon} w-4 text-center`} />}
              <span>{link?.name}</span>
            </div>
            <i className='fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
          </Link>
        )}

        {hasSubMenu && (
          <div
            onClick={toggleOpenSubMenu}
            className='py-2 flex justify-between items-center cursor-pointer text-sm'>
            <div className='flex items-center gap-x-3'>
              {link?.icon && <i className={`${link?.icon} w-4 text-center`} />}
              <span>{link?.name}</span>
            </div>
            <div
              className={`inline-flex items-center transition-transform duration-200 ${
                isOpen ? 'rotate-90 text-cyan-200' : ''
              }`}>
              <i className='fas fa-chevron-right text-xs'></i>
            </div>
          </div>
        )}
      </div>

      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={onHeightChange}>
          {link?.subMenus?.map(sLink => {
            return (
              <div
                key={sLink.id}
                className='pl-12 py-2 magzine-submenu-item flex items-center gap-x-2'>
                <Link href={sLink.href} target={link?.target}>
                  <span className='flex items-center gap-x-2 text-xs'>
                    {sLink?.icon && <i className={`${sLink?.icon} w-3 text-center`} />}
                    {sLink.title}
                  </span>
                </Link>
              </div>
            )
          })}
        </Collapse>
      )}
    </>
  )
}
