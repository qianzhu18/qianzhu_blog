import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = ({ showAside = true, onToggleAside }) => {
  const { toggleDarkMode, isDarkMode, lang, changeLang } = useGlobal()
  const [panelOpen, setPanelOpen] = useState(false)
  const langKey = (lang || '').toLowerCase()
  const isEnglish = langKey.startsWith('en')
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  const handleToggleLang = () => {
    changeLang(isEnglish ? 'zh-CN' : 'en-US')
  }

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = message => {
    setToastMessage(message)
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('')
    }, 2000)
  }

  const handleAiClick = () => {
    setPanelOpen(prev => !prev)
    showToast('AI 知识库正在接入中...')
  }

  useEffect(() => {
    if (typeof window === 'undefined') return () => {}
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || 0
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const percent =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, percent)))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const progressStyle = useMemo(() => {
    const radius = 16
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (scrollProgress / 100) * circumference
    return { circumference, offset }
  }, [scrollProgress])

  return (
    <div className='qianqian-floating-dock'>
      {toastMessage && (
        <div className='absolute right-16 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg backdrop-blur dark:bg-slate-800/90'>
          {toastMessage}
        </div>
      )}
      <div className={`dock-panel ${panelOpen ? 'is-open' : ''}`}>
        <button
          type='button'
          onClick={toggleDarkMode}
          className='dock-panel-btn'
          aria-label='切换深色模式'>
          <span className='dock-panel-icon'>
            <i
              className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} ${
                isDarkMode ? 'dock-icon-rotate' : ''
              }`}
            />
          </span>
          <span>{isDarkMode ? '浅色模式' : '深色模式'}</span>
        </button>
        <button
          type='button'
          onClick={handleToggleLang}
          className='dock-panel-btn'
          aria-label='切换语言'>
          {isEnglish ? '简' : 'EN'}
        </button>
      </div>

      <button
        type='button'
        className='dock-btn'
        onClick={handleAiClick}
        aria-expanded={panelOpen}
        aria-label='AI 助手'>
        <i className='anzhiyufont anzhiyu-icon-robot-astray' />
      </button>

      <button
        type='button'
        className='dock-btn md:hidden'
        onClick={toggleDarkMode}
        aria-label='切换深色模式'>
        <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} />
      </button>

      <button
        type='button'
        className='dock-btn hidden md:inline-flex'
        onClick={onToggleAside}
        disabled={!onToggleAside}
        aria-label='切换布局'>
        {mounted ? (showAside ? '单栏' : '双栏') : '单栏'}
      </button>

      <button
        type='button'
        className='dock-btn dock-btn-progress'
        onClick={handleScrollTop}
        aria-label='回到顶部'>
        <svg className='dock-progress' viewBox='0 0 36 36'>
          <circle
            className='dock-progress-track'
            cx='18'
            cy='18'
            r='16'
          />
          <circle
            className='dock-progress-indicator'
            cx='18'
            cy='18'
            r='16'
            strokeDasharray={progressStyle.circumference}
            strokeDashoffset={progressStyle.offset}
          />
        </svg>
        <i className='fa-solid fa-arrow-up' />
      </button>
    </div>
  )
}

export default FloatingWidgetDock
