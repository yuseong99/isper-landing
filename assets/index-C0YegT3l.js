import{N as s}from"./Navigation-63QfzdoJ.js";class l{constructor(){this.container=document.getElementById("app"),this.newsItems=[{date:"2024-01-15",category:"Product",title:"ISPER Maps 2.0 Released",excerpt:"Major update brings 3x faster processing and improved accuracy for urban environments.",link:"#"},{date:"2023-12-01",category:"Funding",title:"Series A Funding Announcement",excerpt:"ISPER raises $15M to expand location intelligence capabilities and team.",link:"#"},{date:"2023-10-20",category:"Partnership",title:"Strategic Partnership with News Organizations",excerpt:"Leading media companies adopt ISPER for video verification workflows.",link:"#"}]}render(){this.container.innerHTML="";const e=new s;this.container.appendChild(e.render());const t=document.createElement("div");t.className="page-container",t.innerHTML=`
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
        `,this.container.appendChild(t),this.addStyles(),this.setupFilters()}renderNewsItems(){return this.newsItems.map((e,t)=>`
            <article class="news-item fade-in" style="animation-delay: ${t*.1}s" data-category="${e.category.toLowerCase()}">
                <div class="news-meta">
                    <span class="news-date">${this.formatDate(e.date)}</span>
                    <span class="news-category">${e.category}</span>
                </div>
                <h3>${e.title}</h3>
                <p>${e.excerpt}</p>
                <a href="${e.link}" class="read-more">Read more →</a>
            </article>
        `).join("")}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}setupFilters(){const e=this.container.querySelectorAll(".filter-btn"),t=this.container.querySelectorAll(".news-item");e.forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.filter;e.forEach(r=>r.classList.remove("active")),a.classList.add("active"),t.forEach(r=>{n==="all"||r.dataset.category===n?r.style.display="block":r.style.display="none"})})})}addStyles(){const e=document.createElement("style");e.textContent=`
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
        `,document.head.appendChild(e)}destroy(){}}export{l as default};
//# sourceMappingURL=index-C0YegT3l.js.map
