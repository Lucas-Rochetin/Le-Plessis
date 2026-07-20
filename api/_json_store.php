<?php
// Ne supprime que les fichiers réellement uploadés via le drag & drop
// (nommés "timestamp_nom" par upload.php) — jamais les assets d'origine du site.
function maybeDeleteUploadedFile($siteRoot, $relativePath) {
  if (!is_string($relativePath)) return;
  if (!preg_match('#^(images/uploads|documents)/\d+_#', $relativePath)) return;
  $fullPath = $siteRoot . "/" . $relativePath;
  if (is_file($fullPath)) {
    @unlink($fullPath);
  }
}

// Supprime les fichiers de $oldEntry qui ne sont plus référencés dans $newEntry
function deleteOrphanedFiles($siteRoot, $oldEntry, $newEntry = null) {
  if (!is_array($oldEntry)) return;
  foreach ($oldEntry as $key => $value) {
    $stillUsed = $newEntry !== null && isset($newEntry[$key]) && $newEntry[$key] === $value;
    if (!$stillUsed) {
      maybeDeleteUploadedFile($siteRoot, $value);
    }
  }
}

function handleJsonStore($file) {
  session_start();
  header("Content-Type: application/json");

  if (!isset($_SESSION["admin"]) || $_SESSION["admin"] !== true) {
    http_response_code(401);
    exit;
  }

  $siteRoot = dirname($file);
  $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
  if (!is_array($data)) $data = [];

  if ($_SERVER["REQUEST_METHOD"] === "GET") {
    echo json_encode($data);
    exit;
  }

  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    $index = $input["index"] ?? null;
    unset($input["index"]);

    if ($index !== null && isset($data[$index])) {
      deleteOrphanedFiles($siteRoot, $data[$index], $input);
      $data[$index] = $input;
    } else {
      $data[] = $input;
    }

    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    echo json_encode(["success" => true]);
    exit;
  }

  if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $index = $_GET["index"] ?? null;
    if ($index !== null && isset($data[$index])) {
      deleteOrphanedFiles($siteRoot, $data[$index], null);
      array_splice($data, (int)$index, 1);
      file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
    echo json_encode(["success" => true]);
    exit;
  }

  http_response_code(405);
}
