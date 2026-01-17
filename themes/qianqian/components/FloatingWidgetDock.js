import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import { useEffect, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { toggleDarkMode, isDarkMode } = useGlobal()
  const [percent, setPercent] = useState(0)

  const contactEmail = siteConfig('CONTACT_EMAIL')
  const chatbaseId = siteConfig('CHATBASE_ID')
  const difyEnabled = siteConfig('DIFY_CHATBOT_ENABLED')
  const difyBaseUrl = siteConfig('DIFY_CHATBOT_BASE_URL')
  const difyToken = siteConfig('DIFY_CHATBOT_TOKEN')

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleContactClick = event => {
    if (!contactEmail || typeof window === 'undefined') return
    event.preventDefault()
    const email = decryptEmail(contactEmail)
    if (!email) return
    window.location.href = `mailto:${email}`
  }

  const handleAiChatClick = () => {
    if (typeof window === 'undefined') return
    if (chatbaseId) {
      window.open(
        `https://www.chatbase.co/chatbot-iframe/${chatbaseId}`,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }
    if (difyEnabled && difyBaseUrl && difyToken) {
      window.open(
        `${difyBaseUrl}/chat/${difyToken}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
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
        aria-label='AI 对话'
        onClick={handleAiChatClick}>
        <i className='fa-solid fa-robot text-lg' />
      </button>
      <button
        type='button'
        onClick={toggleDarkMode}
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-md dark:bg-zinc-800'
        aria-label='切换深色模式'>
        <i className={isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
      </button>
      <a
        href='#'
        onClick={handleContactClick}
        className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-zinc-700 shadow-md transition-transform hover:-translate-y-0.5 dark:bg-zinc-800 dark:text-zinc-100'
        aria-label='发送邮件'>
        <i className='fa-solid fa-envelope text-base' />
      </a>
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
