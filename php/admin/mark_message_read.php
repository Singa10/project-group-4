<?php
// =============================================
// ADMIN — Mark Message as Read
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$data = json_decode(file_get_contents('php://input'), true);
$messageId = (int)($data['message_id'] ?? 0);

if ($messageId <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid message ID.'
    ]);
    exit();
}

try {
    // Check if message exists
    $stmt = $pdo->prepare("SELECT id, is_read FROM contact_messages WHERE id = ?");
    $stmt->execute([$messageId]);
    $msg = $stmt->fetch();

    if (!$msg) {
        echo json_encode([
            'success' => false,
            'message' => 'Message not found.'
        ]);
        exit();
    }

    if ($msg['is_read']) {
        echo json_encode([
            'success' => true,
            'message' => 'Message already marked as read.'
        ]);
        exit();
    }

    // Mark as read
    $stmt = $pdo->prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ?");
    $stmt->execute([$messageId]);

    echo json_encode([
        'success' => true,
        'message' => 'Message marked as read.'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again.'
    ]);
}
?>