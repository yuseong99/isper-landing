class o{constructor(){this.element=null,this.init()}init(){this.element=document.createElement("nav"),this.element.className="main-nav",this.element.innerHTML=`
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <img src="/assets/group-107.svg" alt="ISPER" class="logo-img">
                </a>
                
                <div class="nav-links">
                    <a href="/isper" class="nav-link">Isper Maps</a>
                    <a href="/company" class="nav-link">Company</a>
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
                
                .main-nav.scrolled {
                    border-bottom-color: var(--border-gray) !important;
                }
                
                @media (max-width: 768px) {
                    .nav-links:not(.active) {
                        border-bottom: none !important;
                    }
                }
            </style>
        `,this.setupMobileToggle(),this.updateActiveLink(),this.setupLinkHandlers(),this.setupScrollBehavior()}setupMobileToggle(){const e=this.element.querySelector(".nav-mobile-toggle"),n=this.element.querySelector(".nav-links"),t=this.element.querySelectorAll(".nav-link");e.addEventListener("click",()=>{n.classList.toggle("active"),e.classList.toggle("active")}),t.forEach(s=>{s.addEventListener("click",()=>{n.classList.remove("active"),e.classList.remove("active")})})}setupLinkHandlers(){const e=this.element.querySelectorAll(".nav-link"),n=this.element.querySelector(".nav-logo");e.forEach(t=>{t.addEventListener("click",s=>{const a=t.getAttribute("href"),l=window.location.pathname;a===l&&s.preventDefault()})}),n.addEventListener("click",t=>{const s=window.location.pathname;(s==="/"||s==="")&&t.preventDefault()})}updateActiveLink(){const e=window.location.pathname;this.element.querySelectorAll(".nav-link").forEach(t=>{t.getAttribute("href")===e?t.classList.add("active"):t.classList.remove("active")})}setupScrollBehavior(){const e=()=>{window.scrollY>10?this.element.classList.add("scrolled"):this.element.classList.remove("scrolled")};e(),window.addEventListener("scroll",e)}render(){return this.element}}export{o as N};
//# sourceMappingURL=Navigation-DEMnZ-9p.js.map
