import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CategoryItem from './CategoryItem'

/**
 * 不带图片
 */
const PostItemCardSimple = ({ post }) => {
  return (
    <div
      key={post.id}
      className='lg:mb-6 max-w-screen-3xl mr-8 py-3 gap-y-3 flex flex-col magzine-simple-card magzine-reveal'>
      <div className='flex mr-2 items-center'>
        {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
          <CategoryItem category={post.category} />
        )}
      </div>

      <Link
        href={post?.href}
        passHref
        className='cursor-pointer hover:underline text-lg leading-tight text-slate-200 hover:text-cyan-200'>
        <h2>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post.pageIcon} />}
          {post.title}
        </h2>
      </Link>

      <div className='text-sm text-slate-400'>{post.date?.start_date}</div>
    </div>
  )
}

export default PostItemCardSimple
