// Legacy script.js - This file is being replaced by modular JavaScript architecture
// The functionality has been moved to separate manager files in the js/ folder

console.warn('script.js is deprecated. Please include the new modular JavaScript files:');
console.warn('- js/navigation-manager.js');
console.warn('- js/skills-manager.js');
console.warn('- js/repository-manager.js');
console.warn('- js/project-manager.js');
console.warn('- js/contact-manager.js');
console.warn('- js/app.js');

// Temporary fallback initialization for backward compatibility
document.addEventListener('DOMContentLoaded', function() {
    console.log('Legacy script.js loaded - consider updating to use modular architecture');
});