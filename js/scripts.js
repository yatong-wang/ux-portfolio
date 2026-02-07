/**
 * Email Copy Functionality with Tooltip
 * 
 * Intercepts mailto link clicks to copy email addresses to clipboard
 * Shows tooltip with "Copy" on hover and "Copied!" after successful copy
 */

(function() {
    'use strict';

    // Tooltip element (created once, reused for all links)
    let tooltip = null;
    let currentLink = null;
    let tooltipTimeout = null;

    /**
     * Creates the tooltip element if it doesn't exist
     */
    function createTooltip() {
        if (tooltip) return tooltip;

        tooltip = document.createElement('div');
        tooltip.className = 'email-copy-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tooltip);
        return tooltip;
    }

    /**
     * Extracts email address from mailto href
     * @param {string} href - The mailto href attribute
     * @returns {string} - The email address
     */
    function extractEmail(href) {
        // Remove 'mailto:' prefix and any query parameters
        const email = href.replace(/^mailto:/i, '').split('?')[0].trim();
        return email;
    }

    /**
     * Copies text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success status
     */
    async function copyToClipboard(text) {
        try {
            // Use modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        } catch (err) {
            console.warn('Failed to copy to clipboard:', err);
            return false;
        }
    }

    /**
     * Positions tooltip relative to the link
     * @param {HTMLElement} link - The mailto link element
     * @param {HTMLElement} tooltipEl - The tooltip element
     */
    function positionTooltip(link, tooltipEl) {
        const linkRect = link.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Default: position above the link
        let top = linkRect.top - tooltipRect.height - 8;
        let left = linkRect.left + (linkRect.width / 2) - (tooltipRect.width / 2);

        // If tooltip would go above viewport, position below
        if (top < 10) {
            top = linkRect.bottom + 8;
        }

        // Keep tooltip within viewport horizontally
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        tooltipEl.style.top = `${top + window.scrollY}px`;
        tooltipEl.style.left = `${left}px`;
    }

    /**
     * Shows tooltip with specified text
     * @param {HTMLElement} link - The mailto link element
     * @param {string} text - Tooltip text to display
     */
    function showTooltip(link, text) {
        const tooltipEl = createTooltip();
        tooltipEl.textContent = text;
        tooltipEl.setAttribute('aria-hidden', 'false');
        
        // Force reflow to get accurate dimensions
        tooltipEl.style.visibility = 'hidden';
        tooltipEl.style.display = 'block';
        
        positionTooltip(link, tooltipEl);
        
        tooltipEl.style.visibility = 'visible';
        tooltipEl.classList.add('visible');
    }

    /**
     * Hides the tooltip
     */
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('visible');
            tooltip.setAttribute('aria-hidden', 'true');
            currentLink = null;
        }
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
            tooltipTimeout = null;
        }
    }

    /**
     * Handles mailto link click
     * @param {Event} event - Click event
     * @param {HTMLElement} link - The mailto link element
     */
    async function handleMailtoClick(event, link) {
        event.preventDefault();
        event.stopPropagation();

        const href = link.getAttribute('href');
        if (!href) return;

        const email = extractEmail(href);
        if (!email) return;

        // Copy to clipboard
        const success = await copyToClipboard(email);

        if (success) {
            // Show "Copied!" message
            showTooltip(link, 'Copied!');
            currentLink = link;

            // Keep tooltip visible for 1 second even if mouse leaves
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }
            tooltipTimeout = setTimeout(() => {
                hideTooltip();
            }, 1000);
        } else {
            // If copy fails, show error message briefly
            showTooltip(link, 'Copy failed');
            tooltipTimeout = setTimeout(() => {
                hideTooltip();
            }, 1000);
        }
    }

    /**
     * Handles mouse enter on mailto link
     * @param {Event} event - Mouse enter event
     * @param {HTMLElement} link - The mailto link element
     */
    function handleMouseEnter(event, link) {
        // If hovering over a different link while "Copied!" is showing on another link,
        // show "Copy" for the new link
        if (currentLink !== link) {
            // Clear any existing timeout if switching links
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
            }
            showTooltip(link, 'Copy');
            currentLink = link;
        } else if (!tooltip || !tooltip.classList.contains('visible')) {
            // Show "Copy" if tooltip isn't visible
            showTooltip(link, 'Copy');
            currentLink = link;
        }
        // If "Copied!" is showing on this link, don't change it
    }

    /**
     * Handles mouse leave on mailto link
     * @param {Event} event - Mouse leave event
     * @param {HTMLElement} link - The mailto link element
     */
    function handleMouseLeave(event, link) {
        // Only hide if we're not in the "Copied!" state (which has its own timeout)
        // The "Copied!" state will be handled by the timeout
        if (currentLink === link && tooltip && tooltip.textContent === 'Copied!') {
            // Don't hide - let the timeout handle it
            return;
        }
        // Hide tooltip for "Copy" state when mouse leaves
        if (currentLink === link) {
            hideTooltip();
        }
    }

    /**
     * Initializes the email copy functionality
     * Uses event delegation to work with dynamically loaded mailto hrefs
     */
    function init() {
        // Use event delegation - works even if hrefs are set dynamically by content-loader
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (link) handleMailtoClick(e, link);
        });
        
        document.addEventListener('mouseenter', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (link) handleMouseEnter(e, link);
        }, true); // capture phase for mouseenter (doesn't bubble)
        
        document.addEventListener('mouseleave', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (link) handleMouseLeave(e, link);
        }, true); // capture phase for mouseleave (doesn't bubble)
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Mobile Hamburger Menu Toggle
 * 
 * Handles the mobile navigation menu toggle functionality.
 * Expands/collapses the nav bar and toggles between menu and close icons.
 */

(function() {
    'use strict';

    /**
     * Toggles the mobile menu open/closed state
     */
    function toggleMobileMenu() {
        const nav = document.querySelector('nav[data-menu-open]');
        const menuButton = document.getElementById('mobile-menu-button');
        const menuIcon = menuButton?.querySelector('.material-symbols-outlined');
        const menuItems = document.getElementById('mobile-menu-items');
        
        if (!nav || !menuButton || !menuIcon || !menuItems) return;

        const isOpen = nav.getAttribute('data-menu-open') === 'true';

        if (isOpen) {
            // Close menu
            nav.setAttribute('data-menu-open', 'false');
            menuButton.setAttribute('aria-expanded', 'false');
            menuIcon.textContent = 'menu';
            menuItems.setAttribute('data-menu-visible', 'false');
        } else {
            // Open menu
            nav.setAttribute('data-menu-open', 'true');
            menuButton.setAttribute('aria-expanded', 'true');
            menuIcon.textContent = 'close';
            menuItems.setAttribute('data-menu-visible', 'true');
        }
    }

    /**
     * Closes the mobile menu (useful for clicking nav links)
     */
    function closeMobileMenu() {
        const nav = document.querySelector('nav[data-menu-open]');
        const menuButton = document.getElementById('mobile-menu-button');
        const menuIcon = menuButton?.querySelector('.material-symbols-outlined');
        const menuItems = document.getElementById('mobile-menu-items');
        
        if (!nav || !menuButton || !menuIcon || !menuItems) return;

        const isOpen = nav.getAttribute('data-menu-open') === 'true';
        
        if (isOpen) {
            nav.setAttribute('data-menu-open', 'false');
            menuButton.setAttribute('aria-expanded', 'false');
            menuIcon.textContent = 'menu';
            menuItems.setAttribute('data-menu-visible', 'false');
        }
    }

    /**
     * Sets active state on nav link matching current URL path
     */
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.link-nav');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }


    /**
     * Initializes the mobile menu functionality
     */
    function init() {
        const menuButton = document.getElementById('mobile-menu-button');
        const menuItems = document.getElementById('mobile-menu-items');
        
        if (!menuButton || !menuItems) return;

        setActiveNavLink();

        // Add click handler to menu button
        menuButton.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking on nav links (mobile only)
        const mobileNavLinks = menuItems.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside (optional enhancement)
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('nav[data-menu-open]');
            if (!nav) return;
            
            const isOpen = nav.getAttribute('data-menu-open') === 'true';
            if (isOpen && !nav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on window resize if it goes above md breakpoint
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth >= 768) { // md breakpoint
                    closeMobileMenu();
                }
            }, 250);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose function globally for content-loader to call after nav is loaded
    window.initMobileMenu = init;
})();

/**
 * Testimonial Carousel
 * 
 * Handles horizontal scrolling carousel for testimonial cards.
 * Shows/hides navigation arrows based on scroll position and overflow.
 */

(function() {
    'use strict';

    let carousel = null;
    let leftArrow = null;
    let rightArrow = null;
    let testimonialsSection = null;
    let resizeObserver = null;

    /**
     * Checks if the carousel has horizontal overflow
     * @returns {boolean} - True if content overflows
     */
    function hasOverflow() {
        if (!carousel) return false;
        return carousel.scrollWidth > carousel.clientWidth;
    }

    /**
     * Updates arrow visibility based on scroll position and overflow
     */
    function updateArrowVisibility() {
        if (!carousel || !leftArrow || !rightArrow || !testimonialsSection) return;

        const hasContentOverflow = hasOverflow();
        const scrollLeft = carousel.scrollLeft;
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        const threshold = 5; // Small threshold for floating point issues

        // If no overflow, hide both arrows and shadows
        if (!hasContentOverflow) {
            leftArrow.classList.remove('visible');
            rightArrow.classList.remove('visible');
            return;
        }

        // Show/hide left arrow and shadow based on scroll position
        if (scrollLeft > threshold) {
            leftArrow.classList.add('visible');
        } else {
            leftArrow.classList.remove('visible');
        }

        // Show/hide right arrow and shadow based on scroll position
        if (scrollLeft < maxScrollLeft - threshold) {
            rightArrow.classList.add('visible');
        } else {
            rightArrow.classList.remove('visible');
        }
    }

    /**
     * Scrolls the carousel by a specified amount
     * @param {string} direction - 'left' or 'right'
     */
    function scrollCarousel(direction) {
        if (!carousel) return;

        // Calculate scroll amount (one card width + gap)
        const card = carousel.querySelector('.testimonial-card');
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const gap = 24; // 6 * 4 = 24px (gap-6 in Tailwind)
        const scrollAmount = cardWidth + gap;

        const currentScroll = carousel.scrollLeft;
        const newScroll = direction === 'left' 
            ? currentScroll - scrollAmount 
            : currentScroll + scrollAmount;

        carousel.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }

    /**
     * Handles left arrow click
     */
    function handleLeftClick() {
        scrollCarousel('left');
    }

    /**
     * Handles right arrow click
     */
    function handleRightClick() {
        scrollCarousel('right');
    }

    /**
     * Handles carousel scroll event
     */
    function handleScroll() {
        updateArrowVisibility();
    }

    /**
     * Initializes the carousel functionality
     */
    function init() {
        carousel = document.getElementById('testimonial-carousel');
        leftArrow = document.getElementById('carousel-arrow-left');
        rightArrow = document.getElementById('carousel-arrow-right');
        testimonialsSection = document.getElementById('testimonials');

        if (!carousel || !leftArrow || !rightArrow || !testimonialsSection) return;

        // Add event listeners
        leftArrow.addEventListener('click', handleLeftClick);
        rightArrow.addEventListener('click', handleRightClick);
        carousel.addEventListener('scroll', handleScroll);

        // Initial arrow visibility check
        updateArrowVisibility();

        // Update arrow visibility on window resize
        resizeObserver = new ResizeObserver(() => {
            updateArrowVisibility();
        });
        resizeObserver.observe(carousel);

        // Also listen for window resize as a fallback
        window.addEventListener('resize', updateArrowVisibility);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


/**
 * Hero Section Loading Animations
 * 
 * Orchestrates sequential loading animations for hero section elements:
 * - Nav bar fade-in
 * - Background slide-down with blur
 * - H1 typewriter effect
 * - P description slide-in from left
 * - Arrow fade-in
 */

(function() {
    'use strict';

    // Animation timing configuration (in milliseconds)
    const TIMING = {
        navDelay: 0,           // Nav starts immediately
        bgDelay: 0,            // Background starts with nav
        h1Delay: 300,          // H1 starts 300ms after nav
        pDelay: 800,           // P starts 800ms after nav (500ms after h1)
        arrowDelay: 1500,      // Arrow starts 1500ms after nav (700ms after p)
        typewriterSpeed: 40    // Milliseconds per character
    };

    /**
     * Typewriter effect that handles HTML tags
     * @param {HTMLElement} element - The element to apply typewriter effect to
     * @param {string} html - The HTML content to type out
     * @param {number} speed - Milliseconds per character
     * @returns {Promise} - Resolves when typing is complete
     */
    function typewriterEffect(element, html, speed) {
        return new Promise((resolve) => {
            // Parse HTML into text and tags
            const segments = parseHTML(html);
            let currentIndex = 0;
            let output = '';
            
            // Add cursor
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            
            function type() {
                if (currentIndex < segments.length) {
                    const segment = segments[currentIndex];
                    
                    if (segment.type === 'tag') {
                        // Add entire tag at once
                        output += segment.content;
                        element.innerHTML = output;
                        element.appendChild(cursor);
                        currentIndex++;
                        // Continue immediately for tags
                        setTimeout(type, 0);
                    } else {
                        // Type character by character
                        output += segment.content;
                        element.innerHTML = output;
                        element.appendChild(cursor);
                        currentIndex++;
                        setTimeout(type, speed);
                    }
                } else {
                    // Remove cursor after typing completes
                    setTimeout(() => {
                        cursor.remove();
                        resolve();
                    }, 500);
                }
            }
            
            // Start typing
            element.innerHTML = '';
            element.appendChild(cursor);
            setTimeout(type, speed);
        });
    }

    /**
     * Parses HTML string into segments of text characters and tags
     * @param {string} html - HTML string to parse
     * @returns {Array} - Array of segments {type: 'char'|'tag', content: string}
     */
    function parseHTML(html) {
        const segments = [];
        let i = 0;
        
        while (i < html.length) {
            if (html[i] === '<') {
                // Find end of tag
                let tagEnd = html.indexOf('>', i);
                if (tagEnd !== -1) {
                    const tag = html.substring(i, tagEnd + 1);
                    segments.push({ type: 'tag', content: tag });
                    i = tagEnd + 1;
                } else {
                    // Malformed HTML, treat as character
                    segments.push({ type: 'char', content: html[i] });
                    i++;
                }
            } else {
                // Regular character
                segments.push({ type: 'char', content: html[i] });
                i++;
            }
        }
        
        return segments;
    }

    /**
     * Applies animation class to element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - CSS animation class to add
     */
    function animateElement(element, animationClass) {
        if (element) {
            // Remove initial state classes
            element.classList.remove('hero-animate-initial', 'hero-bg-initial', 'hero-slide-left-initial');
            // Add animation class
            element.classList.add(animationClass);
        }
    }

    /**
     * Initializes hero animations after content is loaded
     * Called by content-loader.js after hero content is populated
     */
    function initHeroAnimations() {
        // Get elements
        const navContainer = document.querySelector('.nav-container');
        const heroBg = document.querySelector('[data-hero-bg]');
        const heroTitle = document.querySelector('[data-hero-title]');
        const heroDescription = document.querySelector('[data-hero-description]');
        const heroArrow = document.querySelector('[data-section="hero"] .animate-float-soft');

        // Store original content for typewriter
        const titleHTML = heroTitle ? heroTitle.innerHTML : '';
        const descriptionHTML = heroDescription ? heroDescription.innerHTML : '';

        // Set initial states
        if (navContainer) {
            navContainer.classList.add('hero-animate-initial');
        }
        if (heroBg) {
            heroBg.classList.add('hero-bg-initial');
        }
        if (heroTitle) {
            heroTitle.classList.add('hero-animate-initial');
            heroTitle.innerHTML = '';
        }
        if (heroDescription) {
            heroDescription.classList.add('hero-slide-left-initial');
        }
        if (heroArrow) {
            heroArrow.classList.add('hero-animate-initial');
        }

        // Trigger animations with delays

        // Nav fade-in
        setTimeout(() => {
            animateElement(navContainer, 'animate-nav-fade-in');
        }, TIMING.navDelay);

        // Background slide-down blur
        setTimeout(() => {
            animateElement(heroBg, 'animate-bg-slide-down-blur');
        }, TIMING.bgDelay);

        // H1 typewriter effect
        setTimeout(() => {
            if (heroTitle) {
                heroTitle.classList.remove('hero-animate-initial');
                heroTitle.style.opacity = '1';
                typewriterEffect(heroTitle, titleHTML, TIMING.typewriterSpeed);
            }
        }, TIMING.h1Delay);

        // P description slide-in
        setTimeout(() => {
            if (heroDescription) {
                heroDescription.innerHTML = descriptionHTML;
                animateElement(heroDescription, 'animate-slide-in-left');
            }
        }, TIMING.pDelay);

        // Arrow fade-in (uses transition to preserve float animation)
        setTimeout(() => {
            if (heroArrow) {
                heroArrow.classList.remove('hero-animate-initial');
                heroArrow.classList.add('hero-visible');
            }
        }, TIMING.arrowDelay);
    }

    // Expose function globally for content-loader to call
    window.initHeroAnimations = initHeroAnimations;
})();

/**
 * Disabled placeholder links (href="#")
 * Prevents navigation and shows "Coming Soon" via CSS tooltip.
 * Uses event delegation so it works with dynamically loaded content.
 */
(function() {
    'use strict';

    function applyDisabledToPlaceholderLinks() {
        document.querySelectorAll('a[href="#"]').forEach(link => {
            if (link.classList.contains('btn-primary') || link.classList.contains('btn-secondary') || link.classList.contains('btn-tertiary')) {
                if (!link.classList.contains('btn-disabled')) {
                    link.classList.add('btn-disabled');
                    link.setAttribute('aria-disabled', 'true');
                    link.setAttribute('title', 'Coming Soon');
                }
            }
        });
    }

    function initDisabledLinks() {
        applyDisabledToPlaceholderLinks();

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a.btn-disabled') || e.target.closest('a[href="#"][aria-disabled="true"]');
            if (link) {
                e.preventDefault();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDisabledLinks);
    } else {
        initDisabledLinks();
    }

    window.addEventListener('portfolioContentReady', applyDisabledToPlaceholderLinks);
})();