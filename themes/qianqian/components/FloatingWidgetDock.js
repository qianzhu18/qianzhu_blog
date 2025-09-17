import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'

/**
 * 千浅主题浮动控制面板
 * 主要用于承载桌宠相关的快捷操作
 */
export const FloatingWidgetDock = () => {
  const petEnabled = useMemo(() => {
    try {
      return JSON.parse(siteConfig('WIDGET_PET', true))
    } catch (error) {
      return false
    }
  }, [])

  const panelEnabled = useMemo(() => {
    try {
      return JSON.parse(siteConfig('WIDGET_PET_PANEL', true))
    } catch (error) {
      return false
    }
  }, [])

  const [petReady, setPetReady] = useState(false)
  const [petVisible, setPetVisible] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)

  // 订阅自定义事件，保持 dock 状态与 Live2D 同步
  useEffect(() => {
    if (!isBrowser || !petEnabled) {
      return () => {}
    }

    const api = window.__live2dPetAPI
    if (api?.isReady?.()) {
      setPetReady(true)
      setPetVisible(api.isVisible())
      setPanelOpen(api.isPanelOpen())
    }

    const handleReady = event => {
      setPetReady(true)
      setPetVisible(event?.detail?.visible ?? true)
      setPanelOpen(event?.detail?.panelOpen ?? false)
    }

    const handleVisibility = event => {
      setPetVisible(event?.detail?.visible ?? true)
    }

    const handlePanelToggle = event => {
      setPanelOpen(event?.detail?.open ?? false)
    }

    document.addEventListener('live2d:ready', handleReady)
    document.addEventListener('live2d:visibility-change', handleVisibility)
    document.addEventListener('live2d:panel-toggle', handlePanelToggle)

    return () => {
      document.removeEventListener('live2d:ready', handleReady)
      document.removeEventListener('live2d:visibility-change', handleVisibility)
      document.removeEventListener('live2d:panel-toggle', handlePanelToggle)
    }
  }, [petEnabled])

  if (!petEnabled) {
    return null
  }

  const triggerPet = () => {
    const api = window.__live2dPetAPI
    if (!api) return
    if (!petReady) return
    api.togglePet()
  }

  const triggerPanel = () => {
    const api = window.__live2dPetAPI
    if (!api || !panelEnabled) return
    if (!petReady) return
    api.togglePanel()
  }

  const triggerGreeting = () => {
    const api = window.__live2dPetAPI
    if (!api) return
    api.playGreeting?.()
  }

  const scrollToContent = () => {
    if (!isBrowser) return
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div className='pet-floating-dock'>
      <span className='pet-dock-label'>桌宠</span>
      <button
        type='button'
        className='pet-dock-btn'
        onClick={triggerPet}
        disabled={!petReady}
        title={petVisible ? '让桌宠休息一下' : '唤醒桌宠'}>
        {petVisible ? '休息' : '唤醒'}
      </button>

      {panelEnabled && (
        <button
          type='button'
          className='pet-dock-btn'
          onClick={triggerPanel}
          disabled={!petReady}
          title={panelOpen ? '收起控制面板' : '展开控制面板'}>
          {panelOpen ? '收起' : '控制'}
        </button>
      )}

      <button
        type='button'
        className='pet-dock-btn'
        onClick={triggerGreeting}
        disabled={!petReady}
        title='触发一次问候动画'>
        问候
      </button>

      <button
        type='button'
        className='pet-dock-btn secondary'
        onClick={scrollToContent}
        title='快速滚动到主要内容'>
        ↓
      </button>
    </div>
  )
}

export default FloatingWidgetDock
