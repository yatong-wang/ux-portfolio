import { applyRevealFallback } from './lib/content.js';
import * as bannerScroll from './behavior/banner-scroll.js';

const PAGE_LOADERS = {
    home: () => import('./pages/home.js'),
    about: () => import('./pages/about.js'),
};

async function init() {
    try {
        const page = document.documentElement.dataset.page;
        const pageLoader = PAGE_LOADERS[page];
        const pageModule = pageLoader ? await pageLoader() : null;

        // Phase 1: page hero (if any) — needs to be in the DOM before hero animations run.
        if (pageModule?.loadHero) await pageModule.loadHero();

        // Phase 2: wire up the banner scroll-linked drawer (banner is statically in the DOM).
        bannerScroll.init();

        // Phase 3: hero fade-in before any page-specific animation kicks off.
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                if (typeof window.initHeroAnimations === 'function') window.initHeroAnimations();
                resolve();
            });
        });

        // Phase 4: page-specific content + behavior wiring.
        if (pageModule?.init) await pageModule.init();

        applyRevealFallback();
        window.dispatchEvent(new CustomEvent('portfolioContentReady'));
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
