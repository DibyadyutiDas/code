// Repository Manager - Handles GitHub repository data
class RepositoryManager {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        console.log('RepositoryManager: Initializing...');
        await this.loadRepositories();
        this.setupEventListeners();
        this.renderRepositories();
        console.log('RepositoryManager: Initialization complete');
    }

    async loadRepositories() {
        try {
            console.log('RepositoryManager: Loading repository data...');
            const response = await fetch('data/repos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.repositories = await response.json();
            this.filteredRepositories = [...this.repositories];
            console.log('RepositoryManager: Loaded', this.repositories.length, 'repositories');
            this.hideLoading();
        } catch (error) {
            console.error('RepositoryManager: Error loading repositories:', error);
            this.showError();
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.dataset.filter;
                this.filterRepositories(filter);
                this.updateFilterButtons(btn);
            });
        });
    }

    filterRepositories(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredRepositories = [...this.repositories];
        } else {
            this.filteredRepositories = this.repositories.filter(repo => 
                repo.language && repo.language.toLowerCase() === filter.toLowerCase()
            );
        }
        
        this.renderRepositories();
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    renderRepositories() {
        const container = document.getElementById('repo-grid');
        if (!container) {
            console.warn('Repository container not found - component may not be loaded yet');
            return;
        }

        // Hide loading state and empty state
        this.hideLoading();
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'none';

        if (this.filteredRepositories.length === 0) {
            this.showEmptyState();
            return;
        }

        container.innerHTML = this.filteredRepositories.map(repo => this.createRepoCard(repo)).join('');
        this.addFadeInAnimation();
        console.log('RepositoryManager: Rendered', this.filteredRepositories.length, 'repositories');
    }

    createRepoCard(repo) {
        const languageColor = this.getLanguageColor(repo.language);
        const lastUpdated = this.formatDate(repo.updated_at);
        
        return `
            <div class="repo-card" data-aos="fade-up">
                <div class="repo-card-header">
                    <div class="repo-icon">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="repo-info">
                        <h3>${repo.name}</h3>
                        ${repo.language ? `
                            <div class="repo-language">
                                <span class="language-dot" style="background-color: ${languageColor}"></span>
                                <span>${repo.language}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <p class="repo-description">${repo.description || 'No description available'}</p>
                
                <div class="repo-stats">
                    <div class="repo-stats-left">
                        <div class="repo-stat">
                            <i class="fas fa-star"></i>
                            <span>${repo.stargazers_count}</span>
                        </div>
                        <div class="repo-stat">
                            <i class="fas fa-code-branch"></i>
                            <span>${repo.forks_count}</span>
                        </div>
                    </div>
                    <div class="repo-updated">Updated ${lastUpdated}</div>
                </div>
                
                <div class="repo-actions">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <i class="fab fa-github"></i>
                        View Repository
                    </a>
                </div>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f7df1e',
            'Python': '#3776ab',
            'Java': '#ed8b00',
            'C++': '#f34b7d',
            'C': '#a8b9cc',
            'HTML': '#e34c26',
            'CSS': '#1572b6'
        };
        return colors[language] || '#6c757d';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    }

    addFadeInAnimation() {
        const cards = document.querySelectorAll('.repo-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
            console.log('RepositoryManager: Loading state hidden');
        }
    }

    showError() {
        const container = document.getElementById('repo-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <div class="state-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error Loading Repositories</h3>
                <p class="state-message">Unable to load repository data. Please try again later.</p>
            </div>
        `;
    }

    showEmptyState() {
        const container = document.getElementById('repo-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (container) container.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.classList.remove('hidden');
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RepositoryManager;
}
