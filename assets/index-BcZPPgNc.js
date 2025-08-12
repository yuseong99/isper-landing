import{N as r}from"./Navigation-BtANsm5N.js";class d{constructor(){this.container=document.getElementById("app")}render(){this.container.innerHTML="";const e=new r;this.container.appendChild(e.render());const t=document.createElement("div");t.className="page-container",t.innerHTML=`
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-logo fade-in">
                            <img src="/assets/Group 108.svg" alt="ISPER">
                        </div>
                        <h1 class="hero-title">
                            <span class="typewriter-text" data-text="Inspiration to Action"></span>
                        </h1>
                        <p class="hero-subtitle fade-in">
                            Turn creator videos into go-ready maps.<br>
                            One tap from discovery to directions.<br>
                        </p>
                        <div class="hero-actions fade-in">
                            <div class="download-section">
                                <div class="store-buttons">
                                    <!-- App Store Button -->
                                    <a href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" class="store-button">
                                        <svg class="store-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
                                        </svg>
                                        <span>App store</span>
                                    </a>
                                    <!-- Google Play Button -->
                                    <a href="https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME" target="_blank" class="store-button">
                                        <svg class="store-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" fill="currentColor"/>
                                        </svg>
                                        <span>Google play</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Video Section -->
                        <div class="video-section fade-in">
                            <div class="video-content">
                                <div class="video-wrapper">
                                    <video autoplay loop muted playsinline>
                                        <source src="/assets/videos/isper_link_process.mp4" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div class="video-info">
                                    <h2 class="video-title">Turn Videos into Adventures</h2>
                                    <ul class="video-features">
                                        <li>Every video becomes a treasure map.</li>
                                        <li>Tap to reveal the hidden gems your favorite creators discovered.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Second Video Section -->
                        <div class="video-section video-section-reverse fade-in">
                            <div class="video-content">
                                <div class="video-wrapper">
                                    <video autoplay loop muted playsinline>
                                        <source src="/assets/videos/isper_save_place.mp4" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div class="video-info">
                                    <h2 class="video-title">Build Your Collection</h2>
                                    <ul class="video-features">
                                        <li>Curate your personal map of extraordinary places.</li>
                                        <li>They're not just locations—experiences waiting to happen.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Third Video Section -->
                        <div class="video-section fade-in">
                            <div class="video-content">
                                <div class="video-wrapper">
                                    <video autoplay loop muted playsinline>
                                        <source src="/assets/videos/isper_been_here.mp4" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div class="video-info">
                                    <h2 class="video-title">Been There, Done That</h2>
                                    <ul class="video-features">
                                        <li>Earn your place among the world's most adventurous travelers.</li>
                                        <li>Every check-in is a badge of honor in our global community.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,this.container.appendChild(t),this.addStyles(),this.initTypewriter()}initTypewriter(){const e=document.querySelector(".typewriter-text");if(!e)return;const t=e.getAttribute("data-text")||"Inspiration to Action";e.innerHTML='<span class="line typing"></span>';const o=e.querySelector(".line");let i=0;const n=80;function a(){i<t.length?(o.textContent=t.substring(0,i+1),i+=1,setTimeout(a,n)):o.textContent=t}setTimeout(a,500)}addStyles(){const e=document.createElement("style");e.textContent=`
            .hero-section {
                min-height: calc(100vh - 64px);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                text-align: center;
                padding: var(--spacing-xl) 0;
                padding-top: calc(var(--spacing-xl) * 2);
                position: relative;
                overflow: hidden;
            }
            
            .hero-section::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                background: url('/assets/dark-map-bg.jpg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-attachment: fixed;
                filter: blur(5px);
                z-index: -2;
            }
            
            .hero-section::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75));
                z-index: -1;
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
                margin-bottom: var(--spacing-sm);
                line-height: 1.1;
                min-height: 1.6em; /* Reduced to tighten gap while avoiding shift */
            }
            
            .typewriter-text {
                display: inline-block;
            }
            
            .typewriter-text span {
                position: relative;
            }
            
            .typewriter-text span.typing::after {
                content: '|';
                color: var(--accent-blue);
                animation: blink 1s infinite;
                font-weight: 300;
                font-size: 1em;
                margin-left: 0.05em;
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
            
            .store-button svg.store-icon {
                fill: black;
                color: black;
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
            
            /* Video Section Styles */
            .video-section {
                margin-top: var(--spacing-xl);
                padding: var(--spacing-xl) 0;
            }
            
            .video-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-xl);
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .video-wrapper {
                flex: 1;
                max-width: 400px;
            }
            
            .video-wrapper video {
                width: 100%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .video-info {
                flex: 1;
                text-align: left;
            }
            
            .video-title {
                font-size: 2.5rem;
                margin-bottom: var(--spacing-md);
                color: var(--text-white);
            }
            
            .video-features {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .video-features li {
                font-size: 1.25rem;
                color: var(--text-gray);
                margin-bottom: var(--spacing-sm);
                padding-left: 0;
                line-height: 1.6;
                transition: color 0.3s ease;
            }
            
            .video-info:hover .video-features li {
                color: #E0E0E0;
            }
            
            .video-features li::before {
                display: none;
            }
            
            /* Reversed video section */
            .video-section-reverse .video-content {
                display: flex;
                flex-direction: row-reverse; 
                justify-content: space-between;
                align-items: center;
                gap: var(--spacing-xl);
            }
            
            .video-section-reverse .video-wrapper {
                max-width: 600px;
                flex-shrink: 0;
            }
            
            .video-section-reverse .video-info {
                text-align: left;
                flex: 1;
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
                    min-height: 1.4em;
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
                
                .video-content {
                    flex-direction: column !important;
                    text-align: center;
                }
                
                .video-info {
                    text-align: center;
                }
                
                .video-title {
                    font-size: 2rem;
                }
                
                .video-features li {
                    font-size: 1.125rem;
                }
            }
        `,document.head.appendChild(e)}destroy(){}}export{d as default};
//# sourceMappingURL=index-BcZPPgNc.js.map
