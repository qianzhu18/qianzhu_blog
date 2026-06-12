import Link from 'next/link'
import { useState } from 'react'
import TagItemMini from './TagItemMini'
import LazyImage from '@/components/LazyImage'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Comment from '@/components/Comment'

const BlogPostCard = ({ post, index, siteInfo }) => {
  const [showComment, setShowComment] = useState(false)
  const publishDate = post?.publishDate || post?.publishDay
  const coverImage = post?.pageCover || post?.pageCoverThumbnail

  const toggleComment = () => {
    setShowComment(prev => !prev)
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto mb-8 bg-white dark:bg-[#181818] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
        index % 2 === 0 ? 'hover:-translate-y-1' : ''
      }`}>
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800/50'>
        <div className='flex items-center gap-3'>
          <Link href='/about'>
            <div className='relative w-10 h-10 cursor-pointer'>
              <LazyImage
                src={siteInfo?.icon}
                className='rounded-full object-cover border border-gray-200 dark:border-gray-700'
                alt={siteInfo?.title}
              />
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800'></div>
            </div>
          </Link>
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
              {siteInfo?.author || '千逐'}
            </span>
            <span className='text-xs text-gray-400 font-mono'>
              {publishDate ? formatDateFmt(publishDate, 'yyyy/MM/dd') : ''}
            </span>
          </div>
        </div>

        <div className='flex gap-2'>
          {post?.tags?.slice(0, 2).map(tag => (
            <TagItemMini key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <div className='px-6 py-4'>
        <Link href={`/${post?.slug}`} className='block group'>
          <h2 className='text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
            {post?.title}
          </h2>
        </Link>

        <p className='text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-4 line-clamp-3'>
          {post?.summary || ''}
        </p>

        {coverImage && (
          <Link href={`/${post?.slug}`}>
            <div className='relative w-full h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer group'>
              <LazyImage
                src={coverImage}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                alt={post?.title}
              />
            </div>
          </Link>
        )}
      </div>

      <div className='px-6 py-3 bg-gray-50/50 dark:bg-black/20 flex items-center justify-between border-t border-gray-100 dark:border-gray-800'>
        <div className='flex gap-6'>
          <Link
            href={`/${post?.slug}`}
            className='flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors group'>
            <i className='fa-regular fa-eye text-lg group-hover:scale-110 transition-transform' />
            <span className='text-xs font-medium'>阅读全文</span>
          </Link>

          <button
            type='button'
            onClick={toggleComment}
            className={`flex items-center gap-2 transition-colors group ${
              showComment ? 'text-indigo-500' : 'text-gray-500 hover:text-indigo-500'
            }`}>
            <i className='fa-regular fa-comment-dots text-lg group-hover:scale-110 transition-transform' />
            <span className='text-xs font-medium'>
              {showComment ? '收起评论' : '评论 / 留言'}
            </span>
          </button>
        </div>
      </div>

      {showComment && (
        <div className='px-6 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] animate-fade-in-down'>
          <Comment frontMatter={post} />
        </div>
      )}
    </div>
  )
}

export default BlogPostCard
