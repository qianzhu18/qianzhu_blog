import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

/**
 * 千浅主题分页组件
 */
const Pagination = ({ page = 1, totalPage = 1 }) => {
  const router = useRouter()
  const currentPage = Number(page) || 1

  const pagePrefix = useMemo(() => {
    const basePath = router.asPath?.split('?')[0] || '/'
    return basePath
      .replace(/\/page\/[1-9]\d*/, '')
      .replace(/\/$/, '')
      .replace('.html', '')
  }, [router.asPath])

  if (totalPage <= 1) return null

  const showNext = currentPage < totalPage
  const showPrev = currentPage > 1

  const pages = generatePages(pagePrefix, currentPage, totalPage, router.query?.s)

  const getHref = target => {
    const base =
      target === 1
        ? `${pagePrefix || ''}/`
        : `${pagePrefix || ''}/page/${target}`
    // 保留搜索参数（服务端搜索使用）
    if (router.query?.s) {
      return { pathname: base, query: { s: router.query.s } }
    }
    return base
  }

  return (
    <div className='mt-10 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200'>
      <SmartLink
        href={getHref(currentPage - 1)}
        passHref
        legacyBehavior>
        <button
          disabled={!showPrev}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 shadow-sm ${
            showPrev
              ? 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-emerald-700 dark:text-emerald-200 hover:border-emerald-400 dark:hover:border-emerald-400'
              : 'cursor-not-allowed opacity-40 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
          }`}>
          <i className='fas fa-angle-left' />
          上一页
        </button>
      </SmartLink>

      <div className='flex items-center gap-2'>{pages}</div>

      <SmartLink
        href={getHref(currentPage + 1)}
        passHref
        legacyBehavior>
        <button
          disabled={!showNext}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 shadow-sm ${
            showNext
              ? 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-emerald-700 dark:text-emerald-200 hover:border-emerald-400 dark:hover:border-emerald-400'
              : 'cursor-not-allowed opacity-40 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
          }`}>
          下一页
          <i className='fas fa-angle-right' />
        </button>
      </SmartLink>
    </div>
  )
}

function generatePages(pagePrefix, currentPage, totalPage, searchQuery) {
  const pages = []
  const groupCount = 7 // 最多显示页签数

  const pushPage = page =>
    pages.push(getPageElement(pagePrefix, page, currentPage, searchQuery))

  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pushPage(i)
    }
  } else {
    pushPage(1)
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) startPage = 2
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(
        <span key='start-ellipsis' className='px-1 select-none text-gray-400'>
          ...
        </span>
      )
    }
    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pushPage(startPage + i)
      }
    }
    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(
        <span key='end-ellipsis' className='px-1 select-none text-gray-400'>
          ...
        </span>
      )
    }
    pushPage(totalPage)
  }
  return pages
}

function getPageElement(pagePrefix, page, currentPage, searchQuery) {
  const isActive = String(page) === String(currentPage)
  const base = page === 1 ? `${pagePrefix || ''}/` : `${pagePrefix || ''}/page/${page}`
  const href =
    searchQuery && typeof searchQuery === 'string' && searchQuery.length > 0
      ? `${base}?s=${encodeURIComponent(searchQuery)}`
      : base
  return (
    <SmartLink key={page} href={href} passHref>
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-transparent shadow-md'
            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-200 bg-white dark:bg-gray-800'
        }`}>
        {page}
      </span>
    </SmartLink>
  )
}

export default Pagination
