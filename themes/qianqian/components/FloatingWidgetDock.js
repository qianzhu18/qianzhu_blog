import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import { useEffect, useState } from 'react'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const [mounted, setMounted] = useState(false)

  const contactEmail = siteConfig('CONTACT_EMAIL')
  const chatbaseId = siteConfig('CHATBASE_ID')
  const difyEnabled = siteConfig('DIFY_CHATBOT_ENABLED')
  const difyBaseUrl = siteConfig('DIFY_CHATBOT_BASE_URL')
  const difyToken = siteConfig('DIFY_CHATBOT_TOKEN')

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
    const email = contactEmail ? decryptEmail(contactEmail) : ''
    if (email) {
      window.location.href = `mailto:${email}`
      return
    }
    console.warn('SalesSmartly script not loaded yet')
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
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='fixed right-4 bottom-20 z-50 flex flex-col gap-3'>
      <button
        type='button'
        onClick={handleAiChatClick}
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
