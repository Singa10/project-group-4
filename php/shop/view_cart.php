<?php
// =============================================
// VIEW CART ITEMS
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to view cart.',
        'requireLogin' => true,
        'data' => [],
        'total' => 0
    ]);
    exit();
}

$userId = getUserId();

try {
    $stmt = $pdo->prepare("SELECT c.id as cart_id, c.quantity, 
                                  b.id as book_id, b.title, b.author, 
                                  b.price, b.image 
                           FROM cart c 
                           JOIN books b ON c.book_id = b.id 
                           WHERE c.user_id = ? 
                           ORDER BY c.created_at DESC");
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll();

    $total = 0;
    foreach ($items as &$item) {
        $item['subtotal'] = $item['price'] * $item['quantity'];
        $total += $item['subtotal'];
    }

    echo json_encode([
        'success' => true,
        'data' => $items,
        'total' => round($total, 2),
        'count' => array_sum(array_column($items, 'quantity'))
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch cart.'
    ]);
}
?>