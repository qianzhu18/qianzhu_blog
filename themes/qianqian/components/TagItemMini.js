import Link from 'next/link'

const TagItemMini = ({ tag }) => {
  const name = typeof tag === 'string' ? tag : tag?.name
  if (!name) return null
  const count = typeof tag === 'object' ? tag?.count : null

  return (
    <Link
      href={`/tag/${encodeURIComponent(name)}`}
      className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 transition-colors hover:bg-indigo-500 hover:text-white dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-indigo-500'>
      {name}
      {count ? <span className='ml-1 opacity-70'>({count})</span> : null}
    </Link>
  )
}

export default TagItemMini
