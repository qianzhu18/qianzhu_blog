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
  
  // 5. 现代化视差效果
  initModernParallaxEffects()
  
  // 6. 玻璃态效果增强
  initGlassMorphismEffects()
  
  // 7. 动态背景效果
  initDynamicBackground()
  
  // 8. 3D卡片效果
  init3DCardEffects()
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
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
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
        color: var(--qianqian-primary, #4A90E2);
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
  const petCanvas = document.querySelector('#live2dcanvas')
  if (petCanvas) {
    // 为桌宠添加古风滤镜效果
    petCanvas.style.filter = `
      hue-rotate(165deg) 
      saturate(1.1) 
      contrast(1.02)
      drop-shadow(0 8px 16px rgba(74, 144, 226, 0.15))
    `
  }
}

// 现代化视差效果
const initModernParallaxEffects = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]')
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    
    parallaxElements.forEach(el => {
      const speed = el.dataset.parallax || 0.5
      const yPos = -(scrolled * speed)
      el.style.transform = `translateY(${yPos}px)`
    })
  })
}

// 玻璃态效果增强
const initGlassMorphismEffects = () => {
  const glassElements = document.querySelectorAll('.glass-effect, .glass-effect-dark')
  
  glassElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const angleX = (y - centerY) / 20
      const angleY = (centerX - x) / 20
      
      this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`
    })
    
    el.addEventListener('mouseleave', function() {
      this.style.transform = ''
    })
  })
}

// 动态背景效果
const initDynamicBackground = () => {
  // 只在大屏幕上启用
  if (window.innerWidth < 768) return
  
  const canvas = document.createElement('canvas')
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.1;
  `
  
  document.body.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const particles = []
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1
    })
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(74, 144, 226, 0.3)'
      ctx.fill()
    })
    
    requestAnimationFrame(animate)
  }
  
  animate()
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

// 3D卡片效果
const init3DCardEffects = () => {
  const cards = document.querySelectorAll('article > div, .card, .shadow-card')
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      this.style.transition = 'transform 0.1s ease-out'
    })
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = ''
      this.style.transition = 'transform 0.3s ease-out'
    })
  })
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
