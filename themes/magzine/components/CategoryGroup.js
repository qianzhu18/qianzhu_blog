import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * 分类
 */
const CategoryGroup = ({ currentCategory, categoryOptions }) => {
  const { locale } = useGlobal()
  if (!categoryOptions) {
    return <></>
  }
  return (
    <div id='category-list' className='pt-4 magzine-side-card magzine-reveal'>
      <div className='text-xl font-bold mb-2 text-slate-100'>
        {locale.COMMON.CATEGORY}
      </div>
      <div className='flex flex-wrap gap-2'>
        {categoryOptions?.map((category, index) => {
          const selected = currentCategory === category.name
          return (
            <Link
              key={index}
              href={`/category/${category.name}`}
              passHref
              className={`magzine-pill ${selected ? 'magzine-pill--active' : ''}`}>
              <span className='text-sm'>
                {category.name} {category?.count && `(${category?.count})`}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryGroup
