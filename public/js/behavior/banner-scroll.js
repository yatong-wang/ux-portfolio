/**
 * Banner scroll-linked drawer.
 *
 * Syncs the fixed banner shell, the in-flow spacer, and the nav's top offset
 * to scroll position so the banner retracts as the user scrolls down.
 *
 * No-op when #top-banner is absent (case-study / 404 / banner-disabled pages).
 */

let initialized = false;

function syncFromScroll() {
    const banner = document.getElementById('top-banner');
    const spacer = document.getElementById('banner-spacer');
    const shell = document.getElementById('top-banner-shell');
    const navWrapper = document.querySelector('.nav-container')?.parentElement;

    if (!banner || !spacer || !shell) {
        if (navWrapper) navWrapper.style.top = '0';
        return;
    }

    const H = banner.offsetHeight;
    if (H <= 0) return;

    const y = window.scrollY || document.documentElement.scrollTop;
    const t = Math.min(Math.max(y, 0), H);
    const visible = H - t;

    spacer.style.height = `${visible}px`;
    shell.style.height = `${visible}px`;
    banner.style.transform = `translateY(-${t}px)`;
    if (navWrapper) navWrapper.style.top = `${visible}px`;
}

export function updateNavPosition() {
    syncFromScroll();
}

export function init() {
    if (initialized) return;
    const banner = document.getElementById('top-banner');
    if (!banner) return;
    initialized = true;

    const onScrollOrResize = () => syncFromScroll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => syncFromScroll());
        ro.observe(banner);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => syncFromScroll());
    });
}
