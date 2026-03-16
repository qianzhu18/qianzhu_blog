'use client'

import { useEffect, useState } from 'react'

const TIMELINE = {
  INK_START: 500,
  STATE_REVEAL: 2100,
  FADE_OUT: 3200,
  DESTROY: 4000
}

/**
 * Wanguan 版开屏动画（墨迹 + 状态副标题 + 雾散）
 * 保留“千逐”为主视觉，仅弱化副文案的进入方式。
 */
export default function SplashScreenWanguan({ onFinish = () => {} }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), TIMELINE.INK_START),
      setTimeout(() => setStep(2), TIMELINE.STATE_REVEAL),
      setTimeout(() => setStep(3), TIMELINE.FADE_OUT),
      setTimeout(onFinish, TIMELINE.DESTROY)
    ]
    return () => timers.forEach(clearTimeout)
  }, [onFinish])

  const palette = {
    background: '#f8f4ec',
    foreground: '#2f5c56',
    subtle: '#5c6d66',
    primary: '#2f5c56'
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none ${
        step === 3 ? 'animate-mist-out' : ''
      }`}
      style={{
        '--background': palette.background,
        '--foreground': palette.foreground,
        '--subtle': palette.subtle,
        '--primary': palette.primary,
        backgroundColor: 'var(--background)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(162, 181, 177, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(162, 181, 177, 0.05) 0%, transparent 50%)
        `
      }}>
      <div className='relative flex flex-col items-center'>
        <div
          className={`text-5xl md:text-7xl font-bold chinese-font tracking-[0.2em] flex flex-col items-center space-y-6 ${
            step >= 1 ? 'animate-ink' : 'opacity-0'
          }`}
          style={{ color: 'var(--foreground)' }}>
          <div className='flex flex-col items-center gap-2'>
            <span>千</span>
            <span>逐</span>
          </div>
        </div>

        <div
          className={`absolute top-1/2 -right-16 md:-right-24 transform -translate-y-1/2 writing-vertical-rl text-xs md:text-sm tracking-widest serif-font transition-all duration-1000 delay-300 ${
            step >= 1 ? 'opacity-40 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ color: 'var(--subtle)' }}>
          First Principles
        </div>

        <div
          className={`mt-7 flex items-center gap-3 text-[11px] font-medium tracking-[0.32em] text-center transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-8 md:text-xs ${
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ color: 'var(--subtle)' }}>
          <span className='h-px w-8 bg-current opacity-20 md:w-10' />
          <span>构建之中</span>
          <span className='h-px w-8 bg-current opacity-20 md:w-10' />
        </div>
      </div>

      <div className='absolute bottom-16 h-[2px] w-32 overflow-hidden rounded-full bg-gray-200/30 md:w-48'>
        <div
          className='h-full w-full origin-left transition-transform ease-out'
          style={{
            backgroundColor: 'var(--primary)',
            transform: step >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transitionDuration: '2800ms'
          }}
        />
      </div>
    </div>
  )
}
