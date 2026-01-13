const BUSUANZI_URL =
  'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'
const DOMAINS = [
  'https://qianzhu.online/',
  'https://qianzhu.me/',
  'https://blog.qianzhu.me/',
  'https://in.qianzhu.dpdns.org/'
]

const extractJson = text => {
  const match = text.match(/BusuanziCallback\((\{[\s\S]*?\})\)/)
  if (!match) {
    return null
  }
  try {
    return JSON.parse(match[1])
  } catch (error) {
    return null
  }
}

const fetchBusuanzi = async referer => {
  const response = await fetch(BUSUANZI_URL, {
    headers: {
      referer
    }
  })
  const text = await response.text()
  return extractJson(text)
}

export default async function handler(req, res) {
  try {
    const results = await Promise.all(DOMAINS.map(fetchBusuanzi))
    const totals = results.reduce(
      (acc, item) => {
        if (item) {
          acc.site_pv += Number(item.site_pv || 0)
          acc.site_uv += Number(item.site_uv || 0)
        }
        return acc
      },
      { site_pv: 0, site_uv: 0 }
    )
    res.status(200).json(totals)
  } catch (error) {
    res.status(500).json({ site_pv: 0, site_uv: 0 })
  }
}
