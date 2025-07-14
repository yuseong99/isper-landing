import{N as n}from"./Navigation-sY52ByX1.js";class o{constructor(){this.container=document.getElementById("app")}render(){this.container.innerHTML="";const i=new n;this.container.appendChild(i.render());const t=document.createElement("div");t.className="page-container",t.innerHTML=`
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
                <div class="container">
                    <div class="what-is-content">
                        <h3 class="section-label fade-in">SO, WHAT IS ISPER?</h3>
                        <h1 class="what-is-statement fade-in">
                            <div>ISPER: <span class="highlight-text">Intelligent Sensory Perception,</span></div>
                            <div><span class="highlight-text">Extraction & Recognition</span></div>
                        </h1>
                        <p class="what-is-description fade-in">
                            Isper is an AI which has ability to watches and listens to videos in real-time,<br>
                            then extracts and recognizes the data you need.
                        </p>
                    </div>
                </div>
            </section>

        `,this.container.appendChild(t),this.addStyles(),this.initAnimations()}initAnimations(){document.querySelectorAll(".feature-card").forEach((t,e)=>{t.style.animationDelay=`${e*.1}s`})}addStyles(){const i=document.createElement("style");i.textContent=`
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
                min-height: 100vh;
                display: flex;
                align-items: center;
                position: relative;
            }
            
            
            .what-is-content {
                position: relative;
                z-index: 1;
                text-align: left;
                max-width: 1000px;
                margin: 0 auto;
                margin-top: -10vh;
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
                
            }
        `,document.head.appendChild(i)}destroy(){}}export{o as default};
//# sourceMappingURL=index-CUC2MSbc.js.map
