/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 创建数字桌宠控制面板
 */
function createPetControlPanel(petPosition, petHOffset, petVOffset) {
  // 检查是否已存在面板
  if (document.getElementById('pet-control-panel')) return

  const panel = document.createElement('div')
  panel.id = 'pet-control-panel'
  panel.innerHTML = `
    <div class="pet-panel-header">
      <div class="pet-panel-title">
        <span class="pet-icon">🐾</span>
        数字桌宠
      </div>
      <button class="pet-panel-toggle" title="展开/收起">
        <span class="toggle-icon">▼</span>
      </button>
    </div>
    <div class="pet-panel-content">
      <div class="pet-control-section">
        <label class="pet-control-label">透明度</label>
        <div class="pet-slider-container">
          <input type="range" id="pet-opacity-slider" min="0.3" max="1" step="0.1" value="0.95">
          <span class="pet-slider-value">95%</span>
        </div>
      </div>
      
      <div class="pet-control-section">
        <label class="pet-control-label">大小</label>
        <div class="pet-slider-container">
          <input type="range" id="pet-size-slider" min="0.6" max="1.4" step="0.1" value="1.0">
          <span class="pet-slider-value">100%</span>
        </div>
      </div>
      
      <div class="pet-control-section">
        <label class="pet-control-label">互动灵敏度</label>
        <div class="pet-slider-container">
          <input type="range" id="pet-sensitivity-slider" min="60" max="200" step="20" value="120">
          <span class="pet-slider-value">标准</span>
        </div>
      </div>
      
      <div class="pet-control-buttons">
        <button class="pet-btn pet-btn-primary" id="pet-reset-position">
          <span>📍</span> 重置位置
        </button>
        <button class="pet-btn pet-btn-secondary" id="pet-hide-toggle">
          <span>👁️</span> <span class="hide-text">隐藏桌宠</span>
        </button>
      </div>
      
      <div class="pet-control-section">
        <label class="pet-control-label">快速设置</label>
        <div class="pet-preset-buttons">
          <button class="pet-preset-btn" data-preset="focus">专注模式</button>
          <button class="pet-preset-btn" data-preset="interactive">互动模式</button>
          <button class="pet-preset-btn" data-preset="minimal">简约模式</button>
        </div>
      </div>
      
      <div class="pet-info-section">
        <div class="pet-info-text">
          🌸 千浅主题桌宠
        </div>
      </div>
    </div>
  `

  // 添加样式
  const style = document.createElement('style')
  style.id = 'pet-control-panel-styles'
  style.textContent = \`
    #pet-control-panel {
      position: fixed;
      top: 20%;
      \${petPosition === 'right' ? 'right: 20px;' : 'left: 20px;'}
      width: 260px;
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
      backdrop-filter: saturate(180%) blur(20px);
      border: 1px solid rgba(74, 144, 226, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(74, 144, 226, 0.15);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
      opacity: 0.9;
      transition: all 0.3s ease;
    }
    
    #pet-control-panel:hover {
      opacity: 1;
      box-shadow: 0 12px 40px rgba(74, 144, 226, 0.2);
    }
    
    .pet-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(74, 144, 226, 0.1);
      cursor: pointer;
    }
    
    .pet-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #4A90E2;
    }
    
    .pet-icon {
      font-size: 16px;
    }
    
    .pet-panel-toggle {
      background: none;
      border: none;
      color: #4A90E2;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .pet-panel-toggle:hover {
      background: rgba(74, 144, 226, 0.1);
    }
    
    .toggle-icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    .pet-panel-content {
      padding: 16px;
      max-height: 500px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .pet-panel-content.collapsed {
      max-height: 0;
      padding: 0 16px;
    }
    
    .pet-control-section {
      margin-bottom: 16px;
    }
    
    .pet-control-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      margin-bottom: 8px;
    }
    
    .pet-slider-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .pet-slider-container input[type="range"] {
      flex: 1;
      -webkit-appearance: none;
      height: 6px;
      border-radius: 3px;
      background: rgba(74, 144, 226, 0.2);
      outline: none;
    }
    
    .pet-slider-container input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #4A90E2;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(74, 144, 226, 0.3);
    }
    
    .pet-slider-value {
      font-size: 11px;
      color: #4A90E2;
      font-weight: 500;
      min-width: 40px;
      text-align: center;
    }
    
    .pet-control-buttons {
      display: flex;
      gap: 8px;
      margin: 16px 0;
    }
    
    .pet-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid rgba(74, 144, 226, 0.3);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.6));
      color: #4A90E2;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    
    .pet-btn:hover {
      background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255,255,255,0.9));
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
    }
    
    .pet-preset-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    
    .pet-preset-btn {
      padding: 6px 8px;
      border: 1px solid rgba(74, 144, 226, 0.2);
      border-radius: 6px;
      background: rgba(255,255,255,0.6);
      color: #4A90E2;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .pet-preset-btn:hover, .pet-preset-btn.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;
    }
    
    .pet-info-section {
      border-top: 1px solid rgba(74, 144, 226, 0.1);
      padding-top: 12px;
      margin-top: 16px;
    }
    
    .pet-info-text {
      font-size: 11px;
      color: #4A90E2;
      text-align: center;
      opacity: 0.7;
    }
  \`
  
  document.head.appendChild(style)
  document.body.appendChild(panel)

  // 绑定事件
  setupPetControlEvents(petPosition, petHOffset, petVOffset)
}

/**
 * 设置桌宠控制面板事件
 */
/**
 * 设置桌宠控制面板事件
 */
function setupPetControlEvents(petPosition, petHOffset, petVOffset) {
  const panel = document.getElementById('pet-control-panel')
  const content = panel.querySelector('.pet-panel-content')
  const toggle = panel.querySelector('.pet-panel-toggle')
  const toggleIcon = panel.querySelector('.toggle-icon')
  
  // 面板展开/收起
  panel.querySelector('.pet-panel-header').onclick = () => {
    const isCollapsed = content.classList.contains('collapsed')
    content.classList.toggle('collapsed')
    toggleIcon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)'
  }
  
  // 透明度控制
  const opacitySlider = panel.querySelector('#pet-opacity-slider')
  const opacityValue = opacitySlider.parentElement.querySelector('.pet-slider-value')
  opacitySlider.oninput = () => {
    const value = parseFloat(opacitySlider.value)
    opacityValue.textContent = Math.round(value * 100) + '%'
    const petWidget = document.getElementById('live2d-widget')
    if (petWidget) {
      petWidget.style.opacity = value
    }
  }
  
  // 大小控制
  const sizeSlider = panel.querySelector('#pet-size-slider')
  const sizeValue = sizeSlider.parentElement.querySelector('.pet-slider-value')
  sizeSlider.oninput = () => {
    const value = parseFloat(sizeSlider.value)
    sizeValue.textContent = Math.round(value * 100) + '%'
    const petWidget = document.getElementById('live2d-widget')
    if (petWidget) {
      petWidget.style.transform = \`scale(\${value})\`
      petWidget.style.transformOrigin = 'bottom ' + petPosition
    }
  }
  
  // 灵敏度控制
  const sensitivitySlider = panel.querySelector('#pet-sensitivity-slider')
  const sensitivityValue = sensitivitySlider.parentElement.querySelector('.pet-slider-value')
  const sensitivityLabels = { 60: '低', 120: '标准', 160: '高', 200: '极高' }
  sensitivitySlider.oninput = () => {
    const value = parseInt(sensitivitySlider.value)
    sensitivityValue.textContent = sensitivityLabels[value] || '自定义'
    // 更新全局悬停半径
    window.petHoverRadius = value
  }
  
  // 重置位置
  panel.querySelector('#pet-reset-position').onclick = () => {
    const petWidget = document.getElementById('live2d-widget')
    if (petWidget) {
      petWidget.style.transform = 'scale(' + sizeSlider.value + ')'
      petWidget.style.right = petPosition === 'right' ? petHOffset + 'px' : 'auto'
      petWidget.style.left = petPosition === 'left' ? petHOffset + 'px' : 'auto'
      petWidget.style.bottom = petVOffset + 'px'
    }
  }
  
  // 隐藏/显示切换
  panel.querySelector('#pet-hide-toggle').onclick = () => {
    const petWidget = document.getElementById('live2d-widget')
    const hideText = panel.querySelector('.hide-text')
    if (petWidget) {
      const isHidden = petWidget.style.display === 'none'
      petWidget.style.display = isHidden ? 'block' : 'none'
      hideText.textContent = isHidden ? '隐藏桌宠' : '显示桌宠'
    }
  }
  
  // 预设模式
  panel.querySelectorAll('.pet-preset-btn').forEach(btn => {
    btn.onclick = () => {
      panel.querySelectorAll('.pet-preset-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      
      const preset = btn.dataset.preset
      switch(preset) {
        case 'focus':
          opacitySlider.value = '0.4'
          sizeSlider.value = '0.8'
          sensitivitySlider.value = '60'
          break
        case 'interactive':
          opacitySlider.value = '1.0'
          sizeSlider.value = '1.2'
          sensitivitySlider.value = '160'
          break
        case 'minimal':
          opacitySlider.value = '0.6'
          sizeSlider.value = '0.7'
          sensitivitySlider.value = '200'
          break
      }
      
      // 触发所有滑块的输入事件
      opacitySlider.oninput()
      sizeSlider.oninput()
      sensitivitySlider.oninput()
    }
  })
}

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
  // 动作反馈参数：靠近抬眼、远离低头（通过模拟姿态偏移）
  const lookAmplitude = Number(siteConfig('WIDGET_PET_LOOK_AMPLITUDE', 8)) // 0~15

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

          // 数字桌宠控制面板
          if (true) { // 总是显示控制面板
            createPetControlPanel(petPosition, petHOffset, petVOffset)
          }

          // 最小化按钮 - 古风设计
          if (minimizeBtn) {
            const btn = document.createElement('button')
            btn.innerText = '—'
            btn.setAttribute('aria-label', 'minimize pet')
            btn.setAttribute('title', '隐藏桌宠')
            btn.style.position = 'fixed'
            btn.style.zIndex = 10001
            btn.style[petPosition] = `${petHOffset + 4}px`
            btn.style.bottom = `${petVOffset + petHeight + 6}px`
            btn.style.width = '28px'
            btn.style.height = '28px'
            btn.style.lineHeight = '28px'
            btn.style.textAlign = 'center'
            btn.style.border = '1px solid rgba(74, 144, 226, 0.3)'
            btn.style.borderRadius = '14px' // 更圆润
            btn.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.85))'
            btn.style.backdropFilter = 'saturate(180%) blur(12px)'
            btn.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.15), inset 0 1px 0 rgba(255,255,255,0.7)'
            btn.style.cursor = 'pointer'
            btn.style.fontSize = '14px'
            btn.style.color = '#4A90E2'
            btn.style.fontWeight = '500'
            btn.style.transition = 'all 0.2s ease'
            btn.style.userSelect = 'none'
            
            btn.onmouseenter = () => {
              btn.style.borderColor = '#4A90E2'
              btn.style.background = 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255,255,255,0.9))'
              btn.style.transform = 'translateY(-1px) scale(1.05)'
              btn.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.25), inset 0 1px 0 rgba(255,255,255,0.8)'
            }
            btn.onmouseleave = () => {
              btn.style.borderColor = 'rgba(74, 144, 226, 0.3)'
              btn.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.85))'
              btn.style.transform = 'translateY(0px) scale(1)'
              btn.style.boxShadow = '0 4px 16px rgba(74, 144, 226, 0.15), inset 0 1px 0 rgba(255,255,255,0.7)'
            }
            btn.onclick = (e) => {
              e.preventDefault()
              const root = document.getElementById('live2d-widget')
              if (!root) return
              const isHidden = root.style.display === 'none'
              root.style.display = isHidden ? 'block' : 'none'
              btn.innerText = isHidden ? '—' : '+'
              btn.setAttribute('title', isHidden ? '隐藏桌宠' : '显示桌宠')
              
              // 添加点击动画
              btn.style.transform = 'translateY(1px) scale(0.95)'
              setTimeout(() => {
                btn.style.transform = 'translateY(0px) scale(1)'
              }, 150)
            }
            document.body.appendChild(btn)
          }

          // 点击切主题（可选）
          if (petSwitchTheme) {
            const canvas = document.getElementById('live2d')
            canvas && (canvas.onclick = () => switchTheme())
          }

          // 鼠标跟随反馈（减少拖动阻尼，优化流畅度）
          const root = document.getElementById('live2d-widget')
          const petCanvas = document.getElementById('live2d')
          if (root && petCanvas) {
            let rafId
            let isDragging = false
            let dragStartTime = 0
            
            // 分离拖拽和悬停逻辑
            function onMove(e){
              // 如果正在拖拽，减少悬停效果干扰
              if (isDragging) return
              
              const rect = petCanvas.getBoundingClientRect()
              const cx = rect.left + rect.width / 2
              const cy = rect.top + rect.height / 2
              const dx = e.clientX - cx
              const dy = e.clientY - cy
              const dist = Math.sqrt(dx*dx + dy*dy)
              const t = Math.max(0, 1 - Math.min(dist / hoverRadius, 1)) // 0..1
              
              // 只有悬停效果，不影响拖拽
              if (t > 0.1) {
                // 极轻微的悬停反馈
                const moveScale = 0.15 // 进一步减少移动幅度
                const tx = (dx / 60) * t * moveScale  
                const ty = (dy / 60) * t * moveScale
                const sc = 1 + (hoverScale - 1) * t * 0.5 // 减少缩放幅度
                
                cancelAnimationFrame(rafId)
                rafId = requestAnimationFrame(()=>{
                  if (!isDragging) {
                    root.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`
                    root.style.transformOrigin = 'center'
                    root.style.transition = 'transform 80ms ease-out'
                  }
                })

                // 更温和的姿态效果
                const pitch = (dy / hoverRadius) * lookAmplitude * 0.3
                petCanvas.style.transform = `rotateX(${Math.max(Math.min(-pitch, 3), -3)}deg)`
                petCanvas.style.transition = 'transform 100ms ease-out'
                
                const sat = 1 + 0.05 * t
                const brightness = 1 + 0.02 * t
                petCanvas.style.filter = `${cssFilter} saturate(${sat}) brightness(${brightness})`
              }
            }
            
            function onLeave(){
              if (!isDragging) {
                root.style.transform = 'translate(0px, 0px) scale(1)'
                root.style.transition = 'transform 150ms ease-out'
                petCanvas.style.transform = 'rotateX(0deg)'
                petCanvas.style.filter = cssFilter
              }
            }
            
            // 拖拽事件处理
            function onMouseDown(e) {
              isDragging = true
              dragStartTime = Date.now()
              root.style.transition = 'none' // 拖拽时移除过渡效果
              document.body.style.userSelect = 'none' // 防止拖拽时选中文本
            }
            
            function onMouseUp(e) {
              const dragDuration = Date.now() - dragStartTime
              isDragging = false
              document.body.style.userSelect = ''
              
              // 恢复平滑过渡
              setTimeout(() => {
                if (!isDragging) {
                  root.style.transition = 'transform 200ms ease-out'
                }
              }, 50)
            }
            
            // 监听拖拽状态
            root.addEventListener('mousedown', onMouseDown, { passive: true })
            document.addEventListener('mouseup', onMouseUp, { passive: true })
            
            window.addEventListener('mousemove', onMove, { passive: true })
            window.addEventListener('scroll', onLeave, { passive: true })
            window.addEventListener('mouseleave', onLeave, { passive: true })
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
