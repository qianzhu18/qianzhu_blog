import { siteConfig } from '@/lib/config'
import BlogPostCard from './BlogPostCard'

/**
 * 博文列表
 * @param {*} param0
 * @returns
 */
export const Blog = ({ posts, siteInfo }) => {
  const enable = siteConfig('PROXIO_BLOG_ENABLE')
  if (!enable) {
    return null
  }

  return (
    <>
      <section
        id='latest'
        className='bg-gradient-to-b from-white to-gray-50 pt-20 dark:bg-gradient-to-b dark:from-dark dark:to-gray-900 lg:pt-[120px]'>
        <div className='container mx-auto'>
          <div
            className='-mx-4 flex flex-wrap justify-center wow fadeInUp'
            data-wow-delay='.2s'>
            <div className='w-full px-4 py-4'>
              <div className='mx-auto max-w-[485px] text-center space-y-6'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50'>
                  <span className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
                  <span className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    {siteConfig('PROXIO_BLOG_TITLE')}
                  </span>
                </div>

                <h2 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {siteConfig('PROXIO_BLOG_TEXT_1')}
                </h2>
              </div>
            </div>
          </div>

          <div className='w-full max-w-4xl mx-auto px-4 lg:px-0 mb-16'>
            {posts?.map((post, index) => (
              <BlogPostCard
                key={post?.id || post?.slug || index}
                post={post}
                index={index}
                siteInfo={siteInfo}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
