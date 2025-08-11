import { Navigation } from '../../components/Navigation.js';

export default class MapsPage {
    constructor() {
        this.container = document.getElementById('app');
    }
    
    render() {
        this.container.innerHTML = '';
        
        // Add navigation
        const nav = new Navigation();
        this.container.appendChild(nav.render());
        
        // Create page content
        const pageContent = document.createElement('div');
        pageContent.className = 'page-container';
        pageContent.innerHTML = `
            <section class="maps-hero">
                <div class="container">
                    <div class="maps-hero-content">
                        <h1 class="fade-in">Isper Maps</h1>
                        <p class="subtitle fade-in">
                            AI-powered trip planner with vision technology
                        </p>
                        
                        <div class="app-preview fade-in">
                            <div class="video-demo">
                                <div class="demo-placeholder">
                                    <span>Demo Video Player</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="download-section fade-in">
                            <h3>Available on</h3>
                            <div class="download-buttons">
                                <a href="#" class="app-store-btn">
                                    <img src="/assets/app-store.svg" alt="Download on App Store">
                                </a>
                                <a href="#" class="play-store-btn">
                                    <img src="/assets/play-store.svg" alt="Get it on Google Play">
                                </a>
                            </div>
                            <p class="coming-soon">Web version coming soon</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="how-it-works-section">
                <div class="container">
                    <h2 class="text-center mb-4">How Isper Maps Works</h2>
                    <p class="section-subtitle text-center mb-5">
                        Your AI-powered trip planner that uses vision technology to transform your travel experience
                    </p>
                    <div class="grid grid-3">
                        <div class="feature-card fade-in">
                            <div class="feature-icon">🤖</div>
                            <h3>Vision AI Technology</h3>
                            <p>Our advanced AI analyzes videos and images to extract location data, landmarks, and points of interest automatically.</p>
                        </div>
                        <div class="feature-card fade-in" style="animation-delay: 0.1s">
                            <div class="feature-icon">📍</div>
                            <h3>Optimal Route Planning</h3>
                            <p>Get intelligent route suggestions that minimize travel time and maximize your experience at each destination.</p>
                        </div>
                        <div class="feature-card fade-in" style="animation-delay: 0.2s">
                            <div class="feature-icon">✨</div>
                            <h3>Personalized Travel</h3>
                            <p>Receive customized recommendations based on your preferences, travel style, and previous trips.</p>
                        </div>
                        <div class="feature-card fade-in" style="animation-delay: 0.3s">
                            <div class="feature-icon">💎</div>
                            <h3>Discover Hidden Gems</h3>
                            <p>Find off-the-beaten-path locations and local favorites that typical tourists miss.</p>
                        </div>
                        <div class="feature-card fade-in" style="animation-delay: 0.4s">
                            <div class="feature-icon">🗺️</div>
                            <h3>Smart Itinerary</h3>
                            <p>Automatically generate day-by-day itineraries that balance must-see attractions with relaxation time.</p>
                        </div>
                        <div class="feature-card fade-in" style="animation-delay: 0.5s">
                            <div class="feature-icon">🔄</div>
                            <h3>Real-time Updates</h3>
                            <p>Get live updates on traffic, weather, and venue hours to keep your trip running smoothly.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.container.appendChild(pageContent);
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .maps-hero {
                padding: var(--spacing-xl) 0;
                min-height: 80vh;
                display: flex;
                align-items: center;
            }
            
            .maps-hero-content {
                text-align: center;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .subtitle {
                font-size: 1.5rem;
                color: var(--text-gray);
                margin-bottom: var(--spacing-lg);
            }
            
            .app-preview {
                margin: var(--spacing-xl) 0;
            }
            
            .video-demo {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .demo-placeholder {
                aspect-ratio: 16/9;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-gray);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-gray);
                font-size: 1.25rem;
            }
            
            .download-section {
                margin-top: var(--spacing-xl);
            }
            
            .download-buttons {
                display: flex;
                gap: var(--spacing-md);
                justify-content: center;
                margin: var(--spacing-md) 0;
            }
            
            .app-store-btn,
            .play-store-btn {
                display: inline-block;
                height: 50px;
                transition: transform var(--transition-fast);
            }
            
            .app-store-btn:hover,
            .play-store-btn:hover {
                transform: scale(1.05);
            }
            
            .app-store-btn img,
            .play-store-btn img {
                height: 100%;
            }
            
            .coming-soon {
                color: var(--text-gray);
                font-size: 0.875rem;
                margin-top: var(--spacing-sm);
            }
            
            .how-it-works-section {
                padding: var(--spacing-xl) 0;
            }
            
            .section-subtitle {
                font-size: 1.25rem;
                color: var(--text-gray);
                max-width: 800px;
                margin: 0 auto;
            }
            
            .feature-icon {
                font-size: 3rem;
                margin-bottom: var(--spacing-sm);
            }
            
            .feature-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-gray);
                border-radius: 12px;
                padding: var(--spacing-md);
                transition: all var(--transition-normal);
            }
            
            .feature-card:hover {
                background: rgba(255, 255, 255, 0.04);
                transform: translateY(-2px);
            }
            
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        // Cleanup if needed
    }
}