<?php
session_start();
require "../admin/database.php";
if (!isset($_SESSION["admin"])) exit;

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  echo json_encode($pdo->query("SELECT * FROM images")->fetchAll());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $i = json_decode(file_get_contents("php://input"), true);
  $pdo->prepare("INSERT INTO images (titre, chemin) VALUES (?,?)")
      ->execute([$i["titre"], $i["chemin"]]);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
  $pdo->prepare("DELETE FROM images WHERE id=?")
      ->execute([$_GET["id"]]);
}
