import { useEffect, useState } from 'react'
import { useAiStore } from '@/lib/store/aiStore'

export default function AiFloatingButton() {
  const {
    setContext,
    setFabPosition,
    fabPosition,
    openDrawer,
    setTriggerType
  } = useAiStore()
  const [localShow, setLocalShow] = useState(false)

  useEffect(() => {
    const handleSelection = () => {
      setTimeout(() => {
        const selection = window.getSelection()
        const text = selection.toString().trim()

        if (text.length > 2) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          const x = rect.left + rect.width / 2 + window.scrollX
          const y = rect.top + window.scrollY - 50

          setContext(text)
          setFabPosition({ x, y, show: true })
          setLocalShow(true)
        } else {
          setLocalShow(false)
          setTimeout(() => {
            setFabPosition(pos => ({ ...pos, show: false }))
          }, 200)
        }
      }, 100)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [setContext, setFabPosition])

  if (!localShow && !fabPosition.show) return null

  const scrollY = typeof window === 'undefined' ? 0 : window.scrollY

  return (
    <div
      className={`fixed z-[50] transition-all duration-200 ease-out ${
        localShow
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-90'
      }`}
      style={{
        left: fabPosition.x,
        top: fabPosition.y - scrollY,
        transform: 'translateX(-50%)'
      }}>
      <button
        onClick={e => {
          e.stopPropagation()
          setTriggerType('context')
          openDrawer()
          setLocalShow(false)
        }}
        className='flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/50 bg-black/80 shadow-xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 dark:bg-white/90'>
        <span className='text-xs font-bold text-white dark:text-black'>
          Ask
        </span>
      </button>
    </div>
  )
}
