document.addEventListener("DOMContentLoaded", async () => {
  const newsContainer = document.getElementById("news-container");
  const modalsContainer = document.getElementById("modals-container");

  // === ACTUALITÉ SPÉCIALE : Nos évènements précédents ===
  const specialCard = document.createElement("div");
  specialCard.className =
    "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 md:w-96 mx-auto";

  specialCard.innerHTML = `
    <div data-modal="special-modal">
        <img src="images/evenement-affiche.png"
             alt="Nos évènements précédents"
             class="w-full h-[30rem] md:h-[36rem] object-cover rounded-lg pt-4">
        
        <div class="pt-4 text-center pb-4">
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Nos évènements précédents</h3>
            <button class="bg-black text-white px-4 py-2 rounded inline-block transition">
                Voir les photos
            </button>
        </div>
    </div>
  `;

  newsContainer.appendChild(specialCard);

  // === Modale de l’actualité spéciale ===
  const specialModal = document.createElement("div");
  specialModal.id = "special-modal";
  specialModal.className =
    "popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50";

  specialModal.innerHTML = `
  <div class="bg-white rounded-lg shadow-lg px-6 py-4 w-full max-w-md md:max-w-3xl relative">
      <button class="close-modal absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
      <h2 class="text-2xl font-semibold mb-4 text-center">Nos évènements précédents</h2>
  
      <!-- Carousel -->
      <div class="flex items-center justify-between mb-4">
          <button class="prev-carousel bg-black text-white px-3 py-2 rounded">‹</button>
  
          <div class="overflow-hidden rounded-lg h-[30rem] md:h-[36rem] w-full mx-2">
              <div id="special-carousel" class="carousel-images flex transition-transform duration-500 ease-in-out h-full">
                  <img src="images/evenement-concert_mars.webp" class="min-w-full h-full object-contain flex-shrink-0" alt="Evenement 1">
                  <img src="images/evenement2.webp" class="min-w-full h-full object-contain flex-shrink-0" alt="Evenement 2">
                  <img src="images/evenement3.webp" class="min-w-full h-full object-contain flex-shrink-0" alt="Evenement 3">
                  <img src="images/evenement4.webp" class="min-w-full h-full object-contain flex-shrink-0" alt="Evenement 4">
              </div>
          </div>
  
          <button class="next-carousel bg-black text-white px-3 py-2 rounded">›</button>
      </div>
  </div>
  `;

  modalsContainer.appendChild(specialModal);

  try {
    const response = await fetch("actualites.json");
    const actualites = await response.json();

    actualites.forEach((actu, index) => {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 md:w-96 mx-auto";

      card.innerHTML = `
        <img src="${actu.image}" alt="${actu.titre}"
          class="w-full h-[30rem] md:h-[36rem] object-cover rounded-lg pt-4"
          data-modal="modal-${index}">
        <div class="pt-4 pb-4 text-center">
          <h3 class="text-xl font-semibold mb-2 text-gray-800">${actu.titre}</h3>
          <a href="${actu.lien}" ${
        actu.typeLien === "download"
          ? "download"
          : 'target="_blank" rel="noopener noreferrer"'
      } class="bg-black text-white px-4 py-2 rounded inline-block transition">
            ${actu.texteBouton}
          </a>
        </div>
      `;

      newsContainer.appendChild(card);

      const modal = document.createElement("div");
      modal.id = `modal-${index}`;
      modal.className =
        "popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50";

      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg px-6 py-4 w-full max-w-md relative">
          <button class="close-modal absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold">&times;</button>
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">${actu.titre}</h2>
          <p class="text-gray-700 text-sm leading-relaxed">${actu.description}</p>
        </div>
      `;

      modalsContainer.appendChild(modal);
    });

    document.querySelectorAll("[data-modal]").forEach((img) => {
      img.addEventListener("click", () => {
        document.getElementById(img.dataset.modal).classList.remove("hidden");
      });
    });

    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("close-modal") ||
        e.target.classList.contains("popup-modal")
      ) {
        e.target.closest(".popup-modal").classList.add("hidden");
      }
    });
  } catch (error) {
    console.error("Erreur de chargement des actualités :", error);
  }

  let specialIndex = 0;
  const specialCarousel = document.getElementById("special-carousel");
  const specialImages = specialCarousel ? Array.from(specialCarousel.children) : [];
  const totalSpecial = specialImages.length;

  function updateSpecialCarousel() {
    specialCarousel.style.transform = `translateX(-${specialIndex * 100}%)`;
  }

  document.querySelector("#special-modal .next-carousel")?.addEventListener("click", () => {
    specialIndex = (specialIndex + 1) % totalSpecial;
    updateSpecialCarousel();
  });

  document.querySelector("#special-modal .prev-carousel")?.addEventListener("click", () => {
    specialIndex = (specialIndex - 1 + totalSpecial) % totalSpecial;
    updateSpecialCarousel();
  });
});