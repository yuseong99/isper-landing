import { Navigation } from '../../components/Navigation.js';

export default class NewsPage {
    constructor() {
        this.container = document.getElementById('app');
        this.newsItems = [
            {
                date: '2024-01-15',
                category: 'Product',
                title: 'ISPER Maps 2.0 Released',
                excerpt: 'Major update brings 3x faster processing and improved accuracy for urban environments.',
                link: '#'
            },
            {
                date: '2023-12-01',
                category: 'Funding',
                title: 'Series A Funding Announcement',
                excerpt: 'ISPER raises $15M to expand location intelligence capabilities and team.',
                link: '#'
            },
            {
                date: '2023-10-20',
                category: 'Partnership',
                title: 'Strategic Partnership with News Organizations',
                excerpt: 'Leading media companies adopt ISPER for video verification workflows.',
                link: '#'
            }
        ];
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
            <section class="news-hero">
                <div class="container">
                    <h1 class="fade-in">News & Updates</h1>
                    <p class="subtitle fade-in">
                        Latest developments from ISPER
                    </p>
                </div>
            </section>
            
            <section class="news-filters">
                <div class="container">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="product">Product</button>
                        <button class="filter-btn" data-filter="funding">Funding</button>
                        <button class="filter-btn" data-filter="partnership">Partnership</button>
                    </div>
                </div>
            </section>
            
            <section class="news-grid">
                <div class="container">
                    <div class="news-list">
                        ${this.renderNewsItems()}
                    </div>
                </div>
            </section>
            
            <section class="newsletter-section">
                <div class="container">
                    <div class="newsletter-box">
                        <h2>Stay Updated</h2>
                        <p>Get the latest ISPER news delivered to your inbox.</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Enter your email" required>
                            <button type="submit" class="btn btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>
        `;
        
        this.container.appendChild(pageContent);
        this.addStyles();
        this.setupFilters();
    }
    
    renderNewsItems() {
        return this.newsItems.map((item, index) => `
            <article class="news-item fade-in" style="animation-delay: ${index * 0.1}s" data-category="${item.category.toLowerCase()}">
                <div class="news-meta">
                    <span class="news-date">${this.formatDate(item.date)}</span>
                    <span class="news-category">${item.category}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.excerpt}</p>
                <a href="${item.link}" class="read-more">Read more →</a>
            </article>
        `).join('');
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    setupFilters() {
        const filterButtons = this.container.querySelectorAll('.filter-btn');
        const newsItems = this.container.querySelectorAll('.news-item');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items
                newsItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .news-hero {
                padding: var(--spacing-xl) 0;
                text-align: center;
            }
            
            .subtitle {
                font-size: 1.25rem;
                color: var(--text-gray);
            }
            
            .news-filters {
                padding: var(--spacing-md) 0;
                border-bottom: 1px solid var(--border-gray);
            }
            
            .filter-buttons {
                display: flex;
                gap: var(--spacing-sm);
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 8px 16px;
                background: transparent;
                border: 1px solid var(--border-gray);
                color: var(--text-gray);
                border-radius: 20px;
                cursor: pointer;
                transition: all var(--transition-fast);
                font-size: 0.875rem;
            }
            
            .filter-btn:hover {
                border-color: var(--primary-white);
                color: var(--primary-white);
            }
            
            .filter-btn.active {
                background: var(--primary-white);
                color: var(--primary-black);
                border-color: var(--primary-white);
            }
            
            .news-grid {
                padding: var(--spacing-xl) 0;
            }
            
            .news-list {
                display: grid;
                gap: var(--spacing-lg);
            }
            
            .news-item {
                padding: var(--spacing-lg);
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-gray);
                border-radius: 12px;
                transition: all var(--transition-normal);
            }
            
            .news-item:hover {
                background: rgba(255, 255, 255, 0.04);
                transform: translateY(-2px);
            }
            
            .news-meta {
                display: flex;
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-sm);
                font-size: 0.875rem;
                color: var(--text-gray);
            }
            
            .news-category {
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .news-item h3 {
                margin-bottom: var(--spacing-sm);
            }
            
            .news-item p {
                margin-bottom: var(--spacing-sm);
            }
            
            .read-more {
                color: var(--accent-blue);
                text-decoration: none;
                font-weight: 500;
                transition: opacity var(--transition-fast);
            }
            
            .read-more:hover {
                opacity: 0.8;
            }
            
            .newsletter-section {
                padding: var(--spacing-xl) 0;
                background: rgba(255, 255, 255, 0.02);
                border-top: 1px solid var(--border-gray);
            }
            
            .newsletter-box {
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
            }
            
            .newsletter-form {
                display: flex;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-md);
            }
            
            .newsletter-form input {
                flex: 1;
                padding: 12px 20px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-gray);
                border-radius: 6px;
                color: var(--primary-white);
                font-size: 1rem;
            }
            
            .newsletter-form input::placeholder {
                color: var(--text-gray);
            }
            
            .newsletter-form input:focus {
                outline: none;
                border-color: var(--primary-white);
                background: rgba(255, 255, 255, 0.08);
            }
            
            @media (max-width: 480px) {
                .newsletter-form {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        // Cleanup if needed
    }
}