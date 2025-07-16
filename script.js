// Repository and Project Manager - Connects to real GitHub data
class RepositoryManager {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await Promise.all([
            this.loadRepositories(),
            this.loadProjects()
        ]);
        this.setupEventListeners();
        this.renderRepositories();
        this.renderProjects();
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

    async loadProjects() {
        try {
            const response = await fetch('projects.json');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
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

        // Add form validation
        this.setupFormValidation();
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
        
        // Validate form data
        if (!this.validateContactForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success message
            this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            e.target.reset();
        }, 2000);
        
        console.log('Contact form submitted:', data);
    }

    validateContactForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject || data.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join('. '), 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.type) {
            case 'text':
                if (field.name === 'name' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (field.name === 'subject' && value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters long';
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.75rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
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
                repo.language === filter
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
            'C': '#555555',
            'C++': '#f34b7d',
            'Java': '#b07219',
            'Python': '#3572A5',
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Shell': '#89e051'
        };

        const languageColor = languageColors[repo.language] || '#64748b';
        const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Handle empty or null homepage
        const homepageLink = repo.homepage && repo.homepage !== "" ? 
            `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="repo-demo-link">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : '';

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
                            <span>${repo.language || 'No language'}</span>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <p class="repo-description">${repo.description || 'No description available'}</p>

                <!-- Stats -->
                <div class="repo-stats">
                    <div class="repo-stats-left">
                        <div class="repo-stat">
                            <i class="fas fa-star" style="color: #fbbf24"></i>
                            <span>${repo.stargazers_count}</span>
                        </div>
                        <div class="repo-stat">
                            <i class="fas fa-code-branch" style="color: #60a5fa"></i>
                            <span>${repo.forks_count}</span>
                        </div>
                        <div class="repo-stat">
                            <i class="fas fa-eye" style="color: #8b5cf6"></i>
                            <span>${repo.watchers_count}</span>
                        </div>
                    </div>
                    <span class="repo-updated">Updated ${formattedDate}</span>
                </div>

                <!-- Action Buttons -->
                <div class="repo-actions">
                    <a href="${repo.html_url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="repo-link">
                        <i class="fab fa-github"></i>
                        View Repository
                    </a>
                    ${homepageLink}
                </div>
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

    renderProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || !this.projects.length) return;

        const featuredProjects = this.projects.filter(project => project.featured);
        
        projectsGrid.innerHTML = featuredProjects.map(project => this.createProjectCard(project)).join('');
        
        // Add animation to project cards
        this.animateProjectCards();
    }

    createProjectCard(project) {
        const formattedDate = new Date(project.last_updated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="project-card fade-in-up">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${project.icon}"></i>
                    </div>
                    <h3>${project.name}</h3>
                </div>
                <p class="project-description">
                    ${project.description}
                </p>
                <div class="project-tags">
                    ${project.tags.map(tag => `
                        <span class="project-tag">${tag}</span>
                    `).join('')}
                </div>
                <div class="project-stats">
                    <div class="project-stat">
                        <i class="fas fa-star" style="color: #fbbf24"></i>
                        <span>${project.stars}</span>
                    </div>
                    <div class="project-stat">
                        <i class="fas fa-code-branch" style="color: #60a5fa"></i>
                        <span>${project.language}</span>
                    </div>
                    <span class="project-updated">Updated ${formattedDate}</span>
                </div>
                <div class="project-actions">
                    <a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                        <i class="fab fa-github"></i>
                        View Repository
                    </a>
                </div>
            </div>
        `;
    }

    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
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