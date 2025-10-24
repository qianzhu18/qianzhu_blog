import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useState } from 'react'

const LoadingCover = ({ onFinishLoading }) => {
  const [isVisible, setIsVisible] = useState(true)
  const welcomeText = siteConfig('PROXIO_WELCOME_TEXT', '欢迎来到我们的网站！')

  // 颜色配置
  const colors = {
    backgroundStart: '#1a1a1a',
    backgroundMiddle: '#4d4d4d',
    backgroundEnd: '#e6e6e6',
    textColor: '#ffffff'
  }

  // 判断是否需要禁用（弱网/省流/减少动态）
  const disableForEnv = useMemo(() => {
    if (typeof window === 'undefined') return true
    // 网络信息 API
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn) {
      if (conn.saveData) return true
      const et = conn.effectiveType || ''
      if (['slow-2g', '2g'].includes(et)) return true
      if (typeof conn.downlink === 'number' && conn.downlink < 1) return true
    }
    // 用户减少动态偏好
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true
      }
    } catch (e) {}
    return false
  }, [])

  useEffect(() => {
    if (disableForEnv) {
      setIsVisible(false)
      return
    }
    const pageContainer = document.getElementById('pageContainer')
    // 自动播放：进入时触发轻微缩放并在持续时间后淡出
    const enterTimer = setTimeout(() => {
      pageContainer?.classList?.add('page-clicked')
    }, 200) // 稍作停顿后进入淡出

    const exitTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onFinishLoading && onFinishLoading(), 100)
    }, 1600) // 动画总时长 ≈1.6s

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [disableForEnv, onFinishLoading])

  if (!isVisible) return null

  return (
    <div className='welcome' id='pageContainer'>
      <div className='welcome-text px-2' id='welcomeText'>
        {welcomeText}
      </div>
      {/* 覆盖全局：加载画面期间隐藏自定义光标与返回顶部按钮，避免视觉干扰 */}
      <style jsx global>{`
        .cursor-dot, .cursor-ring { display: none !important; }
        #cd-top-button { display: none !important; }
      `}</style>
      <style jsx>{`
        body { margin: 0; background-color: ${colors.backgroundStart}; height: 100vh; overflow: hidden; }
        .welcome { display:flex; justify-content:center; align-items:center; height:100vh; width:100vw; position:fixed; top:0; left:0; z-index:9999; pointer-events:auto; background:linear-gradient(120deg, ${colors.backgroundStart}, ${colors.backgroundMiddle}, ${colors.backgroundEnd}); background-size:300% 300%; animation:gradientShift 6s ease infinite; transition: opacity 0.6s ease; }
        .welcome.page-clicked { opacity:0; pointer-events:none; }
        .welcome-text { font-size:2.2rem; font-weight:700; color:${colors.textColor}; text-shadow:0 0 15px rgba(255,255,255,0.85),0 0 30px rgba(255,255,255,0.5); user-select:none; animation:textPulse 2.2s ease-in-out 1, fadeInUp 1.2s ease-out forwards; text-align:center; z-index:10000; position:relative; }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes textPulse { 0%,100%{ transform:scale(1); text-shadow:0 0 15px rgba(255,255,255,0.85),0 0 30px rgba(255,255,255,0.5);} 50%{ transform:scale(1.06); text-shadow:0 0 22px rgba(255,255,255,1),0 0 38px rgba(255,255,255,0.7);} }
        @keyframes fadeInUp { 0%{opacity:0; transform:translateY(40px)} 100%{opacity:1; transform:translateY(0)} }
      `}</style>
    </div>
  )
}

export default LoadingCover
