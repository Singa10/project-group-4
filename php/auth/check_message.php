<?php
// =============================================
// CHECK SESSION MESSAGES
// Returns any error/success messages from PHP session
// =============================================

session_start();
header('Content-Type: application/json');

$response = [];

if (isset($_SESSION['error'])) {
    $response['error'] = $_SESSION['error'];
    unset($_SESSION['error']);
}

if (isset($_SESSION['success'])) {
    $response['success'] = $_SESSION['success'];
    unset($_SESSION['success']);
}

echo json_encode($response);
?>