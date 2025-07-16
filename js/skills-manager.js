// Skills Manager - Handles skills data and display
class SkillsManager {
    constructor() {
        this.skills = [];
        this.init();
    }

    async init() {
        console.log('SkillsManager: Initializing...');
        await this.loadSkills();
        this.renderSkills();
        console.log('SkillsManager: Initialization complete');
    }

    async loadSkills() {
        try {
            console.log('SkillsManager: Loading skills data...');
            const response = await fetch('data/skills.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.skills = await response.json();
            console.log('SkillsManager: Loaded', this.skills.length, 'skills');
        } catch (error) {
            console.error('SkillsManager: Error loading skills:', error);
            this.showSkillsError();
        }
    }

    renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        if (this.skills.length === 0) {
            this.showEmptySkills();
            return;
        }

        container.innerHTML = this.skills.map(skill => this.createSkillCard(skill)).join('');
        this.addFadeInAnimation();
    }

    createSkillCard(skill) {
        return `
            <div class="skill-item" data-aos="fade-up">
                <div class="skill-icon" style="color: ${skill.color}">
                    <i class="${skill.icon}"></i>
                </div>
                <h4>${skill.title}</h4>
                <p>${skill.description}</p>
            </div>
        `;
    }

    addFadeInAnimation() {
        const cards = document.querySelectorAll('.skill-item');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    showSkillsError() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        container.innerHTML = `
            <div class="skill-item error-state">
                <div class="skill-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h4>Error Loading Skills</h4>
                <p>Unable to load skills data. Please try again later.</p>
            </div>
        `;
    }

    showEmptySkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        container.innerHTML = `
            <div class="skill-item empty-state">
                <div class="skill-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <h4>No Skills Found</h4>
                <p>No skills data is currently available.</p>
            </div>
        `;
    }

    // Method to add a new skill dynamically
    addSkill(skillData) {
        this.skills.push(skillData);
        this.renderSkills();
    }

    // Method to remove a skill by ID
    removeSkill(skillId) {
        this.skills = this.skills.filter(skill => skill.id !== skillId);
        this.renderSkills();
    }

    // Method to update a skill
    updateSkill(skillId, updatedData) {
        const index = this.skills.findIndex(skill => skill.id === skillId);
        if (index !== -1) {
            this.skills[index] = { ...this.skills[index], ...updatedData };
            this.renderSkills();
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsManager;
}
