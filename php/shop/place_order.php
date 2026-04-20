<?php
// =============================================
// PLACE ORDER (creates order, payment happens next)
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login to place an order.']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = getUserId();

// Get & Validate shipping info
$shippingName = trim(htmlspecialchars($data['shipping_name'] ?? ''));
$shippingEmail = trim(htmlspecialchars($data['shipping_email'] ?? ''));
$shippingAddress = trim(htmlspecialchars($data['shipping_address'] ?? ''));
$shippingCity = trim(htmlspecialchars($data['shipping_city'] ?? ''));
$shippingZip = trim(htmlspecialchars($data['shipping_zip'] ?? ''));
$shippingPhone = trim(htmlspecialchars($data['shipping_phone'] ?? ''));

$errors = [];
if (empty($shippingName)) $errors[] = "Name is required.";
if (empty($shippingEmail) || !filter_var($shippingEmail, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
if (empty($shippingAddress)) $errors[] = "Address is required.";
if (empty($shippingCity)) $errors[] = "City is required.";
if (empty($shippingZip)) $errors[] = "ZIP code is required.";
if (empty($shippingPhone)) $errors[] = "Phone number is required.";

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit();
}

try {
    // Get cart items
    $stmt = $pdo->prepare("SELECT c.quantity, b.id as book_id, b.title, b.price FROM cart c JOIN books b ON c.book_id = b.id WHERE c.user_id = ?");
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll();

    if (empty($cartItems)) {
        echo json_encode(['success' => false, 'message' => 'Your cart is empty.']);
        exit();
    }

    // Calculate total
    $totalAmount = 0;
    foreach ($cartItems as $item) {
        $totalAmount += $item['price'] * $item['quantity'];
    }

    // Begin transaction
    $pdo->beginTransaction();

    // Create order with pending payment
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_name, shipping_email, shipping_address, shipping_city, shipping_zip, shipping_phone) VALUES (?, ?, 'pending', 'pending', 'pending', ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $totalAmount, $shippingName, $shippingEmail, $shippingAddress, $shippingCity, $shippingZip, $shippingPhone]);

    $orderId = $pdo->lastInsertId();

    // Create order items
    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($cartItems as $item) {
        $stmt->execute([$orderId, $item['book_id'], $item['quantity'], $item['price']]);
    }

    // Clear cart
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->execute([$userId]);

    // Commit
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order created! Please complete payment.',
        'orderId' => (int) $orderId,
        'total' => round($totalAmount, 2)
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Failed to place order. Please try again.'
    ]);
}
?>