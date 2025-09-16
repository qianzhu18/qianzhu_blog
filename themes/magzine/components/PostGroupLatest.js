import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * 最新文章列表
 */
const PostGroupLatest = props => {
  const { latestPosts, vertical } = props
  const currentPath = useRouter().asPath
  const { locale, siteInfo } = useGlobal()
  if (!latestPosts) {
    return <></>
  }

  return (
    <div className='magzine-side-card magzine-reveal'>
      <div className='mb-2 px-1 flex flex-nowrap justify-between'>
        <div className='font-bold text-lg text-slate-100'>
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-2 ${!vertical ? 'lg:grid-cols-4' : ''}`}>
        {latestPosts.map(post => {
          const selected =
            currentPath === `${siteConfig('SUB_PATH', '')}/${post.slug}`

          const headerImage = post?.pageCoverThumbnail
            ? post.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <Link
              key={post.id}
              title={post.title}
              href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
              passHref
              className='my-3 flex group'>
              <div className='w-20 h-14 overflow-hidden relative rounded-xl magzine-image-frame'>
                <LazyImage
                  alt={post?.title}
                  src={`${headerImage}`}
                  className='object-cover w-full h-full group-hover:scale-110 duration-300'
                />
              </div>
              <div
                className={
                  (selected ? 'text-cyan-200 ' : 'text-slate-300 ') +
                  ' text-sm overflow-x-hidden px-2 duration-200 w-full rounded group-hover:text-cyan-200 cursor-pointer items-center flex'
                }>
                <div>
                  <div className='line-clamp-2 menu-link'>{post.title}</div>
                  <div className='text-slate-500'>{post.lastEditedDay}</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
export default PostGroupLatest
