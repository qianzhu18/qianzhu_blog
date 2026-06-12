import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
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
  const { tagOptions } = useGlobal()
  const tags = normalizeTags(
    tagOptions && tagOptions.length > 0 ? tagOptions : post?.tags
  )
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

      <section className='rounded-3xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-zinc-900/50'>
        <div className='mb-4 flex items-center text-sm font-bold text-gray-900 dark:text-white'>
          <i className='anzhiyufont anzhiyu-icon-tags mr-2 text-indigo-500' />
          话题探索
        </div>
        <div className='flex flex-wrap gap-2'>
          {tags.length === 0 && (
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              暂无标签
            </span>
          )}
          {tags.map(tag => (
            <Link
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className='rounded-xl bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition-all hover:bg-indigo-500 hover:text-white dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-indigo-500'>
              #{tag.name}
              {tag.count ? (
                <span className='ml-1 opacity-50'>{tag.count}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Aside
