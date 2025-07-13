class i{constructor(){this.element=null,this.init()}init(){this.element=document.createElement("nav"),this.element.className="main-nav",this.element.innerHTML=`
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <img src="/assets/group-107.svg" alt="ISPER" class="logo-img">
                </a>
                
                <div class="nav-links">
                    <a href="/isper" class="nav-link">Isper</a>
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
        `,this.setupMobileToggle(),this.updateActiveLink()}setupMobileToggle(){const e=this.element.querySelector(".nav-mobile-toggle"),t=this.element.querySelector(".nav-links"),s=this.element.querySelectorAll(".nav-link");e.addEventListener("click",()=>{t.classList.toggle("active"),e.classList.toggle("active")}),s.forEach(a=>{a.addEventListener("click",()=>{t.classList.remove("active"),e.classList.remove("active")})})}updateActiveLink(){const e=window.location.pathname;this.element.querySelectorAll(".nav-link").forEach(s=>{s.getAttribute("href")===e?s.classList.add("active"):s.classList.remove("active")})}render(){return this.element}}export{i as N};
//# sourceMappingURL=Navigation-CVttPfbx.js.map
