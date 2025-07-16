// About Section Layout Manager
class AboutLayoutManager {
    constructor() {
        this.aboutContent = document.querySelector('.about-content');
        this.currentLayout = 'horizontal';
        this.init();
    }

    init() {
        this.createLayoutToggle();
        this.setupEventListeners();
        this.setInitialLayout();
    }

    createLayoutToggle() {
        // Create layout toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'layout-toggle-btn';
        toggleButton.innerHTML = `
            <i class="fas fa-th-large"></i>
            <span>Switch Layout</span>
        `;
        
        // Insert toggle button after the section header
        const sectionHeader = document.querySelector('#about .section-header');
        if (sectionHeader) {
            sectionHeader.appendChild(toggleButton);
        }
    }

    setupEventListeners() {
        const toggleBtn = document.querySelector('.layout-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleLayout());
        }

        // Auto-adjust layout based on screen size
        window.addEventListener('resize', () => this.handleResize());
    }

    setInitialLayout() {
        // Set layout based on screen size
        if (window.innerWidth < 1024) {
            this.setVerticalLayout();
        } else {
            this.setHorizontalLayout();
        }
    }

    toggleLayout() {
        if (this.currentLayout === 'horizontal') {
            this.setVerticalLayout();
        } else {
            this.setHorizontalLayout();
        }
    }

    setHorizontalLayout() {
        if (this.aboutContent) {
            this.aboutContent.classList.remove('vertical-layout');
            this.currentLayout = 'horizontal';
            this.updateToggleButton();
        }
    }

    setVerticalLayout() {
        if (this.aboutContent) {
            this.aboutContent.classList.add('vertical-layout');
            this.currentLayout = 'vertical';
            this.updateToggleButton();
        }
    }

    updateToggleButton() {
        const toggleBtn = document.querySelector('.layout-toggle-btn');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            const text = toggleBtn.querySelector('span');
            
            if (this.currentLayout === 'horizontal') {
                icon.className = 'fas fa-th-list';
                text.textContent = 'Vertical Layout';
            } else {
                icon.className = 'fas fa-th-large';
                text.textContent = 'Horizontal Layout';
            }
        }
    }

    handleResize() {
        // Auto-adjust layout for mobile devices
        if (window.innerWidth < 768) {
            this.setVerticalLayout();
        }
    }
}

// Initialize About Layout Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for components to load
    document.addEventListener('componentsLoaded', () => {
        new AboutLayoutManager();
    });
});
