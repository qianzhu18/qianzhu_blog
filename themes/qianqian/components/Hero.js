import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'

/**
 * 英雄大图区块 - 现代化设计
 */
export const Hero = props => {
    const router = useRouter()
    const [keyword, setKeyword] = useState('')
    const config = props?.NOTION_CONFIG || CONFIG
    const pageCover = props?.siteInfo?.pageCover
    const bannerImage = siteConfig('PROXIO_HERO_BANNER_IMAGE', CONFIG.PROXIO_HERO_BANNER_IMAGE, config) || pageCover
    const desktopBannerImage =
        siteConfig(
            'PROXIO_HERO_BANNER_IMAGE_DESKTOP',
            CONFIG.PROXIO_HERO_BANNER_IMAGE_DESKTOP,
            config
        ) ||
        bannerImage ||
        pageCover
    const title1 = siteConfig('PROXIO_HERO_TITLE_1', CONFIG.PROXIO_HERO_TITLE_1, config)
    const title2 = siteConfig('PROXIO_HERO_TITLE_2', CONFIG.PROXIO_HERO_TITLE_2, config)
    const button1Text = siteConfig('PROXIO_HERO_BUTTON_1_TEXT', CONFIG.PROXIO_HERO_BUTTON_1_TEXT, config)
    const button1Url = siteConfig('PROXIO_HERO_BUTTON_1_URL', CONFIG.PROXIO_HERO_BUTTON_1_URL, config)
    const slogan = siteConfig(
        'PROXIO_HERO_SLOGAN',
        '千千君子，温润如玉',
        config
    )
    const statusText = siteConfig(
        'PROXIO_HERO_STATUS_TEXT',
        '系统在线 · 首栏体验已升级',
        config
    )
    const featureCards = [
        {
            title: button1Text || '认识千逐',
            icon: 'fa-regular fa-id-card',
            action: button1Url || '#team'
        },
        { title: '项目探索', icon: 'fa-solid fa-compass', action: '#latest' },
        { title: '快速开始', icon: 'fa-solid fa-rocket', action: '/archive' },
        { title: '浏览分类', icon: 'fa-regular fa-folder-open', action: '/category' },
        { title: '标签导航', icon: 'fa-solid fa-tags', action: '/tag' }
    ]

    const scrollToId = id => {
        if (typeof window === 'undefined') return
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const scrollToLanding = () => scrollToId('latest')
    const handleAction = action => {
        if (!action) return
        if (action.startsWith('#')) {
            scrollToId(action.replace('#', ''))
            return
        }
        router.push(action)
    }
    const handleSearch = event => {
        event.preventDefault()
        const key = keyword.trim()
        if (!key) {
            router.push('/search')
            return
        }
        router.push(`/search/${encodeURIComponent(key)}`)
    }
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

            {/* 💻 桌面端首栏重构 */}
            <div className='hidden md:block relative w-full min-h-screen overflow-hidden'>
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                    style={{
                        backgroundImage: `url(${desktopBannerImage || '/images/hero-jade.svg'})`
                    }}
                    aria-hidden='true'
                />
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-multiply'
                    style={{
                        backgroundImage: `url(${desktopBannerImage || '/images/hero-jade.svg'})`
                    }}
                    aria-hidden='true'
                />
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay'
                    style={{
                        backgroundImage: `url(${desktopBannerImage || '/images/hero-jade.svg'})`
                    }}
                    aria-hidden='true'
                />
                <div className='absolute inset-0 z-10 bg-white/45 backdrop-blur-[4px] transition-colors duration-500 dark:bg-[#0f172a]/75' />
                <div className='absolute inset-0 z-10 bg-gradient-to-b from-white/15 via-transparent to-white/35 dark:from-slate-900/10 dark:via-slate-900/0 dark:to-slate-950/40' />

                <div className='relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center px-8 py-28 text-center lg:px-12'>
                    <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/45 px-4 py-1.5 text-sm text-slate-700 backdrop-blur-md dark:border-slate-500/50 dark:bg-slate-900/45 dark:text-slate-200'>
                        <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                        <span>{statusText}</span>
                    </div>
                    <div className='mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/60 text-2xl font-bold text-slate-700 shadow-xl shadow-black/15 backdrop-blur-sm dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-black/35'>
                        千逐
                    </div>
                    <h2 className='mb-5 text-xl tracking-[0.35em] text-slate-700 drop-shadow-sm dark:text-slate-300 md:text-2xl'>
                        {slogan}
                    </h2>
                    <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl'>
                        {title1}
                    </h1>
                    <p className='mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-200/90'>
                        {title2}
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className='mt-10 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-300/70 bg-white/55 px-4 py-3 backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-900/55'>
                        <i className='fa-solid fa-magnifying-glass text-slate-500 dark:text-slate-400' />
                        <input
                            type='search'
                            value={keyword}
                            onChange={event => setKeyword(event.target.value)}
                            placeholder='搜索文档、文章或关键词...'
                            className='w-full bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400'
                            aria-label='搜索文档、文章或关键词'
                        />
                        <button
                            type='submit'
                            className='rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'>
                            搜索
                        </button>
                        <span className='rounded-md border border-slate-300 bg-white/65 px-2 py-1 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                            Enter
                        </span>
                    </form>

                    <div className='mt-10 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-5'>
                        {featureCards.map(card => (
                            <button
                                key={card.title}
                                type='button'
                                onClick={() => handleAction(card.action)}
                                className='group cursor-pointer rounded-2xl border border-white/70 bg-white/45 p-5 text-center shadow-lg shadow-black/8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl dark:border-slate-600/60 dark:bg-slate-900/45 dark:shadow-black/25 dark:hover:bg-slate-800/80'>
                                <span className='mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition-colors duration-300 group-hover:bg-teal-500 group-hover:text-white dark:bg-slate-700/70 dark:text-slate-300 dark:group-hover:bg-teal-400 dark:group-hover:text-slate-900'>
                                    <i className={`${card.icon} text-base`} />
                                </span>
                                <span className='text-sm font-medium text-slate-800 dark:text-slate-100 md:text-base'>
                                    {card.title}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className='mt-7'>
                        <button
                            onClick={scrollToLanding}
                            type='button'
                            className='cursor-pointer text-sm text-slate-600 underline-offset-4 transition hover:underline dark:text-slate-300'>
                            继续下滑查看后续内容
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
