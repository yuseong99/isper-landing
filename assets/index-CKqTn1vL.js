import{N as r}from"./Navigation-D57C2keV.js";class s{constructor(){this.container=document.getElementById("app"),this.newsItems=[{date:"2024-01-15",category:"Product",title:"Web version ISPER Maps",excerpt:"web version fweiofwoefnowinaf.",link:"#"},{date:"2023-12-01",category:"Funding",title:"News 1",excerpt:"Led by Accel Partners, this funding will accelerate our mission to make location discovery seamless across all video content.",link:"#"},{date:"2023-10-20",category:"Partnership",title:"News 2",excerpt:"CNN, BBC, and Reuters adopt ISPER for real-time video verification and location extraction in breaking news coverage.",link:"#"},{date:"2023-09-05",category:"Product",title:"News 3",excerpt:"Process live streams and extract locations in real-time with our new streaming API, perfect for live events and breaking news.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"},{date:"2023-07-12",category:"Company",title:"News 4",excerpt:"Expanding our presence in Europe with a new office in London to better serve our growing international customer base.",link:"#"}]}render(){this.container.innerHTML="";const e=new r;this.container.appendChild(e.render());const t=document.createElement("div");t.className="page-container",t.innerHTML=`
            <section class="news-hero">
                <div class="news-sphere"></div>
                <div class="container">
                    <div class="news-header">
                        <h1 class="news-title fade-in">News</h1>
                    </div>
                </div>
            </section>
            
            <section class="news-content">
                <div class="container">
                    ${this.newsItems.length>0?`
                        <div class="recent-news">
                            ${this.renderRecentNews(this.newsItems[0])}
                        </div>
                    `:""}
                    
                    ${this.newsItems.length>1?`
                        <div class="older-news-section">
                            <div class="older-news-grid">
                                ${this.renderOlderNews(this.newsItems.slice(1))}
                            </div>
                        </div>
                    `:""}
                </div>
            </section>
        `,this.container.appendChild(t),this.addStyles(),this.setupFilters()}renderRecentNews(e){return`
            <article class="news-item recent fade-in" data-category="${e.category.toLowerCase()}">
                <a href="${e.link}" class="news-link">
                    <div class="news-date">${this.formatDate(e.date)}</div>
                    <h2 class="news-item-title">${e.title}</h2>
                    <p class="news-excerpt">${e.excerpt}</p>
                    <div class="news-read-more">
                        <span>Read more</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </a>
            </article>
        `}renderOlderNews(e){return e.map((t,n)=>`
            <article class="news-item older fade-in" style="animation-delay: ${(n+1)*.1}s" data-category="${t.category.toLowerCase()}">
                <a href="${t.link}" class="news-link">
                    <div class="news-date">${this.formatDate(t.date)}</div>
                    <h3 class="news-item-title">${t.title}</h3>
                    <p class="news-excerpt">${t.excerpt}</p>
                    <div class="news-read-more">
                        <span>Read more</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </a>
            </article>
        `).join("")}formatDate(e){return new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}setupFilters(){}addStyles(){const e=document.createElement("style");e.textContent=`
            .news-hero {
                padding: calc(var(--spacing-xl) * 2) 0 var(--spacing-xl);
                border-bottom: 1px solid var(--border-gray);
                background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.05), transparent 50%);
                position: relative;
                overflow: hidden;
            }
            
            .news-sphere {
                position: absolute;
                top: -20%;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                height: 800px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
                border-radius: 50%;
                filter: blur(40px);
            }
            
            .news-header {
                max-width: 1200px;
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }
            
            .news-title {
                font-size: clamp(2.5rem, 5vw, 3.5rem);
                font-weight: 700;
                letter-spacing: -0.02em;
                margin: 0;
            }
            
            .news-content {
                padding: var(--spacing-xl) 0;
                min-height: 60vh;
            }
            
            .recent-news {
                max-width: 800px;
            }
            
            .older-news-section {
                margin-top: 0;
                padding-top: var(--spacing-xl);
                border-top: 1px solid var(--border-gray);
            }
            
            .older-news-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--spacing-lg);
            }
            
            .news-item {
                transition: all var(--transition-normal);
            }
            
            .news-item.recent {
                padding: 0;
                padding-bottom: var(--spacing-lg);
            }
            
            .news-item.older {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-gray);
                border-radius: 12px;
                padding: var(--spacing-lg);
            }
            
            .news-item.older:hover {
                background: rgba(255, 255, 255, 0.04);
                transform: translateY(-2px);
            }
            
            .news-link {
                display: block;
                text-decoration: none;
                color: inherit;
                position: relative;
            }
            
            .news-date {
                font-size: 0.875rem;
                color: var(--text-gray);
                margin-bottom: var(--spacing-xs);
                font-weight: 500;
            }
            
            .news-item-title {
                font-weight: 600;
                color: var(--primary-white);
                margin: 0 0 var(--spacing-sm) 0;
                line-height: 1.3;
                transition: color var(--transition-fast);
            }
            
            .recent .news-item-title {
                font-size: 1.75rem;
            }
            
            .older .news-item-title {
                font-size: 1.25rem;
            }
            
            .news-excerpt {
                color: var(--text-gray);
                line-height: 1.6;
                margin: 0 0 var(--spacing-sm) 0;
            }
            
            .recent .news-excerpt {
                font-size: 1.125rem;
            }
            
            .older .news-excerpt {
                font-size: 1rem;
            }
            
            .news-read-more {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9375rem;
                font-weight: 500;
                color: var(--text-gray);
                transition: color var(--transition-fast);
            }
            
            .news-read-more svg {
                transition: transform var(--transition-fast);
            }
            
            .news-item:hover .news-item-title {
                color: #E0E0E0;
            }
            
            .news-item:hover .news-read-more {
                color: var(--primary-white);
            }
            
            .news-item:hover .news-read-more svg {
                transform: translate(2px, -2px);
            }
            
            @media (max-width: 1024px) {
                .older-news-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .news-hero {
                    padding: var(--spacing-xl) 0 var(--spacing-md);
                }
                
                .news-title {
                    font-size: 2rem;
                }
                
                
                .recent .news-item-title {
                    font-size: 1.5rem;
                }
                
                .older .news-item-title {
                    font-size: 1.125rem;
                }
                
                .recent .news-excerpt {
                    font-size: 1rem;
                }
                
                .older .news-excerpt {
                    font-size: 0.9375rem;
                }
                
                .news-item.recent {
                    padding: var(--spacing-md) 0;
                }
                
                .older-news-grid {
                    grid-template-columns: 1fr;
                }
            }
        `,document.head.appendChild(e)}destroy(){}}export{s as default};
//# sourceMappingURL=index-CKqTn1vL.js.map
