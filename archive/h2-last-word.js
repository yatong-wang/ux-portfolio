/**
 * H2 Last Word Bold Styling
 * 
 * Automatically wraps the last word of all h2 elements in a span
 * to apply bold styling to only the last word.
 */

(function() {
    'use strict';

    /**
     * Wraps the last word of an h2 element in a span with class 'last-word'
     * @param {HTMLElement} h2 - The h2 element to process
     */
    function wrapLastWord(h2) {
        // Skip if already processed (has a .last-word span)
        if (h2.querySelector('.last-word')) return;

        const text = h2.textContent.trim();
        const words = text.split(/\s+/);
        
        if (words.length > 1) {
            const lastWord = words.pop();
            const rest = words.join(' ');
            h2.innerHTML = `${rest} <span class="last-word">${lastWord}</span>`;
        }
    }

    /**
     * Processes all h2 elements on the page
     */
    function processAllH2s() {
        document.querySelectorAll('h2').forEach(wrapLastWord);
    }

    /**
     * Initializes the h2 last word styling
     * Uses MutationObserver to handle dynamically loaded content
     */
    function init() {
        // Process existing h2 elements
        processAllH2s();

        // Watch for new h2 elements added dynamically (from content-loader)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is an h2
                        if (node.tagName === 'H2') {
                            wrapLastWord(node);
                        }
                        // Check if the added node contains h2 elements
                        const h2s = node.querySelectorAll?.('h2');
                        if (h2s) {
                            h2s.forEach(wrapLastWord);
                        }
                    }
                });
            });
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();