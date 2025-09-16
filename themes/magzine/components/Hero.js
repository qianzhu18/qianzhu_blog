// import { useGlobal } from '@/lib/global'
import BannerItem from './BannerItem'
import PostItemCardTop from './PostItemCardTop'
import PostItemCardWide from './PostItemCardWide'

/**
 * 首页主宣传
 */
const Hero = ({ posts }) => {
  const postTop = posts[0]
  const post1 = posts[1]
  const post2 = posts[2]
  return (
    <div className='w-full mx-auto max-w-screen-3xl xl:flex justify-between gap-10 magzine-hero magzine-reveal'>
      <div className='basis-1/2 mb-6 px-2 lg:px-5'>
        <PostItemCardTop post={postTop} />
      </div>
      <div className='basis-1/2 flex flex-col gap-y-4'>
        <BannerItem />

        <div className='py-4 px-2 lg:px-0 flex flex-col gap-y-6 magzine-hero-list'>
          <hr className='magzine-divider' />
          <PostItemCardWide post={post1} />
          <hr className='magzine-divider' />
          <PostItemCardWide post={post2} />
        </div>
      </div>
    </div>
  )
}
export default Hero
