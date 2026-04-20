<?php
// =============================================
// ADMIN — GET CONTACT MESSAGES
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$page = (int)($_GET['page'] ?? 1);
$limit = (int)($_GET['limit'] ?? 20);
$offset = ($page - 1) * $limit;

try {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM contact_messages");
    $total = $stmt->fetch()['total'];

    $stmt = $pdo->prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $messages = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $messages,
        'total' => (int) $total
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch messages.']);
}
?>