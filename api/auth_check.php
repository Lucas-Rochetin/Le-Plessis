<?php
session_start();

if(
    !isset($_SESSION["admin"])
    ||
    $_SESSION["admin"] !== true
){

    http_response_code(401);

    echo json_encode([
        "success"=>false
    ]);

    exit;

}