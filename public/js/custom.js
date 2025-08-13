// 这里编写自定义js脚本；将被静态引入到页面中

// 平滑滚动：拦截站内锚点链接，使用 scrollIntoView
(function () {
  if (typeof window === 'undefined') return;
  const isDesktop = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 在路由切换后，Next 会重新渲染内容；延迟绑定可保证节点已存在
  function bindSmoothAnchors() {
    const anchors = Array.from(document.querySelectorAll('a[href^="#"], a[href*="#"]'));
    anchors.forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;
        try {
          const url = new URL(href, window.location.href);
          // 仅处理同页 hash
          if (url.pathname === window.location.pathname && url.hash) {
            const id = decodeURIComponent(url.hash.replace('#', ''));
            const el = document.getElementById(id);
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // 更新地址栏 hash（不跳转）
              history.replaceState(null, '', `#${id}`);
            }
          }
        } catch (_) {}
      }, { passive: true });
    });
  }

  // 首次与延迟再次绑定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(bindSmoothAnchors, 200));
  } else {
    setTimeout(bindSmoothAnchors, 200);
  }
})();
