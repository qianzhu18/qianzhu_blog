import BLOG from "@/blog.config"

export default function getAllPageIds(collectionQuery, collectionId, collectionView, viewIds) {
  if (!collectionQuery && !collectionView) {
    return []
  }

  const pageSet = new Set()

  // Notion数据库中的第几个视图用于站点展示和排序
  const groupIndex = BLOG.NOTION_INDEX || 0

  try {
    if (viewIds && viewIds.length > 0) {
      const targetViewId = viewIds[groupIndex]
      const pageSort =
        collectionView?.[targetViewId]?.value?.value?.page_sort ||
        collectionView?.[targetViewId]?.value?.page_sort ||
        []

      if (Array.isArray(pageSort) && pageSort.length > 0) {
        pageSort.forEach(id => pageSet.add(id))
      }
    }
  } catch (error) {
    console.error('Error fetching page_sort from collection view:', {
      collectionId,
      viewIds,
      error
    })
  }

  // 合并同一数据库其它视图中的 page_sort，避免新版 Notion 只在某个视图返回新页面。
  if (collectionView) {
    Object.values(collectionView).forEach(view => {
      const pageSort =
        view?.value?.value?.page_sort ||
        view?.value?.page_sort ||
        []

      if (Array.isArray(pageSort) && pageSort.length > 0) {
        pageSort.forEach(id => pageSet.add(id))
      }
    })
  }

  // 再回退到 collectionQuery
  if (collectionQuery && Object.values(collectionQuery).length > 0) {
    Object.values(collectionQuery?.[collectionId] || {}).forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
  }

  return [...pageSet]
}
