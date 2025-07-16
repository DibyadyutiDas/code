// Project Manager - Handles project data and display
class ProjectManager {
    constructor() {
        this.projects = [];
        this.init();
    }

    async init() {
        console.log('ProjectManager: Initializing...');
        await this.loadProjects();
        this.renderProjects();
        console.log('ProjectManager: Initialization complete');
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            this.projects = await response.json();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showProjectsError();
        }
    }

    renderProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container) {
            console.warn('Projects container not found - component may not be loaded yet');
            return;
        }

        if (this.projects.length === 0) {
            this.showEmptyProjects();
            return;
        }

        container.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
        this.addFadeInAnimation();
    }

    createProjectCard(project) {
        const tagsHtml = project.tags ? project.tags.map(tag => 
            `<span class="project-tag">${tag}</span>`
        ).join('') : '';

        return `
            <div class="project-card" data-aos="fade-up">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${project.icon || 'fas fa-project-diagram'}"></i>
                    </div>
                    <h3>${project.name}</h3>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                ${project.tags ? `
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                ` : ''}
                
                ${project.stars !== undefined || project.language ? `
                    <div class="project-stats">
                        ${project.stars !== undefined ? `
                            <div class="project-stat">
                                <i class="fas fa-star"></i>
                                <span>${project.stars}</span>
                            </div>
                        ` : ''}
                        ${project.language ? `
                            <div class="project-stat">
                                <i class="fas fa-code"></i>
                                <span>${project.language}</span>
                            </div>
                        ` : ''}
                        ${project.last_updated ? `
                            <div class="project-updated">
                                Updated ${this.formatDate(project.last_updated)}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="project-actions">
                    <a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        View Project
                    </a>
                </div>
            </div>
        `;
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
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    showProjectsError() {
        const container = document.querySelector('.projects-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <div class="state-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error Loading Projects</h3>
                <p class="state-message">Unable to load project data. Please try again later.</p>
            </div>
        `;
    }

    showEmptyProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-state">
                <div class="state-icon">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h3>No Projects Found</h3>
                <p class="state-message">No projects are currently available.</p>
            </div>
        `;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectManager;
}
