<?php
// =============================================
// ADMIN — GET ALL BOOKS (with pagination)
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
        $where = "WHERE b.title LIKE ? OR b.author LIKE ?";
        $params = ["%$search%", "%$search%"];
    }

    // Count
    $countSql = "SELECT COUNT(*) as total FROM books b $where";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetch()['total'];

    // Fetch
    $sql = "SELECT b.*, c.name as category_name 
            FROM books b 
            LEFT JOIN categories c ON b.category_id = c.id 
            $where 
            ORDER BY b.created_at DESC 
            LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $books,
        'total' => (int) $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch books.']);
}
?>