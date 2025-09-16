import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 文字广告Banner
 */
export default function BannerItem() {
  const banner = siteConfig('MAGZINE_HOME_BANNER_ENABLE', null, CONFIG)
  const button = siteConfig('MAGZINE_HOME_BUTTON', null, CONFIG)
  const text = siteConfig('MAGZINE_HOME_BUTTON_TEXT', null, CONFIG)
  const url = siteConfig('MAGZINE_HOME_BUTTON_URL', null, CONFIG)
  const title = siteConfig('MAGZINE_HOME_TITLE', null, CONFIG)
  const description = siteConfig('MAGZINE_HOME_DESCRIPTION', null, CONFIG)
  const tips = siteConfig('MAGZINE_HOME_TIPS', null, CONFIG)

  if (!banner) {
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-y-5 items-center justify-between w-full magzine-card magzine-banner magzine-reveal text-slate-100 text-center'>
      <h2 className='text-2xl font-semibold'>{title}</h2>
      <h3 className='text-sm text-slate-200'>{description}</h3>
      {button && (
        <Link href={url} className='magzine-button magzine-button--primary'>
          {text}
        </Link>
      )}
      <span className='text-xs text-slate-300'>{tips}</span>
    </div>
  )
}
