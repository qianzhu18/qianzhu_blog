/* eslint-disable no-unreachable */
import DashboardButton from '@/components/ui/dashboard/DashboardButton'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { DarkModeButton } from './DarkModeButton'
import { Logo } from './Logo'
import { MenuList } from './MenuList'
import CONFIG from './config'

/**
 * 顶部导航栏
 */
export const Header = props => {
    const router = useRouter()
    const { isDarkMode } = useGlobal()
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

    return (
        <>
            {/* <!-- ====== Navbar Section Start --> */}
            <div className='ud-header fixed left-0 top-0 z-40 flex w-full items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 transition-all duration-300'>
                <div className='container'>
                    <div className='relative -mx-4 flex items-center justify-between py-3'>
                        {/* Logo */}
                        <Logo {...props} />
                        {/* 右侧菜单 */}
                        <div className='flex items-center gap-4 justify-end pr-16 lg:pr-0'>
                            <MenuList {...props} />
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
