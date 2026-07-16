<?php
session_start();
if (!isset($_SESSION["admin"])) exit;

$type = $_POST["type"]; // "document" ou "image"
$file = $_FILES["file"];

$folders = [
  "document" => "../documents/",
  "image" => "../images/uploads/"
];

$allowed = [
  "document" => ["application/pdf"],
  "image" => ["image/jpeg", "image/png", "image/webp"]
];

if (!in_array($file["type"], $allowed[$type])) exit;

$name = time() . "_" . basename($file["name"]);
move_uploaded_file($file["tmp_name"], $folders[$type] . $name);

echo json_encode([
  "path" => ($type === "document" ? "documents/" : "images/uploads/") . $name
]);
