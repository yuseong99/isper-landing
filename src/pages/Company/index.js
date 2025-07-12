import { Navigation } from '../../components/Navigation.js';

export default class CompanyPage {
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
            <section class="company-hero">
                <div class="container">
                    <h1 class="fade-in">Our Mission</h1>
                    <p class="lead fade-in">
                        Making location intelligence accessible through advanced computer vision
                    </p>
                </div>
            </section>
            
            <section class="mission-section">
                <div class="container">
                    <div class="mission-content">
                        <h2>Democratizing Geographic Intelligence</h2>
                        <p>
                            In an era where visual content dominates communication, valuable location 
                            information remains locked within videos. ISPER transforms this visual data 
                            into actionable geographic intelligence.
                        </p>
                        <p>
                            Our mission is to empower journalists, researchers, investigators, and 
                            content creators with tools that extract precise location data from any 
                            video source, enabling better storytelling, verification, and analysis.
                        </p>
                    </div>
                </div>
            </section>
            
            <section class="values-section">
                <div class="container">
                    <h2 class="text-center mb-4">Our Values</h2>
                    <div class="grid grid-3">
                        <div class="value-card fade-in">
                            <h3>Accuracy</h3>
                            <p>We prioritize precision in location extraction, continuously improving our AI models.</p>
                        </div>
                        <div class="value-card fade-in" style="animation-delay: 0.1s">
                            <h3>Privacy</h3>
                            <p>User data protection is paramount. We process securely and never share without consent.</p>
                        </div>
                        <div class="value-card fade-in" style="animation-delay: 0.2s">
                            <h3>Innovation</h3>
                            <p>Pushing boundaries in computer vision to solve real-world location challenges.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="team-section">
                <div class="container">
                    <h2 class="text-center mb-4">Leadership</h2>
                    <div class="grid grid-3">
                        <div class="team-member fade-in">
                            <div class="member-avatar"></div>
                            <h3>CEO</h3>
                            <p class="role">Chief Executive Officer</p>
                        </div>
                        <div class="team-member fade-in" style="animation-delay: 0.1s">
                            <div class="member-avatar"></div>
                            <h3>CTO</h3>
                            <p class="role">Chief Technology Officer</p>
                        </div>
                        <div class="team-member fade-in" style="animation-delay: 0.2s">
                            <div class="member-avatar"></div>
                            <h3>Head of AI</h3>
                            <p class="role">AI Research Lead</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="join-section">
                <div class="container text-center">
                    <h2>Join Our Mission</h2>
                    <p class="lead">
                        We're building the future of location intelligence.
                    </p>
                    <a href="/contact" class="btn btn-primary">Get in Touch</a>
                </div>
            </section>
        `;
        
        this.container.appendChild(pageContent);
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .company-hero {
                padding: var(--spacing-xl) 0;
                text-align: center;
            }
            
            .mission-section,
            .values-section,
            .team-section,
            .join-section {
                padding: var(--spacing-xl) 0;
            }
            
            .mission-content {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .mission-content h2 {
                margin-bottom: var(--spacing-md);
            }
            
            .mission-content p {
                font-size: 1.125rem;
                line-height: 1.8;
                margin-bottom: var(--spacing-md);
            }
            
            .value-card {
                text-align: center;
                padding: var(--spacing-lg);
            }
            
            .value-card h3 {
                margin-bottom: var(--spacing-sm);
            }
            
            .team-member {
                text-align: center;
                padding: var(--spacing-md);
            }
            
            .member-avatar {
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 50%;
                margin: 0 auto var(--spacing-md);
                border: 2px solid var(--border-gray);
            }
            
            .role {
                color: var(--text-gray);
                font-size: 0.875rem;
            }
            
            .join-section {
                background: rgba(255, 255, 255, 0.02);
                border-top: 1px solid var(--border-gray);
                border-bottom: 1px solid var(--border-gray);
            }
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        // Cleanup if needed
    }
}