class i{constructor(){this.element=null,this.init()}init(){this.element=document.createElement("nav"),this.element.className="main-nav",this.element.innerHTML=`
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <span class="logo-text">IsperAI</span>
                </a>
                
                <div class="nav-links">
                    <a href="/isper" class="nav-link">Maps</a>
                    <a href="/company" class="nav-link">Isper</a>
                    <!-- <a href="/news" class="nav-link">News</a> Disabled -->
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
                
                <div class="nav-mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <style>
                .main-nav {
                    border-bottom-color: transparent !important;
                    transition: border-color 0.3s ease;
                }
                
                .logo-text {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 1.5rem;
                    color: white;
                    text-decoration: none;
                    letter-spacing: -0.02em;
                }
                
                .nav-logo {
                    text-decoration: none;
                }
                
                .nav-logo:hover .logo-text {
                    color: #E0E0E0;
                    transition: color 0.2s ease;
                }
                
                .main-nav.scrolled {
                    border-bottom-color: var(--border-gray) !important;
                }
                
                @media (max-width: 768px) {
                    .nav-links:not(.active) {
                        border-bottom: none !important;
                    }
                }
            </style>
        `,this.setupMobileToggle(),this.updateActiveLink(),this.setupLinkHandlers(),this.setupScrollBehavior()}setupMobileToggle(){const e=this.element.querySelector(".nav-mobile-toggle"),s=this.element.querySelector(".nav-links"),t=this.element.querySelectorAll(".nav-link");e.addEventListener("click",()=>{s.classList.toggle("active"),e.classList.toggle("active")}),t.forEach(n=>{n.addEventListener("click",()=>{s.classList.remove("active"),e.classList.remove("active")})})}setupLinkHandlers(){const e=this.element.querySelectorAll(".nav-link"),s=this.element.querySelector(".nav-logo");e.forEach(t=>{t.addEventListener("click",n=>{const a=t.getAttribute("href"),o=window.location.pathname;a===o&&n.preventDefault()})}),s.addEventListener("click",t=>{const n=window.location.pathname;(n==="/"||n==="")&&t.preventDefault()})}updateActiveLink(){const e=window.location.pathname;this.element.querySelectorAll(".nav-link").forEach(t=>{t.getAttribute("href")===e?t.classList.add("active"):t.classList.remove("active")})}setupScrollBehavior(){const e=()=>{window.scrollY>10?this.element.classList.add("scrolled"):this.element.classList.remove("scrolled")};e(),window.addEventListener("scroll",e)}render(){return this.element}}export{i as N};
//# sourceMappingURL=Navigation-BtANsm5N.js.map
