/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * Live2D 桌宠：人格化、惊喜感、不打扰
 * 使用 stevenjoezhang/live2d-widget 的 L2Dwidget.init
 */
export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = JSON.parse(siteConfig('WIDGET_PET'))
  const petLink = siteConfig('WIDGET_PET_LINK')
  const petSwitchTheme = siteConfig('WIDGET_PET_SWITCH_THEME')
  const petWidth = Number(siteConfig('WIDGET_PET_WIDTH', 280))
  const petHeight = Number(siteConfig('WIDGET_PET_HEIGHT', 250))
  const petPosition = siteConfig('WIDGET_PET_POSITION', 'right') // left | right
  const petHOffset = Number(siteConfig('WIDGET_PET_H_OFFSET', 20))
  const petVOffset = Number(siteConfig('WIDGET_PET_V_OFFSET', 0))
  const draggable = JSON.parse(siteConfig('WIDGET_PET_DRAGGABLE', true))
  const showOnMobile = JSON.parse(siteConfig('WIDGET_PET_MOBILE', false))
  const opacity = Number(siteConfig('WIDGET_PET_OPACITY', 0.9))
  const firstVisitAnim = JSON.parse(siteConfig('WIDGET_PET_FIRST_VISIT_ANIM', true))
  const idleFade = JSON.parse(siteConfig('WIDGET_PET_IDLE_FADE', true))
  const minimizeBtn = JSON.parse(siteConfig('WIDGET_PET_MINIMIZE_BTN', true))

  useEffect(() => {
    if (!showPet) return
    if (!showOnMobile && isMobile()) return

    // 引入 L2Dwidget 脚本
    loadExternalResource(
      'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js',
      'js'
    ).then(() => {
      // L2Dwidget 由 autoload.js 定义
      if (typeof window !== 'undefined' && window.L2Dwidget) {
        try {
          // 首次访问动画：使用 localStorage 标记
          const STORAGE_KEY = 'live2d_first_visited'
          const isFirst = !localStorage.getItem(STORAGE_KEY)
          if (firstVisitAnim && isFirst) {
            localStorage.setItem(STORAGE_KEY, '1')
          }

          window.L2Dwidget.init({
            pluginModelPath: petLink, // 直接使用模型 jsonPath（新版支持）
            model: {
              jsonPath: petLink
            },
            display: {
              position: petPosition,
              width: petWidth,
              height: petHeight,
              hOffset: petHOffset,
              vOffset: petVOffset,
              superSample: 2
            },
            mobile: {
              show: showOnMobile
            },
            react: {
              opacityDefault: opacity,
              opacityOnHover: 1
            },
            dialog: { enable: true },
            dev: { border: false },
            // 拖拽开关
            draggable: draggable
          })

          // 不打扰：长时间无交互淡出
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

          // 最小化按钮
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
            btn.style.background = 'rgba(255,255,255,0.8)'
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

          // 点击交互：切换主题（可选）
          if (petSwitchTheme) {
            const canvas = document.getElementById('live2d')
            canvas && (canvas.onclick = () => switchTheme())
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
