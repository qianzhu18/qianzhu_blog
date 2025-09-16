/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 */
const Style = () => {
  return (
    <style jsx global>{`
      :root {
        --magzine-bg-primary: #0a1224;
        --magzine-bg-secondary: #111a30;
        --magzine-accent: #3daee9;
        --magzine-accent-soft: rgba(61, 174, 233, 0.25);
        --magzine-accent-warm: #fe9600;
        --magzine-border: rgba(88, 122, 190, 0.25);
        --magzine-border-strong: rgba(93, 130, 201, 0.45);
        color-scheme: dark;
      }

      body {
        background: radial-gradient(circle at 20% -10%, rgba(61, 174, 233, 0.18), transparent 45%),
          radial-gradient(circle at 80% 0%, rgba(254, 150, 0, 0.12), transparent 40%),
          linear-gradient(160deg, #05070f 0%, #0b1630 45%, #030712 100%);
        color: #cbd5f5;
      }

      .theme-magzine-app {
        position: relative;
        overflow-x: hidden;
        background: linear-gradient(180deg, rgba(8, 16, 36, 0.9) 0%, rgba(9, 17, 34, 0.95) 60%, rgba(6, 12, 22, 0.98) 100%);
      }

      .theme-magzine-app::before,
      .theme-magzine-app::after {
        content: '';
        position: fixed;
        width: 32vw;
        height: 32vw;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(61, 174, 233, 0.28), transparent 68%);
        top: -18vw;
        right: -12vw;
        filter: blur(40px);
        opacity: 0.75;
        pointer-events: none;
        z-index: 1;
      }

      .theme-magzine-app::after {
        background: radial-gradient(circle, rgba(254, 150, 0, 0.22), transparent 70%);
        top: auto;
        bottom: -22vw;
        left: -14vw;
      }

      /* 滚动条 */
      html::-webkit-scrollbar {
        width: 12px;
        background: transparent;
      }

      html::-webkit-scrollbar-track {
        background: rgba(10, 18, 36, 0.7);
      }

      html::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(61, 174, 233, 0.75), rgba(254, 150, 0, 0.75));
        border-radius: 999px;
        border: 2px solid rgba(11, 22, 48, 0.85);
      }

      /* 顶部导航 */
      .magzine-nav {
        background: rgba(9, 15, 28, 0.92);
        backdrop-filter: blur(18px) saturate(160%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 18px 48px rgba(3, 10, 28, 0.45);
      }

      .magzine-nav-inner {
        color: #e5edff;
      }

      .magzine-menu {
        gap: 1.25rem;
      }

      .magzine-menu-item-wrapper {
        position: relative;
      }

      .magzine-menu-item {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 1.1rem;
        border-radius: 999px;
        color: #c8d4ff;
        border: 1px solid transparent;
        background: rgba(22, 34, 60, 0.35);
        transition: all 0.3s ease;
      }

      .magzine-menu-item:hover {
        color: #fdfcff;
        border-color: rgba(99, 157, 255, 0.35);
        box-shadow: 0 6px 20px rgba(8, 25, 55, 0.35);
      }

      .magzine-menu-item--active {
        color: #ffffff;
        border-color: rgba(99, 157, 255, 0.65);
        background: linear-gradient(120deg, rgba(61, 174, 233, 0.25), rgba(138, 92, 246, 0.22));
      }

      .magzine-submenu {
        min-width: 12rem;
        background: rgba(6, 14, 32, 0.96);
        border: 1px solid rgba(99, 157, 255, 0.25);
        box-shadow: 0 20px 40px rgba(3, 10, 24, 0.55);
        backdrop-filter: blur(20px) saturate(180%);
      }

      .magzine-submenu-item {
        color: #cfd8ff;
        border-radius: 0.75rem;
        transition: all 0.25s ease;
        padding: 0.65rem 1.2rem;
      }

      .magzine-submenu-item:hover {
        background: rgba(61, 174, 233, 0.12);
        color: #ffffff;
      }

      .magzine-icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(19, 28, 48, 0.65);
        border: 1px solid rgba(73, 106, 174, 0.35);
        color: #d3dcff;
        transition: all 0.3s ease;
      }

      .magzine-icon-button:hover {
        transform: translateY(-2px) scale(1.05);
        color: #ffffff;
        box-shadow: 0 10px 24px rgba(10, 24, 56, 0.45);
        border-color: rgba(130, 202, 255, 0.55);
      }

      .magzine-logo {
        gap: 0.65rem;
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        background: rgba(18, 30, 50, 0.4);
        color: #f1f5ff;
        border: 1px solid rgba(83, 120, 188, 0.35);
        transition: all 0.3s ease;
      }

      .magzine-logo:hover {
        background: rgba(61, 174, 233, 0.22);
        color: #ffffff;
        border-color: rgba(61, 174, 233, 0.65);
      }

      .magzine-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.04);
        z-index: 50;
        transform-origin: left;
      }

      .magzine-progress-bar {
        display: block;
        width: 100%;
        height: 100%;
        transform-origin: left;
        transform: scaleX(0);
        background: linear-gradient(90deg, rgba(61, 174, 233, 0.9) 0%, rgba(254, 150, 0, 0.95) 65%, rgba(255, 255, 255, 0.95) 100%);
      }

      .magzine-card,
      .magzine-simple-card,
      .magzine-side-card {
        position: relative;
        background: rgba(13, 23, 45, 0.7);
        border: 1px solid rgba(103, 146, 222, 0.25);
        backdrop-filter: blur(18px) saturate(160%);
        border-radius: 28px;
        box-shadow: 0 20px 42px rgba(5, 10, 24, 0.5);
        transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
      }

      .magzine-card:hover,
      .magzine-side-card:hover {
        transform: translateY(-6px);
        border-color: rgba(128, 189, 255, 0.55);
        box-shadow: 0 34px 60px rgba(5, 15, 38, 0.65);
      }

      .magzine-simple-card {
        border-radius: 18px;
        border-style: dashed;
        background: rgba(14, 22, 40, 0.65);
        box-shadow: none;
      }

      .magzine-simple-card:hover {
        border-color: rgba(91, 138, 212, 0.65);
        box-shadow: 0 18px 42px rgba(8, 18, 38, 0.45);
      }

      .magzine-highlight-card {
        background: linear-gradient(135deg, rgba(61, 174, 233, 0.42), rgba(138, 92, 246, 0.24));
        border: 1px solid rgba(151, 202, 255, 0.5);
        box-shadow: 0 18px 40px rgba(33, 73, 138, 0.55);
      }

      .magzine-banner {
        text-align: center;
      }

      .magzine-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.65rem 1.8rem;
        border-radius: 999px;
        font-weight: 600;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .magzine-button--primary {
        color: #061325;
        background: linear-gradient(120deg, rgba(123, 233, 134, 0.95), rgba(62, 186, 155, 0.9));
        box-shadow: 0 16px 30px rgba(60, 186, 140, 0.35);
      }

      .magzine-button--primary:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 20px 40px rgba(58, 192, 148, 0.55);
      }

      .magzine-section {
        position: relative;
        background: linear-gradient(135deg, rgba(12, 24, 52, 0.88), rgba(8, 16, 32, 0.92));
        border-top: 1px solid rgba(73, 110, 198, 0.25);
        border-bottom: 1px solid rgba(30, 55, 110, 0.35);
        overflow: hidden;
      }

      .magzine-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 15% 20%, rgba(61, 174, 233, 0.16), transparent 50%),
          radial-gradient(circle at 78% 15%, rgba(138, 92, 246, 0.14), transparent 45%);
        opacity: 0.7;
        pointer-events: none;
      }

      .magzine-section > * {
        position: relative;
        z-index: 2;
      }

      .magzine-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.35rem 0.9rem;
        border-radius: 20px;
        background: rgba(39, 63, 112, 0.5);
        border: 1px solid rgba(101, 143, 206, 0.35);
        color: #d8e2ff;
        font-size: 0.8rem;
        transition: all 0.3s ease;
      }

      .magzine-pill:hover {
        transform: translateY(-2px);
        border-color: rgba(126, 189, 255, 0.58);
        color: #ffffff;
        background: rgba(61, 174, 233, 0.28);
        box-shadow: 0 12px 26px rgba(14, 28, 60, 0.45);
      }

      .magzine-pill--outline {
        background: transparent;
        border: 1px dashed rgba(101, 143, 206, 0.4);
      }

      .magzine-pill--active {
        color: #07172c;
        background: linear-gradient(135deg, #3daee9, #7be986);
        border-color: rgba(255, 255, 255, 0.55);
      }

      .magzine-image-frame {
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(110, 156, 228, 0.35);
        box-shadow: 0 18px 38px rgba(8, 18, 34, 0.55);
      }

      .magzine-image-frame img,
      .magzine-image-frame picture,
      .magzine-image-frame video {
        transform-origin: center;
      }

      .magzine-hero {
        position: relative;
      }

      .magzine-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 20%, rgba(61, 174, 233, 0.18), transparent 55%);
        filter: blur(12px);
        pointer-events: none;
        z-index: -1;
      }

      .magzine-hero-list {
        border-radius: 26px;
        border: 1px solid rgba(88, 128, 214, 0.25);
        background: rgba(9, 18, 38, 0.65);
        backdrop-filter: blur(12px);
      }

      .magzine-divider {
        border-color: rgba(108, 140, 210, 0.35);
      }

      .magzine-footer {
        background: linear-gradient(180deg, rgba(4, 9, 20, 0.95) 0%, rgba(6, 12, 28, 0.95) 70%, rgba(5, 10, 26, 0.98) 100%);
        border-top: 1px solid rgba(98, 140, 216, 0.35);
      }

      .magzine-mobile-nav {
        background: rgba(8, 16, 36, 0.85);
        border: 1px solid rgba(93, 138, 209, 0.28);
        border-radius: 28px;
        margin: 1rem;
        padding: 1rem 0.25rem;
        box-shadow: 0 20px 44px rgba(3, 10, 24, 0.5);
      }

      .magzine-reveal {
        opacity: 0;
        transform: translateY(36px) scale(0.98);
      }

      .magzine-reveal.is-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }

      .magzine-reveal.is-visible:nth-of-type(odd) {
        transition-delay: 0.05s;
      }

      .magzine-reveal.is-visible:nth-of-type(even) {
        transition-delay: 0.1s;
      }

      .magzine-reveal:hover {
        transition-delay: 0s;
      }

      @media (max-width: 768px) {
        .magzine-card,
        .magzine-side-card {
          border-radius: 22px;
        }

        .magzine-menu {
          gap: 0.65rem;
        }

        .magzine-menu-item {
          padding: 0.4rem 0.9rem;
        }

        .magzine-progress-container {
          height: 2px;
        }
      }
    `}</style>
  )
}

export { Style }
