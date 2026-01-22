import { useGlobal } from '@/lib/global'
import { useAiStore } from '@/lib/store/aiStore'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const {
    toggleOpen,
    setContext,
    setTriggerType,
    clearActiveContext,
    selectedText,
    setActiveContext
  } = useAiStore()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const router = useRouter()

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenChat = () => {
    if (typeof window === 'undefined') return
    if (window.ssq?.push) {
      window.ssq.push('chatOpen')
      return
    }
    console.warn('SalesSmartly script not loaded yet')
  }

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 100) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <div
      data-ai-dock
      className={`fixed right-4 z-50 flex flex-col gap-3 transition-all duration-300 ease-in-out ${
        visible
          ? 'bottom-20 opacity-100 translate-y-0'
          : 'bottom-4 opacity-0 translate-y-20 pointer-events-none'
      }`}>
      <div className='relative'>
        {selectedText && (
          <div className='absolute right-12 top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-emerald-200/60 bg-white/95 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-lg backdrop-blur dark:border-emerald-900/50 dark:bg-black/70 dark:text-emerald-200'>
            <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M13 2L3 14h6l-1 8 10-12h-6l1-8z' />
            </svg>
            Ask AI
          </div>
        )}
        <button
          type='button'
          onClick={() => {
            setTriggerType('global')
            if (selectedText) {
              setActiveContext(selectedText, {
                source: 'selection',
                scope: router.asPath
              })
              setContext('')
            } else {
              clearActiveContext()
            }
            toggleOpen()
          }}
          className='flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-lg backdrop-blur-md transition-transform active:scale-95'
          aria-label='AI 对话'>
          <i className='fa-solid fa-robot text-indigo-400 text-sm' />
        </button>
      </div>
      <button
        type='button'
        onClick={handleOpenChat}
        className='group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-lg backdrop-blur-md transition-transform active:scale-95'
        aria-label='联系作者'>
        <i className='fa-regular fa-envelope text-green-400 text-sm transition-all group-hover:fa-solid' />
      </button>
      <button
        type='button'
        onClick={toggleDarkMode}
        className='group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-lg backdrop-blur-md transition-transform active:scale-95'
        aria-label='切换主题'>
        <i
          className={`fa-solid ${
            isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-indigo-300'
          } text-sm transition-transform group-hover:rotate-45`}
        />
      </button>
      <button
        type='button'
        onClick={handleScrollTop}
        className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] text-black shadow-lg font-bold transition-transform active:scale-95'
        aria-label='回到顶部'>
        <i className='fa-solid fa-arrow-up text-sm' />
      </button>
    </div>
  )
}

export default FloatingWidgetDock
