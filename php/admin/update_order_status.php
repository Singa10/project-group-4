<?php
// =============================================
// ADMIN — UPDATE ORDER STATUS
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$data = json_decode(file_get_contents('php://input'), true);
$orderId = (int)($data['order_id'] ?? 0);
$status = trim($data['status'] ?? '');

$validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

if ($orderId <= 0) {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid order ID.'
    ]);
    exit();
}

if (!in_array($status, $validStatuses)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid status. Must be: ' . implode(', ', $validStatuses)
    ]);
    exit();
}

try {
    // Check if order exists
    $stmt = $pdo->prepare("SELECT id, status FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();

    if (!$order) {
        echo json_encode([
            'success' => false, 
            'message' => 'Order not found.'
        ]);
        exit();
    }

    $oldStatus = $order['status'];

    // Update the status
    $stmt = $pdo->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    echo json_encode([
        'success' => true,
        'message' => "Order #$orderId updated from '$oldStatus' to '$status'.",
        'oldStatus' => $oldStatus,
        'newStatus' => $status
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to update order status.'
    ]);
}
?>