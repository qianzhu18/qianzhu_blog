/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react'

/**
 * HomePage 风格交互网格背景（简化/高性能版）
 * - 2D Canvas 实现：斜向平移网格 + 悬停高亮 + 痕迹渐隐
 * - 移动端自动降级（更大方格、更慢速度）
 * - pointer-events: none，不影响交互
 */
export default function GridBackground () {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)

    const opts = {
      speed: isPhone ? 0.04 : 0.07,
      squareSize: isPhone ? 56 : 40,
      borderColor: 'rgba(255,255,255,0.10)',
      hoverFill: 'rgba(255,255,255,0.75)',
      hoverShadow: 'rgba(255,255,255,0.6)',
      trailDuration: isPhone ? 1800 : 1200
    }

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let gridOffset = { x: 0, y: 0 }
    let hovered = null
    const trail = new Map() // key: 'x,y' => {t:ms}

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onMove = e => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
      hovered = { x, y }
    }
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })

    const now = () => performance.now()
    let last = now()

    const draw = () => {
      const t = now()
      const dt = Math.min(40, t - last)
      last = t

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      // 平移网格产生“漂移”
      gridOffset.x += opts.speed * dt
      gridOffset.y += opts.speed * dt

      const size = opts.squareSize
      const startX = -((gridOffset.x) % size)
      const startY = -((gridOffset.y) % size)

      // 绘制网格
      ctx.strokeStyle = opts.borderColor
      for (let x = startX; x < w; x += size) {
        for (let y = startY; y < h; y += size) {
          ctx.strokeRect(x, y, size, size)
        }
      }

      // 悬停高亮 + 痕迹
      if (hovered) {
        const gx = Math.floor((hovered.x - startX) / size)
        const gy = Math.floor((hovered.y - startY) / size)
        const hx = startX + gx * size
        const hy = startY + gy * size
        const key = `${gx},${gy}`
        trail.set(key, t)

        // 当前悬停格
        ctx.save()
        ctx.fillStyle = opts.hoverFill
        ctx.shadowColor = opts.hoverShadow
        ctx.shadowBlur = 18
        ctx.fillRect(hx + 1, hy + 1, size - 2, size - 2)
        ctx.restore()
      }

      // 渐隐痕迹
      for (const [key, ts] of trail.entries()) {
        const elapsed = t - ts
        if (elapsed > opts.trailDuration) {
          trail.delete(key)
          continue
        }
        const alpha = 1 - elapsed / opts.trailDuration
        const [gx, gy] = key.split(',').map(Number)
        const hx = startX + gx * size
        const hy = startY + gy * size
        ctx.save()
        ctx.globalAlpha = alpha * 0.65
        ctx.fillStyle = opts.hoverFill
        ctx.fillRect(hx + 1, hy + 1, size - 2, size - 2)
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <div className='fixed inset-0 -z-10 pointer-events-none'>
      <canvas ref={canvasRef} className='w-full h-full' />
    </div>
  )
}

