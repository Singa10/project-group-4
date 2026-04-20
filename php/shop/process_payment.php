<?php
// =============================================
// PROCESS PAYMENT — With Confirmation Email
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/db.php';
require_once '../auth/session.php';
require_once '../../includes/email_helper.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login first.']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$orderId = (int)($data['order_id'] ?? 0);
$paymentMethod = trim($data['payment_method'] ?? '');
$transactionId = trim($data['transaction_id'] ?? '');

$validMethods = ['paypal', 'telebirr', 'cbe'];

if ($orderId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid order ID.']);
    exit();
}

if (!in_array($paymentMethod, $validMethods)) {
    echo json_encode(['success' => false, 'message' => 'Invalid payment method.']);
    exit();
}

try {
    // Verify order belongs to user
    $stmt = $pdo->prepare("SELECT o.*, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?");
    $stmt->execute([$orderId, getUserId()]);
    $order = $stmt->fetch();

    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Order not found.']);
        exit();
    }

    if ($order['payment_status'] === 'paid') {
        echo json_encode(['success' => false, 'message' => 'Order already paid.']);
        exit();
    }

    // Generate transaction ID if not provided
    if (empty($transactionId)) {
        $transactionId = strtoupper($paymentMethod) . '-' . time() . '-' . rand(1000, 9999);
    }

    // Update order with payment info
    $stmt = $pdo->prepare("UPDATE orders SET payment_method = ?, payment_status = 'paid', transaction_id = ?, status = 'processing', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$paymentMethod, $transactionId, $orderId]);

    // Get order items for email
    $stmt = $pdo->prepare("SELECT oi.*, b.title FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id = ?");
    $stmt->execute([$orderId]);
    $items = $stmt->fetchAll();

    // Send confirmation email
    $emailData = [
        'order_id' => $orderId,
        'total' => $order['total_amount'],
        'payment_method' => $paymentMethod,
        'transaction_id' => $transactionId,
        'shipping_name' => $order['shipping_name'],
        'shipping_address' => $order['shipping_address'],
        'shipping_city' => $order['shipping_city'],
        'shipping_zip' => $order['shipping_zip'],
        'items' => $items
    ];

    $emailSent = sendOrderConfirmation($order['shipping_email'], $emailData);

    echo json_encode([
        'success' => true,
        'message' => 'Payment successful!' . ($emailSent ? ' Confirmation email sent.' : ''),
        'transaction_id' => $transactionId,
        'order_id' => $orderId,
        'email_sent' => $emailSent
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Payment processing failed. Please try again.'
    ]);
}
?>