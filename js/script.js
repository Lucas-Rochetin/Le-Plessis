document.addEventListener("DOMContentLoaded", () => {
    // --- BOUTON SCROLL TOP ---
    const backToTopBtn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        backToTopBtn.classList.toggle("hidden", window.scrollY < 300);
    });
    
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    
    const btn = document.getElementById("scroll-about");
    const target = document.getElementById("about");
    
    if (btn && target) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        });
    }
    
    // Empêcher scroll automatique si un hash est présent dans l'URL
    if (window.location.hash === "#about") {
        history.replaceState(null, null, window.location.pathname);
        window.scrollTo({ top: 0, behavior: "auto" });
    }
    document.querySelectorAll('[data-modal]').forEach(img => {
        img.addEventListener('click', () => {
            document.getElementById(img.dataset.modal).classList.remove('hidden');
        });
    });
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.popup-modal').classList.add('hidden');
        });
    });
    
    // --- SCROLL FLUIDE POUR LES ANCRES ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href").substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const topBarHeight = document.getElementById("topBar").offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - topBarHeight + 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
