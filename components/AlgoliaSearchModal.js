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

      <div className='relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/20 bg-white/90 shadow-2xl dark:bg-zinc-900/90'>
        <div className='flex items-center border-b p-5 dark:border-zinc-800'>
          <i className='anzhiyufont anzhiyu-icon-magnifying-glass text-xl text-gray-400' />
          <input
            ref={inputRef}
            onChange={event => handleSearch(event.target.value)}
            className='w-full bg-transparent px-4 text-lg outline-none dark:text-white'
            placeholder='输入关键词，即刻寻找...'
          />

          {loading ? (
            <div className='flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200'>
              <span className='relative flex h-2.5 w-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60'></span>
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500'></span>
              </span>
              <span className='text-xs font-medium'>搜索中</span>
            </div>
          ) : (
            <kbd className='hidden rounded bg-gray-100 p-1 text-xs dark:bg-zinc-800 sm:block'>
              ESC
            </kbd>
          )}
        </div>

        <div className='max-h-[50vh] overflow-y-auto space-y-2 p-4'>
          {searchResults.length > 0 ? (
            searchResults.map(hit => {
              const slug = hit.slug || hit.objectID
              const href = `${normalizedBase}/${slug}`.replace(/\/{2,}/g, '/')
              return (
                <Link
                  key={hit.objectID || slug}
                  href={href}
                  onClick={() => setIsOpen(false)}>
                  <div className='group rounded-2xl p-4 transition-all hover:bg-indigo-600 hover:text-white'>
                    <div className='mb-1 font-bold'>{hit.title}</div>
                    <div className='line-clamp-1 text-sm opacity-60 group-hover:text-indigo-100'>
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
