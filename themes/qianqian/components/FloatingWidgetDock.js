import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { toggleDarkMode, isDarkMode, lang, changeLang } = useGlobal()
  const [percent, setPercent] = useState(0)

  const langKey = (lang || '').toLowerCase()
  const isEnglish = langKey.startsWith('en')

  const handleToggleLang = () => {
    changeLang(isEnglish ? 'zh-CN' : 'en-US')
  }

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return () => {}
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight
      const next =
        total > 0 ? Math.round((window.scrollY / total) * 100) : 0
      setPercent(Math.min(100, Math.max(0, next)))
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div className='fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col space-y-4'>
      <button
        type='button'
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg transition-transform hover:scale-110'
        aria-label='询问 AI 助理 (RAG)'>
        <i className='anzhiyufont anzhiyu-icon-robot-astray text-xl' />
      </button>
      <button
        type='button'
        onClick={toggleDarkMode}
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-md dark:bg-zinc-800'
        aria-label='切换深色模式'>
        <i className={isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
      </button>
      <button
        type='button'
        onClick={handleToggleLang}
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-xs font-semibold text-zinc-700 shadow-md dark:bg-zinc-800 dark:text-zinc-100'
        aria-label='切换语言'>
        {isEnglish ? '简' : 'EN'}
      </button>
      <button
        type='button'
        onClick={handleScrollTop}
        className='flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-white/80 shadow-md dark:bg-zinc-800'
        aria-label='回到顶部'>
        <span className='text-[10px] font-semibold text-zinc-600 dark:text-zinc-200'>
          {percent}%
        </span>
        <i className='fa-solid fa-arrow-up text-xs' />
      </button>
    </div>
  )
}

export default FloatingWidgetDock
