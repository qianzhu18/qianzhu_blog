import { useRouter } from 'next/router';
import { useEffect } from 'react';
/**
 * 双层沉浸式自定义光标：中心点+延迟外环
 */
const CursorDot = () => {
    const router = useRouter();
    useEffect(() => {
        // 仅桌面端启用
        const isDesktop = matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!isDesktop) return;

        // 若已存在则不重复创建
        let dot = document.querySelector('.cursor-dot');
        let ring = document.querySelector('.cursor-ring');
        if (!dot) {
            dot = document.createElement('div');
            dot.classList.add('cursor-dot');
            document.body.appendChild(dot);
        }
        if (!ring) {
            ring = document.createElement('div');
            ring.classList.add('cursor-ring');
            document.body.appendChild(ring);
        }

        // 初始状态
        let mouse = { x: -100, y: -100 };
        let dotPos = { x: mouse.x, y: mouse.y };
        let ringPos = { x: mouse.x, y: mouse.y };

        // 跟随
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // 可交互元素放大态
        const handleMouseEnter = () => {
            ring.classList.add('cursor-active');
        };
        const handleMouseLeave = () => {
            ring.classList.remove('cursor-active');
        };

        let clickableElements = [];
        const bindHoverTargets = () => {
            clickableElements = Array.from(document.querySelectorAll(
                'a, button, [role="button"], [onclick], [cursor="pointer"], [class*="cursor-pointer"], input, select, textarea'
            ));
            clickableElements.forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };
        // 首次与路由变化后延迟绑定，避免SSR水合时缺少节点
        const bindTimer = setTimeout(bindHoverTargets, 250);

        // 动画循环
        const update = () => {
            const dotDamping = 0.35; // 更快
            const ringDamping = 0.15; // 更慢，产生延迟跟随
            dotPos.x += (mouse.x - dotPos.x) * dotDamping;
            dotPos.y += (mouse.y - dotPos.y) * dotDamping;
            ringPos.x += (mouse.x - ringPos.x) * ringDamping;
            ringPos.y += (mouse.y - ringPos.y) * ringDamping;

            dot.style.left = `${dotPos.x}px`;
            dot.style.top = `${dotPos.y}px`;
            ring.style.left = `${ringPos.x}px`;
            ring.style.top = `${ringPos.y}px`;

            requestAnimationFrame(update);
        };
        update();

        // 清理
        return () => {
            clearTimeout(bindTimer);
            document.removeEventListener('mousemove', handleMouseMove);
            clickableElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            // 不主动移除DOM，避免多实例抢占；仅移除事件监听
        };
    }, [router]);

    return (
        <style jsx global>{`
            .cursor-dot {
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--color-text);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 9999;
                mix-blend-mode: normal;
            }
            .cursor-ring {
                position: fixed;
                width: 28px;
                height: 28px;
                border: 1px solid rgba(0,0,0,0.35);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 9998;
                transition: width 200ms ease, height 200ms ease, border-color 200ms ease;
                backdrop-filter: blur(4px);
            }
            .dark .cursor-ring { border-color: rgba(255,255,255,0.35); }
            .cursor-active {
                width: 44px;
                height: 44px;
                border-color: var(--color-primary);
            }
        `}</style>
    );
};

export default CursorDot;