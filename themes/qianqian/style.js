/* eslint-disable react/no-unknown-property */

/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
    return <style jsx global>{`

    /* 千浅主题 v2.0 - 现代化设计升级 */
    :root {
        --dewx-primary: #FE9600;
        --dewx-primary-dark: #E88600;
        --dewx-secondary: #FF6B6B;
        --dewx-accent: #4ECDC4;
        --dewx-text: #2C2C2C;
        --dewx-text-light: #64748B;
        --dewx-text-muted: #94A3B8;
        --dewx-bg: #FFFFFF;
        --dewx-bg-muted: #F8FAFC;
        --dewx-bg-card: #FFFFFF;
        --dewx-border: #E2E8F0;
        --dewx-border-light: #F1F5F9;
        --dewx-shadow: rgba(0, 0, 0, 0.08);
        --dewx-shadow-card: 0 1px 35px -8px rgba(0, 0, 0, 0.8);
        --dewx-shadow-hover: rgba(254, 150, 0, 0.15);
        --dewx-gradient-1: linear-gradient(135deg, #FE9600 0%, #FF6B6B 100%);
        --dewx-gradient-2: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --dewx-gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        --dewx-gradient-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .dark {
        --dewx-text: #E2E8F0;
        --dewx-text-light: #94A3B8;
        --dewx-text-muted: #64748B;
        --dewx-bg: #0F172A;
        --dewx-bg-muted: #1E293B;
        --dewx-bg-card: #1E293B;
        --dewx-border: #334155;
        --dewx-border-light: #475569;
        --dewx-shadow-card: 0 1px 35px -8px rgba(0, 0, 0, 0.9);
    }

    // 底色 - 现代化杂志风格
    body{
        background: var(--dewx-gradient-bg) !important;
        color: var(--dewx-text) !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
        transition: all 0.3s ease;
    }
    .dark body{
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
        color: var(--dewx-text) !important;
    }

    /* 隐藏默认光标，启用自定义光标 */
    html {
        cursor: none !important;
        scroll-behavior: smooth !important;
        overflow-x: hidden !important;
    }

    #theme-qianqian .bg-primary,
    #theme-proxio .bg-primary {
        --tw-bg-opacity: 1;
        background-color: var(--dewx-primary) !important;
    }

    /* 现代化按钮样式 */
    .btn, button, [role="button"] {
        background-color: var(--dewx-primary) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 12px 24px !important;
        font-weight: 600 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 2px 8px var(--dewx-shadow) !important;
        position: relative !important;
        overflow: hidden !important;
    }

    .btn:hover, button:hover, [role="button"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px var(--dewx-shadow-hover) !important;
        background-color: var(--dewx-primary-dark) !important;
    }

    /* 现代化卡片样式 - 参考dewx.top */
    .card, .shadow-card {
        background-color: var(--dewx-bg-card) !important;
        border: 1px solid var(--dewx-border) !important;
        border-radius: 12px !important;
        padding: 24px !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: var(--dewx-shadow-card) !important;
        position: relative !important;
        overflow: hidden !important;
    }

    .card:hover, .shadow-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15) !important;
        border-color: var(--dewx-primary) !important;
    }

    /* 千浅风格 - 渐入动效 */
    .fx-fade-rise {
        opacity: 0 !important;
        transform: translateY(20px) !important;
        transition: opacity 0.6s ease-out, transform 0.6s ease-out !important;
    }

    .fx-fade-rise.in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    /* 千浅风格 - 区域布局 */
    .section-padding {
        padding: 80px 0 !important;
    }

    .section-muted {
        background-color: var(--qianqian-bg-muted) !important;
    }

    /* 千浅风格 - 网格布局 */
    .card-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
        gap: 24px !important;
        margin: 32px 0 !important;
    }

    /* 现代化链接样式 */
    a {
        color: var(--dewx-primary) !important;
        text-decoration: none !important;
        transition: all 0.2s ease !important;
    }

    a:hover {
        color: var(--dewx-primary-dark) !important;
        text-decoration: underline !important;
    }
    
    @media (min-width: 540px) {
        #theme-proxio .container {
            max-width: 540px;
        }
    }
    @media (min-width: 720px) {
        #theme-proxio .container {
            max-width: 720px;
        }
    }
    
    @media (min-width: 960px) {
        #theme-proxio .container {
            max-width: 960px;
        }
    }
    @media (min-width: 1140px) {
        #theme-proxio .container {
            max-width: 1140px;
        }
    }
        
    @media (min-width: 1536px) {
        #theme-proxio .container {
            max-width: 1140px;
        }
    }
        

    #theme-proxio .container {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding-right: 16px;
        padding-left: 16px;
    }

  #theme-proxio .sticky{
    position: fixed;
    z-index: 20;
    background-color: rgb(255 255 255 / 0.8);
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  

  .dark\:bg-dark:is(.dark *) {
    background-color: black!important;
 }

  :is(.dark #theme-proxio .sticky){
    background-color: rgb(17 25 40 / 0.8);
  }
  
  #theme-proxio .sticky {
    -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
    box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  }
  
  #theme-proxio .sticky .navbar-logo{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  #theme-proxio .sticky #navbarToggler span{
    --tw-bg-opacity: 1;
    background-color: rgb(17 25 40 / var(--tw-bg-opacity));
  }
  
  :is(.dark #theme-proxio .sticky #navbarToggler span){
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  }
  
  #theme-proxio .sticky #navbarCollapse li > a{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  #theme-proxio .sticky #navbarCollapse li > a:hover{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }

  #theme-proxio .sticky #navbarCollapse li > button{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  :is(.dark #theme-proxio .sticky #navbarCollapse li > a){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  :is(.dark #theme-proxio .sticky #navbarCollapse li > a:hover){
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
  }

  :is(.dark #theme-proxio .sticky #navbarCollapse li > button){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  #navbarCollapse li .ud-menu-scroll.active{
    opacity: 0.7;
  }
  
  #theme-proxio .sticky #navbarCollapse li .ud-menu-scroll.active{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }
  
  #theme-proxio .sticky .loginBtn{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  #theme-proxio .sticky .loginBtn:hover{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }
  
  :is(.dark #theme-proxio .sticky .loginBtn){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  :is(.dark #theme-proxio .sticky .loginBtn:hover){
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
  }
  
  #theme-proxio .sticky .signUpBtn{
    --tw-bg-opacity: 1;
    background-color: rgb(55 88 249 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  #theme-proxio .sticky .signUpBtn:hover{
    --tw-bg-opacity: 1;
    background-color: rgb(27 68 200 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  #theme-proxio .sticky #themeSwitcher ~ span{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  :is(.dark #theme-proxio .sticky #themeSwitcher ~ span){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  .navbarTogglerActive > span:nth-child(1){
    top: 7px;
    --tw-rotate: 45deg;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  
  .navbarTogglerActive > span:nth-child(2){
    opacity: 0;
  }
  
  .navbarTogglerActive > span:nth-child(3){
    top: -8px;
    --tw-rotate: 135deg;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  
  .text-body-color{
    --tw-text-opacity: 1;
    color: rgb(99 115 129 / var(--tw-text-opacity));
  }
  
  .text-body-secondary{
    --tw-text-opacity: 1;
    color: rgb(136 153 168 / var(--tw-text-opacity));
  }

  
.common-carousel .swiper-button-next:after,
.common-carousel .swiper-button-prev:after{
  display: none;
}

.common-carousel .swiper-button-next,
.common-carousel .swiper-button-prev{
  position: static !important;
  margin: 0px;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(17 25 40 / var(--tw-text-opacity));
  --tw-shadow: 0px 8px 15px 0px rgba(72, 72, 138, 0.08);
  --tw-shadow-colored: 0px 8px 15px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.common-carousel .swiper-button-next:hover,
.common-carousel .swiper-button-prev:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(55 88 249 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

:is(.dark .common-carousel .swiper-button-next),:is(.dark 
.common-carousel .swiper-button-prev){
  --tw-bg-opacity: 1;
  background-color: rgb(17 25 40 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

        /* 现代化滚动条设计 */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, var(--qianqian-primary), var(--qianqian-secondary));
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #357ABD, #5A67D8);
        }
        
        /* 现代化卡片阴影系统 - 参考dewx.top */
        .shadow-modern {
          box-shadow: 0 1px 35px -8px rgba(0, 0, 0, 0.8);
        }
        .shadow-modern-lg {
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }
        .shadow-modern-xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* 文本截断样式 */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        
        /* 现代化渐变背景 */
        .bg-gradient-modern {
          background: var(--dewx-gradient-1);
        }
        .bg-gradient-modern-blue {
          background: var(--dewx-gradient-2);
        }
        .bg-gradient-modern-purple {
          background: var(--dewx-gradient-3);
        }
        .bg-gradient-magazine {
          background: var(--dewx-gradient-bg);
        }
        
        /* 玻璃态效果 */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-effect-dark {
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* 现代化动画 */
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* 3D悬浮效果 */
        .hover-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }
        .hover-3d:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02);
        }
        
        /* 现代化发光效果 */
        .glow-effect {
          transition: box-shadow 0.3s ease;
        }
        .glow-effect:hover {
          box-shadow: 0 0 20px rgba(254, 150, 0, 0.3), 0 0 40px rgba(254, 150, 0, 0.1);
        }
        
        /* 现代化边框动画 */
        .border-animate {
          position: relative;
          overflow: hidden;
        }
        .border-animate::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(254, 150, 0, 0.4), transparent);
          transition: left 0.5s ease;
        }
        .border-animate:hover::before {
          left: 100%;
        }
        
        /* 现代化渐变文字 */
        .gradient-text {
          background: linear-gradient(135deg, var(--dewx-primary), var(--dewx-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* 现代化脉冲动画 */
        .pulse-animation {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(254, 150, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(254, 150, 0, 0.5);
          }
        }
        
        /* 加载动画 */
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        .shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
        }
        
        /* 千浅特效样式增强 */
        .fx-fade-rise {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fx-fade-rise.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* 现代化按钮样式 */
        .btn-modern {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .btn-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .btn-modern:hover::before {
          left: 100%;
        }
        
        /* 响应式字体 */
        @media (max-width: 640px) {
          .text-responsive-xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
        }
        @media (min-width: 641px) {
          .text-responsive-xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
        }
        @media (min-width: 1024px) {
          .text-responsive-xl {
            font-size: 3rem;
            line-height: 1;
          }
        }
  `}</style>
}

export { Style }
// Cache invalidation trigger - 2025年 9月11日 星期四 12时00分33秒 CST
