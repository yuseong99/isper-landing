class c{constructor(){this.element=null,this.init()}init(){this.element=document.createElement("nav"),this.element.className="main-nav",this.element.innerHTML=`
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <img src="/assets/group-107.svg" alt="ISPER" class="logo-img">
                </a>
                
                <div class="nav-links">
                    <a href="/isper" class="nav-link">Isper Maps</a>
                    <a href="/company" class="nav-link">Company</a>
                    <a href="/news" class="nav-link">News</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
                
                <div class="nav-mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <style>
                @media (max-width: 768px) {
                    .nav-links:not(.active) {
                        border-bottom: none !important;
                    }
                }
            </style>
        `,this.setupMobileToggle(),this.updateActiveLink(),this.setupLinkHandlers()}setupMobileToggle(){const t=this.element.querySelector(".nav-mobile-toggle"),s=this.element.querySelector(".nav-links"),e=this.element.querySelectorAll(".nav-link");t.addEventListener("click",()=>{s.classList.toggle("active"),t.classList.toggle("active")}),e.forEach(n=>{n.addEventListener("click",()=>{s.classList.remove("active"),t.classList.remove("active")})})}setupLinkHandlers(){const t=this.element.querySelectorAll(".nav-link"),s=this.element.querySelector(".nav-logo");t.forEach(e=>{e.addEventListener("click",n=>{const a=e.getAttribute("href"),i=window.location.pathname;a===i&&n.preventDefault()})}),s.addEventListener("click",e=>{const n=window.location.pathname;(n==="/"||n==="")&&e.preventDefault()})}updateActiveLink(){const t=window.location.pathname;this.element.querySelectorAll(".nav-link").forEach(e=>{e.getAttribute("href")===t?e.classList.add("active"):e.classList.remove("active")})}render(){return this.element}}export{c as N};
//# sourceMappingURL=Navigation-D57C2keV.js.map
