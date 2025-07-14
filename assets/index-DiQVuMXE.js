import{N as s}from"./Navigation-CVttPfbx.js";class o{constructor(){this.container=document.getElementById("app")}render(){this.container.innerHTML="";const e=new s;this.container.appendChild(e.render());const i=document.createElement("div");i.className="page-container",i.innerHTML=`
            <!-- Mission Section -->
            <section class="mission-hero">
                <div class="mission-sphere"></div>
                <div class="container">
                    <div class="mission-content">
                        <h3 class="section-label fade-in">OUR MISSION</h3>
                        <h1 class="mission-statement fade-in">
                            <div>Isper is Place Search AI.</div>
                            <div style="white-space: nowrap;">Isper <span class="highlight-text">Finds Places</span> from <span class="highlight-text">Social Media</span></div>
                        </h1>
                    </div>
                </div>
            </section>

            <!-- What is Isper Section -->
            <section class="what-is-section">
                <div class="what-is-sphere"></div>
                <div class="container">
                    <div class="what-is-content">
                        <h3 class="section-label fade-in">SO, WHAT IS ISPER?</h3>
                        <h1 class="what-is-statement fade-in">
                            <div>ISPER: <span class="highlight-text">Intelligent Sensory Perception,</span></div>
                            <div><span class="highlight-text">Extraction & Recognition</span></div>
                        </h1>
                        <p class="what-is-description fade-in">
                            Isper is an AI agent that watches and listens to videos in real-time,<br>
                            then extracts and recognizes the data you need.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Discovery Flow Section -->
            <section class="discovery-section">
                <div class="container">
                    <div class="discovery-content">
                        <h3 class="section-label fade-in">HOW IT WORKS</h3>
                        <h1 class="discovery-statement fade-in">
                            <div>Conversational Video-led Discovery Flow</div>
                        </h1>
                        <div class="discovery-steps fade-in">
                            <div class="step-item">
                                <span class="step-number">1.</span>
                                <p>Ask Isper to search places</p>
                            </div>
                            <div class="step-item">
                                <span class="step-number">2.</span>
                                <p>Isper understands and searches trending videos from YouTube, Instagram, and TikTok</p>
                            </div>
                            <div class="step-item">
                                <span class="step-number">3.</span>
                                <p>Isper watches & listens to videos, extract places then shows to user</p>
                            </div>
                        </div>
                        <p class="discovery-tagline fade-in">
                            <span class="highlight-text">"Like Perplexity, but with Map"</span>
                        </p>
                    </div>
                </div>
            </section>
        `,this.container.appendChild(i),this.addStyles(),this.initAnimations()}initAnimations(){document.querySelectorAll(".feature-card").forEach((i,t)=>{i.style.animationDelay=`${t*.1}s`})}addStyles(){const e=document.createElement("style");e.textContent=`
            /* Mission Hero Section */
            .mission-hero {
                min-height: 100vh;
                display: flex;
                align-items: center;
                position: relative;
                overflow: hidden;
                background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.05), transparent 50%);
            }
            
            .mission-sphere {
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
            
            .mission-content {
                position: relative;
                z-index: 1;
                text-align: left;
                max-width: 1000px;
                margin: 0 auto;
                margin-top: -10vh;
                padding: 0 var(--spacing-md);
            }
            
            .mission-label,
            .section-label {
                font-size: 0.875rem;
                letter-spacing: 0.2em;
                color: var(--text-gray);
                margin-bottom: var(--spacing-lg);
                text-transform: uppercase;
            }
            
            .mission-statement {
                font-size: clamp(1.75rem, 4vw, 3rem);
                font-weight: 700;
                line-height: 1.4;
                max-width: 100%;
            }
            
            .mission-statement div {
                margin: 0.5rem 0;
            }
            
            .highlight-text {
                background: white;
                color: black;
                padding: 0.1em 0.3em;
                border-radius: 4px;
                font-weight: 700;
                line-height: 1.4;
            }
            
            /* What is Isper Section - Matching Mission Style */
            .what-is-section {
                padding: calc(var(--spacing-xl) * 3) 0;
                min-height: 60vh;
                display: flex;
                align-items: center;
            }
            
            .what-is-content {
                text-align: left;
                max-width: 1000px;
                margin: 0 auto;
                padding: 0 var(--spacing-md);
            }
            
            .what-is-statement {
                font-size: clamp(1.75rem, 4vw, 3rem);
                font-weight: 700;
                line-height: 1.4;
                margin-bottom: var(--spacing-lg);
            }
            
            .what-is-statement div {
                margin: 0.5rem 0;
            }
            
            .what-is-description {
                font-size: 1.25rem;
                line-height: 1.6;
                color: var(--text-gray);
                margin-top: var(--spacing-xl);
            }
            
            /* Discovery Flow Section */
            .discovery-section {
                padding: calc(var(--spacing-xl) * 3) 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                position: relative;
            }
            
            .discovery-content {
                text-align: left;
                max-width: 1000px;
                margin: 0 auto;
                margin-top: -10vh;
                padding: 0 var(--spacing-md);
            }
            
            .discovery-statement {
                font-size: clamp(1.75rem, 4vw, 3rem);
                font-weight: 700;
                line-height: 1.4;
                margin-bottom: var(--spacing-xl);
            }
            
            .discovery-steps {
                margin: var(--spacing-xl) 0;
            }
            
            .step-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: var(--spacing-md);
                font-size: 1.125rem;
                line-height: 1.6;
            }
            
            .step-number {
                font-weight: 700;
                color: var(--text-white);
                margin-right: var(--spacing-sm);
                flex-shrink: 0;
            }
            
            .step-item p {
                color: var(--text-gray);
                margin: 0;
            }
            
            .discovery-tagline {
                font-size: 1.5rem;
                font-weight: 600;
                text-align: center;
                margin-top: var(--spacing-xl);
            }
            
            /* Mobile Styles */
            @media (max-width: 768px) {
                .mission-hero {
                    min-height: 80vh;
                }
                
                .mission-content {
                    margin-top: -5vh;
                }
                
                .mission-statement {
                    font-size: 1.25rem;
                }
                
                .mission-statement div[style*="nowrap"] {
                    white-space: normal !important;
                }
                
                .highlight-text {
                    padding: 0.05em 0.2em;
                }
                
                .what-is-section {
                    padding: calc(var(--spacing-xl) * 2) 0;
                    min-height: auto;
                }
                
                .what-is-statement {
                    font-size: 1.25rem;
                }
                
                .what-is-description {
                    font-size: 1rem;
                }
                
                .discovery-section {
                    min-height: 80vh;
                }
                
                .discovery-content {
                    margin-top: -5vh;
                }
                
                .discovery-statement {
                    font-size: 1.25rem;
                }
                
                .step-item {
                    font-size: 1rem;
                }
                
                .discovery-tagline {
                    font-size: 1.25rem;
                }
            }
        `,document.head.appendChild(e)}destroy(){}}export{o as default};
//# sourceMappingURL=index-DiQVuMXE.js.map
