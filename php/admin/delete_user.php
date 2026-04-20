<?php
// =============================================
// ADMIN — DELETE USER
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$data = json_decode(file_get_contents('php://input'), true);
$userId = (int)($data['user_id'] ?? 0);

if ($userId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
    exit();
}

// Prevent deleting yourself
if ($userId === getUserId()) {
    echo json_encode(['success' => false, 'message' => 'Cannot delete your own account.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT username, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit();
    }

    if ($user['role'] === 'admin') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete admin accounts.']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    echo json_encode([
        'success' => true,
        'message' => "User '{$user['username']}' deleted successfully!"
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete user.']);
}
?>