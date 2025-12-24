'use client'

import { useEffect, useState } from 'react'

const TIMELINE = {
  INK_START: 500,
  SEAL_DROP: 1800,
  FADE_OUT: 2800,
  DESTROY: 3600
}

/**
 * Wanguan 版开屏动画（墨迹+印章+雾散）
 * 仅影响开屏，不调整其它布局。
 */
export default function SplashScreenWanguan({ onFinish = () => {} }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), TIMELINE.INK_START),
      setTimeout(() => setStep(2), TIMELINE.SEAL_DROP),
      setTimeout(() => setStep(3), TIMELINE.FADE_OUT),
      setTimeout(onFinish, TIMELINE.DESTROY)
    ]
    return () => timers.forEach(clearTimeout)
  }, [onFinish])

  const palette = {
    background: '#f8f4ec',
    foreground: '#2f5c56',
    subtle: '#5c6d66',
    primary: '#2f5c56',
    sealRed: '#c0504d'
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
        '--seal-red': palette.sealRed,
        backgroundColor: 'var(--background)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(162, 181, 177, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(162, 181, 177, 0.05) 0%, transparent 50%)
        `
      }}
    >
      <div className='relative'>
        <div
          className={`text-5xl md:text-7xl font-bold chinese-font tracking-[0.2em] flex flex-col items-center space-y-6 ${
            step >= 1 ? 'animate-ink' : 'opacity-0'
          }`}
          style={{ color: 'var(--foreground)' }}
        >
          <div className='flex flex-col items-center gap-2'>
            <span>千</span>
            <span>逐</span>
          </div>
        </div>

        <div
          className={`absolute top-1/2 -right-16 md:-right-24 transform -translate-y-1/2 writing-vertical-rl text-xs md:text-sm tracking-widest serif-font transition-all duration-1000 delay-300 ${
            step >= 1 ? 'opacity-40 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ color: 'var(--subtle)' }}
        >
          First Principles
        </div>

        <div
          className={`absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-16 h-16 md:w-20 md:h-20 border-[3px] flex items-center justify-center rounded-md overflow-hidden ${
            step >= 2 ? 'animate-seal' : 'opacity-0'
          }`}
          style={{
            borderColor: 'var(--seal-red)',
            backgroundColor: 'rgba(245, 245, 241, 0.8)',
            boxShadow: '0 2px 10px rgba(192, 80, 77, 0.2)'
          }}
        >
          <div
            className='w-[90%] h-[90%] flex items-center justify-center text-white'
            style={{ backgroundColor: 'var(--seal-red)' }}
          >
            <div className='grid grid-cols-2 gap-[2px] text-center p-1 leading-none font-serif select-none'>
              <span className='text-xs md:text-sm'>行</span>
              <span className='text-xs md:text-sm'>动</span>
              <span className='text-xs md:text-sm'>涌</span>
              <span className='text-xs md:text-sm'>现</span>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-16 w-32 md:w-48 h-[2px] bg-gray-200/30 rounded-full overflow-hidden'>
        <div
          className='h-full w-full origin-left transition-transform ease-out'
          style={{
            backgroundColor: 'var(--primary)',
            transform: step >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transitionDuration: '2500ms'
          }}
        />
      </div>
    </div>
  )
}
