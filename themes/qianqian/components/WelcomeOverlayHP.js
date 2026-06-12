/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * HomePage 风格的加载转场覆盖层（简化版）
 * - 自动播放，无需点击
 * - SVG 形变 + 遮罩上移，结束后销毁
 * - 弱网 / 省流 / 减少动态：自动禁用
 */
const WelcomeOverlayHP = ({ onFinishLoading }) => {
  const [mounted, setMounted] = useState(false)
  const [disableForEnv, setDisableForEnv] = useState(true)
  const [show, setShow] = useState(true)
  const overlayRef = useRef(null)
  const pathRef = useRef(null)

  const welcomeText = siteConfig('PROXIO_WELCOME_TEXT', '欢迎来到千逐的个人博客，点击任意位置进入')

  // 环境判定：弱网/省流/减少动态则禁用
  // 仅在客户端计算环境，避免 SSR / CSR 初次渲染不一致
  useEffect(() => {
    const computeDisable = () => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (conn) {
        if (conn.saveData) return true
        const et = conn.effectiveType || ''
        if (['slow-2g', '2g'].includes(et)) return true
        if (typeof conn.downlink === 'number' && conn.downlink < 1) return true
      }
      try {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
      } catch (e) {}
      return false
    }
    const disabled = computeDisable()
    setDisableForEnv(disabled)
    if (disabled) {
      setShow(false)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || disableForEnv) {
      if (disableForEnv) setShow(false)
      return
    }
    let cancelled = false
    const start = () => {
      if (cancelled) return
      const anime = window.anime
      if (!anime) {
        // 等待 anime 脚本就绪
        setTimeout(start, 60)
        return
      }
      const overlay = overlayRef.current
      const pathEl = pathRef.current
      if (!overlay || !pathEl) return

      // 设置 transform 原点
      const shape = overlay.querySelector('svg.shape')
      if (shape) shape.style.transformOrigin = '50% 0%'

      // Intro 整体上移隐藏
      anime({
        targets: overlay.querySelector('.content-intro'),
        duration: 1100,
        easing: 'easeInOutSine',
        translateY: '-200vh'
      })

      // 遮罩拉伸回弹
      anime({
        targets: shape,
        scaleY: [
          { value: [0.8, 1.8], duration: 550, easing: 'easeInQuad' },
          { value: 1, duration: 550, easing: 'easeOutQuad' }
        ]
      })

      // 路径形变为目标路径，动画结束后隐藏覆盖层
      anime({
        targets: pathEl,
        duration: 1100,
        easing: 'easeOutQuad',
        d: pathEl.getAttribute('data-to'),
        complete: () => {
          setShow(false)
          onFinishLoading && onFinishLoading()
        }
      })
    }
    start()
    return () => { cancelled = true }
  }, [disableForEnv, mounted, onFinishLoading])

  if (!mounted || !show) return null

  return (
    <div ref={overlayRef} className='intro-overlay fixed inset-0 z-[9999] overflow-hidden'>
      {/* anime.js 已在 pages/_document.js 全局引入 */}

      {/* 背景流体画布（HomePage 的 WebGL Fluid） */}
      {!disableForEnv && (
        <>
          <canvas id='background' className='absolute inset-0 w-full h-full'></canvas>
          <Script id='hp-fluid-config' strategy='afterInteractive'>
            {`
              window.$ = sel => document.querySelector(sel);
              window.config = {
                SIM_RESOLUTION: 128,
                DYE_RESOLUTION: 1024,
                CAPTURE_RESOLUTION: 512,
                DENSITY_DISSIPATION: 1,
                VELOCITY_DISSIPATION: 0.2,
                PRESSURE: 0.8,
                PRESSURE_ITERATIONS: 20,
                CURL: 30,
                SPLAT_RADIUS: 0.25,
                SPLAT_FORCE: 6000,
                SHADING: true,
                COLORFUL: true,
                COLOR_UPDATE_SPEED: 10,
                PAUSED: false,
                BACK_COLOR: { r: 30, g: 31, b: 33 },
                TRANSPARENT: false,
                BLOOM: true,
                BLOOM_ITERATIONS: 8,
                BLOOM_RESOLUTION: 256,
                BLOOM_INTENSITY: 0.4,
                BLOOM_THRESHOLD: 0.8,
                BLOOM_SOFT_KNEE: 0.7,
                SUNRAYS: true,
                SUNRAYS_RESOLUTION: 196,
                SUNRAYS_WEIGHT: 1.0
              };
              // 可见性 API 变量
              (function(){
                var hp = ('hidden' in document) ? 'hidden' : (('webkitHidden' in document) ? 'webkitHidden' : (('mozHidden' in document) ? 'mozHidden' : 'hidden'));
                window.hiddenProperty = hp;
                window.visibilityChangeEvent = hp.replace(/hidden/i, 'visibilitychange');
              })();
            `}
          </Script>
          <Script src='https://cdn.jsdelivr.net/gh/SimonAKing/HomePage/dist/js/background.js' strategy='afterInteractive' />
        </>
      )}

      {/* Intro 内容 */}
      <div className='content content-intro relative h-full w-full'>
        <div className='content-inner absolute inset-0 flex flex-col items-center justify-center select-none'>
          <h2 className='content-title text-white/95 text-2xl md:text-3xl mb-3 tracking-wide'>{welcomeText}</h2>
          <h3 className='content-subtitle text-white/70 text-base md:text-lg'>&nbsp;</h3>
          <div className='arrow arrow-1'></div>
          <div className='arrow arrow-2'></div>
        </div>

        {/* 遮罩形状 */}
        <div className='shape-wrap pointer-events-none'>
          <svg className='shape block w-full h-screen' preserveAspectRatio='none' viewBox='0 0 1440 800'>
            <path
              ref={pathRef}
              d='M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z'
              data-to='M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z'
              fill='#1e1f21'
            />
          </svg>
        </div>
      </div>

      {/* 遮罩期隐藏自定义光标/置顶按钮，避免干扰 */}
      <style jsx global>{`
        .cursor-dot, .cursor-ring { display: none !important; }
        #cd-top-button { display: none !important; }
        body { overflow: hidden; }
      `}</style>

      <style jsx>{`
        .intro-overlay { background: radial-gradient(1200px 800px at 50% 50%, rgba(255,255,255,0.06), rgba(0,0,0,0.85)); }
        .arrow { position:absolute; left:50%; width:18px; height:18px; border-right:2px solid rgba(255,255,255,.65); border-bottom:2px solid rgba(255,255,255,.65); transform: translateX(-50%) rotate(45deg); opacity:.8; }
        .arrow-1 { bottom: 96px; }
        .arrow-2 { bottom: 76px; }
      `}</style>
    </div>
  )
}

export default WelcomeOverlayHP
