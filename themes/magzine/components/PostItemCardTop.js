import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'

/**
 * 置顶头条文章
 */
const PostItemCardTop = ({ post, showSummary }) => {
  const showPreview =
    siteConfig('MAGZINE_POST_LIST_PREVIEW', true, CONFIG) && post?.blockMap
  const { locale } = useGlobal()

  return (
    <div
      key={post?.id}
      className='mb-6 max-w-screen-3xl magzine-card magzine-reveal px-6 py-6'>
      <div className='flex flex-col w-full gap-y-2'>
        {siteConfig('MAGZINE_POST_LIST_COVER', true, CONFIG) &&
          post?.pageCoverThumbnail && (
            <SmartLink
              href={post?.href || ''}
              passHref
              className='cursor-pointer hover:underline text-4xl leading-tight text-slate-100 hover:text-cyan-200'>
              <div className='w-full h-80 object-cover overflow-hidden mb-2 rounded-2xl magzine-image-frame'>
                <LazyImage
                  priority
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  className='w-full h-80 object-cover hover:scale-110 duration-300'
                />
              </div>
            </SmartLink>
          )}

        <div className='flex py-2 gap-2 items-center text-slate-300'>
          {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
            <CategoryItem category={post?.category} />
          )}
          <div className='flex items-center justify-start flex-wrap gap-2 text-slate-400'>
            {siteConfig('MAGZINE_POST_LIST_TAG') &&
              post?.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
          </div>
        </div>

        <SmartLink
          href={post?.href || ''}
          passHref
          className='cursor-pointer hover:underline leading-tight text-slate-100 hover:text-cyan-200'>
          <h2 className='text-4xl'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post?.pageIcon} />
            )}
            {post?.title}
          </h2>
        </SmartLink>

        {(!showPreview || showSummary) && (
          <main className='my-4 text-slate-200 text-lg leading-7'>
            {post?.summary}
          </main>
        )}

        {showPreview && (
          <div className='overflow-ellipsis truncate'>
            <NotionPage post={post} />
            <div className='pointer-events-none border-t border-dashed border-slate-600/40 pt-8'>
              <div className='w-full justify-start flex'>
                <SmartLink
                  href={post?.href}
                  passHref
                  className='hover:bg-opacity-100 hover:scale-105 duration-200 pointer-events-auto transform font-bold text-cyan-200 cursor-pointer'>
                  {locale.COMMON.ARTICLE_DETAIL}
                  <i className='ml-1 fas fa-angle-right' />
                </SmartLink>
              </div>
            </div>
          </div>
        )}

        <div className='text-sm py-1 text-slate-400'>{post?.date?.start_date}</div>
      </div>
    </div>
  )
}

export default PostItemCardTop
