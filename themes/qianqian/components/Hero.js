import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Image from 'next/image'
import { useRouter } from 'next/router'

/**
 * 英雄大图区块 - 首页定位与能力卡片
 */
export const Hero = props => {
    const router = useRouter()
    const config = props?.NOTION_CONFIG || CONFIG
    const title1 = siteConfig('PROXIO_HERO_TITLE_1', CONFIG.PROXIO_HERO_TITLE_1, config)
    const title2 = siteConfig('PROXIO_HERO_TITLE_2', CONFIG.PROXIO_HERO_TITLE_2, config)
    const mobileSummary = siteConfig(
        'PROXIO_HERO_MOBILE_SUMMARY',
        CONFIG.PROXIO_HERO_MOBILE_SUMMARY,
        config
    )
    const slogan = siteConfig('PROXIO_HERO_SLOGAN', CONFIG.PROXIO_HERO_SLOGAN, config)
    const statusText = siteConfig(
        'PROXIO_HERO_STATUS_TEXT',
        CONFIG.PROXIO_HERO_STATUS_TEXT,
        config
    )
    const featureCards =
        siteConfig(
            'PROXIO_HERO_FEATURE_CARDS',
            CONFIG.PROXIO_HERO_FEATURE_CARDS,
            config
        ) || []
    const heroButtons = [
        {
            title: siteConfig(
                'PROXIO_HERO_BUTTON_1_TEXT',
                CONFIG.PROXIO_HERO_BUTTON_1_TEXT,
                config
            ),
            action: siteConfig(
                'PROXIO_HERO_BUTTON_1_URL',
                CONFIG.PROXIO_HERO_BUTTON_1_URL,
                config
            ),
            variant: 'primary'
        },
        {
            title: siteConfig(
                'PROXIO_HERO_BUTTON_2_TEXT',
                CONFIG.PROXIO_HERO_BUTTON_2_TEXT,
                config
            ),
            action: siteConfig(
                'PROXIO_HERO_BUTTON_2_URL',
                CONFIG.PROXIO_HERO_BUTTON_2_URL,
                config
            ),
            variant: 'secondary'
        },
        {
            title: siteConfig(
                'PROXIO_HERO_BUTTON_3_TEXT',
                CONFIG.PROXIO_HERO_BUTTON_3_TEXT,
                config
            ),
            action: siteConfig(
                'PROXIO_HERO_BUTTON_3_URL',
                CONFIG.PROXIO_HERO_BUTTON_3_URL,
                config
            ),
            variant: 'ghost'
        }
    ].filter(button => button.title && button.action)
    const mobileButtons = heroButtons.slice(0, 2)

    const scrollToId = id => {
        if (typeof window === 'undefined') return
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const scrollToLanding = () => scrollToId('brand')

    const handleAction = action => {
        if (!action) return
        if (action.startsWith('#')) {
            scrollToId(action.replace('#', ''))
            return
        }
        if (action.startsWith('mailto:') || action.startsWith('http')) {
            window.location.href = action
            return
        }
        router.push(action)
    }

    const buttonClassName = variant => {
        switch (variant) {
            case 'primary':
                return 'bg-white text-slate-900 hover:bg-slate-100'
            case 'secondary':
                return 'border border-white/25 bg-white/10 text-white hover:bg-white/20'
            default:
                return 'text-white/80 hover:text-white'
        }
    }

    return (
        <>
            <div className='block md:hidden relative w-full overflow-hidden'>
                <Image
                    src='https://imagehost.qianzhu.online/api/rfile/千逐竖屏封面.png'
                    alt='千逐移动端封面'
                    fill
                    priority
                    sizes='100vw'
                    quality={70}
                    className='absolute inset-0 h-full w-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10' />
                <div className='relative z-10 flex min-h-[calc(100svh-3rem)] items-center px-5 py-8 text-white'>
                    <div className='w-full rounded-[28px] border border-white/12 bg-black/20 p-5 shadow-xl shadow-black/20 backdrop-blur-sm'>
                        <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/90'>
                            <span className='h-2 w-2 rounded-full bg-emerald-400' />
                            <span>{statusText}</span>
                        </div>
                        <h1 className='text-[2rem] font-bold leading-[1.12] tracking-tight'>
                            {title1}
                        </h1>
                        <p className='mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-medium tracking-[0.04em] text-white/88'>
                            {slogan}
                        </p>
                        <p className='mt-4 max-w-[28rem] text-[15px] leading-7 text-white/78'>
                            {mobileSummary}
                        </p>
                        <div className='mt-6 grid grid-cols-2 gap-3'>
                            {mobileButtons.map(button => (
                                <button
                                    key={button.title}
                                    type='button'
                                    onClick={() => handleAction(button.action)}
                                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${buttonClassName(button.variant)}`}>
                                    {button.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section
                id='mobile-capabilities'
                className='bg-black px-5 pb-10 pt-4 text-white md:hidden'>
                <div className='mx-auto max-w-xl'>
                    <div className='mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45'>
                        Capabilities
                    </div>
                    <div className='space-y-3'>
                        {featureCards.map(card => (
                            <div
                                key={card.title}
                                className='rounded-[24px] border border-white/10 bg-white/5 p-5'>
                                <h2 className='text-base font-semibold text-white'>
                                    {card.title}
                                </h2>
                                <ul className='mt-3 space-y-2 text-sm text-white/72'>
                                    {card.items?.map(item => (
                                        <li key={item} className='flex items-center gap-2'>
                                            <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className='relative hidden min-h-screen overflow-hidden md:block'>
                <Image
                    src='https://imagehost.qianzhu.online/api/rfile/千逐个人封面.png'
                    alt='千逐桌面端封面'
                    fill
                    priority
                    sizes='100vw'
                    quality={70}
                    className='absolute inset-0 h-full w-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10' />
                <div className='relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-8 pb-16 pt-32 lg:px-12'>
                    <div className='max-w-4xl rounded-[36px] border border-white/15 bg-white/10 p-8 text-white shadow-2xl shadow-black/20 backdrop-blur-xl lg:p-10'>
                        <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90'>
                            <span className='h-2 w-2 rounded-full bg-emerald-400' />
                            <span>{statusText}</span>
                        </div>
                        <h1 className='text-5xl font-bold leading-tight lg:text-7xl'>
                            {title1}
                        </h1>
                        <p className='mt-5 text-lg font-medium tracking-[0.12em] text-white/90 lg:text-xl'>
                            {slogan}
                        </p>
                        <p className='mt-6 max-w-3xl text-base leading-8 text-white/78 lg:text-lg'>
                            {title2}
                        </p>
                        <div className='mt-8 flex flex-wrap gap-4'>
                            {heroButtons.map(button => (
                                <button
                                    key={button.title}
                                    type='button'
                                    onClick={() => handleAction(button.action)}
                                    className={`rounded-full px-6 py-3 text-sm font-semibold transition ${buttonClassName(button.variant)}`}>
                                    {button.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                        {featureCards.map(card => (
                            <div
                                key={card.title}
                                className='rounded-[28px] border border-white/12 bg-white/10 p-6 text-white shadow-lg shadow-black/10 backdrop-blur-lg'>
                                <h2 className='text-lg font-semibold'>{card.title}</h2>
                                <ul className='mt-4 space-y-2 text-sm text-white/75'>
                                    {card.items?.map(item => (
                                        <li key={item} className='flex items-center gap-2'>
                                            <span className='h-1.5 w-1.5 rounded-full bg-emerald-400' />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button
                        type='button'
                        onClick={scrollToLanding}
                        className='mt-6 w-fit text-sm text-white/75 transition hover:text-white'>
                        继续下滑查看后续内容
                    </button>
                </div>
            </div>
        </>
    )
}
