import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Link from 'next/link'
import Image from 'next/image'

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

    const scrollToId = id => {
        if (typeof window === 'undefined') return
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const scrollToLanding = () => scrollToId('latest')
    const scrollToAbout = () => scrollToId('team')
    return (
        <>
            {/* 📱 移动端全屏封面 */}
            <div className='block md:hidden relative w-full h-screen overflow-hidden'>
                <Image
                    src='https://imagehost.qianzhu.online/api/rfile/千逐竖屏封面.png'
                    alt='千逐移动端封面'
                    fill
                    priority
                    sizes='100vw'
                    quality={70}
                    className='absolute inset-0 w-full h-full object-cover z-0'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10' />
                <div className='absolute bottom-24 left-0 w-full px-6 z-20 text-white'>
                    <h1 className='text-4xl font-bold mb-3 chinese-font tracking-wider drop-shadow-md'>千逐</h1>
                    <p className='text-lg font-light text-gray-200 mb-6 border-l-2 border-[#2f5c56] pl-3'>
                        系统构建者 <br /> AI 与认知探索
                    </p>
                    <button
                        onClick={scrollToLanding}
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
            <div className='hidden md:block relative w-full h-screen overflow-hidden group'>
                <Image
                    src='https://imagehost.qianzhu.online/api/rfile/千逐个人封面.png'
                    alt='千逐桌面端封面'
                    fill
                    sizes='(min-width: 768px) 100vw, 0vw'
                    quality={70}
                    loading='lazy'
                    className='absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-[20s] ease-in-out group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10' />

                <div className='absolute bottom-0 left-0 w-full h-full flex flex-col justify-end pb-32 px-16 z-20 max-w-4xl space-y-6'>
                    <h1 className='text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl tracking-tight mb-6'>
                        千逐
                        <span className='block text-3xl lg:text-4xl font-normal opacity-90 mt-4 tracking-normal'>
                            系统构建者 / AI 与认知探索
                        </span>
                    </h1>

                    <div className='flex flex-wrap gap-6'>
                        <button
                            onClick={scrollToAbout}
                            className='px-8 py-3.5 text-base font-semibold text-[#1a2f2c] bg-white rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-0.5'
                        >
                            关于我
                        </button>
                        <button
                            onClick={scrollToLanding}
                            className='px-8 py-3.5 text-base font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all shadow-lg flex items-center group/btn'
                        >
                            向下探索
                            <span className='ml-2 text-xs opacity-60 bg-white/20 px-1.5 py-0.5 rounded group-hover/btn:bg-white/30 transition-colors'>↓</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
