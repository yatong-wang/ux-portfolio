const cache = {};

export async function fetchJSON(path) {
    if (cache[path]) return cache[path];
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
        const data = await response.json();
        cache[path] = data;
        return data;
    } catch (error) {
        console.error(`Error loading ${path}:`, error);
        return null;
    }
}

export function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function createHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

export function applyRevealFallback() {
    if (!CSS.supports('animation-timeline', 'view()')) {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.classList.add('revealed');
        });
    }
}
