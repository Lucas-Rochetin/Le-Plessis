document.addEventListener("DOMContentLoaded", async () => {
  const newsContainer = document.getElementById("news-container");
  const modalsContainer = document.getElementById("modals-container");

  // Choisit l'item dont la date est la plus proche sans dépasser aujourd'hui
  // (ex: plusieurs cartes snacking à l'avance, on affiche celle de la semaine en cours).
  function pickCurrentIndex(items) {
    const todayStr = new Date().toISOString().slice(0, 10);
    let bestIndex = 0;
    let bestDate = null;
    let soonestIndex = null;

    items.forEach((it, i) => {
      if (!it.date) return;
      if (it.date <= todayStr && (bestDate === null || it.date > bestDate)) {
        bestDate = it.date;
        bestIndex = i;
      }
      if (soonestIndex === null || it.date < items[soonestIndex].date) {
        soonestIndex = i;
      }
    });

    // Aucune carte encore valable aujourd'hui : on prend la plus proche à venir
    if (bestDate === null && soonestIndex !== null) return soonestIndex;
    return bestIndex;
  }

  // "2026-07-27" -> "Semaine du 27/07/2026"
  function formatWeekLabel(dateStr) {
    const [y, m, d] = dateStr.split("-");
    return `Semaine du ${d}/${m}/${y}`;
  }

  // Met à jour l'image affichée et, si fournis, le titre/la description/le bouton
  // pour qu'ils suivent la diapositive courante du carrousel.
  function setupCarouselNav(modalId, items, { showButton, startIndex = 0, getTitle } = {}) {
    let index = startIndex;
    const carousel = document.getElementById(`${modalId}-carousel`);
    if (!carousel) return;
    const total = carousel.children.length;
    const titleEl = document.getElementById(`${modalId}-title`);
    const descEl = document.getElementById(`${modalId}-description`);
    const buttonWrap = document.getElementById(`${modalId}-button-wrap`);

    function update() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      if (items && items[index]) {
        const it = items[index];
        if (titleEl) titleEl.textContent = getTitle ? getTitle(it, index, startIndex) : it.titre;
        if (descEl) descEl.textContent = it.description;
        if (showButton && buttonWrap) {
          buttonWrap.innerHTML = `<a href="${it.lien}" ${
            it.typeLien === "download"
              ? "download"
              : 'target="_blank" rel="noopener noreferrer"'
          } class="bg-black text-white px-4 py-2 rounded inline-block transition">${it.texteBouton}</a>`;
        }
      }
    }

    document.querySelector(`#${modalId} .next-carousel`)?.addEventListener("click", () => {
      index = (index + 1) % total;
      update();
    });

    document.querySelector(`#${modalId} .prev-carousel`)?.addEventListener("click", () => {
      index = (index - 1 + total) % total;
      update();
    });

    update();
  }

  // === Galerie photo simple (Nos évènements précédents) ===
  async function renderPhotoGallery({ jsonFile, modalId, title }) {
    try {
      const res = await fetch(jsonFile);
      const galerie = await res.json();
      const photos = galerie.map((p) => p.image);
      if (!photos.length) return;

      const card = document.createElement("div");
      card.className =
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 md:w-96 mx-auto";

      card.innerHTML = `
        <div data-modal="${modalId}">
            <img src="${photos[0]}"
                 alt="${title}"
                 class="w-full h-[30rem] md:h-[36rem] object-cover rounded-lg pt-4">

            <div class="pt-4 text-center pb-4">
                <h3 class="text-xl font-semibold mb-2 text-gray-800">${title}</h3>
                <button class="bg-black text-white px-4 py-2 rounded inline-block transition">
                    Voir les photos
                </button>
            </div>
        </div>
      `;

      newsContainer.appendChild(card);

      const modal = document.createElement("div");
      modal.id = modalId;
      modal.className =
        "popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50";

      modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg px-6 py-4 w-full max-w-md md:max-w-3xl relative">
          <button class="close-modal absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
          <h2 class="text-2xl font-semibold mb-4 text-center">${title}</h2>

          <div class="flex items-center justify-between mb-4">
              <button class="prev-carousel bg-black text-white px-3 py-2 rounded">‹</button>

              <div class="overflow-hidden rounded-lg h-[30rem] md:h-[36rem] w-full mx-2">
                  <div id="${modalId}-carousel" class="carousel-images flex transition-transform duration-500 ease-in-out h-full">
                      ${photos.map((src, i) => `<img src="${src}" class="min-w-full h-full object-contain flex-shrink-0" alt="Photo ${i + 1}">`).join("")}
                  </div>
              </div>

              <button class="next-carousel bg-black text-white px-3 py-2 rounded">›</button>
          </div>
      </div>
      `;

      modalsContainer.appendChild(modal);

      setupCarouselNav(modalId);
    } catch (error) {
      console.error(`Erreur de chargement de la galerie (${jsonFile}) :`, error);
    }
  }

  // Trie par date croissante si les items en ont (ex: cartes snacking), sinon inchangé
  function sortByDateIfPresent(items) {
    if (!items.length || !items[0].date) return items;
    return [...items].sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
  }

  // === Carrousel de fiches (titre + description qui suivent l'image, bouton optionnel) ===
  async function renderFicheCarousel({ jsonFile, modalId, title, showButton, titleForSlide }) {
    try {
      const res = await fetch(jsonFile);
      const items = sortByDateIfPresent(await res.json());
      if (!items.length) return;

      const startIndex = pickCurrentIndex(items);
      const current = items[startIndex];
      const getTitle = titleForSlide || ((it) => it.titre);

      const card = document.createElement("div");
      card.className =
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 md:w-96 mx-auto";

      card.innerHTML = `
        <div data-modal="${modalId}">
            <img src="${current.image}"
                 alt="${title}"
                 class="w-full h-[30rem] md:h-[36rem] object-cover rounded-lg pt-4">

            <div class="pt-4 text-center pb-4">
                <h3 class="text-xl font-semibold mb-2 text-gray-800">${title}</h3>
                <button class="bg-black text-white px-4 py-2 rounded inline-block transition">
                    Découvrir
                </button>
            </div>
        </div>
      `;

      newsContainer.appendChild(card);

      const modal = document.createElement("div");
      modal.id = modalId;
      modal.className =
        "popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50";

      modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg px-6 py-4 w-full max-w-md md:max-w-3xl relative">
          <button class="close-modal absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
          <h2 id="${modalId}-title" class="text-2xl font-semibold mb-4 text-center">${getTitle(current, startIndex, startIndex)}</h2>

          <div class="flex items-center justify-between mb-4">
              <button class="prev-carousel bg-black text-white px-3 py-2 rounded">‹</button>

              <div class="overflow-hidden rounded-lg h-[30rem] md:h-[36rem] w-full mx-2">
                  <div id="${modalId}-carousel" class="carousel-images flex transition-transform duration-500 ease-in-out h-full">
                      ${items.map((it, i) => `<img src="${it.image}" class="min-w-full h-full object-contain flex-shrink-0" alt="Photo ${i + 1}">`).join("")}
                  </div>
              </div>

              <button class="next-carousel bg-black text-white px-3 py-2 rounded">›</button>
          </div>

          <p id="${modalId}-description" class="text-gray-700 text-sm leading-relaxed text-center">${current.description}</p>
          ${showButton ? `<div id="${modalId}-button-wrap" class="text-center mt-4"></div>` : ""}
      </div>
      `;

      modalsContainer.appendChild(modal);

      setupCarouselNav(modalId, items, { showButton, startIndex, getTitle });
    } catch (error) {
      console.error(`Erreur de chargement (${jsonFile}) :`, error);
    }
  }

  await renderPhotoGallery({
    jsonFile: "evenements-precedents.json",
    modalId: "special-modal",
    title: "Nos évènements précédents",
  });

  await renderFicheCarousel({
    jsonFile: "carte-snacking.json",
    modalId: "snacking-modal",
    title: "Carte snacking de la semaine",
    showButton: true,
    titleForSlide: (it, i, currentIndex) =>
      i === currentIndex ? "Carte snacking de la semaine" : formatWeekLabel(it.date),
  });

  await renderFicheCarousel({
    jsonFile: "futurs-evenements.json",
    modalId: "futurs-modal",
    title: "Nos Futurs Évènements",
    showButton: false,
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
});
