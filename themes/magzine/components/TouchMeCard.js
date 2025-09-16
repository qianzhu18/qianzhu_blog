import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 交流频道
 */
export default function TouchMeCard() {
  if (!siteConfig('MAGZINE_SOCIAL_CARD', null, CONFIG)) {
    return <></>
  }

  return (
    <div className='relative h-32 flex flex-col magzine-reveal'>
      <FlipCard
        className='cursor-pointer lg:py-8 px-4 py-4 magzine-card magzine-highlight-card'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl text-slate-100'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_1')}
            </h2>
            <h3 className='pt-2 text-slate-200'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_2')}
            </h3>
          </div>
        }
        backContent={
          <Link href={siteConfig('MAGZINE_SOCIAL_CARD_URL', '#', CONFIG)}>
            <div className='font-[1000] text-xl h-full text-slate-100'>
              {siteConfig('MAGZINE_SOCIAL_CARD_TITLE_3')}
            </div>
          </Link>
        }
      />
    </div>
  )
}
