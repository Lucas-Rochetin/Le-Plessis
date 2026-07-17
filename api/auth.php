<?php

session_start();

header("Content-Type: application/json");


require "../admin/database.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$username = $data["username"] ?? "";
$password = $data["password"] ?? "";


$stmt = $pdo->prepare(
    "SELECT * FROM users WHERE username=?"
);


$stmt->execute([$username]);


$user = $stmt->fetch();



if(
    $user &&
    password_verify($password, $user["password"])
){

    $_SESSION["admin"] = true;
    $_SESSION["username"] = $user["username"];


    echo json_encode([
        "success"=>true,
        "message"=>"Connexion réussie"
    ]);

    exit;


}



http_response_code(401);


echo json_encode([
    "success"=>false,
    "message"=>"Identifiants incorrects"
]);

exit;