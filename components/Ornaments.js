import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 侧边装饰动画：纯视觉，不拦截鼠标/滚动
 */
const Ornaments = () => {
  const enable = siteConfig('ORNAMENTS_ENABLE', true)
  const side = siteConfig('ORNAMENTS_SIDE', 'right')
  const color = siteConfig('ORNAMENTS_COLOR', 'rgba(7,49,49,0.35)')
  const width = Number(siteConfig('ORNAMENTS_WIDTH', 90))
  const opacity = Number(siteConfig('ORNAMENTS_OPACITY', 0.55))
  const styleName = siteConfig('ORNAMENTS_STYLE', 'mist') // mist|wave
  useEffect(() => {
    if (!enable) return
    const bar = document.createElement('div')
    bar.style.position = 'fixed'
    bar.style.top = '0'
    bar.style[side] = '0'
    bar.style.height = '100vh'
    bar.style.width = `${width}px`
    bar.style.pointerEvents = 'none'
    bar.style.zIndex = '5'
    const bgMist = `linear-gradient(180deg, transparent 0%, ${color} 40%, ${color} 60%, transparent 100%)`
    const bgWave = `radial-gradient(120px 40px at 50% 30%, ${color} 0%, transparent 70%), radial-gradient(120px 40px at 50% 70%, ${color} 0%, transparent 70%)`
    bar.style.background = styleName === 'wave' ? bgWave : bgMist
    bar.style.opacity = `${opacity}`
    document.body.appendChild(bar)

    let rafId
    function onScroll(){
      const y = window.scrollY || 0
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(()=>{
        if (styleName === 'wave') {
          const p = (y % 400) / 400
          bar.style.backgroundPosition = `50% ${p*100}% , 50% ${(1-p)*100}%`
        } else {
          const p = (y % 600) / 600
          bar.style.backgroundPosition = `0 ${p*100}%`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (bar && bar.parentNode) bar.parentNode.removeChild(bar)
    }
  }, [enable, side, color, width, opacity, styleName])
  return null
}

export default Ornaments


