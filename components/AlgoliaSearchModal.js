import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import algoliasearch from 'algoliasearch/lite'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  Snippet,
  useInstantSearch,
  useSearchBox,
  useStats
} from 'react-instantsearch'

/**
 * 结合 Algolia InstantSearch 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 */
export default function AlgoliaSearchModal({ cRef }) {
  const router = useRouter()
  const recommendedKeywords = ['#PM实习', '#AI产品', '#NUS留学']

  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * 快捷键设置
   */
  useHotkeys('ctrl+k', e => {
    e.preventDefault()
    setIsModalOpen(true)
  })

  useHotkeys(
    'esc',
    e => {
      if (!isModalOpen) return
      e.preventDefault()
      setIsModalOpen(false)
    },
    { enableOnFormTags: true }
  )

  /**
   * 页面路径变化后，自动关闭此modal
   */
  useEffect(() => {
    setIsModalOpen(false)
  }, [router])

  /**
   * 打开时自动聚焦输入框
   */
  useEffect(() => {
    if (!isModalOpen) return
    const timer = setTimeout(() => {
      const input = document.getElementById('algolia-search-input')
      input?.focus()
    }, 60)
    return () => clearTimeout(timer)
  }, [isModalOpen])

  /**
   * 打开时禁用页面滚动
   */
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  /**
   * 对外暴露方法
   **/
  useImperativeHandle(cRef, () => {
    return {
      openSearch: () => {
        setIsModalOpen(true)
      }
    }
  })

  const appId = siteConfig('ALGOLIA_APP_ID')
  const searchKey = siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY')
  const indexName = siteConfig('ALGOLIA_INDEX')

  const searchClient = useMemo(() => {
    if (!appId || !searchKey) return null
    return algoliasearch(appId, searchKey)
  }, [appId, searchKey])

  useEffect(() => {
    if (!searchClient || !indexName) return
    searchClient.initIndex(indexName)
  }, [searchClient, indexName])

  if (!appId || !searchKey || !indexName || !searchClient) {
    return <></>
  }

  return (
    <div
      id='search-modal'
      onClick={() => setIsModalOpen(false)}
      className={`${
        isModalOpen
          ? 'opacity-100 animate-fade-in'
          : 'pointer-events-none opacity-0'
      } fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/20 p-4 pt-[10vh] backdrop-blur-lg transition-opacity duration-200`}>
      <div
        onClick={event => event.stopPropagation()}
        className={`${
          isModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        } w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/20 bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-200 dark:border-white/10 dark:bg-zinc-900/90`}>
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure hitsPerPage={8} />
          <ResetOnClose isOpen={isModalOpen} />

          <SearchBoxWithLoading isOpen={isModalOpen} />

          <div className='space-y-3 px-4 pt-4'>
            <TagGroups />
            <QuickSearchTags keywords={recommendedKeywords} />
            <NoResults />
          </div>

          <div className='max-h-[60vh] overflow-y-auto px-4 pb-4 pt-1 space-y-3'>
            <Hits hitComponent={SearchHit} className='space-y-3' />
          </div>

          <div className='flex flex-wrap items-center justify-between gap-2 border-t border-white/20 px-4 py-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400'>
            <StatsLine />
            <div className='flex items-center gap-2'>
              <Pagination
                className='ais-Pagination'
                padding={1}
                showFirst={false}
                showLast={false}
              />
              <span className='text-right'>
                <i className='fa-brands fa-algolia'></i> Algolia 提供搜索服务
              </span>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  )
}

function SearchBoxWithLoading({ isOpen }) {
  const { status } = useInstantSearch()
  const { query, refine } = useSearchBox()
  const isLoading =
    Boolean(query) && (status === 'loading' || status === 'stalled')

  return (
    <div className='relative flex items-center border-b border-white/40 p-4 dark:border-zinc-800/80'>
      <i className='anzhiyufont anzhiyu-icon-magnifying-glass ml-2 text-gray-400' />
      <input
        id='algolia-search-input'
        value={query || ''}
        onChange={event => refine(event.target.value)}
        autoFocus={isOpen}
        className='w-full bg-transparent px-4 py-2 text-lg text-slate-900 outline-none placeholder:text-slate-400 dark:text-white'
        placeholder='寻找灵感...'
      />
      {isLoading && (
        <div className='absolute right-6 animate-spin text-indigo-500'>
          <i className='anzhiyufont anzhiyu-icon-spinner text-xl' />
        </div>
      )}
    </div>
  )
}

function SearchHit({ hit }) {
  const basePath = siteConfig('SUB_PATH', '')
  const href = `${basePath}/${hit.slug || hit.objectID}`

  return (
    <article className='group cursor-pointer rounded-2xl bg-white/60 p-4 transition-all hover:scale-[1.01] hover:bg-indigo-500 hover:text-white dark:bg-zinc-900/60 dark:hover:bg-indigo-500'>
      <SmartLink href={href} className='block space-y-2'>
        <h3 className='text-lg font-bold text-slate-900 transition-colors group-hover:text-white dark:text-white'>
          <Highlight attribute='title' hit={hit} />
        </h3>
        <p className='text-sm text-slate-600 transition-colors line-clamp-2 group-hover:text-white/90 dark:text-slate-300'>
          <Snippet attribute='content' hit={hit} />
        </p>
        <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500 transition-colors group-hover:text-white/80 dark:text-slate-400'>
          {hit.category && (
            <span className='rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200'>
              {hit.category}
            </span>
          )}
          {Array.isArray(hit.tags) &&
            hit.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className='rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                {tag}
              </span>
            ))}
        </div>
      </SmartLink>
    </article>
  )
}

function NoResults() {
  const { results } = useInstantSearch()
  const { query } = useSearchBox()

  if (!query || !results || results.nbHits > 0) {
    return null
  }

  return (
    <div className='mb-4 rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300'>
      无法找到相关结果 <span className='font-semibold'>&quot;{query}&quot;</span>
    </div>
  )
}

function StatsLine() {
  const { nbHits, processingTimeMS } = useStats()
  const { query } = useSearchBox()

  if (!query) {
    return <span>输入关键词即可即时搜索</span>
  }

  return (
    <span>
      共搜索到 {nbHits} 条结果，用时 {processingTimeMS} 毫秒
    </span>
  )
}

function QuickSearchTags({ keywords }) {
  const { refine } = useSearchBox()

  if (!keywords || keywords.length === 0) return null

  return (
    <div className='mb-4 space-y-2'>
      <div className='text-xs text-slate-500 dark:text-slate-400'>推荐关键词</div>
      <div className='flex flex-wrap gap-2'>
        {keywords.map(keyword => (
          <button
            type='button'
            key={keyword}
            onClick={() => refine(keyword)}
            className='rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-500 hover:text-white dark:border-slate-700 dark:text-slate-300 dark:hover:border-yellow-500/60 dark:hover:bg-yellow-500/20'>
            {keyword}
          </button>
        ))}
      </div>
    </div>
  )
}

function ResetOnClose({ isOpen }) {
  const { refine } = useSearchBox()

  useEffect(() => {
    if (!isOpen) {
      refine('')
    }
  }, [isOpen, refine])

  return null
}

/**
 * 标签组
 */
function TagGroups() {
  const { tagOptions } = useGlobal()
  const firstTenTags = tagOptions?.slice(0, 10)

  return (
    <div id='tags-group' className='space-y-2'>
      {firstTenTags?.map((tag, index) => {
        return (
          <SmartLink
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'inline-block whitespace-nowrap'}>
            <div className='flex items-center rounded-lg px-2 py-0.5 text-sm text-slate-600 transition hover:bg-indigo-500 hover:text-white dark:text-slate-300 dark:hover:bg-yellow-500/20'>
              <div className='text-sm'>{tag.name} </div>
              {tag.count ? (
                <sup className='relative ml-1'>{tag.count}</sup>
              ) : (
                <></>
              )}
            </div>
          </SmartLink>
        )
      })}
    </div>
  )
}
