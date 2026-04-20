<?php
// =============================================
// UPDATE CART ITEM QUANTITY
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
$change = (int)($data['change'] ?? 0);
$userId = getUserId();

if ($bookId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

try {
    // Get current quantity
    $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$userId, $bookId]);
    $item = $stmt->fetch();

    if (!$item) {
        echo json_encode(['success' => false, 'message' => 'Item not in cart.']);
        exit();
    }

    $newQuantity = $item['quantity'] + $change;

    if ($newQuantity <= 0) {
        // Remove item
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
        $stmt->execute([$item['id']]);
        $message = "Item removed from cart.";
    } else {
        // Update quantity
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $item['id']]);
        $message = "Cart updated.";
    }

    // Get updated cart total
    $stmt = $pdo->prepare("SELECT SUM(c.quantity * b.price) as total, SUM(c.quantity) as count 
                           FROM cart c 
                           JOIN books b ON c.book_id = b.id 
                           WHERE c.user_id = ?");
    $stmt->execute([$userId]);
    $cartInfo = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => $message,
        'total' => round($cartInfo['total'] ?? 0, 2),
        'count' => (int)($cartInfo['count'] ?? 0)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update cart.'
    ]);
}
?>