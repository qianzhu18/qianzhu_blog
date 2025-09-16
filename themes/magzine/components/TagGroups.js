import { useGlobal } from '@/lib/global'
import TagItemMini from './TagItemMini'

/**
 * 标签组
 */
const TagGroups = ({ tagOptions, currentTag }) => {
  const { locale } = useGlobal()
  if (!tagOptions) return <></>
  return (
    <div id='tags-group' className='py-4 magzine-side-card magzine-reveal'>
      <div className='mb-2 text-slate-100'>
        <i className='mr-2 fas fa-tag' />
        {locale.COMMON.TAGS}
      </div>
      <div className='flex flex-wrap gap-2'>
        {tagOptions?.map(tag => {
          const selected = tag.name === currentTag
          return <TagItemMini key={tag.name} tag={tag} selected={selected} />
        })}
      </div>
    </div>
  )
}

export default TagGroups
