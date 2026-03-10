import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * 移动端专属：横向滚动分类栏
 * 放在 Header 下方，支持触摸滑动
 */
const CategoryGroup = ({
  categoryOptions,
  compactMode = false,
  panelOpen = false,
  setPanelOpen
}) => {
  const router = useRouter()
  const currentCat = router.query.category
  const panelRef = useRef(null)

  useEffect(() => {
    if (!categoryOptions?.length || !panelOpen || typeof document === 'undefined') {
      return
    }

    const handlePointerDown = event => {
      const target = event.target
      if (panelRef.current?.contains(target)) return
      if (target.closest?.('[aria-controls="mobile-category-panel"]')) return
      setPanelOpen?.(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [categoryOptions?.length, panelOpen, setPanelOpen])

  if (!categoryOptions || categoryOptions.length === 0) return null

  const isHomeActive = router.pathname === '/'
  const chipClassName = isActive =>
    `shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'bg-white dark:bg-[#181818] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-500'
    }`

  const renderChip = ({ name, href, count, isActive, onClick }) => (
    <Link
      key={name}
      href={href}
      onClick={onClick}
      className={chipClassName(isActive)}>
      {name}
      {typeof count === 'number' && (
        <span
          className={`ml-1.5 text-[9px] opacity-70 ${
            isActive ? 'text-indigo-100' : 'text-gray-400'
          }`}>
          {count}
        </span>
      )}
    </Link>
  )

  return (
    <>
      <div
        className={`lg:hidden sticky top-12 z-40 overflow-hidden transition-all duration-300 ${
          compactMode
            ? 'mb-0 max-h-0 opacity-0 pointer-events-none'
            : 'mb-3 max-h-20 opacity-100'
        }`}>
        <div className='w-full border-b border-gray-200 bg-gray-50/92 py-2 backdrop-blur-md dark:border-gray-800 dark:bg-[#121212]/92'>
          <div className='flex items-center px-3 space-x-2 overflow-x-auto no-scrollbar scroll-smooth'>
            {renderChip({
              name: '首页',
              href: '/',
              isActive: isHomeActive
            })}

            {categoryOptions.map(cat =>
              renderChip({
                name: cat.name,
                href: `/category/${encodeURIComponent(cat.name)}`,
                count: cat.count,
                isActive: currentCat === cat.name
              })
            )}
          </div>
        </div>
      </div>

      {compactMode && (
        <>
          <div
            aria-hidden='true'
            className={`lg:hidden fixed inset-0 top-12 z-[60] bg-black/20 backdrop-blur-[1px] transition-all duration-200 ${
              panelOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          />
          <div
            id='mobile-category-panel'
            ref={panelRef}
            className={`lg:hidden fixed left-3 right-3 top-14 z-[70] rounded-[22px] border border-white/10 bg-black/88 p-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-200 ${
              panelOpen
                ? 'translate-y-0 scale-100 opacity-100'
                : '-translate-y-2 scale-[0.98] opacity-0 pointer-events-none'
            }`}>
            <div className='mb-3 flex items-center justify-between'>
              <div className='text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45'>
                Explore
              </div>
              <button
                type='button'
                onClick={() => setPanelOpen?.(false)}
                className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72'
                aria-label='关闭功能区'>
                <i className='fa-solid fa-xmark text-xs' />
              </button>
            </div>

            <div className='flex flex-wrap gap-2'>
              {renderChip({
                name: '首页',
                href: '/',
                isActive: isHomeActive,
                onClick: () => setPanelOpen?.(false)
              })}

              {categoryOptions.map(cat =>
                renderChip({
                  name: cat.name,
                  href: `/category/${encodeURIComponent(cat.name)}`,
                  count: cat.count,
                  isActive: currentCat === cat.name,
                  onClick: () => setPanelOpen?.(false)
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default CategoryGroup
