import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import PostItemCard from './PostItemCard'
import PostListEmpty from './PostListEmpty'
import Swiper from './Swiper'

/**
 * 推荐文章列表
 */
const PostListRecommend = ({ latestPosts, allNavPages }) => {
  const recommendPosts = getTopPosts({ latestPosts, allNavPages })
  const title = siteConfig('MAGZINE_RECOMMEND_POST_TITLE', '', CONFIG)

  if (!recommendPosts || recommendPosts.length === 0) {
    return <PostListEmpty />
  }

  return (
    <div className='w-full py-10 px-2 magzine-section magzine-reveal'>
      <div className='max-w-screen-3xl w-full mx-auto'>
        <div className='flex justify-between items-center py-6'>
          <h3 className='text-4xl font-bold text-slate-100'>{title}</h3>
        </div>
        <div className='hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {recommendPosts?.map((p, index) => {
            return <PostItemCard key={index} post={p} />
          })}
        </div>
        <div className='block lg:hidden px-2'>
          <Swiper posts={recommendPosts} />
        </div>
      </div>
    </div>
  )
}

function getTopPosts({ latestPosts, allNavPages }) {
  if (
    !siteConfig('MAGZINE_RECOMMEND_POST_TAG') ||
    siteConfig('MAGZINE_RECOMMEND_POST_TAG') === ''
  ) {
    return latestPosts
  }

  let sortPosts = []
  if (siteConfig('MAGZINE_RECOMMEND_POST_SORT_BY_UPDATE_TIME')) {
    sortPosts = Object.create(allNavPages).sort((a, b) => {
      const dateA = new Date(a?.lastEditedDate)
      const dateB = new Date(b?.lastEditedDate)
      return dateB - dateA
    })
  } else {
    sortPosts = Object.create(allNavPages)
  }

  const count = siteConfig('MAGZINE_RECOMMEND_POST_COUNT', 6)
  const topPosts = []
  for (const post of sortPosts) {
    if (topPosts.length === count) {
      break
    }
    if (post?.tags?.indexOf(siteConfig('MAGZINE_RECOMMEND_POST_TAG')) >= 0) {
      topPosts.push(post)
    }
  }
  return topPosts
}

export default PostListRecommend
