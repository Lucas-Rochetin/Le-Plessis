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
    const modalImage = document.getElementById("welcomeModalImage");

    // Affiche automatiquement l'image de la carte snacking dont la date
    // est la plus proche sans dépasser aujourd'hui (celle de la semaine en cours).
    fetch("carte-snacking.json")
        .then((res) => res.json())
        .then((items) => {
            if (!items.length) return;
            const todayStr = new Date().toISOString().slice(0, 10);
            let current = items[0];
            let bestDate = null;
            let soonest = items[0];

            items.forEach((it) => {
                if (!it.date) return;
                if (it.date <= todayStr && (bestDate === null || it.date > bestDate)) {
                    bestDate = it.date;
                    current = it;
                }
                if (it.date < soonest.date) soonest = it;
            });

            modalImage.src = (bestDate === null ? soonest : current).image;
        })
        .catch((error) => console.error("Erreur de chargement de la carte snacking :", error));

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