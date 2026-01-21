import { useEffect, useRef, useState } from 'react'
import { useAiStore } from '@/lib/store/aiStore'

export default function AiChatDrawer() {
  const { isOpen, closeDrawer, selectedText, setContext } = useAiStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() && !selectedText) return
    const currentContext = selectedText
    const userMsg = { role: 'user', content: input, context: currentContext }
    const nextMessages = [...messages, userMsg]

    setMessages(nextMessages)
    setInput('')
    setContext('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          context: currentContext
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络连接异常' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={
        'fixed inset-0 z-[100] pointer-events-none flex justify-end items-end md:items-start md:justify-end'
      }>
      <div
        className={`
          pointer-events-auto bg-white/90 dark:bg-[#181818]/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl flex flex-col overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]

          md:fixed md:top-24 md:right-8 md:bottom-auto md:left-auto
          md:w-[380px] md:h-[600px] md:max-h-[80vh]
          md:rounded-2xl
          md:origin-top-right
          ${
            isOpen
              ? 'md:opacity-100 md:scale-100 md:translate-y-0'
              : 'md:opacity-0 md:scale-95 md:translate-y-[-20px] md:pointer-events-none'
          }

          fixed bottom-0 left-0 right-0 w-full h-[40vh]
          rounded-t-2xl md:rounded-2xl
          origin-bottom
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 md:translate-y-0'}
        `}>
        <div className='flex justify-between items-center p-3 border-b border-gray-100/10 shrink-0 bg-white/50 dark:bg-black/20'>
          <div className='flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200'>
            <span className='flex h-2 w-2 relative'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' />
              <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500' />
            </span>
            AI Assistant
          </div>
          <button
            onClick={closeDrawer}
            className='w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500'>
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain scrollbar-hide'>
          {messages.length === 0 && (
            <div className='h-full flex flex-col items-center justify-center text-gray-400 text-xs opacity-70'>
              <p>✨ 划选正文发起提问</p>
              <p className='mt-1'>或直接在此对话</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              } animate-fade-in-up`}>
              {msg.context && (
                <div className='mb-1 text-[10px] text-gray-400 dark:text-gray-500 max-w-[90%] truncate px-1 border-l-2 border-indigo-400/50'>
                  {msg.context}
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-2xl max-w-[95%] text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-gray-700'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex items-center gap-1 text-gray-400 text-xs ml-2'>
              <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' />
              <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75' />
              <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150' />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='p-3 bg-white/80 dark:bg-black/40 border-t border-gray-100/10 shrink-0 backdrop-blur-md'>
          {selectedText && (
            <div className='flex justify-between items-center mb-2 px-2 py-1 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded text-[10px] text-indigo-600 dark:text-indigo-300'>
              <span className='truncate max-w-[200px]'>引用: {selectedText}</span>
              <button
                onClick={() => setContext('')}
                className='hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded px-1'>
                ✕
              </button>
            </div>
          )}

          <div className='relative'>
            <input
              className='w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-full pl-4 pr-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow'
              placeholder='Ask AI...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className='absolute right-1 top-1 w-7 h-7 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100'>
              <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 12h14M12 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
