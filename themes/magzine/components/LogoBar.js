import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

export default function LogoBar({ siteInfo, className }) {
  return (
    <div
      id='top-wrapper'
      className={`w-full flex items-center ${className || ''}`}>
      <SmartLink
        href='/'
        className='inline-flex items-center whitespace-nowrap font-semibold magzine-logo'>
        <LazyImage
          priority
          src={siteInfo?.icon}
          width={24}
          height={20}
          alt={siteConfig('AUTHOR')}
          className='mr-2 hidden md:inline-block'
        />
        <span>{siteConfig('TITLE')}</span>
      </SmartLink>
    </div>
  )
}
