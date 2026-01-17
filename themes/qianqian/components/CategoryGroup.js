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
    <div className='lg:hidden sticky top-14 z-[998] w-full bg-black/95 border-b border-gray-800 backdrop-blur-md'>
      <div className='flex items-center px-4 py-2 space-x-2 overflow-x-auto no-scrollbar scroll-smooth'>
        <Link
          href='/'
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            router.pathname === '/'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-gray-400 bg-gray-900 hover:bg-gray-800'
          }`}>
          首页
        </Link>

        {categoryOptions.map(cat => {
          const isActive = currentCat === cat.name
          return (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-400 bg-gray-900 hover:bg-gray-800'
              }`}>
              {cat.name}
              <span
                className={`ml-1.5 text-[10px] ${
                  isActive ? 'text-indigo-200' : 'text-gray-600'
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
