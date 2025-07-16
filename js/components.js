// Component Loader - Dynamically loads HTML components
class ComponentLoader {
    constructor() {
        this.components = [
            { selector: 'nav', file: 'components/header.html' },
            { selector: '#hero-section', file: 'components/hero.html' },
            { selector: '#about-section', file: 'components/about.html' },
            { selector: '#projects-section', file: 'components/projects.html' },
            { selector: '#repositories-section', file: 'components/repositories.html' },
            { selector: '#contact-section', file: 'components/contact.html' },
            { selector: 'footer', file: 'components/footer.html' }
        ];
        this.loadComponents();
    }

    async loadComponents() {
        try {
            const loadPromises = this.components.map(component => 
                this.loadComponent(component.selector, component.file)
            );
            
            await Promise.all(loadPromises);
            console.log('All components loaded successfully');
            
            // Trigger custom event when components are ready
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
            
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    async loadComponent(selector, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            
            const html = await response.text();
            const element = document.querySelector(selector);
            
            if (element) {
                element.innerHTML = html;
            } else {
                console.warn(`Element with selector "${selector}" not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${file}:`, error);
            // Fallback: show error message in the element
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = `<div class="component-error">Failed to load component: ${file}</div>`;
            }
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});