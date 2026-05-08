import { fetchJSON, escapeHTML, createHTML } from '../lib/content.js';
import * as strengthCards from '../behavior/strength-cards.js';
import * as interestsMotion from '../behavior/interests-motion.js';
import * as tagline from '../behavior/tagline.js';

function renderPortrait(data) {
    const portraitImg = document.querySelector('[data-about-portrait]');
    if (!portraitImg || !data.portrait?.image) return;

    portraitImg.src = data.portrait.image.url;
    portraitImg.alt = data.portrait.image.alt;

    const portraitAltEl = document.querySelector('[data-about-portrait-alt]');
    if (portraitAltEl) portraitAltEl.textContent = data.portrait.image.alt || '';
}

function renderParagraphs(data) {
    const paragraphsContainer = document.querySelector('[data-about-paragraphs]');
    if (!paragraphsContainer || !data.bio?.paragraphs) return;

    paragraphsContainer.innerHTML = '';
    data.bio.paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        paragraphsContainer.appendChild(p);
    });
}

function renderLinks(data) {
    const linksContainer = document.querySelector('[data-about-links]');
    if (!linksContainer || !data.bio?.links) return;

    linksContainer.innerHTML = '';

    const appendLink = (linkData) => {
        if (!linkData) return;
        const a = document.createElement('a');
        a.className = 'btn-tertiary btn-tight inline-flex';
        a.href = escapeHTML(linkData.href);
        if (linkData.target) {
            a.target = linkData.target;
            if (linkData.target === '_blank') a.rel = 'noopener';
        }
        a.innerHTML = `${escapeHTML(linkData.text)}<span class="material-symbols-outlined btn-secondary-icon">arrow_outward</span>`;
        linksContainer.appendChild(a);
    };

    appendLink(data.bio.links.resume);
    appendLink(data.bio.links.linkedin);
}

function renderTimeline(data) {
    const timelineContainer = document.querySelector('[data-about-timeline]');
    if (!timelineContainer || !Array.isArray(data.timeline?.milestones)) return;

    timelineContainer.innerHTML = '';
    data.timeline.milestones.forEach((milestone) => {
        const featured = milestone.featured === true;
        const periodClass = featured
            ? 'about-timeline-period about-timeline-period--accent'
            : 'about-timeline-period';
        const markerClass = featured
            ? 'about-timeline-marker about-timeline-marker--featured'
            : 'about-timeline-marker about-timeline-marker--muted';
        const titleClass = featured
            ? 'about-timeline-title about-timeline-title--emphasis'
            : 'about-timeline-title';
        const iconName = milestone.icon && String(milestone.icon).trim()
            ? String(milestone.icon).trim()
            : 'circle';
        const iconClass = featured
            ? 'material-symbols-outlined about-timeline-icon about-timeline-icon--filled'
            : 'material-symbols-outlined about-timeline-icon about-timeline-icon--outline';
        const pingHTML = featured
            ? '<span class="about-timeline-marker-ping" aria-hidden="true"></span>'
            : '';
        const rowHTML = `
            <div class="about-timeline-row">
                <span class="${periodClass}">${escapeHTML(milestone.period || '')}</span>
                <div class="about-timeline-rail">
                    <div class="about-timeline-line" aria-hidden="true"></div>
                    <div class="${markerClass}">
                        ${pingHTML}
                        <span class="${iconClass}" aria-hidden="true">${escapeHTML(iconName)}</span>
                    </div>
                </div>
                <p class="${titleClass}">${escapeHTML(milestone.title || '')}</p>
                <div class="about-timeline-spacer" aria-hidden="true"></div>
                <p class="about-timeline-subtitle">${escapeHTML(milestone.subtitle || '')}</p>
            </div>
        `;
        timelineContainer.appendChild(createHTML(rowHTML));
    });
}

function renderStrengths(data) {
    const strengthsContainer = document.querySelector('[data-strengths-container]');
    if (!strengthsContainer || !data.strengths) return;

    strengthsContainer.innerHTML = '';
    data.strengths.forEach((strength, index) => {
        const panelId = `about-strength-panel-${index}`;
        const buttonId = `about-strength-toggle-${index}`;
        const strengthHTML = `
            <div class="strength-card w-full surface-card p-8 rounded-[2rem] hover:border-primary transition-colors">
                <button type="button" id="${buttonId}" class="strength-card-toggle w-full flex items-center justify-between gap-3 text-left" aria-expanded="false" aria-controls="${panelId}">
                    <span class="strength-card-title text-xl font-semibold">${escapeHTML(strength.title)}</span>
                    <span class="material-symbols-outlined strength-card-indicator text-primary text-4xl" aria-hidden="true">keyboard_arrow_down</span>
                </button>
                <div id="${panelId}" class="strength-card-panel mt-3" role="region" aria-labelledby="${buttonId}" hidden>
                    <p class="text-sm text-gray-400">${escapeHTML(strength.description)}</p>
                </div>
            </div>
        `;
        strengthsContainer.appendChild(createHTML(strengthHTML));
    });
}

function renderToolkits(data) {
    const toolkitsContainer = document.querySelector('[data-toolkits-container]');
    if (!toolkitsContainer || !Array.isArray(data.toolkits)) return;

    toolkitsContainer.innerHTML = '';
    data.toolkits.forEach(group => {
        const toolChips = group.tools.map(tool => `
            <div class="flex items-center gap-2 surface-card rounded-full px-4 py-2">
                <img src="${escapeHTML(tool.logo)}" alt="${escapeHTML(tool.name)} logo" class="w-5 h-5 object-contain flex-shrink-0">
                <span class="text-sm font-medium text-gray-300 whitespace-nowrap">${escapeHTML(tool.name)}</span>
            </div>
        `).join('');
        const groupHTML = `
            <div>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">${escapeHTML(group.category)}</p>
                <div class="flex flex-wrap gap-2">${toolChips}</div>
            </div>
        `;
        toolkitsContainer.appendChild(createHTML(groupHTML));
    });
}

function renderInterests(data) {
    const interestsContainer = document.querySelector('[data-interests-container]');
    if (!interestsContainer || !data.interests) return;

    interestsContainer.innerHTML = '';

    function createInterestImages(isLoop) {
        const wrapper = document.createElement('div');
        wrapper.className = 'interests-copy flex gap-4 flex-shrink-0';
        if (isLoop) wrapper.setAttribute('data-interests-loop-copy', '');
        data.interests.forEach(interest => {
            const interestHTML = `
                <div class="interest-card w-72 h-96 md:h-96 flex-shrink-0 relative overflow-hidden rounded-3xl transition-all duration-500 border border-[#29382f]">
                    <img alt="${escapeHTML(interest.image.alt)}" class="w-full h-full object-cover" src="${escapeHTML(interest.image.url)}">
                    <div class="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                        <span class="text-white font-medium text-lg">${escapeHTML(interest.label)}</span>
                    </div>
                </div>
            `;
            wrapper.appendChild(createHTML(interestHTML));
        });
        return wrapper;
    }

    interestsContainer.appendChild(createInterestImages(false));
    interestsContainer.appendChild(createInterestImages(true));
}

export async function init() {
    const data = await fetchJSON('data/about.json');
    if (!data) return;

    renderPortrait(data);
    renderParagraphs(data);
    renderLinks(data);
    renderTimeline(data);
    renderStrengths(data);
    renderToolkits(data);
    renderInterests(data);

    // Wire up behavior modules now that the markup they target is in the DOM.
    // Tagline runs async — paragraphs etc. stay hidden behind [data-below-bio]'s opacity-0
    // until tagline.init() reveals them.
    strengthCards.init();
    interestsMotion.init();
    tagline.init();
}
