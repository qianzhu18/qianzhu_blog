import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={`magzine-pill magzine-pill--outline ${
        selected ? 'magzine-pill--active' : ''
      } text-xs`}
    >
      <div className='text-slate-200'>
        #
        {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
