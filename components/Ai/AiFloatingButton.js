import { useEffect, useState } from 'react'
import { useAiStore } from '@/lib/store/aiStore'

export default function AiFloatingButton() {
  const { setContext, setFabPosition, fabPosition, toggleOpen } = useAiStore()
  const [localShow, setLocalShow] = useState(false)

  useEffect(() => {
    const handleSelection = () => {
      setTimeout(() => {
        const selection = window.getSelection()
        const text = selection.toString().trim()

        if (text.length > 1) {
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
      }, 10)
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
      className={`fixed z-[50] transition-all duration-300 ease-out ${
        localShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{
        left: fabPosition.x,
        top: fabPosition.y - scrollY,
        transform: 'translateX(-50%)',
        pointerEvents: localShow ? 'auto' : 'none'
      }}>
      <button
        type='button'
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          toggleOpen()
          setLocalShow(false)
        }}
        className='group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-black/80 shadow-lg backdrop-blur-md transition-transform active:scale-95'
        aria-label='AI 对话'>
        <i className='fa-solid fa-robot text-indigo-400 text-sm group-hover:text-indigo-300'></i>
      </button>
    </div>
  )
}
