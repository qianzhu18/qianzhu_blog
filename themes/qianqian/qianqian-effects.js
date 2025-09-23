/**
 * 千浅主题专用特效系统
 * 古雅今用，科技有温度
 */

// 初始化千浅主题特效
export const initQianqianEffects = () => {
  console.log('🌸 千浅主题特效初始化...')
  
  // 1. 渐入动效系统
  initFadeRiseAnimations()
  
  // 2. 平滑滚动增强
  initSmoothScrolling()
  
  // 3. 添加页面微动效
  initPageMicroInteractions()
  
  // 4. 初始化古风装饰元素
  initAncientStyleDecorations()
  
  // 5. 初始化返回顶部按钮
  initBackToTopButton()
  
  // 6. 调整桌宠以匹配古风主题
  setTimeout(() => {
    adjustPetColorsForTheme()
  }, 1000) // 延迟确保Live2D已加载
}

// 渐入动效系统
const initFadeRiseAnimations = () => {
  const fadeRiseElements = document.querySelectorAll('.fx-fade-rise')
  
  if (fadeRiseElements.length === 0) {
    // 如果没有预设的 fx-fade-rise 元素，自动为主要内容添加
    const autoTargets = document.querySelectorAll(
      '.card, .shadow-card, .blog-item, .feature-item, section > div'
    )
    autoTargets.forEach(el => {
      if (!el.classList.contains('fx-fade-rise')) {
        el.classList.add('fx-fade-rise')
      }
    })
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
      } else {
        // 可选：滚动离开时重置动画
        entry.target.classList.remove('in-view')
      }
    })
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // 提前触发动画
  })

  document.querySelectorAll('.fx-fade-rise').forEach(el => {
    observer.observe(el)
  })
}

// 平滑滚动增强
const initSmoothScrolling = () => {
  // 为锚点链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        // 使用 Lenis 实例进行平滑滚动（如果可用）
        if (window.lenis) {
          window.lenis.scrollTo(target, { 
            duration: 0.6,
            offset: -80 // 顶部偏移量
          })
        } else {
          // 降级到原生滚动
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    })
  })
  
  // 优化滚动性能
  if (window.CSS && CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'smooth'
  }
}

// 页面微动效
const initPageMicroInteractions = () => {
  // 为按钮添加波纹效果
  document.querySelectorAll('.btn, button, [role="button"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span')
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `
      
      this.style.position = 'relative'
      this.style.overflow = 'hidden'
      this.appendChild(ripple)
      
      setTimeout(() => ripple.remove(), 600)
    })
  })
  
  // 添加波纹动画CSS
  if (!document.querySelector('#qianqian-ripple-style')) {
    const style = document.createElement('style')
    style.id = 'qianqian-ripple-style'
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// 返回顶部按钮控制
const initBackToTopButton = () => {
  const cdTopButton = document.getElementById('cd-top-button')
  
  if (!cdTopButton) return
  
  // 监听滚动事件
  const handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop
    
    if (scrollY > 300) {
      // 显示按钮
      cdTopButton.style.visibility = 'visible'
      cdTopButton.style.opacity = '1'
      cdTopButton.style.transform = 'translateY(0)'
    } else {
      // 隐藏按钮
      cdTopButton.style.visibility = 'hidden'
      cdTopButton.style.opacity = '0'
      cdTopButton.style.transform = 'translateY(20px)'
    }
  }
  
  // 初始检查
  handleScroll()
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
  
  // 点击事件（已在React中处理，这里作为备用）
  cdTopButton.addEventListener('click', (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

// 古风装饰元素
const initAncientStyleDecorations = () => {
  // 在页面顶部添加古风装饰线条
  const decorativeLine = document.createElement('div')
  decorativeLine.className = 'qianqian-decorative-line'
  decorativeLine.innerHTML = `
    <div class="line-pattern">
      <span>·</span><span>◊</span><span>·</span><span>◊</span><span>·</span>
    </div>
  `
  
  // 插入到主要内容区域的开始
  const mainWrapper = document.querySelector('#main-wrapper')
  if (mainWrapper && !document.querySelector('.qianqian-decorative-line')) {
    mainWrapper.insertAdjacentElement('afterbegin', decorativeLine)
  }
  
  // 添加装饰样式
  if (!document.querySelector('#qianqian-decoration-style')) {
    const style = document.createElement('style')
    style.id = 'qianqian-decoration-style'
    style.textContent = `
      .qianqian-decorative-line {
        text-align: center;
        padding: 40px 0 20px;
        opacity: 0.6;
      }
      
      .line-pattern {
        font-size: 18px;
        color: var(--qianqian-primary, #2F5C56);
        letter-spacing: 8px;
        animation: gentle-pulse 4s ease-in-out infinite;
      }
      
      @keyframes gentle-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
      }
      
      .line-pattern span:nth-child(odd) {
        animation-delay: 0.5s;
      }
      
      .line-pattern span:nth-child(even) {
        animation-delay: 1s;
      }
    `
    document.head.appendChild(style)
  }
}

// 动态调整桌宠颜色以匹配主题
export const adjustPetColorsForTheme = () => {
  const petCanvas = document.querySelector('#live2d')
  const petWidget = document.querySelector('#live2d-widget')
  
  if (petCanvas && petWidget) {
    // 为桌宠添加千浅主题的古风滤镜效果
    petCanvas.style.filter = `
      hue-rotate(165deg) 
      saturate(1.15) 
      contrast(1.05)
      brightness(1.02)
      drop-shadow(0 12px 24px rgba(47, 92, 86, 0.2))
      drop-shadow(0 4px 8px rgba(47, 92, 86, 0.1))
    `
    
    // 为整个桌宠容器添加古风氛围
    petWidget.style.filter = `drop-shadow(0 8px 32px rgba(47, 92, 86, 0.16))`
    
    // 添加古风装饰光效
    const existingGlow = petWidget.querySelector('.qianqian-pet-glow')
    if (!existingGlow) {
      const glowEffect = document.createElement('div')
      glowEffect.className = 'qianqian-pet-glow'
      glowEffect.style.cssText = `
        position: absolute;
        top: -20px;
        left: -20px;
        right: -20px;
        bottom: -20px;
        background: radial-gradient(circle, rgba(47, 92, 86, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.8s ease;
        pointer-events: none;
        z-index: -1;
        animation: qianqian-glow-pulse 4s ease-in-out infinite;
      `
      petWidget.style.position = 'relative'
      petWidget.insertBefore(glowEffect, petWidget.firstChild)
      
      // 鼠标悬停时显示光效
      petWidget.addEventListener('mouseenter', () => {
        glowEffect.style.opacity = '0.6'
      })
      petWidget.addEventListener('mouseleave', () => {
        glowEffect.style.opacity = '0'
      })
    }
  }
  
  // 添加相关样式到页面
  if (!document.querySelector('#qianqian-pet-styles')) {
    const style = document.createElement('style')
    style.id = 'qianqian-pet-styles'
    style.textContent = `
      @keyframes qianqian-glow-pulse {
        0%, 100% { 
          transform: scale(0.95);
          opacity: 0.3;
        }
        50% { 
          transform: scale(1.02);
          opacity: 0.6;
        }
      }
      
      /* 拖拽时的视觉反馈 */
      #live2d-widget:active {
        filter: drop-shadow(0 12px 40px rgba(47, 92, 86, 0.28)) !important;
        transform: scale(1.02) !important;
        transition: all 0.2s ease !important;
      }
      
      /* 桌宠容器的古风边框装饰 */
      #live2d-widget::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: conic-gradient(from 0deg, transparent, rgba(47, 92, 86, 0.18), transparent, rgba(184, 106, 91, 0.15), transparent);
        border-radius: 20px;
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: -1;
        animation: qianqian-border-rotate 8s linear infinite;
      }
      
      #live2d-widget:hover::before {
        opacity: 0.7;
      }
      
      @keyframes qianqian-border-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
  }
}

// 页面加载完成后初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQianqianEffects)
  } else {
    initQianqianEffects()
  }
  
  // 监听路由变化，重新初始化特效
  let currentPath = window.location.pathname
  setInterval(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname
      setTimeout(initQianqianEffects, 300) // 延迟确保新页面已渲染
    }
  }, 1000)
}
