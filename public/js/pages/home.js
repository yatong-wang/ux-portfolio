import { fetchJSON, escapeHTML, createHTML } from '../lib/content.js';

export async function loadHero() {
    const data = await fetchJSON('data/hero.json');
    if (!data) return;

    const heroSection = document.querySelector('section[data-section="hero"]');
    if (!heroSection) return;

    const bgDiv = heroSection.querySelector('[data-hero-bg]');
    if (bgDiv && data.backgroundImage) {
        bgDiv.style.backgroundImage = `url("${data.backgroundImage.url}")`;
        bgDiv.setAttribute('data-alt', data.backgroundImage.alt);
    }

    const descEl = heroSection.querySelector('[data-hero-description]');
    if (descEl) descEl.innerHTML = data.description;
}

export async function loadMarquee() {
    const data = await fetchJSON('data/marquee.json');
    if (!data) return;

    const marqueeContainer = document.querySelector('[data-marquee-container]');
    if (!marqueeContainer) return;

    const itemsContainer = marqueeContainer.querySelector('[data-marquee-items]');
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';

    function createMarqueeItems() {
        const fragment = document.createDocumentFragment();
        data.items.forEach((item) => {
            const isTransparent = item.style === 'transparent';
            const span = document.createElement('span');
            span.className = isTransparent
                ? 'text-2xl md:text-3xl font-mono font-black tracking-wide text-transparent stroke-text stroke-primary opacity-80 uppercase'
                : 'text-2xl md:text-3xl font-mono font-black tracking-wide text-white uppercase';
            span.textContent = item.text;
            fragment.appendChild(span);

            const separator = document.createElement('span');
            separator.className = 'material-symbols-outlined text-primary text-3xl opacity-50';
            separator.textContent = 'y_circle';
            fragment.appendChild(separator);
        });
        return fragment;
    }

    itemsContainer.appendChild(createMarqueeItems());
    itemsContainer.appendChild(createMarqueeItems());
}

export async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    if (!data) return;

    const projectsSection = document.querySelector('section[data-section="projects"]');
    if (!projectsSection) return;

    const projectsContainer = projectsSection.querySelector('[data-projects-container]');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';

    data.projects.forEach(project => {
        const isPlaceholder = !project.link || project.link === '#';
        const linkClass = isPlaceholder ? 'btn-secondary btn-disabled' : 'btn-secondary';
        const linkAttrs = isPlaceholder
            ? 'href="#" aria-disabled="true" title="Coming Soon"'
            : `href="${escapeHTML(project.link)}"`;
        const cardClass = isPlaceholder
            ? 'flex flex-col md:flex-row surface-card rounded-[2rem] overflow-hidden transition-all duration-300 reveal-on-scroll'
            : 'group flex flex-col md:flex-row surface-card rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-300 reveal-on-scroll';
        const imageClass = isPlaceholder
            ? 'absolute inset-0 bg-cover bg-center'
            : 'absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700';
        const overlayClass = isPlaceholder
            ? 'absolute inset-0 bg-black/10'
            : 'absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all';
        const buttonLabel = isPlaceholder ? 'coming soon' : 'view case';
        const buttonIcon = isPlaceholder ? 'emoji_food_beverage' : 'arrow_forward';
        const projectHTML = `
            <div class="${cardClass}">
                <div class="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden">
                    <div class="${imageClass}"
                         data-alt="${escapeHTML(project.image.alt)}"
                         style="background-image: url('${escapeHTML(project.image.url)}');"></div>
                    <div class="${overlayClass}"></div>
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
                            ${buttonLabel}
                            <span class="material-symbols-outlined btn-secondary-icon">${buttonIcon}</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        projectsContainer.appendChild(createHTML(projectHTML));
    });
}

export async function loadTestimonials() {
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
            <div class="testimonial-card flex-shrink-0 w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] surface-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group snap-always snap-center">
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
        carousel.appendChild(createHTML(testimonialHTML));
    });

    window.dispatchEvent(new Event('resize'));
}

export async function init() {
    await Promise.all([loadHero(), loadMarquee(), loadProjects(), loadTestimonials()]);
}
