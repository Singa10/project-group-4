<?php
// =============================================
// ADMIN — GET ALL USERS
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$page = (int)($_GET['page'] ?? 1);
$limit = (int)($_GET['limit'] ?? 20);
$search = $_GET['search'] ?? '';
$offset = ($page - 1) * $limit;

try {
    $where = '';
    $params = [];

    if (!empty($search)) {
        $where = "WHERE username LIKE ? OR email LIKE ?";
        $params = ["%$search%", "%$search%"];
    }

    $countSql = "SELECT COUNT(*) as total FROM users $where";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];

    $sql = "SELECT id, username, email, role, created_at 
            FROM users $where 
            ORDER BY created_at DESC 
            LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll();

    // Get order count for each user
    foreach ($users as &$user) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_spent 
                               FROM orders WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $orderInfo = $stmt->fetch();
        $user['order_count'] = (int) $orderInfo['order_count'];
        $user['total_spent'] = round($orderInfo['total_spent'], 2);
    }

    echo json_encode([
        'success' => true,
        'data' => $users,
        'total' => (int) $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch users.']);
}
?>