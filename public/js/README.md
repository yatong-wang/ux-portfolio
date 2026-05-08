# JavaScript structure

The portfolio's JS is split between two entry points:

- **`main.js`** — ES module, loaded with `<script type="module">`. Dispatches to a page module based on `<html data-page="…">` and wires up the banner-scroll behavior. The nav, banner, and footer are inlined into each HTML page (no JS rendering), so `main.js` no longer fetches `site.json`.
- **`scripts.js`** — classic script. Hosts page-agnostic behavior (mobile menu, hero animations, scroll-to-top, copy-email tooltip, disabled-link guard). Some handlers re-run on `portfolioContentReady`, the event `main.js` fires after page-specific content renders.

`scripts.js` runs synchronously while parsing; the module entry is deferred. So `window.initHeroAnimations` is defined before `main.js` calls it, and the static nav/banner/footer markup is in the DOM when `scripts.js`'s mobile-menu / disabled-link handlers attach.

## Folder layout

```
js/
  main.js          Entry point. Orchestrates load phases, dispatches by data-page.
  scripts.js       Page-agnostic behavior (mobile menu, hero anims, scroll-to-top, ...).
  case-study.js    Behavior specific to case-study pages (loaded only there).
  lib/
    content.js     Shared helpers: fetchJSON (with cache), escapeHTML, createHTML, applyRevealFallback.
  pages/           Page-specific content loaders. One file per page. Render markup only.
    home.js        Hero, marquee, projects, testimonials.
    about.js       Portrait, paragraphs, links, timeline, strengths, toolkits, interests.
  behavior/        Self-contained behavior modules. Each no-ops when its DOM hooks are absent.
    banner-scroll.js   Banner scroll-linked drawer + nav top sync.
    tagline.js         About-page typewriter animation; reveals [data-below-bio] when done.
    strength-cards.js  About-page strength accordion expand/collapse.
    interests-motion.js About-page interests gallery pause / scroll / reduced-motion toggle.
```

## Render → behave separation

Static structure (nav, banner, footer) is hand-inlined into each HTML page. Dynamic content (`pages/*`) injects the page-specific DOM. Behavior (`behavior/*`) wires up event handlers and animations after the markup it targets is in the DOM.

Behavior modules are safe to call unconditionally — they bail out when their hook elements (e.g. `[data-interests-scroller]`, `.strength-card`) aren't on the page.

## How a page boots

1. HTML parse: nav, banner, and footer are already in the DOM.
2. `scripts.js` (classic, sync) runs. Its DOMContentLoaded handlers attach the mobile-menu listeners, the disabled-link guard, etc.
3. `main.js` (deferred module) reads `document.documentElement.dataset.page` and dynamically imports `pages/<page>.js` if one matches (`home`, `about`).
4. **Phase 1:** the page module's `loadHero()` (if exported) runs, populating hero markup from JSON.
5. **Phase 2:** `bannerScroll.init()` wires the scroll listener for the banner drawer.
6. **Phase 3:** `requestAnimationFrame` → `initHeroAnimations` so the nav has settled before any hero animation runs.
7. **Phase 4:** the page module's `init()` renders the rest of the page-specific content, then calls `init()` on each behavior module it depends on.
8. `applyRevealFallback` for browsers without `animation-timeline: view()`, then dispatch `portfolioContentReady`.

## Adding a new page

1. Add `data-page="<name>"` to the page's `<html>` tag. Inline the same nav, banner, and footer markup as the other pages (copy from any existing page).
2. Create `js/pages/<name>.js` exporting `init()` (and optionally `loadHero()` if the page has a hero that should render in phase 1).
3. Register it in `PAGE_LOADERS` inside `main.js`.

If the page only needs the static chrome (case studies, 404), no page module is required — omit it from `PAGE_LOADERS` and the inlined nav/banner/footer still render.

## Conventions

- **Render → behave.** `pages/*` only injects content. Behavior lives under `behavior/*` (page-scoped, ES modules, called from page modules) or `scripts.js` (page-agnostic, listens for `portfolioContentReady`).
- **All HTML insertion goes through `createHTML`** from `lib/content.js`.
- **All user-supplied strings** (JSON content) go through `escapeHTML` before interpolation. Note: `escapeHTML` is for HTML text — it does not sanitize `javascript:` URLs in `href` attributes.
- **JSON is cached** in-memory by path inside `fetchJSON`, so multiple loaders requesting the same path only trigger one HTTP request per page load.

## Updating the banner message or footer status

Both strings are inlined into all four HTML pages. To change one, edit the four pages directly. `data/site.json` is kept as a source-of-truth reference and lists what the canonical values should be — but nothing fetches it at runtime.
