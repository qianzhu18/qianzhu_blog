import SmartLink from '@/components/SmartLink'

export default function CategoryItem({ selected, category, categoryCount }) {
  return (
    <SmartLink
      href={`/category/${category}`}
      passHref
      className={`magzine-pill ${selected ? 'magzine-pill--active' : ''}`}>
      <div>
        {category} {categoryCount && `(${categoryCount})`}
      </div>
    </SmartLink>
  )
}
