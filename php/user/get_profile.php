<?php
// =============================================
// GET USER SESSION INFO (for navbar updates)
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode([
        'success' => false,
        'loggedIn' => false
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?");
    $stmt->execute([getUserId()]);
    $user = $stmt->fetch();

    // Get cart count
    $stmt = $pdo->prepare("SELECT SUM(quantity) as count FROM cart WHERE user_id = ?");
    $stmt->execute([getUserId()]);
    $cartCount = $stmt->fetch()['count'] ?? 0;

    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'data' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'cartCount' => (int) $cartCount
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to get profile.'
    ]);
}
?>