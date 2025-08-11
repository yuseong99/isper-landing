export class DockBar {
    constructor() {
        this.element = null;
        this.isExpanded = false;
    }
    
    render() {
        this.element = document.createElement('div');
        this.element.className = 'dock-bar';
        this.element.innerHTML = `
            <div class="dock-container">
                <button class="dock-toggle" aria-label="Toggle dock">
                    <img src="/assets/dock-icon.svg" alt="Menu" class="dock-icon">
                </button>
                <div class="dock-menu">
                    <a href="/isper-site.html#/" class="dock-item" data-tooltip="Home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </a>
                    <a href="/isper-site.html#/maps" class="dock-item" data-tooltip="Maps">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </a>
                    <a href="/isper-site.html#/company" class="dock-item" data-tooltip="Company">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </a>
                    <a href="/isper-site.html#/news" class="dock-item" data-tooltip="News">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                            <path d="M18 14h-8"></path>
                            <path d="M15 18h-5"></path>
                            <path d="M10 6h8v4h-8V6Z"></path>
                        </svg>
                    </a>
                    <a href="/isper-site.html#/contact" class="dock-item" data-tooltip="Contact">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `;
        
        this.attachEvents();
        this.addStyles();
        
        return this.element;
    }
    
    attachEvents() {
        const toggle = this.element.querySelector('.dock-toggle');
        const dockBar = this.element;
        
        toggle.addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            dockBar.classList.toggle('expanded', this.isExpanded);
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dockBar.contains(e.target) && this.isExpanded) {
                this.isExpanded = false;
                dockBar.classList.remove('expanded');
            }
        });
        
        // Handle route changes
        window.addEventListener('hashchange', () => {
            this.updateActiveItem();
        });
        
        this.updateActiveItem();
    }
    
    updateActiveItem() {
        const currentPath = window.location.hash || '#/';
        const items = this.element.querySelectorAll('.dock-item');
        
        items.forEach(item => {
            const href = item.getAttribute('href');
            const itemPath = href.split('#')[1];
            item.classList.toggle('active', currentPath === itemPath);
        });
    }
    
    addStyles() {
        if (document.getElementById('dock-bar-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'dock-bar-styles';
        style.textContent = `
            .dock-bar {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
            }
            
            .dock-container {
                position: relative;
            }
            
            .dock-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .dock-toggle:hover {
                transform: scale(1.05);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .dock-icon {
                width: 28px;
                height: 28px;
                transition: transform 0.3s ease;
            }
            
            .dock-bar.expanded .dock-icon {
                transform: rotate(45deg);
            }
            
            .dock-menu {
                position: absolute;
                bottom: 75px;
                right: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }
            
            .dock-bar.expanded .dock-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .dock-item {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(255, 255, 255, 0.6);
                transition: all 0.3s ease;
                position: relative;
                text-decoration: none;
            }
            
            .dock-item:hover {
                color: rgba(255, 255, 255, 1);
                transform: translateX(-5px);
                border-color: rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
            }
            
            .dock-item.active {
                color: var(--accent-blue);
                border-color: var(--accent-blue);
            }
            
            .dock-item svg {
                width: 20px;
                height: 20px;
            }
            
            /* Tooltip */
            .dock-item::before {
                content: attr(data-tooltip);
                position: absolute;
                right: 58px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
                pointer-events: none;
            }
            
            .dock-item::after {
                content: '';
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%);
                border: 6px solid transparent;
                border-left-color: rgba(0, 0, 0, 0.9);
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
            }
            
            .dock-item:hover::before,
            .dock-item:hover::after {
                opacity: 1;
                visibility: visible;
            }
            
            /* Entrance animation */
            @keyframes dockEntrance {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .dock-bar {
                animation: dockEntrance 0.5s ease forwards;
            }
            
            /* Mobile adjustments */
            @media (max-width: 768px) {
                .dock-bar {
                    bottom: 1rem;
                    right: 1rem;
                }
                
                .dock-toggle {
                    width: 54px;
                    height: 54px;
                }
                
                .dock-icon {
                    width: 24px;
                    height: 24px;
                }
                
                .dock-item {
                    width: 44px;
                    height: 44px;
                }
                
                .dock-item::before,
                .dock-item::after {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}