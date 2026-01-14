import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import SocialButton from './SocialButton'

const normalizeTags = tags => {
  if (!Array.isArray(tags)) return []
  return tags.map(tag => {
    if (typeof tag === 'string') {
      return { name: tag }
    }
    return tag
  })
}

export const Aside = ({ post, siteInfo }) => {
  const tags = normalizeTags(post?.tags)
  const author = siteConfig('AUTHOR')
  const bio = siteConfig('BIO')
  const avatar = siteConfig('AVATAR') || siteInfo?.icon

  return (
    <div className='space-y-4'>
      <section className='rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/30'>
        <div className='flex items-center gap-4'>
          <div className='h-14 w-14 overflow-hidden rounded-full border border-white/40 bg-white/80 shadow-sm dark:border-white/10'>
            <LazyImage
              src={avatar}
              alt={author}
              className='h-full w-full object-cover'
            />
          </div>
          <div>
            <div className='text-base font-semibold text-gray-900 dark:text-white'>
              {author}
            </div>
            <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
              {bio}
            </p>
          </div>
        </div>
        <div className='mt-3 flex justify-center'>
          <SocialButton />
        </div>
      </section>

      <section className='rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/30'>
        <div className='text-sm font-semibold text-gray-900 dark:text-white'>
          文章标签
        </div>
        <div className='mt-3 flex flex-wrap gap-2'>
          {tags.length === 0 && (
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              暂无标签
            </span>
          )}
          {tags.map(tag => (
            <Link
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className='inline-flex items-center rounded-full border border-gray-200/70 bg-white/70 px-2.5 py-1 text-xs text-gray-600 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-yellow-500/50 dark:hover:text-yellow-200'>
              <i className='fas fa-tag mr-1 text-[10px]' />
              {tag.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Aside
