import { useEffect } from 'react'

/**
 * 不蒜子统计 访客和阅读量
 * @returns
 */
export default function AnalyticsBusuanzi() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.__BUSUANZI_AGGREGATE__ = true
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch('/api/busuanzi-aggregate')
        if (!response.ok) {
          return
        }
        const data = await response.json()
        if (cancelled) {
          return
        }
        const pvNodes = document.getElementsByClassName(
          'busuanzi_value_site_pv'
        )
        const uvNodes = document.getElementsByClassName(
          'busuanzi_value_site_uv'
        )
        const pvContainers = document.getElementsByClassName(
          'busuanzi_container_site_pv'
        )
        const uvContainers = document.getElementsByClassName(
          'busuanzi_container_site_uv'
        )

        for (const node of pvNodes) {
          node.textContent = String(data.site_pv ?? '')
        }
        for (const node of uvNodes) {
          node.textContent = String(data.site_uv ?? '')
        }
        for (const node of pvContainers) {
          node.style.display = 'inline'
        }
        for (const node of uvContainers) {
          node.style.display = 'inline'
        }
      } catch (error) {
        // Keep Busuanzi fallback when aggregate fetch fails.
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])
  return (
    <div className='flex gap-x-1'>
      <span className='hidden busuanzi_container_site_pv whitespace-nowrap'>
        <i className='fas fa-eye' />
        <span className='px-1 busuanzi_value_site_pv'> </span>
      </span>
      <span className='hidden busuanzi_container_site_uv whitespace-nowrap'>
        <i className='fas fa-users' />
        <span className='px-1 busuanzi_value_site_uv'> </span>
      </span>
    </div>
  )
}
