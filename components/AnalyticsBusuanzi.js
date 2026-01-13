import { useEffect, useState } from 'react'

/**
 * 不蒜子统计 访客和阅读量
 * @returns
 */
export default function AnalyticsBusuanzi() {
  const [stats, setStats] = useState({ pv: null, uv: null })
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
        setStats({
          pv: data.site_pv ?? 0,
          uv: data.site_uv ?? 0
        })
      } catch (error) {
        // Keep Busuanzi fallback when aggregate fetch fails.
      }
    }
    load()
    const intervalId = setInterval(load, 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])
  const showStats = stats.pv !== null && stats.uv !== null
  return (
    <div className='flex gap-x-1'>
      <span className={`${showStats ? '' : 'hidden'} whitespace-nowrap`}>
        <i className='fas fa-eye' />
        <span className='px-1'>{stats.pv ?? ''}</span>
      </span>
      <span className={`${showStats ? '' : 'hidden'} whitespace-nowrap`}>
        <i className='fas fa-users' />
        <span className='px-1'>{stats.uv ?? ''}</span>
      </span>
    </div>
  )
}
