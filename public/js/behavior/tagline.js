/**
 * Tagline typing animation.
 *
 * Cycles through "Thinking…", "Synthesizing…", "Generating…" placeholders, then
 * types out the bio.tagline HTML one character at a time with a blinking cursor.
 * After completion, removes opacity-0 from any [data-below-bio] containers.
 *
 * No-op when [data-about-tagline] is absent.
 */

import { fetchJSON } from '../lib/content.js';

const delay = ms => new Promise(r => setTimeout(r, ms));

async function animate(el, finalHTML) {
    const phases = ['Thinking', 'Synthesizing', 'Generating'];

    for (const word of phases) {
        for (let d = 1; d <= 3; d++) {
            el.innerHTML = `<span class="font-mono font-medium text-gray-400 text-xl lg:text-2xl">${word}${'·'.repeat(d)}</span>`;
            await delay(130);
        }
        await delay(200);
    }

    await delay(80);
    el.innerHTML = '';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    const template = document.createElement('template');
    template.innerHTML = finalHTML.trim();

    async function typeNodes(parent, nodes, insertBefore) {
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const span = document.createElement('span');
                if (insertBefore) parent.insertBefore(span, insertBefore);
                else parent.appendChild(span);
                for (const ch of node.textContent) {
                    span.textContent += ch;
                    await delay(22);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = document.createElement(node.tagName.toLowerCase());
                for (const attr of node.attributes) clone.setAttribute(attr.name, attr.value);
                if (insertBefore) parent.insertBefore(clone, insertBefore);
                else parent.appendChild(clone);
                await typeNodes(clone, node.childNodes, null);
            }
        }
    }

    await typeNodes(el, template.content.childNodes, cursor);
    cursor.remove();
}

export async function init() {
    const el = document.querySelector('[data-about-tagline]');
    if (!el) return;

    const data = await fetchJSON('data/about.json');
    if (!data?.bio?.tagline) return;

    await animate(el, data.bio.tagline);
    document.querySelectorAll('[data-below-bio]').forEach(below => below.classList.remove('opacity-0'));
}
