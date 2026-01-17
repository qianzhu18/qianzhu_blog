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
    <div className='fixed inset-0 z-[9999] flex flex-col bg-zinc-900/95 backdrop-blur-2xl animate-fade-in'>
      <div className='flex items-center p-4 pt-16 lg:pt-4 border-b border-gray-800'>
        <div className='flex flex-1 items-center rounded-full border border-gray-700 bg-black px-5 py-3 transition-colors focus-within:border-indigo-500'>
          <i className='fa-solid fa-magnifying-glass mr-3 text-lg text-gray-500' />
          <input
            ref={inputRef}
            className='flex-1 bg-transparent text-base text-white outline-none placeholder:text-gray-600'
            placeholder='Search...'
            onChange={event => handleSearch(event.target.value)}
          />
          {loading && (
            <i className='fa-solid fa-circle-notch fa-spin text-indigo-500' />
          )}
        </div>
        <button
          type='button'
          onClick={() => setIsOpen(false)}
          className='ml-4 font-bold text-gray-400 active:text-white'>
          取消
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
        {loading &&
          [1, 2, 3].map(item => (
            <div
              key={item}
              className='mb-3 h-20 rounded-2xl bg-gray-800/50 p-4 animate-pulse'
            />
          ))}

        {!loading && searchResults.length > 0
          ? searchResults.map(hit => {
              const slug = hit.slug || hit.objectID
              const href = `${normalizedBase}/${slug}`.replace(/\/{2,}/g, '/')
              return (
                <Link
                  key={hit.objectID || slug}
                  href={href}
                  onClick={() => setIsOpen(false)}>
                  <div className='group mb-3 rounded-2xl border border-gray-800 bg-black/40 p-4 transition-all active:bg-gray-800'>
                    <div className='mb-1 flex items-center'>
                      <span className='mr-2 text-xs text-indigo-500'>#</span>
                      <h3 className='line-clamp-1 text-base font-bold text-gray-200'>
                        {hit.title}
                      </h3>
                    </div>
                    <p className='line-clamp-2 pl-4 text-xs text-gray-500'>
                      {hit.summary || hit.content || ''}
                    </p>
                  </div>
                </Link>
              )
            })
          : !loading && query && (
              <div className='py-10 text-center text-gray-400'>暂无相关结果</div>
            )}
      </div>
    </div>
  )
}
