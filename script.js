// Repository data and functionality
class RepositoryManager {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadRepositories();
        this.setupEventListeners();
        this.renderRepositories();
        this.updateActiveNavLink();
    }

    async loadRepositories() {
        try {
            const response = await fetch('repos.json');
            this.repositories = await response.json();
            this.filteredRepositories = [...this.repositories];
            this.hideLoading();
        } catch (error) {
            console.error('Error loading repositories:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton?.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveFilter(e.target);
                this.filterRepositories(filter);
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.navbar-mobile .navbar-link').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('mobile-menu').classList.remove('show');
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.debounce(() => {
            this.updateActiveNavLink();
        }, 100));

        // Handle contact form submission
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! I\'ll get back to you soon.');
        e.target.reset();
    }

    setActiveFilter(activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    filterRepositories(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredRepositories = [...this.repositories];
        } else {
            this.filteredRepositories = this.repositories.filter(repo => 
                repo.language === filter || repo.tags.includes(filter)
            );
        }
        
        this.renderRepositories();
    }

    renderRepositories() {
        const grid = document.getElementById('repo-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (this.filteredRepositories.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        grid.innerHTML = this.filteredRepositories.map(repo => this.createRepositoryCard(repo)).join('');
        
        // Add animation to cards
        this.animateCards();
    }

    createRepositoryCard(repo) {
        const languageColors = {
            'C': 'var(--color-c)',
            'C++': 'var(--color-cpp)',
            'Java': 'var(--color-java)',
            'Python': 'var(--color-python)',
            'JavaScript': 'var(--color-javascript)'
        };

        const languageColor = languageColors[repo.language] || 'var(--color-secondary)';
        const formattedDate = new Date(repo.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="repo-card fade-in-up">
                <!-- Card Header -->
                <div class="repo-card-header">
                    <div class="repo-icon">
                        <i class="fas fa-code" style="color: ${languageColor}"></i>
                    </div>
                    <div class="repo-info">
                        <h3>${repo.name}</h3>
                        <div class="repo-language">
                            <span class="language-dot" style="background-color: ${languageColor}"></span>
                            <span>${repo.language}</span>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <p class="repo-description">${repo.description}</p>

                <!-- Tags -->
                <div class="repo-tags">
                    ${repo.tags.slice(0, 3).map(tag => `
                        <span class="repo-tag">${tag}</span>
                    `).join('')}
                    ${repo.tags.length > 3 ? `<span class="repo-tag">+${repo.tags.length - 3}</span>` : ''}
                </div>

                <!-- Stats -->
                <div class="repo-stats">
                    <div class="repo-stats-left">
                        <div class="repo-stat">
                            <i class="fas fa-star" style="color: #fbbf24"></i>
                            <span>${repo.stars}</span>
                        </div>
                        <div class="repo-stat">
                            <i class="fas fa-code-branch" style="color: #60a5fa"></i>
                            <span>${repo.forks}</span>
                        </div>
                    </div>
                    <span class="repo-updated">Updated ${formattedDate}</span>
                </div>

                <!-- Action Button -->
                <a href="${repo.link}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="repo-link">
                    <i class="fab fa-github"></i>
                    View Repository
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        `;
    }

    animateCards() {
        const cards = document.querySelectorAll('.repo-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
    }

    showError() {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div class="empty-state">
                <div class="state-icon" style="background-color: #fef2f2; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p class="state-message">Failed to load repositories. Please try again later.</p>
            </div>
        `;
    }

    // Utility method for debouncing
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new RepositoryManager();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', (() => {
    let timeout;
    return function executedFunction() {
        const later = () => {
            clearTimeout(timeout);
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 768) {
                document.getElementById('mobile-menu').classList.remove('show');
            }
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, 250);
    };
})());