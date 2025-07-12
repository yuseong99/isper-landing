import{N as c}from"./Navigation-63QfzdoJ.js";class m{constructor(){this.container=document.getElementById("app")}render(){this.container.innerHTML="";const t=new c;this.container.appendChild(t.render());const e=document.createElement("div");e.className="page-container",e.innerHTML=`
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-logo fade-in">
                            <img src="/assets/group-108.png" alt="ISPER">
                        </div>
                        <h1 class="hero-title">
                            <span class="typewriter-text" data-text="Copy, Paste and Go "></span>
                        </h1>
                        <p class="hero-subtitle fade-in">
                            Uncover hidden gems straight from your favorite creators.<br>
                            Your next journey is only one URL away.
                        </p>
                        <div class="hero-actions fade-in">
                            <div class="download-section">
                                <div class="store-buttons">
                                    <!-- App Store Button -->
                                    <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" class="store-button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" class="store-icon">
                                        <span>App store</span>
                                    </a>
                                    <!-- Google Play Button -->
                                    <a href="https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME" target="_blank" class="store-button">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" class="store-icon">
                                        <span>Google play</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,this.container.appendChild(e),this.addStyles(),this.initTypewriter()}initTypewriter(){const t=document.querySelector(".typewriter-text");if(!t)return;let e=0,i="";const n="Copy,  Paste... ",r="GO!";t.innerHTML='<span class="line1"></span><br><span class="line2"></span>';const a=t.querySelector(".line1"),o=t.querySelector(".line2");function l(){const s=n+" "+r;if(e++,i=s.substring(0,e),e>s.length){a.textContent=n,o.textContent=r,o.classList.add("typing");return}i.length<=n.length?(a.textContent=i,o.textContent=""):(a.textContent=n,o.textContent=i.substring(n.length+1)),e<=s.length&&(i.length<=n.length?(a.classList.add("typing"),o.classList.remove("typing")):(a.classList.remove("typing"),o.classList.add("typing"))),setTimeout(l,80)}setTimeout(l,500)}addStyles(){const t=document.createElement("style");t.textContent=`
            .hero-section {
                min-height: calc(100vh - 64px);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                text-align: center;
                padding: var(--spacing-xl) 0;
                padding-top: calc(var(--spacing-xl) * 2);
            }
            
            .hero-logo {
                margin-bottom: var(--spacing-lg);
            }
            
            .hero-logo img {
                height: 60px;
                width: auto;
            }
            
            .hero-title {
                font-size: clamp(3rem, 8vw, 5rem);
                margin-bottom: var(--spacing-md);
                line-height: 1.1;
                min-height: 2.4em; /* Prevent layout shift */
            }
            
            .typewriter-text {
                display: inline-block;
            }
            
            .typewriter-text span {
                position: relative;
            }
            
            .typewriter-text span.typing::after {
                content: '|';
                position: absolute;
                right: -0.1em;
                color: var(--accent-blue);
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .hero-subtitle {
                font-size: 1.25rem;
                max-width: 600px;
                margin: 0 auto var(--spacing-lg);
                color: var(--text-gray);
            }
            
            .hero-actions {
                display: flex;
                gap: var(--spacing-sm);
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .download-section {
                text-align: center;
            }
            
            .download-section h3 {
                font-size: 1.125rem;
                margin-bottom: var(--spacing-md);
                color: var(--text-light);
            }
            
            .store-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                justify-content: center;
            }
            
            .store-button {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background-color: white;
                border-radius: 999px;
                padding: 0.75rem 1.25rem;
                text-decoration: none;
                color: black;
                font-size: 16px;
                font-weight: 500;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 0 0 transparent;
            }
            
            .store-button:hover {
                transform: translateY(-2px);
                box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
            }
            
            .store-icon {
                width: 20px;
                height: 20px;
            }
            
            .dock-showcase {
                margin-top: var(--spacing-xl);
                transition: transform 0.3s ease;
            }
            
            .dock-showcase:hover {
                transform: scale(1.05);
            }
            
            .dock-icon-display {
                width: auto;
                height: 60px;
                display: block;
                margin: 0 auto;
            }
            
            .feature-icon {
                font-size: 3rem;
                margin-bottom: var(--spacing-sm);
            }
            
            .feature-list {
                list-style: none;
                margin-top: var(--spacing-md);
            }
            
            .feature-list li {
                padding: var(--spacing-xs) 0;
                padding-left: 1.5rem;
                position: relative;
                color: var(--text-gray);
            }
            
            .feature-list li::before {
                content: "→";
                position: absolute;
                left: 0;
                color: var(--accent-blue);
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
            
            .lead {
                font-size: 1.25rem;
                line-height: 1.6;
                margin-bottom: var(--spacing-md);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .hero-section {
                    padding: var(--spacing-lg) 0;
                }
                
                .hero-logo img {
                    height: 60px;
                }
                
                .hero-title {
                    font-size: clamp(2rem, 6vw, 3rem);
                    min-height: 2.2em;
                }
                
                .hero-subtitle {
                    font-size: 1rem;
                }
                
                .hero-actions {
                    margin-top: var(--spacing-md);
                }
                
                .btn {
                    width: 100%;
                    max-width: 300px;
                }
                
                .store-buttons {
                    flex-direction: column;
                    gap: var(--spacing-sm);
                }
                
                .store-button {
                    width: 100%;
                    max-width: 200px;
                    justify-content: center;
                }
            }
        `,document.head.appendChild(t)}destroy(){}}export{m as default};
//# sourceMappingURL=index-BK86AOad.js.map
