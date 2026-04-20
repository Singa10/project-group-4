<?php
// =============================================
// ADD TO CART
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

// ---- Check if user is logged in ----
if (!isLoggedIn()) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to add items to cart.',
        'requireLogin' => true
    ]);
    exit();
}

// ---- Get input ----
$data = json_decode(file_get_contents('php://input'), true);
$bookId = (int)($data['book_id'] ?? 0);
$quantity = (int)($data['quantity'] ?? 1);
$userId = getUserId();

if ($bookId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

try {
    // Check if book exists and is in stock
    $stmt = $pdo->prepare("SELECT id, title, price, in_stock FROM books WHERE id = ?");
    $stmt->execute([$bookId]);
    $book = $stmt->fetch();

    if (!$book) {
        echo json_encode(['success' => false, 'message' => 'Book not found.']);
        exit();
    }

    if (!$book['in_stock']) {
        echo json_encode(['success' => false, 'message' => 'Book is out of stock.']);
        exit();
    }

    // Check if item already in cart
    $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND book_id = ?");
    $stmt->execute([$userId, $bookId]);
    $existingItem = $stmt->fetch();

    if ($existingItem) {
        // Update quantity
        $newQuantity = $existingItem['quantity'] + $quantity;
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $existingItem['id']]);
    } else {
        // Insert new item
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $bookId, $quantity]);
    }

    // Get updated cart count
    $stmt = $pdo->prepare("SELECT SUM(quantity) as total FROM cart WHERE user_id = ?");
    $stmt->execute([$userId]);
    $cartCount = $stmt->fetch()['total'] ?? 0;

    echo json_encode([
        'success' => true,
        'message' => $book['title'] . ' added to cart!',
        'cartCount' => (int) $cartCount
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to add item to cart.'
    ]);
}
?>