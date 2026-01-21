import { useGlobal } from '@/lib/global'
import { useAiStore } from '@/lib/store/aiStore'
import { useEffect, useRef, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const { toggleOpen, setContext, setTriggerType } = useAiStore()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

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
      className={`fixed right-4 z-50 flex flex-col gap-3 transition-all duration-300 ease-in-out ${
        visible
          ? 'bottom-20 opacity-100 translate-y-0'
          : 'bottom-4 opacity-0 translate-y-20 pointer-events-none'
      }`}>
      <button
        type='button'
        onClick={() => {
          setTriggerType('global')
          setContext('')
          toggleOpen()
        }}
        className='flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-lg backdrop-blur-md transition-transform active:scale-95'
        aria-label='AI 对话'>
        <i className='fa-solid fa-robot text-indigo-400 text-sm' />
      </button>
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
