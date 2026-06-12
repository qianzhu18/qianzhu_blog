import { MenuItem } from './MenuItem'

/**
 * 移动端菜单栏
 */
export const MenuBarMobile = ({ links }) => {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <ul className='space-y-1'>
      {links.map((link, index) => (
        <MenuItem key={index} link={link} />
      ))}
    </ul>
  )
}

export default MenuBarMobile
