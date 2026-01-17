import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DarkModeButton } from './DarkModeButton'
import { MenuList } from './MenuList'
import CONFIG from '../config'

/**
 * 顶部导航栏
 */
export const Header = props => {
    const router = useRouter()
    const { searchModalRef, siteInfo } = props
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const postCount = siteInfo?.postCount ?? props?.postCount ?? 0

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = () => {
        const hasAlgolia = Boolean(
            siteConfig('ALGOLIA_APP_ID') &&
                siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY') &&
                siteConfig('ALGOLIA_INDEX')
        )
        if (hasAlgolia) {
            searchModalRef?.current?.openSearch?.()
            return
        }
        router.push('/search')
    }

    const handleSearchPreload = () => {
        const hasAlgolia = Boolean(
            siteConfig('ALGOLIA_APP_ID') &&
                siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY') &&
                siteConfig('ALGOLIA_INDEX')
        )
        if (!hasAlgolia) return
        void import('@/components/AlgoliaSearchModal')
    }

    const handleRandom = () => {
        router.push('/article/random').catch(() => router.push('/'))
    }

    return (
        <>
            {/* ================== 💻 桌面端 Header ================== */}
            <div className='hidden lg:block sticky top-0 z-[50] w-full border-b border-zinc-100 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800 dark:bg-black/70'>
                <div className='container'>
                    <div className='relative -mx-4 flex items-center justify-between py-3'>
                        <div className='w-60 max-w-full px-4'>
                            <Link
                                href='/'
                                className='whitespace-nowrap text-2xl font-black tracking-tighter text-zinc-800 dark:text-white'>
                                千逐
                            </Link>
                        </div>
                        <div className='flex items-center gap-4 justify-end pr-16 lg:pr-0'>
                            <MenuList {...props} />
                            <button
                                type='button'
                                onClick={handleSearch}
                                onMouseEnter={handleSearchPreload}
                                onFocus={handleSearchPreload}
                                className='hidden lg:flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200'
                                aria-label='搜索'>
                                <i className='fa-solid fa-magnifying-glass faa-tada animated-hover' />
                            </button>
                            {siteConfig('THEME_SWITCH', false, CONFIG) && (
                                <DarkModeButton />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================== 📱 移动端 Header ================== */}
            <div
                className={`lg:hidden fixed top-0 left-0 z-[999] flex h-14 w-full items-center justify-between border-b px-4 transition-all duration-300 ${
                    scrolled
                        ? 'bg-black/95 border-gray-800 backdrop-blur-xl'
                        : 'bg-transparent border-transparent'
                }`}>
                <div className='flex items-center'>
                    <Link
                        href='/'
                        className='text-lg font-bold text-white tracking-wider hover:text-indigo-400 transition-colors z-[1000]'>
                        千逐
                    </Link>
                </div>
                <div className='flex items-center gap-4 z-[1000]'>
                    <button
                        type='button'
                        onClick={handleRandom}
                        className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all hover:text-white active:scale-95'
                        aria-label='随机文章'>
                        <i className='fa-solid fa-dice text-sm' />
                    </button>
                    <button
                        type='button'
                        onClick={handleSearch}
                        className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all hover:text-white active:scale-95'
                        aria-label='搜索'>
                        <i className='fa-solid fa-magnifying-glass text-sm' />
                    </button>
                    <div className='flex h-6 items-center justify-center rounded-full border border-gray-700 bg-gray-800 px-2'>
                        <span className='text-[10px] font-mono leading-none text-gray-300'>
                            {postCount}
                        </span>
                    </div>
                    <button
                        type='button'
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className='flex h-8 w-8 items-center justify-center text-gray-400 transition-all hover:text-white active:scale-95'
                        aria-label='展开菜单'>
                        <i className='fa-solid fa-bars text-lg' />
                    </button>
                </div>
            </div>

            <div className='lg:hidden'>
                <MenuList
                    {...props}
                    idPrefix='mobile'
                    menuOpen={mobileMenuOpen}
                    setMenuOpen={setMobileMenuOpen}
                />
            </div>

            <div className='h-14 lg:hidden' />
        </>
    )
}
