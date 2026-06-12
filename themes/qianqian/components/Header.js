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
    const {
        searchModalRef,
        mobileToolbarCompact = false,
        mobileCategoryPanelOpen = false,
        setMobileCategoryPanelOpen,
        hasMobileCategoryGroup = false
    } = props
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            const nextScrolled = currentScroll > 10
            setScrolled(prev => (prev === nextScrolled ? prev : nextScrolled))
        }
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
            setMobileCategoryPanelOpen?.(false)
            searchModalRef?.current?.openSearch?.()
            return
        }
        setMobileCategoryPanelOpen?.(false)
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

    const handleToolbarToggle = () => {
        setMobileMenuOpen(false)
        setMobileCategoryPanelOpen?.(prev => !prev)
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
                className={`lg:hidden fixed top-0 left-0 z-[999] flex h-12 w-full items-center justify-between border-b px-4 transition-all duration-300 ease-in-out ${
                    scrolled || mobileToolbarCompact || mobileCategoryPanelOpen
                        ? 'bg-black/95 border-gray-800 backdrop-blur-xl'
                        : 'bg-transparent border-transparent'
                }`}>
                <div className='flex min-w-0 items-center gap-3'>
                    <Link
                        href='/'
                        className='text-lg font-bold text-white tracking-wider hover:text-indigo-400 transition-colors z-[1000]'>
                        千逐
                    </Link>
                    {hasMobileCategoryGroup && mobileToolbarCompact && (
                        <button
                            type='button'
                            onClick={handleToolbarToggle}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                                mobileCategoryPanelOpen
                                    ? 'border-emerald-400/60 bg-emerald-400/12 text-white'
                                    : 'border-white/10 bg-white/8 text-white/78'
                            }`}
                            aria-label='展开功能区'
                            aria-controls='mobile-category-panel'
                            aria-expanded={mobileCategoryPanelOpen}>
                            <i className='fa-solid fa-grip text-[10px]' />
                            <span>栏目</span>
                            <i
                                className={`fa-solid ${
                                    mobileCategoryPanelOpen
                                        ? 'fa-chevron-up'
                                        : 'fa-chevron-down'
                                } text-[10px]`}
                            />
                        </button>
                    )}
                </div>
                <div className='flex items-center gap-2.5 z-[1000]'>
                    <button
                        type='button'
                        onClick={handleSearch}
                        className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transition-all hover:text-white active:scale-95'
                        aria-label='搜索'>
                        <i className='fa-solid fa-magnifying-glass text-sm' />
                    </button>
                    <button
                        type='button'
                        onClick={() => {
                            setMobileCategoryPanelOpen?.(false)
                            setMobileMenuOpen(prev => !prev)
                        }}
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

            <div className='h-12 lg:hidden' />
        </>
    )
}
