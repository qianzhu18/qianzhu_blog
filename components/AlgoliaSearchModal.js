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
  SearchBox,
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

  if (!appId || !searchKey || !indexName || !searchClient) {
    return <></>
  }

  return (
    <div
      id='search-wrapper'
      className={`${
        isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'
      } fixed left-0 top-0 z-30 flex h-screen w-screen items-start justify-center pt-0 sm:pt-[8vh]`}>
      {/* 模态框 */}
      <div
        className={`${
          isModalOpen ? 'opacity-100' : 'invisible opacity-0 translate-y-6'
        } relative z-50 flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/80 animate-fade-in`}>
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure hitsPerPage={8} />
          <ResetOnClose isOpen={isModalOpen} />

          <div className='flex items-center justify-between'>
            <div className='text-2xl font-semibold text-slate-900 dark:text-white'>
              搜索
            </div>
            <button
              type='button'
              className='rounded-full p-2 text-slate-500 transition hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10'
              onClick={() => setIsModalOpen(false)}
              aria-label='关闭搜索'>
              <i className='fa-solid fa-xmark' />
            </button>
          </div>

          <SearchBox
            placeholder='在这里输入搜索关键词...'
            autoFocus={isModalOpen}
            searchAsYouType
            inputProps={{ id: 'algolia-search-input' }}
            classNames={{
              root: 'ais-SearchBox-root',
              form: 'ais-SearchBox-form',
              input: 'ais-SearchBox-input',
              submit: 'ais-SearchBox-submit',
              reset: 'ais-SearchBox-reset',
              submitIcon: 'ais-SearchBox-submitIcon',
              resetIcon: 'ais-SearchBox-resetIcon',
              loadingIndicator: 'ais-SearchBox-loadingIndicator'
            }}
          />

          {/* 标签组 */}
          <div className='mb-4'>
            <TagGroups />
          </div>

          <QuickSearchTags keywords={recommendedKeywords} />
          <NoResults />

          <div className='flex-1 overflow-auto pr-1'>
            <Hits hitComponent={SearchHit} />
          </div>

          <div className='mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400'>
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

      {/* 遮罩 */}
      <div
        onClick={() => setIsModalOpen(false)}
        className='fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/20 backdrop-blur-sm'
      />
    </div>
  )
}

function SearchHit({ hit }) {
  const basePath = siteConfig('SUB_PATH', '')
  const href = `${basePath}/${hit.slug || hit.objectID}`

  return (
    <article className='group rounded-xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-yellow-500/40'>
      <SmartLink href={href} className='block space-y-2'>
        <h3 className='text-base font-semibold text-slate-900 dark:text-white'>
          <Highlight attribute='title' hit={hit} />
        </h3>
        <p className='text-sm text-slate-600 dark:text-slate-300 line-clamp-2'>
          <Snippet attribute='content' hit={hit} />
        </p>
        <div className='flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
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
