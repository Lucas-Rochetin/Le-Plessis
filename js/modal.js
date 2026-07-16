document.addEventListener("DOMContentLoaded", () => {
    // --- MODALS GÉNÉRAUX ---
    document.querySelectorAll(".open-modal").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".popup-modal")[index].classList.remove("hidden");
        });
    });
    
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".popup-modal, .reservation-modal, .carousel-modal").classList.add("hidden");
        });
    });
    
    document.querySelectorAll(".popup-modal, .reservation-modal, .carousel-modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });
        
        const carousel = modal.querySelector(".carousel-images");
        if (carousel) {
            let index = 0;
            const images = carousel.querySelectorAll("img");
            
            modal.querySelector(".prev-carousel")?.addEventListener("click", () => {
                index = (index - 1 + images.length) % images.length;
                carousel.style.transform = `translateX(-${index * 100}%)`;
            });
            
            modal.querySelector(".next-carousel")?.addEventListener("click", () => {
                index = (index + 1) % images.length;
                carousel.style.transform = `translateX(-${index * 100}%)`;
            });
        }
    });
    
    // --- MODALS spécifiques (réservation / visite) ---
    document.querySelectorAll(".open-reservation").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".reservation-modal").classList.remove("hidden");
        });
    });
    
    document.querySelectorAll(".open-carousel").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".carousel-modal").classList.remove("hidden");
        });
    });
    
    // Ouvrir la modale
    document.getElementById("openReservationModal").addEventListener("click", function () {
        document.getElementById("reservationModal").classList.remove("hidden");
    });
    
    // Fermer la modale
    document.getElementById("closeReservationModal").addEventListener("click", function () {
        document.getElementById("reservationModal").classList.add("hidden");
    });
    
    // Fermer la modale si on clique en dehors
    document.getElementById("reservationModal").addEventListener("click", function (e) {
        if (e.target === this) {
            this.classList.add("hidden");
        }
    });
    
    const modal = document.getElementById("welcomeModal");
    const closeBtn = document.getElementById("closeWelcomeModal");
    
    const lastSeen = localStorage.getItem("welcomeModalSeenAt");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastSeen || now - lastSeen > oneDay) {
        modal.classList.remove("hidden");
    }
    
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        localStorage.setItem("welcomeModalSeenAt", now);
    });
});