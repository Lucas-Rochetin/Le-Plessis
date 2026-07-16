document.addEventListener("DOMContentLoaded", () => {
    // --- STRENGTHS CAROUSEL ---
    let strengthsIndex = 0;
    const strengthsContainer = document.getElementById("strengths-carousel-items");
    const strengthsSlides = Array.from(strengthsContainer.children);
    const strengthsTotal = strengthsSlides.length;
    
    function updateStrengthsDisplay() {
        if (window.matchMedia("(max-width: 767px)").matches) {
            updateStrengthsMobile();
        } else {
            updateStrengthsDesktop();
        }
    }
    
    function updateStrengthsMobile() {
        strengthsContainer.style.position = "relative";
        strengthsSlides.forEach((slide, i) => {
            slide.style.position = "absolute";
            slide.style.top = 0;
            slide.style.left = 0;
            slide.style.width = "100%";
            
            if (i === strengthsIndex) {
                slide.style.opacity = "1";
                slide.style.transform = "scale(1)";
                slide.style.zIndex = "10";
                slide.style.pointerEvents = "auto";
            } else {
                slide.style.opacity = "0";
                slide.style.transform = "scale(0.95)";
                slide.style.zIndex = "0";
                slide.style.pointerEvents = "none";
            }
        });
        
        setTimeout(() => {
            const visibleSlide = strengthsSlides[strengthsIndex];
            strengthsContainer.style.height = visibleSlide.offsetHeight + "px";
        }, 100);
    }
    
    function updateStrengthsDesktop() {
        strengthsContainer.style.display = "flex";
        strengthsContainer.style.overflow = "hidden";
        strengthsContainer.style.position = "relative";
        
        strengthsSlides.forEach((slide, i) => {
            slide.style.transition = "transform 0.5s ease, opacity 0.5s ease";
            slide.style.flex = "0 0 33.3333%";
            slide.style.opacity = "0.5";
            slide.style.transform = "scale(0.95)";
            slide.style.zIndex = "0";
        });
        
        const prevIndex = (strengthsIndex - 1 + strengthsTotal) % strengthsTotal;
        const nextIndex = (strengthsIndex + 1) % strengthsTotal;
        
        strengthsContainer.innerHTML = '';
        strengthsContainer.appendChild(strengthsSlides[prevIndex]);
        strengthsContainer.appendChild(strengthsSlides[strengthsIndex]);
        strengthsContainer.appendChild(strengthsSlides[nextIndex]);
        
        // <-- Apply final styles on the next frame so transitions run correctly
        requestAnimationFrame(() => {
            strengthsSlides[prevIndex].style.opacity = "0.7";
            strengthsSlides[strengthsIndex].style.opacity = "1";
            strengthsSlides[strengthsIndex].style.transform = "scale(1)";
            strengthsSlides[strengthsIndex].style.zIndex = "10";
            strengthsSlides[nextIndex].style.opacity = "0.7";
        });
    }
    
    
    document.getElementById("strengths-next").addEventListener("click", () => {
        strengthsIndex = (strengthsIndex + 1) % strengthsTotal;
        updateStrengthsDisplay();
    });
    
    document.getElementById("strengths-prev").addEventListener("click", () => {
        strengthsIndex = (strengthsIndex - 1 + strengthsTotal) % strengthsTotal;
        updateStrengthsDisplay();
    });
    
    let strengthsAuto = setInterval(() => {
        strengthsIndex = (strengthsIndex + 1) % strengthsTotal;
        updateStrengthsDisplay();
    }, 4000);
    
    strengthsContainer.addEventListener("mouseenter", () => clearInterval(strengthsAuto));
    strengthsContainer.addEventListener("mouseleave", () => {
        strengthsAuto = setInterval(() => {
            strengthsIndex = (strengthsIndex + 1) % strengthsTotal;
            updateStrengthsDisplay();
        }, 4000);
    });
    
    window.addEventListener("load", updateStrengthsDisplay);
    window.addEventListener("resize", updateStrengthsDisplay);

    const track = document.getElementById("logoTrack");

const logos = track.innerHTML;

// duplique les logos plusieurs fois
track.innerHTML += logos + logos + logos;
});