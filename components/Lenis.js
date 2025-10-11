import { useEffect, useRef } from 'react'
import { loadExternalResource } from '@/lib/utils'

/**
 * 滚动阻尼特效
 * 目前只用在proxio主题
 * @returns
 */
const Lenis = () => {
  const lenisRef = useRef(null) // 用于存储 Lenis 实例

  useEffect(() => {
    // 异步加载
    async function loadLenis() {
      try {
        // 桌面端去除滚动阻尼，保证拖动流畅
        const prefersNoMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isDesktopPointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches

        if (prefersNoMotion || isDesktopPointer) {
          // 不在桌面端或减少动态偏好下启用 Lenis
          return
        }

        await loadExternalResource('/js/lenis.js', 'js')

        // console.log('Lenis', window.Lenis)
        if (!window.Lenis) {
          console.error('Lenis not loaded')
          return
        }
        const Lenis = window.Lenis

        // 创建 Lenis 实例
        const lenis = new Lenis({
          duration: 1.2,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
          direction: 'vertical', // vertical, horizontal
          gestureDirection: 'vertical', // vertical, horizontal, both
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: true,
          touchMultiplier: 2,
          infinite: false
        })

        // 存储实例到 ref
        lenisRef.current = lenis

        // 监听滚动事件
        // lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        //   // console.log({ scroll, limit, velocity, direction, progress })
        // })

        // 动画帧循环
        function raf(time) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      } catch (error) {
        console.error('Failed to load Lenis:', error)
      }
    }

    loadLenis()

    return () => {
      // 在组件卸载时清理资源
      if (lenisRef.current) {
        lenisRef.current.destroy() // 销毁 Lenis 实例
        lenisRef.current = null
        // console.log('Lenis instance destroyed')
      }
    }
  }, [])

  return <></>
}

export default Lenis
