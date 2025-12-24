import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'

/**
 * 英雄大图区块 - 现代化设计
 */
export const Hero = props => {
    const config = props?.NOTION_CONFIG || CONFIG
    const pageCover = props?.siteInfo?.pageCover
    const bannerImage = siteConfig('PROXIO_HERO_BANNER_IMAGE', CONFIG.PROXIO_HERO_BANNER_IMAGE, config) || pageCover
    const bannerIframe = siteConfig('PROXIO_HERO_BANNER_IFRAME_URL', '', config)
    const title1 = siteConfig('PROXIO_HERO_TITLE_1', CONFIG.PROXIO_HERO_TITLE_1, config)
    const title2 = siteConfig('PROXIO_HERO_TITLE_2', CONFIG.PROXIO_HERO_TITLE_2, config)
    const button1Text = siteConfig('PROXIO_HERO_BUTTON_1_TEXT', CONFIG.PROXIO_HERO_BUTTON_1_TEXT, config)
    const button1Url = siteConfig('PROXIO_HERO_BUTTON_1_URL', CONFIG.PROXIO_HERO_BUTTON_1_URL, config)
      // 可配置遮罩与文字样式，提升可读性且不改变功能逻辑
      const overlayEnable = siteConfig('PROXIO_HERO_OVERLAY_ENABLE', true, config)
      const overlayColor = siteConfig('PROXIO_HERO_OVERLAY_COLOR', 'rgba(0,0,0,0.45)', config)
      const titleShadow = siteConfig('PROXIO_HERO_TEXT_SHADOW', true, config)
    return (
        <>
            {/* 📱 移动端全屏封面 */}
            <div className='block md:hidden relative w-full h-screen overflow-hidden'>
                <img
                    src='https://imagehost.qianzhu.online/api/rfile/千逐竖屏封面.png'
                    alt='千逐移动端封面'
                    className='absolute inset-0 w-full h-full object-cover z-0'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10' />
                <div className='absolute bottom-24 left-0 w-full px-6 z-20 text-white'>
                    <h1 className='text-4xl font-bold mb-3 chinese-font tracking-wider drop-shadow-md'>千逐</h1>
                    <p className='text-lg font-light text-gray-200 mb-6 border-l-2 border-[#2f5c56] pl-3'>
                        系统构建者 <br /> AI 与认知探索
                    </p>
                    <button
                        onClick={() => document.getElementById('fast-nav')?.scrollIntoView({ behavior: 'smooth' })}
                        className='flex items-center space-x-2 text-sm text-gray-300 animate-bounce'
                    >
                        <span>向下探索</span>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 💻 桌面端背景 + 卡片 */}
            <div className='hidden md:block'>
                <div
                    id='home'
                    className='h-screen relative overflow-hidden bg-gradient-to-br from-[#f8f4ec] via-[#e4ede7] to-[#dbe7e1]'>
                    {!bannerIframe && bannerImage && (
                        <img
                            className='w-full object-cover absolute h-screen left-0 top-0 pointer-events-none'
                            src={bannerImage}
                            alt='Hero background'
                            loading='eager'
                            decoding='async'
                        />
                    )}
                    <iframe src={bannerIframe} className='w-full absolute h-screen left-0 top-0 pointer-events-none' />
                    {overlayEnable && (
                        <div className='absolute inset-0 z-10 pointer-events-none'>
                            <div className='absolute inset-0' style={{ background: overlayColor }} />
                            <div className='absolute inset-0 bg-gradient-to-t from-[#0f1f1e]/35 via-transparent to-transparent' />
                        </div>
                    )}

                    <div className='absolute inset-0 z-5 pointer-events-none'>
                        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-[#b6d7cc]/25 rounded-full blur-3xl animate-pulse' />
                        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d9eadf]/30 rounded-full blur-[140px] animate-pulse' style={{ animationDelay: '1.2s' }} />
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#cfded7]/20 rounded-full blur-[140px] animate-pulse' style={{ animationDelay: '2s' }} />
                    </div>

                    <div className='h-1/3 w-full absolute left-0 bottom-0 z-10'>
                        <div className='h-full w-full absolute group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent via-white/30 to-[#f8f4ec] dark:to-[#0f1f1e]' />
                    </div>
                </div>

                <div className='w-full pb-15 dark:text-white relative z-20' style={{ paddingTop: '120px' }}>
                    <div className='container mx-auto px-6'>
                        <div className='flex flex-wrap items-center justify-center'>
                            <div className='w-full'>
                                <div className='pointer-events-none absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[380px] rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.28)_55%,rgba(255,255,255,0)_80%)]' />

                                <div
                                    className='hero-content wow fadeInUp mx-auto max-w-[720px] text-left'
                                    style={{ visibility: 'visible' }}
                                >
                                    <div className='mx-auto px-12 py-12 rounded-[28px] bg-white/45 dark:bg-[#0f1f1e]/30 backdrop-blur-3xl backdrop-saturate-150 border border-white/25 dark:border-white/10 shadow-[0_28px_60px_-18px_rgba(15,31,30,0.28)] space-y-6 relative overflow-hidden'>
                                        <div className='pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 to-transparent'></div>

                                        {title1 && (
                                            <h1 className={`text-5xl font-bold leading-tight ${titleShadow ? 'drop-shadow-sm' : ''}`}>
                                                <span className='bg-gradient-to-r from-[#2f5c56] via-[#4e8079] to-[#2f5c56] bg-clip-text text-transparent'>
                                                    {title1}
                                                </span>
                                            </h1>
                                        )}

                                        {title2 && (
                                            <p className='max-w-[640px] text-lg font-medium text-[#2f5c56]/90 dark:text-[#c7e0da] leading-relaxed'>
                                                {title2}
                                            </p>
                                        )}

                                        <div className='flex flex-wrap gap-4 pt-4'>
                                            {button1Text && (
                                                <Link
                                                    href={button1Url || ''}
                                                    className='px-8 py-3 text-base font-semibold text-[#2f5c56] bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg hover:-translate-y-1'>
                                                    认识千逐
                                                </Link>
                                            )}
                                            <Link
                                                href='/archive'
                                                className='px-8 py-3 text-base font-semibold text-[#2f5c56] bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg hover:-translate-y-1 flex items-center'>
                                                体验终端 <span className='ml-2 text-xs opacity-60'>⌘K</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
