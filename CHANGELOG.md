# Changelog
All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- 2 additional case study pages
- Fun page with side projects showcase
- Curated resource page

---
## [0.6.0] - 2026-05-07
### Changed — internal architecture (no user-visible changes)
- Split monolithic `js/content-loader.js` into `lib/`, `pages/`, and `behavior/` modules; entry point is now `js/main.js` (ES module), dispatched per-page via `<html data-page>`.
- Split `styles.css` (1,783 lines) into `styles/base.css`, `styles/home.css`, `styles/about.css`, and moved `case-study.css` into `styles/`. Each page loads only what it needs.
- Hand-inlined nav, banner, and footer into every HTML page. They now render at parse time, work without JS, and no longer cause the load-time reflow. `data/site.json` is no longer fetched at runtime.
- Promoted the repeated dark-card pattern to a `.surface-card` class.
- Extended `prefers-reduced-motion` to disable wave, nudge, pulse-soft, float-soft, fade-soft, and marquee animations.

### Removed
- `js/content-loader.js`, `js/site/banner.js`, `js/site/nav.js`, `js/site/footer.js` (functionality replaced by static HTML or moved to `js/behavior/`).
- `public/styles.css` (split into per-page sheets).


## [0.5.0] - 2026-05-06
### Added
- NN/G UXC badge on `about.html` page
- In-page section rail (dot rail / mobile FAB) on `case-enterprise.html` page

### Changed
- Enabled horizontal scrolling for Interests image carousel on `about.html` when on pause
- Micro-animation for scroll-to-top icon transitions and global nav menus
- Footer badge swapped from `built-with-cursor` to `vibe-coded-in-cursor-with-claude-code`
- Minor padding and card style tweaks across pages


## [0.4.0] - 2026-05-04
### Added
- Enterprise App Integration case study page: `case-enterprise.html`

### Changed
- Updated thumbnails for all 3 case studies on `index.html`
- Reduced max-width of content across the site to make it easy to scan and read


## [0.3.1] - 2026-04-22
### Added
- Timeline and toolkit section on About page
- Loading animation for bio section on About page

### Changed
- Include repo link in global banner
- Minor copy, spacing and motion tweaks (Claude Code test)


## [0.3.0] - 2026-03-26
### Added
- `about` page and associated assets
- `LICENSE.md`
- Tight variants for button styling

### Changed
- `README.md` (and made the repo public)


## [0.2.1] - 2026-02-13
### Added
- Global top banner indicating WIP status

### Fixed
- Minor sizing and spacing refinements
- `404.html` page layout and mobile responsiveness


## [0.2.0] - 2026-02-09
### Added
- Custom `404.html` page
- Redirect handling for broken navigation links


## [0.1.0] - 2026-02-08
Initial public preview deployed to Netlify.

### Added
- Static site architecture using plain HTML + Tailwind CSS
- Custom `styles.css` layer for design overrides and visual refinement
- JSON-driven content structure (`/data/*.json`)
- Dynamic content loading via `content-loader.js`
- Custom scripts for niche functions (eg. click to copy email)
- Custom cursor assets, site logos  and project cover images
- Homepage (complete) with hero, project preview section, testimonial section and navigation
- Basic repository structure and Netlify deployment pipeline

### Known Issues
- About page and case study pages are incomplete (WIP)
- Some navigation links are not working because the pages are not built yet
- Some buttons are intentionally disabled
