    /**
     * Loads and renders services section
     */
    async function loadServices() {
        const data = await fetchJSON('data/services.json');
        if (!data) return;

        const servicesSection = document.querySelector('section[data-section="services"]');
        if (!servicesSection) return;

        // Update title
        const titleEl = servicesSection.querySelector('[data-services-title]');
        if (titleEl) {
            titleEl.innerHTML = data.title;
        }

        // Update description
        const descEl = servicesSection.querySelector('[data-services-description]');
        if (descEl) {
            descEl.textContent = data.description;
        }

        // Update CTA link
        const ctaEl = servicesSection.querySelector('[data-services-cta]');
        if (ctaEl && data.cta) {
            ctaEl.href = data.cta.link;
            const ctaText = ctaEl.querySelector('[data-services-cta-text]');
            if (ctaText) {
                ctaText.textContent = data.cta.text;
            }
        }

        // Render services
        const servicesContainer = servicesSection.querySelector('[data-services-container]');
        if (!servicesContainer) return;

        servicesContainer.innerHTML = '';

        data.services.forEach(service => {
            const serviceHTML = `
                <div class="group border-b border-[#29382f] pb-6 hover:border-primary/50 transition-colors">
                    <div class="flex items-start gap-4">
                        <div class="mt-1 p-2 rounded-full bg-[#29382f] text-primary group-hover:bg-primary group-hover:text-[#111714] transition-colors">
                            <span class="material-symbols-outlined">${escapeHTML(service.icon)}</span>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">${escapeHTML(service.title)}</h3>
                            <p class="text-gray-400 text-sm leading-relaxed">${escapeHTML(service.description)}</p>
                        </div>
                    </div>
                </div>
            `;
            const fragment = createHTML(serviceHTML);
            servicesContainer.appendChild(fragment);
        });
    }