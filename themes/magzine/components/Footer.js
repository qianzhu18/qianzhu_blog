import AnalyticsBusuanzi from '@/components/AnalyticsBusuanzi'
import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import CopyRightDate from '@/components/CopyRightDate'
import DarkModeButton from '@/components/DarkModeButton'
import LazyImage from '@/components/LazyImage'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'

/**
 * 网页底脚
 */
const Footer = ({ title }) => {
  const { siteInfo } = useGlobal()
  const MAGZINE_FOOTER_LINKS = siteConfig('MAGZINE_FOOTER_LINKS', [], CONFIG)

  return (
    <footer
      id='footer-bottom'
      className='z-10 justify-center m-auto w-full p-6 relative magzine-footer text-slate-200'>
      <div className='max-w-screen-3xl w-full mx-auto'>
        {/* 信息与链接区块 */}
        <div className='w-full flex lg:flex-row flex-col justify-between py-16 gap-8'>
          <div className='gap-x-4 py-6 flex items-center'>
            {/* 站长信息 */}
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={40}
              alt={siteConfig('AUTHOR')}
            />
            <div>
              <h1 className='text-lg font-semibold text-slate-100'>{title}</h1>
              <i className='fas fa-copyright' />
              <a
                href={siteConfig('LINK')}
                className='underline font-bold justify-start text-amber-300 hover:text-cyan-200 duration-200'>
                {siteConfig('AUTHOR')}
              </a>
            </div>
          </div>

          {/* 右侧链接区块 */}
          <div className='grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-8 text-sm'>
            {MAGZINE_FOOTER_LINKS?.map((group, index) => {
              return (
                <div key={index}>
                  <div className='font-bold text-xl text-slate-100 lg:pb-8 pb-4'>
                    {group.name}
                  </div>
                  <div className='flex flex-col gap-y-2'>
                    {group?.menus?.map((menu, menuIndex) => {
                      return (
                        <div key={menuIndex}>
                          <Link
                            href={menu.href}
                            className='hover:underline text-slate-300 hover:text-cyan-200 duration-200'>
                            {menu.title}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 页脚 */}
        <div className='py-4 flex flex-col lg:flex-row justify-between items-center border-t border-slate-600/40'>
          <div className='flex gap-x-4 flex-wrap justify-between items-center'>
            <CopyRightDate />
            <PoweredBy />
          </div>

          <DarkModeButton className='text-slate-200' />

          <div className='flex justify-between items-center gap-x-4'>
            <div className='flex items-center gap-x-4'>
              <AnalyticsBusuanzi />
              <SocialButton />
            </div>
          </div>
        </div>

        {/* 备案 */}
        <div className='w-full text-center flex flex-wrap items-center justify-center gap-x-2'>
          <BeiAnSite />
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}

export default Footer
