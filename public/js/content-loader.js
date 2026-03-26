/**
 * Content Loader
 * 
 * Dynamically loads content from JSON files and injects it into the HTML.
 * This allows for easy content management without editing HTML directly.
 */

(function() {
    'use strict';

    // Cache for loaded JSON data
    const contentCache = {};

    /**
     * Fetches JSON data from a file
     * @param {string} path - Path to JSON file
     * @returns {Promise<Object>} - Parsed JSON data
     */
    async function fetchJSON(path) {
        if (contentCache[path]) {
            return contentCache[path];
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
            }
            const data = await response.json();
            contentCache[path] = data;
            return data;
        } catch (error) {
            console.error(`Error loading ${path}:`, error);
            return null;
        }
    }

    /**
     * Escapes HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Renders HTML from a string (for trusted content)
     * @param {string} html - HTML string
     * @returns {DocumentFragment} - Document fragment
     */
    function createHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content;
    }

    /**
     * Loads and renders hero section
     */
    async function loadHero() {
        const data = await fetchJSON('data/hero.json');
        if (!data) return;

        const heroSection = document.querySelector('section[data-section="hero"]');
        if (!heroSection) return;

        // Update background image
        const bgDiv = heroSection.querySelector('[data-hero-bg]');
        if (bgDiv && data.backgroundImage) {
            bgDiv.style.backgroundImage = `url("${data.backgroundImage.url}")`;
            bgDiv.setAttribute('data-alt', data.backgroundImage.alt);
        }

        // Update description
        const descEl = heroSection.querySelector('[data-hero-description]');
        if (descEl) {
            descEl.innerHTML = data.description;
        }
    }

    /**
     * Loads and renders marquee section
     */
    async function loadMarquee() {
        const data = await fetchJSON('data/marquee.json');
        if (!data) return;

        const marqueeContainer = document.querySelector('[data-marquee-container]');
        if (!marqueeContainer) return;

        const itemsContainer = marqueeContainer.querySelector('[data-marquee-items]');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';
        
        // Helper function to create marquee items
        function createMarqueeItems() {
            const fragment = document.createDocumentFragment();
            data.items.forEach((item, index) => {
                const isTransparent = item.style === 'transparent';
                const span = document.createElement('span');
                span.className = isTransparent 
                    ? 'text-2xl md:text-3xl font-mono font-black tracking-wide text-transparent stroke-text stroke-primary opacity-80 uppercase'
                    : 'text-2xl md:text-3xl font-mono font-black tracking-wide text-white uppercase';
                span.textContent = item.text;
                fragment.appendChild(span);

                // Add separator after each item (including last, for seamless looping)
                const separator = document.createElement('span');
                separator.className = 'material-symbols-outlined text-primary text-3xl opacity-50';
                separator.textContent = 'y_circle';
                fragment.appendChild(separator);
            });
            return fragment;
        }

        // Create two identical sets for seamless infinite scrolling
        // The animation moves -50%, so duplicating ensures smooth loop
        itemsContainer.appendChild(createMarqueeItems());
        itemsContainer.appendChild(createMarqueeItems());
    }

    /**
     * Loads and renders projects section
     */
    async function loadProjects() {
        const data = await fetchJSON('data/projects.json');
        if (!data) return;

        const projectsSection = document.querySelector('section[data-section="projects"]');
        if (!projectsSection) return;

        // Render projects
        const projectsContainer = projectsSection.querySelector('[data-projects-container]');
        if (!projectsContainer) return;

        projectsContainer.innerHTML = '';

        data.projects.forEach(project => {
            const isPlaceholder = !project.link || project.link === '#';
            const linkClass = isPlaceholder ? 'btn-secondary btn-disabled' : 'btn-secondary';
            const linkAttrs = isPlaceholder
                ? 'href="#" aria-disabled="true" title="Coming Soon"'
                : `href="${escapeHTML(project.link)}"`;
            const projectHTML = `
                <div class="group flex flex-col md:flex-row bg-[#1c2620] rounded-[2rem] overflow-hidden border border-[#29382f] hover:border-primary/50 transition-all duration-300 reveal-on-scroll">
                    <div class="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden">
                        <div class="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700" 
                             data-alt="${escapeHTML(project.image.alt)}" 
                             style="background-image: url('${escapeHTML(project.image.url)}');"></div>
                        <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                        <div class="absolute top-6 right-6 z-20">
                            <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                                ${escapeHTML(project.year)}
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div class="mb-6">
                            <span class="text-primary font-bold tracking-widest uppercase mb-3 block">${escapeHTML(project.category)}</span>
                            <h3 class="text-3xl md:text-4xl md:leading-tighter font-bold text-white mb-6">${escapeHTML(project.title)}</h3>
                            <p class="text-gray-400 text-xl md:text-2xl font-light mb-4">
                                ${escapeHTML(project.description)}
                            </p>
                        </div>
                        <div class="mt-auto md:mt-0">
                            <a ${linkAttrs} class="${linkClass}">
                                view case
                                <span class="material-symbols-outlined btn-secondary-icon">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            const fragment = createHTML(projectHTML);
            projectsContainer.appendChild(fragment);
        });
    }

    /**
     * Loads and renders testimonials section
     */
    async function loadTestimonials() {
        const data = await fetchJSON('data/testimonials.json');
        if (!data) return;

        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        carousel.innerHTML = '';

        data.testimonials.forEach(testimonial => {
            const linkedinLink = testimonial.author.linkedin 
                ? `<a class="inline-flex items-center text-sm font-medium border-b border-transparent gap-2 text-gray-300 hover:text-primary hover:border-primary transition-colors" href="${escapeHTML(testimonial.author.linkedin)}" target="_blank">
                    Read on LinkedIn
                    <span class="material-symbols-outlined text-sm">arrow_outward</span>
                </a>`
                : '';

            const noteHTML = testimonial.note 
                ? `<br><span class="text-sm text-gray-400">${escapeHTML(testimonial.note)}</span>`
                : '';

            const testimonialHTML = `
                <div class="testimonial-card flex-shrink-0 w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] bg-[#1c2620] rounded-[2.5rem] p-8 md:p-12 border border-[#29382f] relative overflow-hidden group snap-always snap-center">
                    <div class="relative z-10 flex flex-col h-full justify-between gap-8">
                        <p class="text-gray-300 text-lg md:text-xl font-light">
                            <span class="material-symbols-outlined text-2xl rotate-180">format_quote</span>
                            <span class="leading-relaxed">${testimonial.quote}</span>
                            <span class="material-symbols-outlined text-xl">format_quote</span>
                            ${noteHTML}
                        </p>
                        <div class="flex items-center gap-6">
                            <div>
                                <p class="font-bold text-white">${escapeHTML(testimonial.author.name)}</p>
                                <p class="text-sm text-gray-400 mt-1 ${testimonial.author.linkedin ? '' : 'whitespace-nowrap'}">${escapeHTML(testimonial.author.role)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>
            `;
            const fragment = createHTML(testimonialHTML);
            carousel.appendChild(fragment);
        });

        // Reinitialize carousel functionality after content is loaded
        // The carousel script should handle this, but we'll trigger a resize event
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Loads and renders about page content
     */
    async function loadAbout() {
        const data = await fetchJSON('data/about.json');
        if (!data) return;

        // Load portrait image
        const portraitImg = document.querySelector('[data-about-portrait]');
        if (portraitImg && data.portrait && data.portrait.image) {
            portraitImg.src = data.portrait.image.url;
            portraitImg.alt = data.portrait.image.alt;

            const portraitAltEl = document.querySelector('[data-about-portrait-alt]');
            if (portraitAltEl) {
                portraitAltEl.textContent = data.portrait.image.alt || '';
            }
        }

        // Load bio tagline
        const taglineEl = document.querySelector('[data-about-tagline]');
        if (taglineEl && data.bio && data.bio.tagline) {
            taglineEl.innerHTML = data.bio.tagline;
        }

        // Load bio paragraphs
        const paragraphsContainer = document.querySelector('[data-about-paragraphs]');
        if (paragraphsContainer && data.bio && data.bio.paragraphs) {
            paragraphsContainer.innerHTML = '';
            data.bio.paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                paragraphsContainer.appendChild(p);
            });
        }

        // Load bio links
        const linksContainer = document.querySelector('[data-about-links]');
        if (linksContainer && data.bio && data.bio.links) {
            linksContainer.innerHTML = '';
            
            if (data.bio.links.resume) {
                const resumeLink = document.createElement('a');
                resumeLink.className = 'btn-tertiary btn-tight inline-flex';
                resumeLink.href = escapeHTML(data.bio.links.resume.href);
                if (data.bio.links.resume.target) resumeLink.setAttribute('target', data.bio.links.resume.target);
                resumeLink.innerHTML = `${escapeHTML(data.bio.links.resume.text)}<span class="material-symbols-outlined btn-secondary-icon">arrow_outward</span>`;
                linksContainer.appendChild(resumeLink);
            }
            
            if (data.bio.links.linkedin) {
                const linkedinLink = document.createElement('a');
                linkedinLink.className = 'btn-tertiary btn-tight inline-flex';
                linkedinLink.href = escapeHTML(data.bio.links.linkedin.href);
                if (data.bio.links.linkedin.target) linkedinLink.setAttribute('target', data.bio.links.linkedin.target);
                linkedinLink.innerHTML = `${escapeHTML(data.bio.links.linkedin.text)}<span class="material-symbols-outlined btn-secondary-icon">arrow_outward</span>`;
                linksContainer.appendChild(linkedinLink);
            }
        }

        // Load strengths cards
        const strengthsContainer = document.querySelector('[data-strengths-container]');
        if (strengthsContainer && data.strengths) {
            strengthsContainer.innerHTML = '';

            data.strengths.forEach((strength, index) => {
                const panelId = `about-strength-panel-${index}`;
                const buttonId = `about-strength-toggle-${index}`;
                const strengthHTML = `
                    <div class="strength-card w-full bg-[#1c2620] p-8 rounded-[2rem] border border-[#29382f] hover:border-primary transition-colors">
                        <button type="button" id="${buttonId}" class="strength-card-toggle w-full flex items-center justify-between gap-3 text-left" aria-expanded="false" aria-controls="${panelId}">
                            <span class="strength-card-title text-xl font-semibold">${escapeHTML(strength.title)}</span>
                            <span class="material-symbols-outlined strength-card-indicator text-primary text-4xl" aria-hidden="true">keyboard_arrow_down</span>
                        </button>
                        <div id="${panelId}" class="strength-card-panel mt-3" role="region" aria-labelledby="${buttonId}" hidden>
                            <p class="text-sm text-gray-400">${escapeHTML(strength.description)}</p>
                        </div>
                    </div>
                `;

                const fragment = createHTML(strengthHTML);
                const cardEl = fragment.firstElementChild;
                if (cardEl) {
                    const toggleButton = cardEl.querySelector('.strength-card-toggle');
                    const panelEl = cardEl.querySelector('.strength-card-panel');
                    if (toggleButton && panelEl) {
                        let isAnimating = false;
                        toggleButton.addEventListener('click', () => {
                            if (isAnimating) return;

                            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                            const nextExpanded = !isExpanded;

                            toggleButton.setAttribute('aria-expanded', String(nextExpanded));

                            isAnimating = true;
                            panelEl.style.willChange = 'height, opacity, transform';

                            if (nextExpanded) {
                                panelEl.hidden = false;
                                panelEl.style.height = '0px';

                                requestAnimationFrame(() => {
                                    const targetHeight = panelEl.scrollHeight;
                                    panelEl.style.height = `${targetHeight}px`;
                                    cardEl.classList.add('is-expanded');
                                });
                            } else {
                                const currentHeight = panelEl.scrollHeight;
                                panelEl.style.height = `${currentHeight}px`;

                                requestAnimationFrame(() => {
                                    panelEl.style.height = '0px';
                                    cardEl.classList.remove('is-expanded');
                                });
                            }

                            const onTransitionEnd = (event) => {
                                if (event.propertyName !== 'height') return;

                                if (nextExpanded) {
                                    panelEl.style.height = 'auto';
                                } else {
                                    panelEl.hidden = true;
                                }

                                panelEl.style.willChange = '';
                                isAnimating = false;
                                panelEl.removeEventListener('transitionend', onTransitionEnd);
                            };

                            panelEl.addEventListener('transitionend', onTransitionEnd);
                        });
                    }
                }

                strengthsContainer.appendChild(fragment);
            });
        }

        // Load scrolling interest images
        const interestsContainer = document.querySelector('[data-interests-container]');
        if (interestsContainer && data.interests) {
            interestsContainer.innerHTML = '';
            
            // Helper function to create interest images
            function createInterestImages() {
                const fragment = document.createDocumentFragment();
                data.interests.forEach(interest => {
                    const interestHTML = `
                        <div class="interest-card w-64 h-64 md:h-80 flex-shrink-0 relative overflow-hidden rounded-[1.5rem] transition-all duration-500 border border-[#29382f]">
                            <img alt="${escapeHTML(interest.image.alt)}" class="w-full h-full object-cover" src="${escapeHTML(interest.image.url)}">
                            <div class="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                                <span class="text-white font-medium text-lg">${escapeHTML(interest.label)}</span>
                            </div>
                        </div>
                    `;
                    const fragmentItem = createHTML(interestHTML);
                    fragment.appendChild(fragmentItem);
                });
                return fragment;
            }

            // Create two identical sets for seamless infinite scrolling
            // The animation moves -50%, so duplicating ensures smooth loop
            interestsContainer.appendChild(createInterestImages());
            interestsContainer.appendChild(createInterestImages());
        }
    }

    /**
     * Loads and renders the global top banner (non-dismissible)
     */
    async function loadBanner() {
        const data = await fetchJSON('data/site.json');
        const placeholder = document.querySelector('[data-banner-placeholder]');
        if (!placeholder) return;

        // Turn banner off by setting "enabled": false (or omit "banner") in site.json
        if (!data || !data.banner || data.banner.enabled === false) {
            placeholder.replaceWith(document.createDocumentFragment());
            return;
        }

        const cta = data.banner.cta;
        const ctaHTML = cta && cta.href
            ? `<a class="bg-primary text-[#111714] px-4 py-[0.4rem] rounded-full text-xs font-bold hover:bg-white transition-all" href="${escapeHTML(cta.href)}"${cta.target ? ' target="_blank" rel="noopener"' : ''}>${escapeHTML(cta.text || '')}</a>`
            : '';

        const bannerHTML = `
            <div class="sticky top-0 z-[100] w-full border-b py-1.5 px-4 md:px-10 flex items-center justify-center gap-4 bg-[#2ebd67] border-[#25a55a]" id="top-banner">
                <div class="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
                    <p class="text-sm font-medium tracking-tight text-[#111714]">
                        <span class="mr-2">🚧</span>${escapeHTML(data.banner.message)}
                    </p>
                    ${ctaHTML}
                </div>
            </div>
        `;
        const fragment = createHTML(bannerHTML);
        placeholder.replaceWith(fragment);
    }

    /**
     * Loads and renders the global navigation component
     */
    async function loadNav() {
        const data = await fetchJSON('data/site.json');
        if (!data) return;

        // Find nav placeholder
        const navPlaceholder = document.querySelector('[data-nav-placeholder]');
        if (!navPlaceholder) return;

        // Build desktop nav links HTML
        let desktopNavLinksHTML = '';
        let mobileNavLinksHTML = '';
        if (data.navigation && Array.isArray(data.navigation)) {
            data.navigation.forEach(navItem => {
                const targetAttr = navItem.target ? ` target="${escapeHTML(navItem.target)}"` : '';
                desktopNavLinksHTML += `<a class="link-nav" href="${escapeHTML(navItem.href)}"${targetAttr}>${escapeHTML(navItem.text)}</a>`;
                mobileNavLinksHTML += `<a class="link-nav link-nav-mobile" href="${escapeHTML(navItem.href)}"${targetAttr}>${escapeHTML(navItem.text)}</a>`;
            });
        }

        // Create nav HTML
        const navHTML = `
            <div class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-2">
                <nav class="relative nav-container bg-[#1c2620]/80 backdrop-blur-md border border-[#29382f] rounded-full px-2 py-2 flex items-center justify-between gap-2 shadow-lg max-w-[960px] w-full mx-auto" data-menu-open="false">  
                <a class="flex link-logo items-center" href="index.html" aria-label="Yatong Wang - Home">
                        <div class="items-center size-6 text-primary">
                            <svg width="18" height="18" viewBox="0 0 846 846" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
                                <path d="M53 282.5C53 421.4 191.344 534 362 534V31C191.344 31 53 143.6 53 282.5Z" fill="currentColor"/>
                                <path d="M201 838H807V613H363.572L201 838Z" fill="currentColor"/>
                                <path d="M413 543H807V0L413 543Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span class="items-center font-[Syne] text-white font-bold uppercase whitespace-nowrap" data-logo-text>YAT<span class="font-extrabold">O</span>NG WANG</span>
                </a>
                    <div class="hidden md:flex items-center gap-1 px-1 py-1">
                        ${desktopNavLinksHTML}
                    </div>
                    <div class="md:hidden flex items-center justify-center ml-auto px-1 py-1">
                        <button id="mobile-menu-button" class="items-center text-gray-400 hover:text-primary transition-colors px-5" aria-label="Toggle menu" aria-expanded="false">
                            <span class="material-symbols-outlined text-2xl">menu</span>
                        </button>
                    </div>
                    <div id="mobile-menu-items" class="md:hidden absolute left-0 right-0 top-full
                    flex flex-col items-end justify-end gap-2 w-full px-4 pb-2 pt-2" data-menu-visible="false">
                        ${mobileNavLinksHTML}
                    </div>
                </nav>
            </div>
        `;

        // Replace placeholder with nav
        const navFragment = createHTML(navHTML);
        navPlaceholder.replaceWith(navFragment);

        // Reinitialize mobile menu after nav is loaded
        if (window.initMobileMenu) {
            window.initMobileMenu();
        }
    }

    /**
     * Updates the fixed nav wrapper's top offset so it sits below the top banner
     * when present.
     */
    function updateNavPosition() {
        const banner = document.getElementById('top-banner');
        const navWrapper = document.querySelector('.nav-container')?.parentElement;
        if (!navWrapper) return;

        const bannerVisible = banner && banner.style.display !== 'none';
        navWrapper.style.top = bannerVisible ? `${banner.offsetHeight}px` : '0';
    }

    // Expose for inline dismiss button and resize handling
    window.updateNavPosition = updateNavPosition;

    /**
     * Loads and renders the global footer component
     */
    async function loadFooter() {
        const data = await fetchJSON('data/site.json');
        if (!data || !data.footer) return;

        // Find footer placeholder
        const footerPlaceholder = document.querySelector('[data-footer-placeholder]');
        if (!footerPlaceholder) return;

        // Support footer.status (preferred) with fallback to site.status for backwards compatibility
        const status = data.footer?.status || data.site?.status || '';

        // Build footer links HTML
        let footerLinksHTML = '';
        if (data.footer.links && Array.isArray(data.footer.links)) {
            data.footer.links.forEach(linkData => {
                const targetAttr = linkData.target ? ` target="${escapeHTML(linkData.target)}"` : '';
                footerLinksHTML += `
                    <a class="link-footer group" href="${escapeHTML(linkData.href)}"${targetAttr}>
                        <span class="material-symbols-outlined text-xl group-hover:rotate-6 group-hover:translate-x-1 transform transition-all">${escapeHTML(linkData.icon || '')}</span>
                        <span class="link-footer-text">${escapeHTML(linkData.text || '')}</span>
                    </a>
                `;
            });
        }

        // Create footer HTML with responsive classes matching case2.html
        const footerHTML = `
            <footer class="border-t border-[#29382f] w-full pt-6 pb-6 px-4 md:px-8 lg:px-20 lg:pb-4">
                <div class="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start justify-between md:gap-8 gap-2 mb-2">
                    <div class="flex flex-col items-center md:items-start gap-2">
                        <p class="inline-flex items-center gap-2 text-white font-mono uppercase">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span class="tracking-tight" data-footer-status>${status}</span>
                        </p>
                        <div class="flex flex-col md:flex-row items-center gap-2">
                         <div class="inline-flex justify-center md:justify-end md:items-end md:gap-4 gap-8 text-gray-400">
                        ${footerLinksHTML}
                        </div>
                        </div>
                    </div>
                     <div class="flex flex-col md:flex-col-reverse md:items-end items-center md:gap-2 gap-3">
                        <p class="text-gray-500 tracking-tight" data-footer-copyright>${escapeHTML(data.footer.copyright || '')}</p>
                         <img src="assets/images/built-with-cursor.svg" alt="Built with Cursor" class="w-30 h-8">
                    </div>
                </div>
            </footer>
        `;

        // Replace placeholder with footer
        const footerFragment = createHTML(footerHTML);
        footerPlaceholder.replaceWith(footerFragment);
    }

    /**
     * Applies fallback for browsers that don't support animation-timeline
     * Adds .revealed class to .reveal-on-scroll elements to make them visible
     */
    function applyRevealFallback() {
        if (!CSS.supports('animation-timeline', 'view()')) {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => {
                el.classList.add('revealed');
            });
        }
    }

    /**
     * Loads and renders site-wide content (nav, footer)
     */
    async function loadSiteContent() {
        const data = await fetchJSON('data/site.json');
        if (!data) return;

        // Update site title
        const titleEl = document.querySelector('title');
        if (titleEl && data.site.title && document.documentElement.getAttribute('data-page') !== '404') {
            titleEl.textContent = data.site.title;
        }


        // Update navigation (if needed)
        const navLinks = document.querySelectorAll('[data-nav-link]');
        navLinks.forEach((link, index) => {
            if (data.navigation[index]) {
                link.textContent = data.navigation[index].text;
                link.href = data.navigation[index].href;
                if (data.navigation[index].target) {
                    link.target = data.navigation[index].target;
                }
            }
        });

        // Update footer (for backwards compatibility with existing footer elements)
        const footerCopyright = document.querySelector('[data-footer-copyright]');
        if (footerCopyright && data.footer.copyright) {
            footerCopyright.textContent = data.footer.copyright;
        }

        const footerStatus = document.querySelector('[data-footer-status]');
        if (footerStatus) {
            // Support footer.status (preferred) with fallback to site.status for backwards compatibility
            const status = data.footer?.status || data.site?.status;
            if (status) {
                footerStatus.textContent = status;
            }
        }

        // Update footer links (for backwards compatibility)
        const footerLinks = document.querySelectorAll('[data-footer-link]');
        footerLinks.forEach((link, index) => {
            if (data.footer.links[index]) {
                const linkData = data.footer.links[index];
                link.href = linkData.href;
                if (linkData.target) {
                    link.target = linkData.target;
                }
                const icon = link.querySelector('[data-footer-link-icon]');
                if (icon) {
                    icon.textContent = linkData.icon;
                }
                const text = link.querySelector('[data-footer-link-text]');
                if (text) {
                    text.textContent = linkData.text;
                }
            }
        });
    }

    /**
     * Initializes all content loading
     */
    async function init() {
        try {
            // Load all content in parallel
            await Promise.all([
                loadBanner(),
                loadNav(),
                loadHero(),
                loadMarquee(),
                loadProjects(),
                loadTestimonials(),
                loadAbout(),
                loadSiteContent(),
                loadFooter()
            ]);

            // Apply fallback for browsers that don't support animation-timeline (e.g. Safari)
            applyRevealFallback();

            // Initialize mobile menu after nav is loaded
            if (typeof window.initMobileMenu === 'function') {
                window.initMobileMenu();
            }

            // Trigger hero section loading animations
            // Small delay to ensure DOM is fully ready
            requestAnimationFrame(() => {
                if (typeof window.initHeroAnimations === 'function') {
                    window.initHeroAnimations();
                }
            });

            // Position nav below banner when banner is visible
            updateNavPosition();
            window.addEventListener('resize', updateNavPosition);

            window.dispatchEvent(new CustomEvent('portfolioContentReady'));
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

