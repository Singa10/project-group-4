<?php
// =============================================
// REMOVE ITEM FROM CART
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login.']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$bookId = (int)($data['book_id'] ?? 0);
$userId = getUserId();

if ($bookId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

try {
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$userId, $bookId]);

    // Get updated totals
    $stmt = $pdo->prepare("SELECT SUM(c.quantity * b.price) as total, SUM(c.quantity) as count 
                           FROM cart c 
                           JOIN books b ON c.book_id = b.id 
                           WHERE c.user_id = ?");
    $stmt->execute([$userId]);
    $cartInfo = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Item removed from cart.',
        'total' => round($cartInfo['total'] ?? 0, 2),
        'count' => (int)($cartInfo['count'] ?? 0)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to remove item.'
    ]);
}
?>