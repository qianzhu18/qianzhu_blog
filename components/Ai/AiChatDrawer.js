import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAiStore } from '@/lib/store/aiStore'

const API_PROMPT_AFTER_MS = 20 * 60 * 1000
const STORAGE_KEYS = {
  api: 'nn_ai_custom_api',
  usageStarted: 'nn_ai_usage_started',
  apiPrompted: 'nn_ai_api_prompted'
}
const DEFAULT_API_SETTINGS = {
  enabled: false,
  baseUrl: '',
  apiKey: '',
  model: ''
}

const sanitizeApiSettings = value => ({
  enabled: Boolean(value?.enabled),
  baseUrl: typeof value?.baseUrl === 'string' ? value.baseUrl : '',
  apiKey: typeof value?.apiKey === 'string' ? value.apiKey : '',
  model: typeof value?.model === 'string' ? value.model : ''
})

const normalizeText = text => {
  if (!text) return ''
  return String(text).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

const getArticleText = () => {
  if (typeof document === 'undefined') return ''
  const articleNode =
    document.querySelector('#article-wrapper #notion-article') ||
    document.getElementById('notion-article')
  if (!articleNode) return ''
  const rawText = articleNode.innerText || articleNode.textContent || ''
  return normalizeText(rawText)
}

export default function AiChatDrawer() {
  const {
    isOpen,
    closeDrawer,
    selectedText,
    setContext,
    activeContext,
    contextMeta,
    contextScope,
    setActiveContext,
    clearActiveContext
  } = useAiStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiSettings, setApiSettings] = useState(DEFAULT_API_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)
  const [apiNotice, setApiNotice] = useState('')
  const [usageStartedAt, setUsageStartedAt] = useState(0)
  const [apiPrompted, setApiPrompted] = useState(false)
  const [articleMeta, setArticleMeta] = useState({
    available: false,
    length: 0
  })
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.api)
      if (raw) {
        const parsed = JSON.parse(raw)
        setApiSettings(prev => ({
          ...prev,
          ...sanitizeApiSettings(parsed)
        }))
      }
    } catch (e) {
      // ignore corrupted storage
    }

    const usageStarted = Number(
      window.localStorage.getItem(STORAGE_KEYS.usageStarted)
    )
    if (Number.isFinite(usageStarted)) {
      setUsageStartedAt(Math.max(0, usageStarted))
    }

    const prompted = window.localStorage.getItem(STORAGE_KEYS.apiPrompted)
    if (prompted === 'true') {
      setApiPrompted(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.api, JSON.stringify(apiSettings))
  }, [apiSettings])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (usageStartedAt > 0) {
      window.localStorage.setItem(
        STORAGE_KEYS.usageStarted,
        String(usageStartedAt)
      )
    }
  }, [usageStartedAt])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEYS.apiPrompted, String(apiPrompted))
  }, [apiPrompted])

  useEffect(() => {
    const ready =
      apiSettings.enabled &&
      Boolean(apiSettings.baseUrl.trim()) &&
      Boolean(apiSettings.apiKey.trim())
    if (ready) {
      setApiNotice('')
    }
  }, [apiSettings])

  useEffect(() => {
    if (!contextScope) return
    if (router.asPath !== contextScope) {
      clearActiveContext()
      setContext('')
    }
  }, [router.asPath, contextScope, clearActiveContext, setContext])

  useEffect(() => {
    if (!isOpen) {
      setContext('')
    }
  }, [isOpen, setContext])

  useEffect(() => {
    if (!isOpen) return
    const text = getArticleText()
    setArticleMeta({ available: Boolean(text), length: text.length })
  }, [isOpen, router.asPath])

  const handleApplySelectionContext = () => {
    if (!selectedText) return
    setActiveContext(selectedText, {
      source: 'selection',
      scope: router.asPath
    })
    setContext('')
  }

  const handleApplyArticleContext = () => {
    const text = getArticleText()
    if (!text) return
    setActiveContext(text, { source: 'article', scope: router.asPath })
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    const hasContext = Boolean(activeContext || selectedText)
    if (!trimmedInput && !hasContext) return
    if (apiSettings.enabled && !isCustomApiReady) {
      setApiNotice('请先填写 API 地址和 Key，或关闭自定义 API。')
      setShowSettings(true)
      setApiPrompted(true)
      return
    }
    setApiNotice('')
    const now = Date.now()
    if (!usageStartedAt) {
      setUsageStartedAt(now)
    }
    const usageAnchor = usageStartedAt || now
    if (
      !apiPrompted &&
      !isCustomApiReady &&
      now - usageAnchor >= API_PROMPT_AFTER_MS
    ) {
      setShowSettings(true)
      setApiPrompted(true)
    }

    let currentContext = activeContext
    if (!currentContext && selectedText) {
      currentContext = selectedText
      setActiveContext(selectedText, { source: 'selection', scope: router.asPath })
      setContext('')
    }
    const userMsg = {
      role: 'user',
      content: trimmedInput,
      context: currentContext
    }
    const nextMessages = [...messages, userMsg]
    const assistantIndex = nextMessages.length

    setMessages([
      ...nextMessages,
      { role: 'assistant', content: '', streaming: true }
    ])
    setInput('')
    setIsLoading(true)

    try {
      const requestBody = {
        messages: nextMessages.map(m => ({
          role: m.role,
          content: m.content
        })),
        context: currentContext
      }

      requestBody.stream = true

      if (isCustomApiReady) {
        requestBody.api = {
          baseUrl: apiSettings.baseUrl.trim(),
          apiKey: apiSettings.apiKey.trim(),
          model: apiSettings.model.trim()
        }
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const applyAssistantMessage = (content, streaming = false) => {
        setMessages(prev =>
          prev.map((msg, idx) =>
            idx === assistantIndex ? { ...msg, content, streaming } : msg
          )
        )
      }

      const handleErrorPayload = data => {
        if (data?.error_code === 'INSUFFICIENT_QUOTA') {
          setApiNotice(
            data?.user_message ||
              '当前服务额度已用尽，请配置自定义 API。'
          )
          setShowSettings(true)
          setApiPrompted(true)
        }
        if (data?.error_code === 'RATE_LIMITED') {
          setApiNotice(
            data?.user_message ||
              '对话过于频繁，服务已暂时失效，请配置自定义 API。'
          )
          setShowSettings(true)
          setApiPrompted(true)
        }
        if (data?.error_code === 'MISSING_API_KEY') {
          setApiNotice('AI 服务未配置或 Key 无效，请检查设置。')
          setShowSettings(true)
          setApiPrompted(true)
        }
        applyAssistantMessage(
          data?.user_message || '网络连接异常',
          false
        )
      }

      if (!res.ok) {
        let data = {}
        try {
          data = await res.json()
        } catch (e) {
          data = {}
        }
        handleErrorPayload(data)
        return
      }

      if (!res.body) {
        let data = {}
        try {
          data = await res.json()
        } catch (e) {
          data = {}
        }
        applyAssistantMessage(data?.reply || '暂无回复', false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      let assistantContent = ''
      let streamFailed = false

      const processPayload = payload => {
        if (!payload) return
        if (payload.error_code) {
          handleErrorPayload(payload)
          streamFailed = true
          return
        }
        if (payload.delta) {
          assistantContent += payload.delta
          applyAssistantMessage(assistantContent, true)
        }
        if (payload.done) {
          applyAssistantMessage(assistantContent || '暂无回复', false)
        }
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          const lines = part.split('\n')
          const dataLines = lines
            .filter(line => line.startsWith('data:'))
            .map(line => line.replace(/^data:\s?/, ''))
          const dataText = dataLines.join('\n').trim()
          if (!dataText) continue
          if (dataText === '[DONE]') {
            applyAssistantMessage(assistantContent || '暂无回复', false)
            streamFailed = false
            buffer = ''
            break
          }
          try {
            const payload = JSON.parse(dataText)
            processPayload(payload)
            if (streamFailed) break
          } catch (e) {
            // ignore parse errors
          }
        }
        if (streamFailed) break
      }

      if (!streamFailed) {
        applyAssistantMessage(assistantContent || '暂无回复', false)
      }
    } catch (e) {
      setMessages(prev =>
        prev.map((msg, idx) =>
          idx === assistantIndex
            ? { ...msg, content: '网络连接异常', streaming: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const hasActiveContext = Boolean(activeContext)
  const hasSelection = Boolean(selectedText)
  const isCustomApiReady =
    apiSettings.enabled &&
    Boolean(apiSettings.baseUrl.trim()) &&
    Boolean(apiSettings.apiKey.trim())
  const shouldShowContextPanel =
    hasActiveContext || hasSelection || articleMeta.available
  const settingsToggleLabel = showSettings ? '收起设置' : 'API 设置'
  const showSettingsToggle = showSettings || apiPrompted
  const contextLabel =
    contextMeta?.source === 'article'
      ? '文章全文'
      : contextMeta?.source === 'selection'
        ? '选中文本'
        : '上下文'
  const contextLength =
    contextMeta?.originalLength > 0 ? contextMeta.originalLength : activeContext.length
  const contextLimit = contextMeta?.limit || 0
  const contextTruncated = Boolean(contextMeta?.truncated)

  return (
    <div className='fixed inset-0 z-[200] pointer-events-none flex justify-end items-end lg:items-start lg:pt-[72px]'>
      <div
        className={`
          pointer-events-auto bg-white/85 dark:bg-[#121212]/85 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]

          w-full h-[60vh] border-t border-black/5 rounded-t-2xl dark:border-white/10
          lg:h-full lg:w-[400px] lg:border-l lg:border-t-0 lg:rounded-none lg:translate-y-0
          ${
            isOpen
              ? 'translate-y-0 lg:translate-x-0'
              : 'translate-y-[120%] lg:translate-x-[100%]'
          }
        `}>
        <div className='flex items-center justify-between border-b border-black/5 px-4 py-3 shrink-0 dark:border-white/5'>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
              AI 阅读助手
            </span>
            <span className='text-[10px] uppercase tracking-[0.3em] text-gray-400'>
              READ MODE
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {showSettingsToggle && (
              <button
                type='button'
                onClick={() =>
                  setShowSettings(prev => {
                    const next = !prev
                    if (next) setApiPrompted(true)
                    return next
                  })
                }
                className='rounded-full border border-gray-200/70 bg-white/80 px-2 py-0.5 text-[10px] text-gray-600 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300'>
                {settingsToggleLabel}
              </button>
            )}
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
        </div>

        <div className='flex-1 overflow-y-auto p-4 text-sm overscroll-contain'>
          <div className='space-y-4'>
            {shouldShowContextPanel && (
              <div
                className={`rounded-xl border p-3 text-xs shadow-sm ${
                  hasActiveContext
                    ? 'border-emerald-200/70 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200'
                    : 'border-gray-200/70 bg-gray-50/80 text-gray-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300'
                }`}>
                {hasActiveContext ? (
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 text-[11px] font-semibold'>
                        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white'>
                          ✓
                        </span>
                        <span>上下文已引入</span>
                      </div>
                      <div className='mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-200/80'>
                        来源：{contextLabel} · {contextLength}字
                        {contextTruncated && contextLimit
                          ? ` · 已截取前 ${contextLimit} 字`
                          : ''}
                      </div>
                      <div className='mt-2 line-clamp-2 text-[11px] text-emerald-700/70 dark:text-emerald-200/70'>
                        {activeContext}
                      </div>
                    </div>
                    <div className='flex shrink-0 flex-col gap-1'>
                      {hasSelection && (
                        <button
                          type='button'
                          onClick={handleApplySelectionContext}
                          className='rounded-full border border-emerald-200 bg-white/70 px-2 py-1 text-[10px] text-emerald-700 transition hover:bg-white dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'>
                          替换选中
                        </button>
                      )}
                      <button
                        type='button'
                        onClick={clearActiveContext}
                        className='rounded-full border border-emerald-200/60 bg-white/70 px-2 py-1 text-[10px] text-emerald-700 transition hover:bg-white dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200'>
                        清除
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='text-[11px] font-semibold text-gray-700 dark:text-gray-200'>
                        未引入上下文
                      </div>
                      <div className='mt-1 text-[11px] text-gray-500 dark:text-gray-400'>
                        选中文本或引入全文，AI 将基于上下文回答。
                      </div>
                      {hasSelection && (
                        <div className='mt-2 line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400'>
                          选中：{selectedText}
                        </div>
                      )}
                    </div>
                    <div className='flex shrink-0 flex-col gap-1'>
                      {hasSelection && (
                        <button
                          type='button'
                          onClick={handleApplySelectionContext}
                          className='rounded-full border border-gray-200 bg-white/70 px-2 py-1 text-[10px] text-gray-700 transition hover:bg-white dark:border-gray-700 dark:bg-black/20 dark:text-gray-200'>
                          引入选中
                        </button>
                      )}
                      {articleMeta.available && (
                        <button
                          type='button'
                          onClick={handleApplyArticleContext}
                          title={
                            articleMeta.length
                              ? `约 ${articleMeta.length} 字`
                              : undefined
                          }
                          className='rounded-full border border-gray-200 bg-white/70 px-2 py-1 text-[10px] text-gray-700 transition hover:bg-white dark:border-gray-700 dark:bg-black/20 dark:text-gray-200'>
                          引入全文
                        </button>
                      )}
                      {hasSelection && (
                        <button
                          type='button'
                          onClick={() => setContext('')}
                          className='rounded-full border border-gray-200/70 bg-white/70 px-2 py-1 text-[10px] text-gray-500 transition hover:bg-white dark:border-gray-700/70 dark:bg-black/20 dark:text-gray-400'>
                          清除选中
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {messages.length === 0 && (
              <div className='mt-6 text-center text-xs text-gray-400'>
                先引入上下文再提问，<br />
                或直接在这里输入问题。
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                {msg.context && (
                  <div className='mb-2 relative max-w-[90%] rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-[10px] text-gray-500 italic leading-relaxed dark:border-white/10 dark:bg-white/5 dark:text-gray-400'>
                    <span className='absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-emerald-400/60 dark:bg-emerald-300/40' />
                    <div className='line-clamp-2'>{msg.context}</div>
                  </div>
                )}
                <div
                  className={`max-w-[95%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-2xl rounded-br-md bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'bg-transparent text-gray-800 dark:text-gray-200 pl-4 border-l-2 border-emerald-500/30'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='ml-2 flex items-center gap-1'>
                <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 dark:bg-gray-600' />
                <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 delay-75 dark:bg-gray-600' />
                <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 delay-150 dark:bg-gray-600' />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className='shrink-0 border-t border-black/5 bg-gradient-to-t from-white via-white/80 to-transparent p-4 dark:border-white/10 dark:from-[#121212] dark:via-[#121212]/80'>
          {apiNotice && (
            <div className='mb-3 rounded-lg border border-rose-200/70 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200'>
              {apiNotice}
            </div>
          )}

          {showSettings && (
            <div className='mb-3 space-y-2 rounded-xl border border-gray-200/70 bg-white/80 p-3 text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300'>
              <label className='flex items-center justify-between gap-3'>
                <div>
                  <div className='text-xs font-medium text-gray-700 dark:text-gray-200'>
                    使用自定义 API
                  </div>
                  <div className='text-[10px] text-gray-400'>
                    填写后将使用你自己的 API 服务。
                  </div>
                </div>
                <input
                  type='checkbox'
                  checked={apiSettings.enabled}
                  onChange={e =>
                    setApiSettings(prev => ({
                      ...prev,
                      enabled: e.target.checked
                    }))
                  }
                  className='h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-500 focus:ring-emerald-400'
                />
              </label>
              <div className='grid gap-2'>
                <input
                  value={apiSettings.baseUrl}
                  onChange={e =>
                    setApiSettings(prev => ({
                      ...prev,
                      baseUrl: e.target.value
                    }))
                  }
                  placeholder='API 地址，例如 https://api.z.ai/api/anthropic'
                  className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-white/10 dark:bg-black/20 dark:text-gray-200'
                />
                <input
                  value={apiSettings.apiKey}
                  onChange={e =>
                    setApiSettings(prev => ({
                      ...prev,
                      apiKey: e.target.value
                    }))
                  }
                  type='password'
                  placeholder='API Key'
                  className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-white/10 dark:bg-black/20 dark:text-gray-200'
                />
                <input
                  value={apiSettings.model}
                  onChange={e =>
                    setApiSettings(prev => ({
                      ...prev,
                      model: e.target.value
                    }))
                  }
                  placeholder='模型（可选），例如 GLM-4.7-FlashX'
                  className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-white/10 dark:bg-black/20 dark:text-gray-200'
                />
              </div>
              <div className='text-[10px] text-gray-400'>
                信息仅保存在本地浏览器，不会上传到站点。
              </div>
            </div>
          )}

          <div className='flex gap-2'>
            <input
              className='flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-100'
              placeholder='输入你的问题...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  void handleSend()
                }
              }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={isLoading}
              className='flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-md transition active:scale-95 disabled:opacity-50 disabled:shadow-none dark:bg-white dark:text-black'>
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
