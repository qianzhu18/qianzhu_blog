/* eslint-disable no-unreachable */
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DarkModeButton } from './DarkModeButton'
import { MenuList } from './MenuList'
import CONFIG from '../config'

/**
 * 顶部导航栏
 */
export const Header = props => {
    const router = useRouter()
    const { searchModalRef } = props

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

    return (
        <>
            {/* <!-- ====== Navbar Section Start --> */}
            <div
                className='ud-header sticky top-0 z-[50] flex w-full items-center border-b border-zinc-100 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800 dark:bg-black/70'>
                <div className='container'>
                    <div className='relative -mx-4 flex items-center justify-between py-3'>
                        {/* Logo */}
                        <div className='w-60 max-w-full px-4'>
                            <Link
                                href='/'
                                className='text-2xl font-black tracking-tighter text-zinc-800 dark:text-white whitespace-nowrap'>
                                千逐
                            </Link>
                        </div>
                        {/* 右侧菜单 */}
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
                            {/* 主题切换器 */}
                            {siteConfig('THEME_SWITCH', false, CONFIG) && <DarkModeButton />}
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- ====== Navbar Section End --> */}
        </>
    )
}
