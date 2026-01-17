import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 移动端专属：横向滚动分类栏
 * 放在 Header 下方，支持触摸滑动
 */
const CategoryGroup = ({ categoryOptions }) => {
  const router = useRouter()
  const currentCat = router.query.category

  if (!categoryOptions || categoryOptions.length === 0) return null

  return (
    <div className='lg:hidden sticky top-14 z-40 w-full transition-colors duration-300 py-2 bg-gray-50/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'>
      <div className='flex items-center px-4 space-x-2 overflow-x-auto no-scrollbar scroll-smooth'>
        <Link
          href='/'
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
            router.pathname === '/'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
          }`}>
          首页
        </Link>

        {categoryOptions.map(cat => {
          const isActive = currentCat === cat.name
          return (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
              }`}>
              {cat.name}
              <span
                className={`ml-1 ${
                  isActive ? 'text-indigo-100' : 'text-gray-400'
                }`}>
                {cat.count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryGroup
