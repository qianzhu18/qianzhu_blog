import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = ({ showAside = true, onToggleAside }) => {
  const { toggleDarkMode, isDarkMode, lang, changeLang } = useGlobal()
  const [panelOpen, setPanelOpen] = useState(false)
  const langKey = (lang || '').toLowerCase()
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleToggleLang = () => {
    const isTraditional = langKey.includes('zh-tw') || langKey.includes('zh-hk')
    changeLang(isTraditional ? 'zh-CN' : 'zh-TW')
  }

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const progressStyle = useMemo(() => {
    const radius = 16
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (scrollProgress / 100) * circumference
    return { circumference, offset }
  }, [scrollProgress])

  return (
    <div className='qianqian-floating-dock'>
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
          aria-label='切换简繁'>
          {langKey.includes('zh') ? '简繁切换' : '中文切换'}
        </button>
      </div>

      <button
        type='button'
        className='dock-btn'
        onClick={() => setPanelOpen(prev => !prev)}
        aria-expanded={panelOpen}
        aria-label='设置'>
        <i className='fa-solid fa-gear faa-tada animated-hover' />
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
        {showAside ? '单栏' : '双栏'}
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
