import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAiStore } from '@/lib/store/aiStore'

export default function AiFloatingButton() {
  const {
    setContext,
    isOpen,
    setFabPosition,
    fabPosition,
    openDrawer,
    setTriggerType,
    selectedText,
    setActiveContext
  } = useAiStore()
  const [localShow, setLocalShow] = useState(false)
  const debounceRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const handleSelection = event => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        if (event?.target?.closest?.('[data-ai-dock]')) {
          return
        }
        const selection = window.getSelection()
        const text = selection?.toString().trim() || ''

        if (text.length > 2 && selection?.rangeCount) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          const x = rect.left + rect.width / 2 + window.scrollX
          const y = rect.top + window.scrollY - 56

          setContext(text)
          setFabPosition({ x, y, show: true })
          setLocalShow(true)
          return
        }

        if (!isOpen) {
          setContext('')
        }
        setLocalShow(false)
        setTimeout(() => {
          setFabPosition(pos => ({ ...pos, show: false }))
        }, 200)
      }, 120)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [setContext, setFabPosition, isOpen, fabPosition.show])

  if (!localShow && !fabPosition.show) return null

  const scrollY = typeof window === 'undefined' ? 0 : window.scrollY

  return (
    <div
      className={`fixed z-[9999] transition-all duration-200 ease-out ${
        localShow
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-90 pointer-events-none'
      }`}
      style={{
        left: fabPosition.x,
        top: fabPosition.y - scrollY,
        transform: 'translateX(-50%)'
      }}>
      <button
        id='ai-fab-btn'
        onClick={e => {
          e.stopPropagation()
          const scope = router?.asPath || ''
          if (selectedText) {
            setActiveContext(selectedText, { source: 'selection', scope })
            setContext('')
          }
          setTriggerType('context')
          openDrawer()
          setLocalShow(false)
          setFabPosition(pos => ({ ...pos, show: false }))
        }}
        className='group relative flex items-center gap-2 overflow-hidden rounded-full border border-emerald-200/60 bg-emerald-600/90 px-3 py-1.5 text-white shadow-2xl backdrop-blur-md transition-all hover:shadow-xl hover:scale-[1.03] active:scale-95'>
        <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full' />
        <span className='relative flex items-center gap-2'>
          <svg className='h-4 w-4 text-white' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M13 2L3 14h6l-1 8 10-12h-6l1-8z' />
          </svg>
          <span className='text-xs font-semibold tracking-wide'>Ask AI</span>
        </span>
      </button>
    </div>
  )
}
