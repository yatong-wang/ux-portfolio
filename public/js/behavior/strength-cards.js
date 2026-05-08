/**
 * Strength card accordions.
 *
 * Wires click + transitionend handlers onto every .strength-card found in the DOM.
 * Pure DOM behavior — no JSON dependency. No-op when no cards are present.
 */

function wireCard(cardEl) {
    const toggleButton = cardEl.querySelector('.strength-card-toggle');
    const panelEl = cardEl.querySelector('.strength-card-panel');
    if (!toggleButton || !panelEl) return;

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

            if (nextExpanded) panelEl.style.height = 'auto';
            else panelEl.hidden = true;

            panelEl.style.willChange = '';
            isAnimating = false;
            panelEl.removeEventListener('transitionend', onTransitionEnd);
        };

        panelEl.addEventListener('transitionend', onTransitionEnd);
    });
}

export function init() {
    document.querySelectorAll('.strength-card').forEach(wireCard);
}
