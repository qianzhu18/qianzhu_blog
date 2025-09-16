import Link from 'next/link'

export default function CategoryItem({ selected, category, categoryCount }) {
  return (
    <Link
      href={`/category/${category}`}
      passHref
      className={`magzine-pill ${selected ? 'magzine-pill--active' : ''}`}>
      <div>
        {category} {categoryCount && `(${categoryCount})`}
      </div>
    </Link>
  )
}
