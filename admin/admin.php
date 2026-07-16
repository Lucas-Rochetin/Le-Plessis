<?php
session_start();
if (!isset($_SESSION["admin"])) {
  header("Location: login.php");
  exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Administration</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-6">

<div class="max-w-5xl mx-auto bg-white p-6 rounded shadow">
<h1 class="text-2xl font-bold mb-6">Administration</h1>

<a href="logout.php"
  class="absolute top-4 right-6 text-sm text-gray-600 hover:text-red-600">
  Déconnexion
</a>

<!-- DOCUMENTS -->
<h2 class="font-semibold mb-2">Documents PDF</h2>
<input id="docTitle" placeholder="Titre" class="border p-2 w-full mb-2">
<div id="docDrop" class="border-dashed border-2 p-6 text-center cursor-pointer">Drag & drop PDF</div>
<button onclick="addDoc()" class="mt-2 bg-orange-500 text-white px-4 py-2 rounded">Ajouter</button>
<ul id="docList" class="mt-4"></ul>

<hr class="my-8">

<!-- IMAGES -->
<h2 class="font-semibold mb-2">Images</h2>
<input id="imgTitle" placeholder="Titre" class="border p-2 w-full mb-2">
<div id="imgDrop" class="border-dashed border-2 p-6 text-center cursor-pointer">Drag & drop image</div>
<div id="preview" class="mt-2"></div>
<button onclick="addImg()" class="mt-2 bg-orange-500 text-white px-4 py-2 rounded">Ajouter</button>
<ul id="imgList" class="mt-4 grid grid-cols-3 gap-3"></ul>

</div>

<script>
/* =======================
   VARIABLES GLOBALES
======================= */
let currentDocPath = "";
let currentImgPath = "";

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
  initDropZone("docDrop", "document");
  initDropZone("imgDrop", "image");
  loadDocuments();
  loadImages();
});

/* =======================
   DRAG & DROP
======================= */
function initDropZone(zoneId, type) {
  const zone = document.getElementById(zoneId);

  zone.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "document" ? ".pdf" : "image/*";
    input.onchange = () => handleFile(input.files[0], type);
    input.click();
  });

  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("border-orange-500");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("border-orange-500");
  });

  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("border-orange-500");
    handleFile(e.dataTransfer.files[0], type);
  });
}

/* =======================
   UPLOAD FICHIER
======================= */
async function handleFile(file, type) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch("../api/upload.php", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    alert("❌ Erreur upload");
    return;
  }

  const data = await res.json();

  if (type === "document") {
    currentDocPath = data.path;
    document.getElementById("docDrop").innerHTML =
      "📄 " + file.name + " (prêt à enregistrer)";
  }

  if (type === "image") {
    currentImgPath = data.path;
    document.getElementById("preview").innerHTML =
      `<img src="../${data.path}" class="w-full max-h-48 object-contain rounded">`;
  }
}

/* =======================
   DOCUMENTS
======================= */
async function loadDocuments() {
  const res = await fetch("../api/documents.php");
  const docs = await res.json();
  const list = document.getElementById("docList");

  list.innerHTML = docs.map(d => `
    <li class="flex justify-between items-center border-b py-2">
      <span>${d.titre}</span>
      <button onclick="deleteDocument(${d.id})"
        class="text-red-600 hover:underline">Supprimer</button>
    </li>
  `).join("");
}

async function addDoc() {
  const titre = document.getElementById("docTitle").value;
  if (!titre || !currentDocPath) {
    alert("Titre ou document manquant");
    return;
  }

  await fetch("../api/documents.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titre,
      chemin: currentDocPath
    })
  });

  document.getElementById("docTitle").value = "";
  document.getElementById("docDrop").innerHTML = "Drag & drop PDF";
  currentDocPath = "";
  loadDocuments();
}

async function deleteDocument(id) {
  if (!confirm("Supprimer ce document ?")) return;
  await fetch(`../api/documents.php?id=${id}`, { method: "DELETE" });
  loadDocuments();
}

/* =======================
   IMAGES
======================= */
async function loadImages() {
  const res = await fetch("../api/images.php");
  const imgs = await res.json();
  const list = document.getElementById("imgList");

  list.innerHTML = imgs.map(i => `
    <div class="relative group">
      <img src="../${i.chemin}" class="rounded object-cover h-32 w-full">
      <button onclick="deleteImage(${i.id})"
        class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition">
        ✕
      </button>
    </div>
  `).join("");
}

async function addImg() {
  const titre = document.getElementById("imgTitle").value;
  if (!titre || !currentImgPath) {
    alert("Titre ou image manquante");
    return;
  }

  await fetch("../api/images.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titre,
      chemin: currentImgPath
    })
  });

  document.getElementById("imgTitle").value = "";
  document.getElementById("preview").innerHTML = "";
  currentImgPath = "";
  loadImages();
}

async function deleteImage(id) {
  if (!confirm("Supprimer cette image ?")) return;
  await fetch(`../api/images.php?id=${id}`, { method: "DELETE" });
  loadImages();
}
</script>

</body>
</html>
