// Main Application - Initializes and coordinates all managers
class App {
    constructor() {
        this.managers = {};
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForComponents());
        } else {
            this.waitForComponents();
        }
    }

    waitForComponents() {
        // Wait for components to be loaded before initializing managers
        document.addEventListener('componentsLoaded', () => {
            this.initializeManagers();
        });
        
        // Fallback timeout in case the event doesn't fire
        setTimeout(() => {
            if (!this.managers.navigation) {
                console.log('Fallback: Initializing managers after timeout');
                this.initializeManagers();
            }
        }, 3000);
    }

    initializeManagers() {
        try {
            // Initialize all managers
            this.managers.navigation = new NavigationManager();
            this.managers.skills = new SkillsManager();
            this.managers.repository = new RepositoryManager();
            this.managers.project = new ProjectManager();
            this.managers.contact = new ContactManager();

            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Initialize any additional features
            this.initializeFeatures();

            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize for responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 768) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('show');
                }
            }
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    initializeFeatures() {
        // Initialize any additional features
        this.initializeAnimations();
        this.initializeTheme();
        this.initializeAccessibility();
    }

    initializeAnimations() {
        // Add intersection observer for animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all animatable elements
            document.querySelectorAll('[data-aos]').forEach(el => {
                observer.observe(el);
            });
        }
    }

    initializeTheme() {
        // Handle theme switching if implemented
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);

            themeToggle.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    initializeAccessibility() {
        // Add keyboard navigation support
        document.querySelectorAll('.btn-primary, .btn-secondary, .filter-btn').forEach(button => {
            if (!button.hasAttribute('tabindex')) {
                button.setAttribute('tabindex', '0');
            }
        });

        // Add ARIA labels where needed
        const menuButton = document.getElementById('mobile-menu-button');
        if (menuButton && !menuButton.hasAttribute('aria-label')) {
            menuButton.setAttribute('aria-label', 'Toggle mobile menu');
        }
    }

    handleScroll() {
        // Handle scroll-based features
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class to navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Show/hide scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            if (scrollTop > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }

    handleKeyboardNavigation(e) {
        // Handle keyboard shortcuts
        if (e.key === 'Escape') {
            // Close mobile menu
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
            }
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external access
    getManager(name) {
        return this.managers[name];
    }

    // Method to reinitialize specific managers
    reinitializeManager(name) {
        if (this.managers[name] && typeof this.managers[name].init === 'function') {
            this.managers[name].init();
        }
    }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
if (typeof window !== 'undefined') {
    window.app = app;
}
