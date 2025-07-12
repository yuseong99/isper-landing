export class Router {
    constructor() {
        this.routes = {
            '/': () => import('./pages/Isper/index.js'),
            '/isper': () => import('./pages/Isper/index.js'),
            '/maps': () => import('./pages/Maps/index.js'),
            '/company': () => import('./pages/Company/index.js'),
            '/news': () => import('./pages/News/index.js'),
            '/contact': () => import('./pages/Contact/index.js')
        };
        
        this.currentPage = null;
        this.init();
    }
    
    init() {
        // Handle initial route
        this.handleRoute();
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
    }
    
    async handleRoute() {
        const path = window.location.pathname;
        const routeHandler = this.routes[path] || this.routes['/'];
        
        try {
            const module = await routeHandler();
            const Page = module.default;
            
            // Clean up previous page
            if (this.currentPage && this.currentPage.destroy) {
                this.currentPage.destroy();
            }
            
            // Initialize new page
            this.currentPage = new Page();
            this.currentPage.render();
        } catch (error) {
            console.error('Route loading error:', error);
        }
    }
    
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
}