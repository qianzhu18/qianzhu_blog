import { siteConfig } from '@/lib/config'
import algoliasearch from 'algoliasearch/lite'
import Link from 'next/link'
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 */
export default function AlgoliaSearchModal({ cRef }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)
  const requestIdRef = useRef(0)

  const appId = siteConfig('ALGOLIA_APP_ID')
  const searchKey = siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY')
  const indexName = siteConfig('ALGOLIA_INDEX')
  const basePath = siteConfig('SUB_PATH', '')
  const normalizedBase = basePath?.endsWith('/')
    ? basePath.slice(0, -1)
    : basePath || ''

  const client = useMemo(() => {
    if (!appId || !searchKey) return null
    return algoliasearch(appId, searchKey)
  }, [appId, searchKey])

  const index = useMemo(() => {
    if (!client || !indexName) return null
    return client.initIndex(indexName)
  }, [client, indexName])

  const isReady = Boolean(appId && searchKey && indexName && index)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleKeyDown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (!isReady) return
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isReady])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) return
    setLoading(false)
    setQuery('')
    setSearchResults([])
  }, [isOpen])

  useImperativeHandle(
    cRef,
    () => ({
      openSearch: () => {
        if (!isReady) return
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }),
    [isReady]
  )

  const handleSearch = async nextQuery => {
    if (!isReady) return
    const trimmedQuery = nextQuery.trim()
    if (!trimmedQuery) {
      setQuery(nextQuery)
      setSearchResults([])
      setLoading(false)
      return
    }
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setQuery(nextQuery)
    setLoading(true)
    try {
      const { hits } = await index.search(trimmedQuery, { hitsPerPage: 8 })
      if (requestIdRef.current === requestId) {
        setSearchResults(hits)
      }
    } catch (error) {
      if (requestIdRef.current === requestId) {
        console.error(error)
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false)
      }
    }
  }

  if (!isOpen || !isReady) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[15vh] backdrop-blur-xl animate-fade-in'>
      <div className='absolute inset-0' onClick={() => setIsOpen(false)}></div>

      <div className='relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/20 bg-white/80 shadow-2xl backdrop-blur-3xl dark:bg-zinc-900/80'>
        <div className='relative flex items-center border-b p-5 dark:border-zinc-800'>
          <i className='anzhiyufont anzhiyu-icon-magnifying-glass text-xl text-gray-400' />
          <input
            ref={inputRef}
            onChange={event => handleSearch(event.target.value)}
            className='w-full bg-transparent px-4 text-lg outline-none dark:text-white'
            placeholder='寻找深度见解与灵感...'
          />
          <kbd className='hidden rounded bg-gray-100 p-1 text-xs dark:bg-zinc-800 sm:block'>
            ESC
          </kbd>
        </div>

        {loading && (
          <div className='absolute bottom-0 left-0 h-[2px] w-full animate-pulse bg-indigo-500 transition-all duration-500'></div>
        )}

        <div className='max-h-[50vh] overflow-y-auto space-y-2 p-4'>
          {loading ? (
            <div className='space-y-4'>
              <div className='text-xs text-indigo-500'>正在穿梭知识库...</div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className='rounded-2xl bg-zinc-100/70 p-4 shadow-sm animate-pulse dark:bg-zinc-800/60'>
                  <div className='h-4 w-1/3 rounded bg-zinc-300/70 dark:bg-zinc-700/60'></div>
                  <div className='mt-3 h-3 w-2/3 rounded bg-zinc-300/60 dark:bg-zinc-700/50'></div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map(hit => {
              const slug = hit.slug || hit.objectID
              const href = `${normalizedBase}/${slug}`.replace(/\/{2,}/g, '/')
              return (
                <Link
                  key={hit.objectID || slug}
                  href={href}
                  onClick={() => setIsOpen(false)}>
                  <div className='rounded-2xl p-4 transition-all transform hover:scale-[1.01] hover:bg-indigo-50 dark:hover:bg-indigo-900/30'>
                    <div className='mb-1 font-bold'>{hit.title}</div>
                    <div className='line-clamp-1 text-sm text-gray-500 dark:text-gray-400'>
                      {hit.summary || hit.content || ''}
                    </div>
                  </div>
                </Link>
              )
            })
          ) : query ? (
            <div className='py-10 text-center text-gray-400'>暂无相关结果</div>
          ) : (
            <div className='py-10 text-center text-gray-400'>输入关键词开始搜索</div>
          )}
        </div>
      </div>
    </div>
  )
}
