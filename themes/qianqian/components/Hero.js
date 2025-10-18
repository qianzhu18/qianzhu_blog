/* eslint-disable @next/next/no-img-element */
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'

/**
 * 英雄大图区块 - 现代化设计
 */
export const Hero = props => {
    const config = props?.NOTION_CONFIG || CONFIG
    const pageCover = props?.siteInfo?.pageCover
    const bannerImage = siteConfig('PROXIO_HERO_BANNER_IMAGE', null, config) || pageCover
    const bannerIframe = siteConfig('PROXIO_HERO_BANNER_IFRAME_URL',null,config)
      // 可配置遮罩与文字样式，提升可读性且不改变功能逻辑
      const overlayEnable = siteConfig('PROXIO_HERO_OVERLAY_ENABLE', true, config)
      const overlayColor = siteConfig('PROXIO_HERO_OVERLAY_COLOR', 'rgba(0,0,0,0.45)', config)
      const titleShadow = siteConfig('PROXIO_HERO_TEXT_SHADOW', true, config)
    return (
        <>
            {/* <!-- ====== Hero Section Start --> */}
            <div
                id='home'
                className='h-screen relative overflow-hidden bg-gradient-to-br from-[#f8f4ec] via-[#e4ede7] to-[#dbe7e1]'>
                {/* 横幅图片 */}
                {!bannerIframe && bannerImage && (
                    <LazyImage
                        priority
                        className='w-full object-cover absolute h-screen left-0 top-0 pointer-events-none'
                        src={bannerImage} />
                )}
                <iframe src={bannerIframe} className='w-full absolute h-screen left-0 top-0 pointer-events-none' />
                  {/* 现代化渐变遮罩 */}
                  {overlayEnable && (
                    <div className='absolute inset-0 z-10 pointer-events-none'>
                      <div className='absolute inset-0' style={{ background: overlayColor }} />
                      <div className='absolute inset-0 bg-gradient-to-t from-[#0f1f1e]/35 via-transparent to-transparent' />
                    </div>
                  )}
                  
                  {/* 动态装饰元素 */}
                  <div className='absolute inset-0 z-5 pointer-events-none'>
                    <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-[#b6d7cc]/25 rounded-full blur-3xl animate-pulse' />
                    <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d9eadf]/30 rounded-full blur-[140px] animate-pulse' style={{ animationDelay: '1.2s' }} />
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#cfded7]/20 rounded-full blur-[140px] animate-pulse' style={{ animationDelay: '2s' }} />
                  </div>

                  {/* 底部渐变保留，提升层次感 */}
                  <div className='h-1/3 w-full absolute left-0 bottom-0 z-10'>
                      <div className='h-full w-full absolute group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent via-white/20 to-[#f8f4ec] dark:to-[#0f1f1e]'/>
                  </div>

            </div>
            {/* 文字标题等 - 现代化设计，前景卡片化并收窄版心 */}
            <div className='w-full pb-15 dark:text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'>
              <div className='container mx-auto px-4'>
                <div className='flex flex-wrap items-center justify-center'>
                  <div className='w-full'>
                    {/* 聚焦背景光晕，突出前景 */}
                    <div className='pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[380px] rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.28)_55%,rgba(255,255,255,0)_80%)]' />

                    <div className='hero-content wow fadeInUp mx-auto max-w-[640px] md:max-w-[720px] text-center'>
                      {/* 前景卡片化容器，增强与背景的分离度 */}
                      <div className='relative mx-auto px-6 md:px-12 py-8 md:py-12 rounded-[28px] bg-white/25 dark:bg-[#0f1f1e]/20 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 dark:border-white/10 shadow-[0_28px_60px_-18px_rgba(15,31,30,0.26)] space-y-6'>
                        {/* 内部高光与阴影，增强毛玻璃质感 */}
                        <div className='pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/10 to-transparent'></div>
                        {/* 装饰性标签占位移除，避免视觉干扰 */}
                        <div className='h-0' />

                        {/* 主标题 - 渐变文字效果（尺寸略微收敛） */}
                        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${titleShadow ? 'drop-shadow-[0_8px_24px_rgba(15,31,30,0.25)]' : ''}`}>
                          <span className='bg-gradient-to-r from-[#2f5c56] via-[#4e8079] to-[#2f5c56] bg-clip-text text-transparent'>
                            {siteConfig('PROXIO_HERO_TITLE_1', null, config)}
                          </span>
                        </h1>

                        {/* 次标题（更紧凑） */}
                        <p className='mx-auto max-w-[640px] text-base md:text-lg font-medium text-[#2f5c56]/90 dark:text-[#c7e0da] leading-relaxed'>
                          {siteConfig('PROXIO_HERO_TITLE_2', null, config)}
                        </p>

                        {/* 现代化按钮组（尺寸收敛） */}
                        <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
                          {siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, config) && (
                            <Link
                              href={siteConfig('PROXIO_HERO_BUTTON_1_URL', '')}
                              className='group relative inline-flex items-center justify-center px-7 py-3 text-sm md:text-base font-semibold text-[#2f5c56] dark:text-[#cfe3df] bg-white/85 dark:bg-white/10 backdrop-blur-sm border border-black/5 dark:border-white/15 rounded-2xl hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg'>
                              <span className='relative z-10 tracking-wide'>{siteConfig('PROXIO_HERO_BUTTON_1_TEXT', null, config)}</span>
                              <div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0))' }} />
                            </Link>
                          )}

                          {/* 次要按钮 */}
                          <Link
                            href='/archive'
                            className='inline-flex items-center justify-center px-7 py-3 text-sm md:text-base font-semibold text-[#2f5c56] dark:text-[#cfe3df] bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-black/5 dark:border-white/15 rounded-2xl hover:bg-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg'>
                            <span className='tracking-wide'>浏览文章</span>
                            <svg className='ml-2 w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </Link>
                        </div>
                      </div>

                      {/* 滚动提示 */}
                      <div className='pt-6 animate-bounce'>
                        <div className='flex flex-col items-center gap-2 text-[#2f5c56]/70 dark:text-[#9fc6be]/70'>
                          <span className='text-xs'>向下滚动</span>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- ====== Hero Section End --> */}
        </>
    )
}
