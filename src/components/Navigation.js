export class Navigation {
    constructor() {
        this.element = null;
        this.init();
    }
    
    init() {
        this.element = document.createElement('nav');
        this.element.className = 'main-nav';
        this.element.innerHTML = `
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <img src="/assets/group-107.svg" alt="ISPER" class="logo-img">
                </a>
                
                <div class="nav-links">
                    <a href="/isper" class="nav-link">Isper</a>
                    <a href="/maps" class="nav-link">Maps</a>
                    <a href="/company" class="nav-link">Company</a>
                    <a href="/news" class="nav-link">News</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
                
                <div class="nav-mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.setupMobileToggle();
        this.updateActiveLink();
    }
    
    setupMobileToggle() {
        const toggle = this.element.querySelector('.nav-mobile-toggle');
        const links = this.element.querySelector('.nav-links');
        const navLinks = this.element.querySelectorAll('.nav-link');
        
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
    
    updateActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.element.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    render() {
        return this.element;
    }
}