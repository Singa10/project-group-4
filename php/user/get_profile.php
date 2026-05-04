<?php
// =============================================
// GET USER SESSION INFO (for navbar updates)
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(array(
        'success' => false,
        'loggedIn' => false
    ));
    exit();
}

try {
    // Include profile_picture in SELECT
    $stmt = $pdo->prepare("SELECT id, username, email, role, profile_picture, created_at FROM users WHERE id = ?");
    $stmt->execute(array(getUserId()));
    $user = $stmt->fetch();

    // Get cart count
    $stmt2 = $pdo->prepare("SELECT SUM(quantity) as count FROM cart WHERE user_id = ?");
    $stmt2->execute(array(getUserId()));
    $cartCount = $stmt2->fetch();
    $count = $cartCount['count'] ? (int)$cartCount['count'] : 0;

    echo json_encode(array(
        'success' => true,
        'loggedIn' => true,
        'data' => array(
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'profile_picture' => $user['profile_picture'],
            'cartCount' => $count
        )
    ));

} catch (PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to get profile.'
    ));
}
?>