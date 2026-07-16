document.addEventListener("DOMContentLoaded", async () => {
  const newsList = document.getElementById("news-list");
  const addBtn = document.getElementById("add-news-btn");

  // Chargement du fichier actualites.json
  const response = await fetch("actualites.json");
  let actualites = await response.json();

  // Fonction d'affichage
  function renderNews() {
    newsList.innerHTML = "";
    actualites.forEach((actu, i) => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow";
      card.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${actu.titre}</h3>
        <p class="text-sm mb-2">${actu.description}</p>
        <a href="${actu.lien}" target="_blank" class="text-blue-600 underline">${actu.lien}</a>
        <div class="mt-3 flex gap-2">
          <button class="bg-yellow-500 text-white px-3 py-1 rounded edit">Modifier</button>
          <button class="bg-red-600 text-white px-3 py-1 rounded delete">Supprimer</button>
        </div>
      `;

      card.querySelector(".delete").addEventListener("click", () => {
        actualites.splice(i, 1);
        renderNews();
        saveChanges();
      });

      card.querySelector(".edit").addEventListener("click", () => {
        const titre = prompt("Titre :", actu.titre);
        const description = prompt("Description :", actu.description);
        if (titre && description) {
          actualites[i].titre = titre;
          actualites[i].description = description;
          renderNews();
          saveChanges();
        }
      });

      newsList.appendChild(card);
    });
  }

  // Ajouter une actualité
  addBtn.addEventListener("click", () => {
    const titre = prompt("Titre de l’actualité :");
    const description = prompt("Description :");
    const lien = prompt("Lien (URL ou PDF) :");
    const image = prompt("Image (URL) :");
    const typeLien = lien.endsWith(".pdf") ? "download" : "link";
    const texteBouton = typeLien === "download" ? "Télécharger" : "En savoir plus";

    if (titre && description && lien) {
      actualites.push({ titre, description, lien, image, typeLien, texteBouton });
      renderNews();
      saveChanges();
    }
  });

  // Sauvegarde (temporaire côté client)
  function saveChanges() {
    localStorage.setItem("actualites", JSON.stringify(actualites));
  }

  // Charger depuis localStorage si dispo
  const saved = localStorage.getItem("actualites");
  if (saved) actualites = JSON.parse(saved);

  renderNews();
});
