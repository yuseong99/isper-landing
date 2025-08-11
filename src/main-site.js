import { Router } from './router.js';
import './styles/xai-style.css';

class IsperSite {
    constructor() {
        this.router = null;
        this.init();
    }
    
    init() {
        // Create app container
        if (!document.getElementById('app')) {
            const app = document.createElement('div');
            app.id = 'app';
            document.body.appendChild(app);
        }
        
        // Initialize router
        this.router = new Router();
        
        // Setup smooth scrolling
        this.setupSmoothScroll();
    }
    
    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new IsperSite());
} else {
    new IsperSite();
}