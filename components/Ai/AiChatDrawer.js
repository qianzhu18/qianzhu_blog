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
    const userMessage = { role: 'user', content: input, context: currentContext }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setContext('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          context: currentContext
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '网络连接异常' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}>
      <div
        className={`
          absolute pointer-events-auto bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl shadow-2xl border-l border-t border-gray-200/20 flex flex-col
          transition-transform duration-300 ease-in-out
          md:top-0 md:right-0 md:h-full md:w-[400px]
          ${isOpen ? 'md:translate-x-0' : 'md:translate-x-[100%]'}
          bottom-0 left-0 w-full h-[40vh] md:h-full
          rounded-t-2xl md:rounded-none
          ${isOpen ? 'translate-y-0' : 'translate-y-[100%]'}
        `}>
        <div className='flex items-center justify-between border-b border-gray-100/10 p-3 shrink-0'>
          <div className='flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200'>
            🤖 AI 助手
          </div>
          <button
            onClick={closeDrawer}
            className='rounded-full p-1 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800'>
            <svg
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='flex-1 space-y-4 overflow-y-auto p-4 text-sm overscroll-contain'>
          {messages.length === 0 && (
            <div className='mt-8 text-center text-xs text-gray-400'>
              在文章中划词提问，<br />
              或直接在这里输入。
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}>
              {msg.context && (
                <div className='mb-1 max-w-[90%] truncate rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-500 border-l-2 border-indigo-500 dark:bg-gray-800'>
                  {msg.context}
                </div>
              )}
              <div
                className={`max-w-[90%] rounded-xl px-3 py-2 leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-none bg-indigo-600 text-white'
                    : 'rounded-bl-none bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='ml-2 animate-pulse text-xs text-gray-400'>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='shrink-0 border-t border-gray-100/10 bg-white/50 p-3 dark:bg-black/20'>
          {selectedText && (
            <div className='mb-2 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/20'>
              <span className='max-w-[200px] truncate text-xs text-indigo-600 dark:text-indigo-300'>
                {selectedText}
              </span>
              <button
                onClick={() => setContext('')}
                className='text-indigo-400 hover:text-indigo-600'>
                ×
              </button>
            </div>
          )}

          <div className='flex gap-2'>
            <input
              className='flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-gray-100'
              placeholder='发送消息...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className='flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-md transition active:scale-95 dark:bg-white dark:text-black'>
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
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
