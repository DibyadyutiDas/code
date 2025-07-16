# JavaScript Modular Architecture

This project has been refactored to use a modular JavaScript architecture for better maintainability and organization.

## File Structure

### Manager Classes (js/ folder)

- **NavigationManager** (`js/navigation-manager.js`)
  - Handles mobile menu toggling
  - Manages smooth scrolling navigation
  - Updates active navigation links on scroll

- **SkillsManager** (`js/skills-manager.js`)
  - Loads skills data from `data/skills.json`
  - Renders skills with icons and descriptions
  - Handles skills display and animations

- **RepositoryManager** (`js/repository-manager.js`)
  - Loads repository data from `data/repos.json`
  - Implements filtering by programming language
  - Renders repository cards with GitHub stats
  - Manages repository display animations

- **ProjectManager** (`js/project-manager.js`)
  - Loads project data from `data/projects.json`
  - Renders featured project cards
  - Handles project display and interactions

- **ContactManager** (`js/contact-manager.js`)
  - Handles contact form validation
  - Manages form submission
  - Provides real-time validation feedback
  - Shows success/error notifications

- **App** (`js/app.js`)
  - Main application coordinator
  - Initializes all manager classes
  - Handles global events and utilities
  - Provides centralized application management

### Data Files (data/ folder)

- `data/skills.json` - Skills and technologies data
- `data/repos.json` - GitHub repository information
- `data/projects.json` - Project portfolio data

## Usage

The application automatically initializes when the DOM is loaded. All managers are instantiated and coordinated through the main App class.

```javascript
// Access the global app instance
window.app

// Get specific managers
const repoManager = app.getManager('repository');
const skillsManager = app.getManager('skills');
```

## Features

- ✅ Modular architecture with separation of concerns
- ✅ Automatic manager initialization and coordination
- ✅ Global error handling and debugging support
- ✅ Responsive design with mobile menu support
- ✅ Real-time form validation
- ✅ Smooth animations and transitions
- ✅ Theme switching capability (when implemented)
- ✅ Accessibility features and keyboard navigation
- ✅ Performance optimizations with debouncing/throttling

## Legacy Support

The old `script.js` file is maintained for backward compatibility but shows deprecation warnings. New development should use the modular architecture.

## Development

To extend functionality:

1. Create new manager classes following the existing pattern
2. Add them to the App class initialization
3. Update the HTML to include the new script files
4. Update this documentation

Each manager class should:
- Have an `init()` method for setup
- Handle its own error states
- Provide public methods for external interaction
- Follow the established naming conventions
