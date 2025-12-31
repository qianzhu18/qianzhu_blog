/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'

/**
 * 博文列表
 * @param {*} param0
 * @returns
 */
export const Blog = ({ posts }) => {
  const enable = siteConfig('PROXIO_BLOG_ENABLE')
  if (!enable) {
    return null
  }

  // 博客列表默认显示summary文字，当鼠标指向时显示文章封面。这里可选把summary文字替换成图片占位符。
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_1 = siteConfig('PROXIO_BLOG_PLACEHOLDER_IMG_URL_1')
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_2 = siteConfig('PROXIO_BLOG_PLACEHOLDER_IMG_URL_2')
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_3 = siteConfig('PROXIO_BLOG_PLACEHOLDER_IMG_URL_3')
  const PROXIO_BLOG_PLACEHOLDER_IMG_URL_4 = siteConfig('PROXIO_BLOG_PLACEHOLDER_IMG_URL_4')

  return (
    <>
      {/* <!-- ====== Blog Section Start --> */}
      <section id='latest' className='bg-gradient-to-b from-white to-gray-50 pt-20 dark:bg-gradient-to-b dark:from-dark dark:to-gray-900 lg:pt-[120px]'>
        <div className='container mx-auto'>
          {/* 区块标题文字 */}
          <div className='-mx-4 flex flex-wrap justify-center wow fadeInUp' data-wow-delay='.2s'>
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
          {/* 博客列表 - 现代卡片设计 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 mb-16'>
            {posts?.map((item, index) => {
              // 文章封面图片，默认使用占位符 根据index 判断获取的时哪一张图片
              let coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_1
              if (index === 0) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_1
              } else if (index === 1) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_2
              } else if (index === 2) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_3
              } else if (index === 3) {
                coverImg = PROXIO_BLOG_PLACEHOLDER_IMG_URL_4
              }
              return (
                <article key={index} className='group wow fadeInUp hover:scale-[1.03] transition-all duration-500' data-wow-delay={`${0.1 + index * 0.1}s`}>
                  <div className='relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-sm transform-gpu'>
                    {/* 文章封面 */}
                    <div className='relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800'>
                      {item.pageCoverThumbnail ? (
                        <Link href={item?.href} className='block h-full'>
                          <Image
                            src={item.pageCoverThumbnail}
                            alt={item.title}
                            fill
                            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu'
                            priority={index === 0}
                          />
                        </Link>
                      ) : (
                        <div className='w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden'>
                          <div className='text-white text-6xl font-bold opacity-30 select-none animate-pulse'>
                            {item.title?.charAt(0)?.toUpperCase() || '文'}
                          </div>
                          {/* 装饰性几何图形 */}
                          <div className='absolute top-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full animate-ping' style={{animationDuration: '3s'}}></div>
                          <div className='absolute bottom-4 left-4 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-pulse' style={{animationDuration: '2s'}}></div>
                          {/* 动态背景元素 */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                        </div>
                      )}
                      
                      {/* 渐变遮罩 */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                      
                      {/* 悬浮阅读按钮 */}
                      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0'>
                        <Link href={item?.href} className='px-6 py-3 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full font-semibold hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg border border-white/20'>
                          <span className='flex items-center gap-2'>
                            <span className='text-sm font-medium'>阅读文章</span>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </span>
                        </Link>
                      </div>
                      
                      {/* 右上角标签 */}
                      <div className='absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full backdrop-blur-sm shadow-md'>
                        最新
                      </div>
                    </div>
                    
                    {/* 文章内容 */}
                    <div className='p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5 dark:to-gray-700/5'>
                      {/* 发布日期和阅读时间 */}
                      <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                          </svg>
                          <span className='font-medium'>{item.publishDay}</span>
                        </div>
                        <div className='flex items-center gap-1 text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span className='font-medium'>5 分钟</span>
                        </div>
                      </div>
                      
                      {/* 文章标题 */}
                      <h3 className='space-y-2'>
                        <Link
                          href={item?.href}
                          className='block text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2'>
                          {item.title}
                        </Link>
                      </h3>
                      
                      {/* 文章摘要 */}
                      <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed overflow-hidden line-clamp-3'>
                        {item.summary || '这是一篇精彩的文章，包含丰富的内容和深入的见解。点击阅读完整内容，获取更多详细信息。'}
                      </p>
                      
                      {/* 标签和阅读更多 */}
                      <div className='flex items-center justify-between pt-2'>
                        <div className='flex items-center gap-2'>
                          <span className='px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200/50 dark:border-blue-700/50'>
                            技术
                          </span>
                          <span className='px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-200/50 dark:border-green-700/50'>
                            原创
                          </span>
                        </div>
                        
                        <Link 
                          href={item?.href}
                          className='inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-all duration-200 group-hover:translate-x-1 group-hover:scale-105'
                        >
                          <span className='font-medium'>详情</span>
                          <svg className='w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      {/* <!-- ====== Blog Section End --> */}
    </>
  )
}
