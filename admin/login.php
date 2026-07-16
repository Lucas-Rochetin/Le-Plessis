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
  <title>Connexion administration</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

<div class="bg-white p-6 rounded shadow w-80">
  <h1 class="text-xl font-bold text-center mb-4">Administration</h1>

  <label class="block mb-2 text-sm font-semibold">Identifiant</label>
  <input id="username" class="w-full border p-2 rounded mb-3">

  <label class="block mb-2 text-sm font-semibold">Mot de passe</label>
  <input id="password" type="password" class="w-full border p-2 rounded mb-4">

  <button onclick="login()"
    class="bg-orange-500 text-white w-full py-2 rounded hover:opacity-90 transition">
    Se connecter
  </button>

  <p id="error" class="text-red-600 text-sm mt-3 hidden text-center">
    Identifiants incorrects
  </p>
</div>

<script>
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("../api/auth.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    window.location.href = "admin.php";
  } else {
    document.getElementById("error").classList.remove("hidden");
  }
}
</script>

</body>
</html>
