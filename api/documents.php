<?php
session_start();
require "../config/database.php";
if (!isset($_SESSION["admin"])) exit;

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  echo json_encode($pdo->query("SELECT * FROM documents")->fetchAll());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $d = json_decode(file_get_contents("php://input"), true);
  $pdo->prepare("INSERT INTO documents (titre, chemin) VALUES (?,?)")
      ->execute([$d["titre"], $d["chemin"]]);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
  $pdo->prepare("DELETE FROM documents WHERE id=?")
      ->execute([$_GET["id"]]);
}
