# CLAUDE.md - NotionNext 千浅主题 v2.0

> 🎨 古雅今用，科技有温度 - 现代化设计升级版  
> 📅 更新时间：2025-08-15  
> 🚀 当前版本：qianqian v2.0 (现代化设计版)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 qianqian v2.0 版本特性

### 🎨 视觉设计升级
- **现代化卡片系统**：参考dewx.top设计，立体感卡片布局
- **优雅渐变背景**：多层次渐变和玻璃态效果  
- **丰富交互动画**：悬浮、缩放、阴影变化等现代效果
- **智能暗色适配**：完善的深色模式支持

### ⚡ 性能优化
- **滚动体验优化**：Lenis参数调优，减少阻尼感
- **响应式增强**：全设备适配的现代布局
- **动画性能**：GPU加速的流畅动画效果

### 🛠️ 技术架构
- **CSS变量系统**：完整的设计令牌管理
- **模块化样式**：可复用的现代UI组件
- **TypeScript友好**：完善的类型定义支持

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version 
- `npm run start` - Start production server
- `npm run export` - Export static site (with cross-env EXPORT=true)
- `npm run build-all-in-dev` - Build with production environment variables in dev
- `npm run bundle-report` - Analyze bundle with webpack-bundle-analyzer
- `npm run post-build` - Generate sitemap after build

### Linting and Type Checking
- `npx eslint .` - Run ESLint (configured with Next.js, Prettier, TypeScript rules)
- `npx tsc --noEmit` - Run TypeScript type checking

### Testing
- No explicit test framework is configured. Check if tests exist before assuming test commands.

## Project Architecture

This is a **NotionNext** blog system built with Next.js that transforms Notion pages into a static blog. The architecture is theme-based with multiple deployment options.

### Core Architecture
- **Framework**: Next.js with SSR/SSG capabilities
- **CMS**: Notion API as content management system
- **Styling**: Tailwind CSS + theme-specific styles
- **Rendering**: react-notion-x for Notion block rendering
- **Deployment**: Primarily Vercel, supports Docker and static export

### Key Directories Structure

```
/
├── blog.config.js          # Main configuration file
├── next.config.js          # Next.js configuration with theme scanning
├── pages/                  # Next.js pages with dynamic routing
├── lib/                    # Core utilities and data fetching
│   ├── notion/            # Notion API integration
│   ├── cache/             # Cache management (memory, Redis, local file)
│   └── lang/              # Multi-language support
├── themes/                # Multiple theme implementations
│   ├── qianqian/         # Current default theme (千浅主题, based on proxio)
│   ├── proxio/           # Original proxio theme
│   ├── hexo/             # Hexo-style theme
│   ├── next/             # Next-style theme
│   └── [20+ other themes]
├── components/           # Shared global components
├── conf/                 # Modular configuration files
└── styles/              # Global styles and utilities
```

### Multi-Theme System

The project uses a **dynamic theme loading system**:

- **Theme Selection Priority**: `FORCE_THEME` > URL `?theme=` parameter > Notion config > `blog.config.js`
- **Default Theme**: `qianqian` (千浅主题 - 古雅今用，科技有温度, based on proxio)
- **Theme Structure**: Each theme has `index.js`, `config.js`, `style.js`, and `components/` directory
- **Dynamic Loading**: Themes are loaded dynamically using Next.js dynamic imports
- **Theme Components**: Resolved via webpack alias `@theme-components`

### Qianqian Theme Features

The current `qianqian` theme includes:
- **Ancient-Modern Design**: Blends traditional Chinese aesthetics with modern UI
- **Enhanced Animations**: Fade-rise animations via `qianqian-effects.js`
- **Micro Interactions**: Button ripple effects and smooth scrolling
- **Decorative Elements**: Ancient-style ornamental components
- **Pet Integration**: Enhanced Live2D pet with theme-matched color filters

### Configuration Architecture

**Modular Config System** (in `/conf/` directory):
- `comment.config.js` - Comment system integration
- `analytics.config.js` - Analytics and tracking
- `image.config.js` - Image handling and optimization
- `animation.config.js` - Visual effects and animations
- `widget.config.js` - Floating widgets (chat, pets, music player)
- `plugin.config.js` - Third-party plugins (Algolia search, etc.)

### Data Flow

1. **Content Source**: Notion page ID(s) configured in `NOTION_PAGE_ID`
2. **Data Fetching**: `/lib/notion/` handles API calls and data transformation
3. **Caching**: Multi-layer caching (memory, Redis, file-based)
4. **Rendering**: react-notion-x renders Notion blocks
5. **Theme**: Dynamic theme components handle presentation
6. **Output**: Static generation or server-side rendering

### Multi-Language Support

- Supports multiple Notion page IDs with language prefixes (e.g., `zh:pageId,en:pageId`)
- Language detection and routing handled in `lib/lang/`
- Next.js i18n configuration generated dynamically

### Key Integration Points

- **Notion API**: Custom wrapper in `lib/notion/CustomNotionApi.ts`
- **Cache Management**: `lib/cache/cache_manager.js` with multiple backends
- **Image Optimization**: Next.js Image component with custom domains
- **SEO**: Dynamic sitemap, RSS feeds, and meta tag generation
- **Comments**: Multiple providers (Giscus, Gitalk, Twikoo, etc.)

### Environment Variables

Key configurations can be overridden via environment variables:
- `NOTION_PAGE_ID` - Notion page/database ID
- `NEXT_PUBLIC_THEME` - Default theme
- `NEXT_PUBLIC_FORCE_THEME` - Force specific theme (highest priority)
- `NEXT_PUBLIC_LANG` - Default language

## Development Notes

### Theme Development
- Each theme must implement `LayoutBase` and routing-specific layouts
- Theme components are resolved via `@theme-components` alias
- Use `getLayoutByTheme()` for dynamic theme component loading

### Configuration Changes
- Main config in `blog.config.js` imports from `/conf/` directory
- Theme configs in `themes/{theme}/config.js`
- Webpack alias setup in `next.config.js` for theme resolution

### Performance Considerations
- `NEXT_REVALIDATE_SECOND` controls cache invalidation (default: 5 seconds)
- Image optimization configured for common domains
- Bundle analysis available via `npm run bundle-report`

### Deployment Modes
- **Vercel**: Default SSR/SSG deployment
- **Static Export**: `npm run export` for static hosting
- **Standalone**: Docker-compatible build
- **Self-hosted**: Node.js server mode