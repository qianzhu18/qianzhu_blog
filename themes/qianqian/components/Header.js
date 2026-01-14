/* eslint-disable no-unreachable */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { DarkModeButton } from './DarkModeButton'
import { Logo } from './Logo'
import { MenuList } from './MenuList'
import CONFIG from '../config'

/**
 * 顶部导航栏
 */
export const Header = props => {
    const router = useRouter()
    const { isDarkMode } = useGlobal()
    const { searchModalRef } = props
    const [buttonTextColor, setColor] = useState(
        router.route === '/' ? 'text-white' : ''
    )

    useEffect(() => {
        if (isDarkMode || router.route === '/') {
            setColor('text-white')
        } else {
            setColor('')
        }
        // ======= Sticky
        // window.addEventListener('scroll', navBarScollListener)
        // return () => {
        //     window.removeEventListener('scroll', navBarScollListener)
        // }
    }, [isDarkMode])

    // 滚动监听
    const throttleMs = 200
    // const navBarScollListener = useCallback(
    //     throttle(() => {
    //         // eslint-disable-next-line camelcase
    //         const ud_header = document.querySelector('.ud-header')
    //         const scrollY = window.scrollY
    //         // 控制台输出当前滚动位置和 sticky 值
    //         if (scrollY > 0) {
    //             ud_header?.classList?.add('sticky')
    //         } else {
    //             ud_header?.classList?.remove('sticky')
    //         }
    //     }, throttleMs)
    // )

    const headerStyle = useMemo(
        () => ({
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            background: isDarkMode
                ? 'rgba(17, 24, 39, 0.7)'
                : 'rgba(255, 255, 255, 0.7)'
        }),
        [isDarkMode]
    )

    const handleSearch = () => {
        if (siteConfig('ALGOLIA_APP_ID')) {
            searchModalRef?.current?.openSearch?.()
            return
        }
        router.push('/search')
    }

    return (
        <>
            {/* <!-- ====== Navbar Section Start --> */}
            <div
                className='ud-header fixed left-0 top-0 z-40 flex w-full items-center border-b border-gray-200/20 dark:border-gray-700/20 transition-all duration-300'
                style={headerStyle}>
                <div className='container'>
                    <div className='relative -mx-4 flex items-center justify-between py-3'>
                        {/* Logo */}
                        <Logo {...props} />
                        {/* 右侧菜单 */}
                        <div className='flex items-center gap-4 justify-end pr-16 lg:pr-0'>
                            <MenuList {...props} />
                            <button
                                type='button'
                                onClick={handleSearch}
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
            {/* 顶部导航占位空间 */}
            <div className='h-16'></div>
            {/* <!-- ====== Navbar Section End --> */}
        </>
    )
}
