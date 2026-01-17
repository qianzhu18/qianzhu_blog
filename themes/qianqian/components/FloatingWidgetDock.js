import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

/**
 * 千浅主题右侧浮动 Dock
 */
export const FloatingWidgetDock = () => {
  const { toggleDarkMode } = useGlobal()

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

  return (
    <div className='fixed right-4 bottom-24 z-50 flex flex-col gap-3'>
      <button
        type='button'
        onClick={handleAiChatClick}
        className='flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-xl backdrop-blur-md transition-transform active:scale-95'
        aria-label='AI 对话'>
        <i className='fa-solid fa-robot text-indigo-400 text-lg' />
      </button>
      <a
        href='#'
        onClick={handleContactClick}
        className='flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-xl backdrop-blur-md transition-transform active:scale-95'
        aria-label='发送邮件'>
        <i className='fa-solid fa-envelope text-green-400 text-lg' />
      </a>
      <button
        type='button'
        onClick={toggleDarkMode}
        className='flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-xl backdrop-blur-md transition-transform active:scale-95'
        aria-label='切换主题'>
        <i className='fa-solid fa-gear text-gray-400 text-lg' />
      </button>
      <button
        type='button'
        onClick={handleScrollTop}
        className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#F59E0B] text-black shadow-xl font-bold transition-transform active:scale-95'
        aria-label='回到顶部'>
        <i className='fa-solid fa-arrow-up text-lg' />
      </button>
    </div>
  )
}

export default FloatingWidgetDock
