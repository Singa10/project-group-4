<?php
// =============================================
// ADMIN — GET ALL ORDERS
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$page = (int)($_GET['page'] ?? 1);
$limit = (int)($_GET['limit'] ?? 20);
$status = $_GET['status'] ?? '';
$offset = ($page - 1) * $limit;

try {
    $where = '';
    $params = [];

    if (!empty($status)) {
        $where = "WHERE o.status = ?";
        $params[] = $status;
    }

    $countSql = "SELECT COUNT(*) as total FROM orders o $where";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];

    $sql = "SELECT o.*, o.payment_method, o.payment_status, o.transaction_id, u.username, u.email as user_email
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            $where 
            ORDER BY o.created_at DESC 
            LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    // Get order items for each order
    foreach ($orders as &$order) {
        $stmt = $pdo->prepare("SELECT oi.*, b.title, b.image 
                               FROM order_items oi 
                               JOIN books b ON oi.book_id = b.id 
                               WHERE oi.order_id = ?");
        $stmt->execute([$order['id']]);
        $order['items'] = $stmt->fetchAll();
    }

    echo json_encode([
        'success' => true,
        'data' => $orders,
        'total' => (int) $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch orders.']);
}
?>