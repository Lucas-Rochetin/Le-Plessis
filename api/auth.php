<?php
session_start();
require "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("SELECT * FROM users WHERE username=?");
$stmt->execute([$data["username"]]);
$user = $stmt->fetch();

if ($user && password_verify($data["password"], $user["password"])) {
  $_SESSION["admin"] = true;
  echo json_encode(["success" => true]);
} else {
  http_response_code(401);
}
