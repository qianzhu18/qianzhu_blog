/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Live2D 桌宠（L2Dwidget.init）：古风少女、低打扰、可配置
 */
export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))
  // 推荐古风少女模型（默认 koharu，可在 Notion 中切换）
  const petLink = siteConfig('WIDGET_PET_LINK') || 'https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json'
  const petSwitchTheme = siteConfig('WIDGET_PET_SWITCH_THEME')
  const petWidth = Number(siteConfig('WIDGET_PET_WIDTH', 280))
  const petHeight = Number(siteConfig('WIDGET_PET_HEIGHT', 260))
  const petPosition = siteConfig('WIDGET_PET_POSITION', 'right')
  const petHOffset = Number(siteConfig('WIDGET_PET_H_OFFSET', 24))
  const petVOffset = Number(siteConfig('WIDGET_PET_V_OFFSET', 16))
  const draggable = JSON.parse(siteConfig('WIDGET_PET_DRAGGABLE', true))
  const showOnMobile = JSON.parse(siteConfig('WIDGET_PET_MOBILE', false))
  const opacity = Number(siteConfig('WIDGET_PET_OPACITY', 0.95))
  const firstVisitAnim = JSON.parse(siteConfig('WIDGET_PET_FIRST_VISIT_ANIM', true))
  const idleFade = JSON.parse(siteConfig('WIDGET_PET_IDLE_FADE', true))
  const minimizeBtn = JSON.parse(siteConfig('WIDGET_PET_MINIMIZE_BTN', true))
  const canvasStyle = siteConfig('WIDGET_PET_CANVAS_STYLE', '')
  const cssFilter = siteConfig('WIDGET_PET_CSS_FILTER', '')
  // 鼠标靠近反馈半径
  const hoverRadius = Number(siteConfig('WIDGET_PET_HOVER_RADIUS', 120))
  const hoverScale = Number(siteConfig('WIDGET_PET_HOVER_SCALE', 1.08))

  useEffect(() => {
    if (!showPet) return
    if (!showOnMobile && isMobile()) return

        loadExternalResource(
      'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js',
      'js'
    ).then(() => {
      if (typeof window !== 'undefined' && window.L2Dwidget) {
        try {
          const STORAGE_KEY = 'live2d_first_visited'
          const isFirst = !localStorage.getItem(STORAGE_KEY)
          if (firstVisitAnim && isFirst) localStorage.setItem(STORAGE_KEY, '1')

          window.L2Dwidget.init({
            pluginModelPath: petLink,
            model: { jsonPath: petLink },
            display: {
              position: petPosition,
              width: petWidth,
              height: petHeight,
              hOffset: petHOffset,
              vOffset: petVOffset,
              superSample: 2
            },
            mobile: { show: showOnMobile },
            react: { opacityDefault: opacity, opacityOnHover: 1 },
            dialog: { enable: true },
            dev: { border: false },
            draggable
          })

          // 统一色调/质感
          const canvas = document.getElementById('live2d')
          if (canvas) {
            if (cssFilter) {
              canvas.style.filter = cssFilter
              const root = document.getElementById('live2d-widget')
              root && (root.style.filter = cssFilter)
            }
            if (canvasStyle) {
              try {
                canvas.setAttribute('style', `${canvas.getAttribute('style') || ''}; ${canvasStyle}`)
              } catch (_) {}
            }
          }

          // 空闲淡出
          if (idleFade) {
            let idleTimer
            const root = document.getElementById('live2d-widget')
            const reset = () => {
              root && (root.style.opacity = opacity)
              clearTimeout(idleTimer)
              idleTimer = setTimeout(() => {
                root && (root.style.opacity = Math.max(0.25, opacity - 0.4))
              }, 8000)
            }
            reset()
            ;['mousemove', 'click', 'scroll', 'keydown'].forEach(evt => {
              window.addEventListener(evt, reset, { passive: true })
            })
          }

          // 最小化
          if (minimizeBtn) {
            const btn = document.createElement('button')
            btn.innerText = '—'
            btn.setAttribute('aria-label', 'minimize')
            btn.style.position = 'fixed'
            btn.style.zIndex = 10001
            btn.style[petPosition] = `${petHOffset + 4}px`
            btn.style.bottom = `${petVOffset + petHeight + 6}px`
            btn.style.width = '24px'
            btn.style.height = '24px'
            btn.style.lineHeight = '24px'
            btn.style.textAlign = 'center'
            btn.style.border = '1px solid rgba(0,0,0,0.2)'
            btn.style.borderRadius = '6px'
            btn.style.background = 'rgba(255,255,255,0.85)'
            btn.style.backdropFilter = 'saturate(180%) blur(10px)'
            btn.style.cursor = 'pointer'
            btn.style.fontSize = '14px'
            btn.style.color = '#333'
            btn.onmouseenter = () => (btn.style.borderColor = '#007AFF')
            btn.onmouseleave = () => (btn.style.borderColor = 'rgba(0,0,0,0.2)')
            btn.onclick = () => {
              const root = document.getElementById('live2d-widget')
              if (!root) return
              const isHidden = root.style.display === 'none'
              root.style.display = isHidden ? 'block' : 'none'
            }
            document.body.appendChild(btn)
          }

          // 点击切主题（可选）
          if (petSwitchTheme) {
            const canvas = document.getElementById('live2d')
            canvas && (canvas.onclick = () => switchTheme())
          }

          // 鼠标跟随反馈（靠近放大、远离回落，不拦截滚动）
          const root = document.getElementById('live2d-widget')
          const petCanvas = document.getElementById('live2d')
          if (root && petCanvas) {
            const base = { x: 0, y: 0, s: 1 }
            let rafId
            function onMove(e){
              const rect = petCanvas.getBoundingClientRect()
              const cx = rect.left + rect.width / 2
              const cy = rect.top + rect.height / 2
              const dx = e.clientX - cx
              const dy = e.clientY - cy
              const dist = Math.sqrt(dx*dx + dy*dy)
              const t = Math.max(0, 1 - Math.min(dist / hoverRadius, 1)) // 0..1
              const tx = (dx / 40) * t
              const ty = (dy / 40) * t
              const sc = 1 + (hoverScale - 1) * t
              cancelAnimationFrame(rafId)
              rafId = requestAnimationFrame(()=>{
                root.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`
                root.style.transformOrigin = 'center'
                root.style.transition = 'transform 80ms ease-out'
              })
            }
            function onLeave(){
              root.style.transform = 'translate(0px, 0px) scale(1)'
              root.style.transition = 'transform 160ms ease-out'
            }
            window.addEventListener('mousemove', onMove, { passive: true })
            window.addEventListener('scroll', onLeave, { passive: true })
          }
        } catch (error) {
          console.error('Live2D init error', error)
        }
      }
    })
  }, [theme])

  if (!showPet) return null
  return null
}
