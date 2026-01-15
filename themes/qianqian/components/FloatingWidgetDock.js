import { useGlobal } from '@/lib/global'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { toggleDarkMode, isDarkMode } = useGlobal()

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='fixed right-6 bottom-10 z-50 flex flex-col space-y-3'>
      <button
        type='button'
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg transition-transform hover:scale-110'
        aria-label='AI 助手'>
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
        onClick={handleScrollTop}
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-md dark:bg-zinc-800'
        aria-label='回到顶部'>
        <i className='fa-solid fa-arrow-up' />
      </button>
    </div>
  )
}

export default FloatingWidgetDock
