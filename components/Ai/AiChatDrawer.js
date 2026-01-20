import { useEffect, useRef, useState } from 'react'
import { useAiStore } from '@/lib/store/aiStore'

export default function AiChatDrawer() {
  const { isOpen, toggleOpen, selectedText, setContext } = useAiStore()
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

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        throw new Error('No reply')
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '连接断开了，请稍后再试。' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='relative z-[999]'>
      <div
        className='fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity'
        onClick={toggleOpen}
      />

      <div
        className={`
        fixed bg-white/90 dark:bg-[#181818]/90 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out
        md:top-0 md:right-0 md:w-[380px] md:h-full md:border-l md:border-gray-200/20 md:rounded-l-2xl
        bottom-0 left-0 w-full h-[50vh] rounded-t-2xl border-t border-gray-200/20
      `}>
        <div className='flex items-center justify-between border-b border-gray-200/10 p-4'>
          <div className='flex items-center gap-2 text-indigo-500'>
            <i className='fa-solid fa-robot'></i>
            <span className='font-bold text-gray-800 dark:text-gray-100'>
              AI 助手
            </span>
          </div>
          <button
            onClick={toggleOpen}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'>
            <i className='fa-solid fa-xmark'></i>
          </button>
        </div>

        <div className='flex-1 space-y-4 overflow-y-auto p-4 text-sm'>
          {messages.length === 0 && (
            <div className='mt-10 text-center text-gray-400 opacity-60'>
              <i className='fa-regular fa-comment-dots mb-2 text-4xl'></i>
              <p>划选文字，即刻提问</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}>
              {msg.context && (
                <div className='mb-1 max-w-[90%] truncate border-l-2 border-indigo-400 pl-2 text-xs text-gray-500'>
                  {msg.context}
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'rounded-tr-none bg-indigo-500 text-white'
                    : 'rounded-tl-none bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
                }`}>
                {msg.content || (msg.context ? '（针对这段文字提问）' : '')}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='ml-2 animate-pulse text-xs text-gray-400'>
              Kimi 正在思考...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='border-t border-gray-200/10 bg-white/50 p-3 dark:bg-black/20'>
          {selectedText && (
            <div className='mb-2 flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-1 text-xs text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'>
              <span className='max-w-[200px] truncate'>引用: {selectedText}</span>
              <button onClick={() => setContext('')} className='hover:text-indigo-800'>
                ×
              </button>
            </div>
          )}

          <div className='flex gap-2'>
            <input
              className='flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-gray-100'
              placeholder='输入问题...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md transition-transform active:scale-95'>
              <i className='fa-solid fa-paper-plane text-xs'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
