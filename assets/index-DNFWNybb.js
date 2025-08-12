import{N as d}from"./Navigation-BtANsm5N.js";class g{constructor(){this.container=document.getElementById("app")}render(){this.container.innerHTML="";const e=new d;this.container.appendChild(e.render()),this.loadRecaptchaScript();const t=document.createElement("div");t.className="page-container",t.innerHTML=`
            <section class="contact-hero">
                <div class="container">
                    <h1 class="fade-in">Get in Touch</h1>
                </div>
            </section>
            
            <section class="contact-content">
                <div class="container">
                    <div class="contact-grid">
                        <div class="contact-info">
                            <h2>Contact Information</h2>
                            
                            <div class="contact-item">
                                <h3>General Inquiries</h3>
                                <p><a href="mailto:hello@isperai.com">hello@isperai.com</a></p>
                            </div>
                        </div>
                        
                        <div class="contact-form-wrapper">
                            <h2>Send us a message</h2>
                            <form class="contact-form">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject">Subject</label>
                                    <select id="subject" name="subject" required>
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="partnership">Partnership</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <div class="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY" data-theme="dark"></div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            
         
        `,this.container.appendChild(t),this.addStyles(),this.setupForm()}setupForm(){const e=this.container.querySelector(".contact-form"),t=e.querySelector('button[type="submit"]'),o=e.querySelector("#email");e.setAttribute("novalidate","true");let r;o.addEventListener("input",a=>{const i=a.target.value;clearTimeout(r);const s=a.target.parentNode.querySelector(".validation-tooltip");s&&s.remove(),i&&(r=setTimeout(()=>{/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(i)||this.showFieldError(a.target,"Please enter a valid email address")},500))}),e.querySelectorAll("input[required], select[required], textarea[required]").forEach(a=>{a.addEventListener("blur",i=>{this.validateField(i.target)})}),e.addEventListener("submit",async a=>{a.preventDefault();let i=!0;if(e.querySelectorAll("input[required], select[required], textarea[required]").forEach(n=>{this.validateField(n)||(i=!1)}),!i)return;t.disabled=!0,t.textContent="Sending...";const s=new FormData(e),c=Object.fromEntries(s),l=grecaptcha.getResponse();if(!l){this.showMessage("Please complete the reCAPTCHA verification.","error"),t.disabled=!1,t.textContent="Send Message";return}c["g-recaptcha-response"]=l;try{if((await fetch("https://formspree.io/f/xyzjqvra",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).ok)this.showMessage("Thank you for your message. We'll get back to you soon!","success"),e.reset(),typeof grecaptcha<"u"&&grecaptcha.reset();else throw new Error("Failed to send message")}catch(n){console.error("Error sending form:",n),this.showMessage("Sorry, there was an error sending your message. Please try again later.","error")}finally{t.disabled=!1,t.textContent="Send Message"}})}validateField(e){const t=e.parentNode.querySelector(".validation-tooltip");return t&&t.remove(),e.hasAttribute("required")&&!e.value.trim()?(this.showFieldError(e,"This field is required"),!1):e.type==="email"&&!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.value)?(this.showFieldError(e,"Please enter a valid email address"),!1):e.tagName==="SELECT"&&e.value===""?(this.showFieldError(e,"Please select an option"),!1):!0}showFieldError(e,t){const o=e.parentNode.querySelector(".validation-tooltip");o&&o.remove();const r=document.createElement("div");r.className="validation-tooltip",r.textContent=t,e.parentNode.appendChild(r),setTimeout(()=>{r.classList.add("show")},10)}showMessage(e,t){const o=this.container.querySelector(".form-message");o&&o.remove();const r=document.createElement("div");r.className=`form-message form-message-${t}`,r.textContent=e;const a=this.container.querySelector(".contact-form");a.parentNode.insertBefore(r,a.nextSibling),setTimeout(()=>{r.remove()},5e3)}addStyles(){const e=document.createElement("style");e.textContent=`
            .contact-hero {
                padding: var(--spacing-xl) 0;
                text-align: center;
            }
            
            .contact-content {
                padding: var(--spacing-xl) 0;
            }
            
            .contact-grid {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: var(--spacing-xl);
            }
            
            .contact-item {
                margin-bottom: var(--spacing-md);
            }
            
            .contact-item h3 {
                font-size: 1rem;
                margin-bottom: var(--spacing-xs);
            }
            
            .contact-item a {
                color: var(--accent-blue);
                text-decoration: none;
                transition: opacity var(--transition-fast);
            }
            
            .contact-item a:hover {
                opacity: 0.8;
            }
            
            .social-links {
                display: flex;
                gap: var(--spacing-md);
                margin-top: var(--spacing-lg);
            }
            
            .social-link {
                color: var(--text-gray);
                text-decoration: none;
                transition: color var(--transition-fast);
            }
            
            .social-link:hover {
                color: var(--primary-white);
            }
            
            .contact-form {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
                position: relative;
            }
            
            .form-group label {
                font-size: 0.875rem;
                color: var(--text-gray);
                font-weight: 500;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-gray);
                border-radius: 6px;
                color: var(--primary-white);
                font-size: 1rem;
                font-family: inherit;
                transition: all var(--transition-fast);
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary-white);
                background: rgba(255, 255, 255, 0.08);
            }
            
            .form-group textarea {
                resize: vertical;
                min-height: 120px;
            }
            
            .office-section {
                padding: var(--spacing-xl) 0;
                background: rgba(255, 255, 255, 0.02);
                border-top: 1px solid var(--border-gray);
            }
            
            .office-card {
                text-align: center;
                padding: var(--spacing-lg);
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-gray);
                border-radius: 12px;
            }
            
            .form-message {
                margin-top: var(--spacing-md);
                padding: var(--spacing-md) var(--spacing-lg);
                border-radius: 8px;
                font-size: 0.9rem;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .form-message-success {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .form-message-error {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .g-recaptcha {
                transform: scale(0.9);
                transform-origin: 0 0;
            }
            
            /* Custom validation tooltip */
            .validation-tooltip {
                position: absolute;
                bottom: -35px;
                left: 0;
                background: rgba(30, 30, 30, 0.95);
                color: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.875rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.2s ease;
                pointer-events: none;
                white-space: nowrap;
                z-index: 1000;
            }
            
            .validation-tooltip::before {
                content: '';
                position: absolute;
                top: -6px;
                left: 16px;
                width: 12px;
                height: 12px;
                background: rgba(30, 30, 30, 0.95);
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                transform: rotate(45deg);
            }
            
            .validation-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Error state for inputs */
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .contact-grid {
                    grid-template-columns: 1fr;
                    gap: var(--spacing-lg);
                }
            }
        `,document.head.appendChild(e)}loadRecaptchaScript(){if(document.querySelector('script[src*="recaptcha/api.js"]'))return;const e=document.createElement("script");e.src="https://www.google.com/recaptcha/api.js",e.async=!0,e.defer=!0,document.head.appendChild(e)}destroy(){}}export{g as default};
//# sourceMappingURL=index-DNFWNybb.js.map
