#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const requiredTheme = process.env.QIANZHU_REQUIRED_THEME || 'qianqian'
const isVercelProduction =
  process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production'
const isStrict = isVercelProduction || process.env.QIANZHU_STRICT_DEPLOY === '1'

const errors = []
const warnings = []

const fail = message => errors.push(message)
const warn = message => warnings.push(message)

const exists = relativePath => fs.existsSync(path.join(root, relativePath))

const themeDir = path.join('themes', requiredTheme)
const themeIndexPath = path.join(themeDir, 'index.js')

if (!exists(themeDir)) {
  fail(
    `Missing ${themeDir}. The qianzhu production site cannot fall back to another theme.`
  )
} else {
  for (const fileName of ['index.js', 'config.js', 'style.js']) {
    const relativePath = path.join(themeDir, fileName)
    if (!exists(relativePath)) {
      fail(`Missing ${relativePath}.`)
    }
  }
}

if (exists(themeIndexPath)) {
  const indexSource = fs.readFileSync(path.join(root, themeIndexPath), 'utf8')
  const requiredExports = [
    'LayoutBase',
    'LayoutIndex',
    'LayoutPostList',
    'LayoutSlug',
    'THEME_CONFIG'
  ]

  for (const exportName of requiredExports) {
    const re = new RegExp(`\\b${exportName}\\b`)
    if (!re.test(indexSource)) {
      fail(`themes/${requiredTheme}/index.js does not expose ${exportName}.`)
    }
  }
}

const configuredTheme = process.env.NEXT_PUBLIC_THEME
if (isStrict) {
  if (configuredTheme !== requiredTheme) {
    fail(
      `NEXT_PUBLIC_THEME must be "${requiredTheme}" for production; got "${configuredTheme || '<unset>'}".`
    )
  }

  const notionPageId = process.env.NOTION_PAGE_ID
  if (!notionPageId) {
    fail('NOTION_PAGE_ID is required for production qianzhu.me deployments.')
  } else if (notionPageId.includes('02ab3b8678004aa69e9e415905ef32a5')) {
    fail('NOTION_PAGE_ID still points at the NotionNext template database.')
  }

  if (!process.env.NOTION_ACCESS_TOKEN && !process.env.NOTION_TOKEN_V2) {
    fail(
      'NOTION_ACCESS_TOKEN or NOTION_TOKEN_V2 is required for production Notion data.'
    )
  }
} else if (configuredTheme && configuredTheme !== requiredTheme) {
  warn(
    `NEXT_PUBLIC_THEME is "${configuredTheme}". Production qianzhu.me should use "${requiredTheme}".`
  )
}

for (const message of warnings) {
  console.warn(`[qianqian-deploy-guard] warning: ${message}`)
}

if (errors.length > 0) {
  console.error('[qianqian-deploy-guard] Deployment guard failed:')
  for (const message of errors) {
    console.error(`- ${message}`)
  }
  process.exit(1)
}

console.log(
  `[qianqian-deploy-guard] OK (${isStrict ? 'strict production' : 'local'} check, theme=${requiredTheme})`
)
