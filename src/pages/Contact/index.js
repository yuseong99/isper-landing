import { Navigation } from '../../components/Navigation.js';

export default class ContactPage {
    constructor() {
        this.container = document.getElementById('app');
    }
    
    render() {
        this.container.innerHTML = '';
        
        // Add navigation
        const nav = new Navigation();
        this.container.appendChild(nav.render());
        
        // Load reCAPTCHA script
        this.loadRecaptchaScript();
        
        // Create page content
        const pageContent = document.createElement('div');
        pageContent.className = 'page-container';
        pageContent.innerHTML = `
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
                                <p><a href="mailto:hello@isper.com">hello@isper.com</a></p>
                            </div>
                            
                            <div class="contact-item">
                                <h3>Sales</h3>
                                <p><a href="mailto:sales@isper.com">sales@isper.com</a></p>
                            </div>
                            
                            <div class="contact-item">
                                <h3>Support</h3>
                                <p><a href="mailto:support@isper.com">support@isper.com</a></p>
                            </div>
                            
                            <div class="contact-item">
                                <h3>Press</h3>
                                <p><a href="mailto:press@isper.com">press@isper.com</a></p>
                            </div>
                            
                            <div class="social-links">
                                <a href="#" class="social-link">Twitter</a>
                                <a href="#" class="social-link">LinkedIn</a>
                                <a href="#" class="social-link">GitHub</a>
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
                                        <option value="sales">Sales</option>
                                        <option value="support">Support</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="media">Media/Press</option>
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
            
            <section class="office-section">
                <div class="container">
                    <h2 class="text-center mb-4">Our Offices</h2>
                    <div class="grid grid-2">
                        <div class="office-card fade-in">
                            <h3>San Francisco</h3>
                            <p>123 Innovation Street<br>
                            San Francisco, CA 94107<br>
                            United States</p>
                        </div>
                        <div class="office-card fade-in" style="animation-delay: 0.1s">
                            <h3>London</h3>
                            <p>456 Tech Lane<br>
                            London, EC2A 4BX<br>
                            United Kingdom</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.container.appendChild(pageContent);
        this.addStyles();
        this.setupForm();
    }
    
    setupForm() {
        const form = this.container.querySelector('.contact-form');
        const submitButton = form.querySelector('button[type="submit"]');
        const emailInput = form.querySelector('#email');
        
        // Disable browser's native validation UI
        form.setAttribute('novalidate', 'true');
        
        // Add custom email validation with debounce
        let emailTimeout;
        emailInput.addEventListener('input', (e) => {
            const email = e.target.value;
            
            // Clear any existing timeout
            clearTimeout(emailTimeout);
            
            // Remove any existing error tooltip immediately when typing
            const existingTooltip = e.target.parentNode.querySelector('.validation-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            // Only validate after user stops typing for 500ms
            if (email) {
                emailTimeout = setTimeout(() => {
                    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(email)) {
                        this.showFieldError(e.target, 'Please enter a valid email address');
                    }
                }, 500);
            }
        });
        
        // Add blur validation for all required fields
        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Get reCAPTCHA response
            const recaptchaResponse = grecaptcha.getResponse();
            
            if (!recaptchaResponse) {
                this.showMessage('Please complete the reCAPTCHA verification.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                return;
            }
            
            // Add reCAPTCHA response to form data
            data['g-recaptcha-response'] = recaptchaResponse;
            
            try {
                // Option 1: Use Formspree (replace YOUR_FORM_ID with your actual Formspree form ID)
                // Sign up at https://formspree.io to get a form ID
                const response = await fetch('https://formspree.io/f/xyzjqvra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Show success message
                    this.showMessage('Thank you for your message. We\'ll get back to you soon!', 'success');
                    form.reset();
                    // Reset reCAPTCHA
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending form:', error);
                this.showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }
    
    validateField(field) {
        // Remove any existing error tooltip
        const existingTooltip = field.parentNode.querySelector('.validation-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Check if field is empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Select validation
        if (field.tagName === 'SELECT' && field.value === '') {
            this.showFieldError(field, 'Please select an option');
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        // Remove any existing tooltip
        const existingTooltip = field.parentNode.querySelector('.validation-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'validation-tooltip';
        tooltip.textContent = message;
        
        // Add tooltip after the field
        field.parentNode.appendChild(tooltip);
        
        // Position tooltip
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
    }
    
    showMessage(text, type) {
        // Remove any existing message
        const existingMessage = this.container.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        
        // Insert after form
        const form = this.container.querySelector('.contact-form');
        form.parentNode.insertBefore(message, form.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        document.head.appendChild(style);
    }
    
    loadRecaptchaScript() {
        // Check if script already exists
        if (document.querySelector('script[src*="recaptcha/api.js"]')) {
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
    
    destroy() {
        // Cleanup if needed
    }
}