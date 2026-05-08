/**
 * Interests gallery motion toggle.
 *
 * Drives the pause/play button on the about-page interests strip:
 *   - Marquee animation when motion is active.
 *   - On pause, snapshots the current translateX and converts the strip into
 *     a horizontally scrollable container so the user can drag through it.
 *   - On hover, freezes the animation by reading the live transform (avoids
 *     the animation-play-state jump on pause).
 *   - Respects prefers-reduced-motion (default paused; opt-in via .interests-motion-opt-in).
 *
 * a11y labels come from data/about.json's interestsAccessibility, with sensible defaults.
 * No-op when the toggle button or scroller is absent.
 */

import { fetchJSON } from '../lib/content.js';

const ANIM_DURATION = 40;

function setUp(a11y) {
    const scroller = document.querySelector('[data-interests-scroller]');
    const btn = document.querySelector('[data-interests-motion-toggle]');
    const labelEl = document.querySelector('[data-interests-motion-label]');
    const iconEl = document.querySelector('[data-interests-motion-icon]');
    const region = document.querySelector('[data-interests-region]');
    if (!scroller || !btn || !labelEl) return;

    const strip = scroller.parentElement;
    let inScrollMode = false;
    let isHoverFrozen = false;
    const loopCopy = () => scroller.querySelector('[data-interests-loop-copy]');
    const edgeOverlays = () => Array.from(strip.children).filter(el => el !== scroller);

    const pauseLabel = a11y?.pauseLabel || 'Pause scrolling gallery';
    const playLabel = a11y?.playLabel || 'Play scrolling gallery';
    const regionLabel = a11y?.regionLabel || 'Photos of interests';
    if (region) region.setAttribute('aria-label', regionLabel);

    const prmMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function isMotionActive() {
        if (prmMq.matches) return scroller.classList.contains('interests-motion-opt-in');
        return !scroller.classList.contains('is-paused');
    }

    function updateUI() {
        const active = isMotionActive();
        btn.setAttribute('aria-pressed', String(active));
        labelEl.textContent = active ? pauseLabel : playLabel;
        if (iconEl) iconEl.textContent = active ? 'pause' : 'play_arrow';
    }

    function readTranslateX() {
        const matrix = window.getComputedStyle(scroller).transform;
        if (!matrix || matrix === 'none') return 0;
        try { return new DOMMatrix(matrix).m41; } catch (_) { return 0; }
    }

    function resumeAnimationFrom(offsetX) {
        const halfWidth = scroller.scrollWidth / 2;
        const normalized = halfWidth > 0 ? (Math.abs(offsetX) % halfWidth) : 0;
        const delay = halfWidth > 0 ? -(normalized / halfWidth) * ANIM_DURATION : 0;
        scroller.style.animation = '';
        scroller.style.animationDelay = `${delay}s`;
        scroller.style.transform = '';
        void scroller.offsetWidth;
    }

    function freezeForHover() {
        if (inScrollMode || isHoverFrozen) return;
        const offsetX = readTranslateX();
        scroller.style.animation = 'none';
        scroller.style.transform = `translateX(${offsetX}px)`;
        isHoverFrozen = true;
    }

    function unfreezeForHover() {
        if (!isHoverFrozen) return;
        const offsetX = readTranslateX();
        resumeAnimationFrom(offsetX);
        isHoverFrozen = false;
    }

    function enterScrollMode() {
        isHoverFrozen = false;
        const offsetX = Math.abs(readTranslateX());
        scroller.style.animation = 'none';
        scroller.style.position = 'relative';
        scroller.style.transform = 'none';
        scroller.classList.add('interests-scroll-mode');
        const copy = loopCopy();
        if (copy) copy.hidden = true;
        edgeOverlays().forEach(el => { el.style.display = 'none'; });
        strip.style.overflowX = 'auto';
        strip.style.overflowY = 'hidden';
        strip.style.cursor = 'grab';
        strip.scrollLeft = Math.min(offsetX, scroller.scrollWidth);
        inScrollMode = true;
    }

    function exitScrollMode() {
        const scrollLeft = strip.scrollLeft;
        const copy = loopCopy();
        if (copy) copy.hidden = false;
        edgeOverlays().forEach(el => { el.style.display = ''; });

        strip.style.overflowX = '';
        strip.style.overflowY = '';
        strip.style.cursor = '';
        strip.scrollLeft = 0;

        scroller.style.position = '';
        scroller.classList.remove('interests-scroll-mode');
        resumeAnimationFrom(scrollLeft);
        inScrollMode = false;
    }

    function syncToSystemPreference() {
        if (inScrollMode) exitScrollMode();
        isHoverFrozen = false;
        scroller.classList.remove('interests-motion-opt-in');
        scroller.classList.remove('is-paused');
        updateUI();
    }

    btn.addEventListener('click', () => {
        let willBePaused;
        if (prmMq.matches) {
            scroller.classList.toggle('interests-motion-opt-in');
            willBePaused = !scroller.classList.contains('interests-motion-opt-in');
        } else {
            scroller.classList.toggle('is-paused');
            willBePaused = scroller.classList.contains('is-paused');
        }
        if (willBePaused) enterScrollMode();
        else exitScrollMode();
        updateUI();
    });

    strip.addEventListener('mouseenter', freezeForHover);
    strip.addEventListener('mouseleave', () => {
        if (inScrollMode) strip.style.cursor = 'grab';
        unfreezeForHover();
    });
    strip.addEventListener('mousedown', () => { if (inScrollMode) strip.style.cursor = 'grabbing'; });
    strip.addEventListener('mouseup', () => { if (inScrollMode) strip.style.cursor = 'grab'; });

    if (typeof prmMq.addEventListener === 'function') {
        prmMq.addEventListener('change', syncToSystemPreference);
    } else if (typeof prmMq.addListener === 'function') {
        prmMq.addListener(syncToSystemPreference);
    }

    syncToSystemPreference();
}

export async function init() {
    if (!document.querySelector('[data-interests-scroller]')) return;
    const data = await fetchJSON('data/about.json');
    setUp(data?.interestsAccessibility);
}
