<?php
// =============================================
// ADMIN — DELETE BOOK
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT title FROM books WHERE id = ?");
    $stmt->execute([$id]);
    $book = $stmt->fetch();

    if (!$book) {
        echo json_encode(['success' => false, 'message' => 'Book not found.']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => "Book '{$book['title']}' deleted successfully!"
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to delete book.']);
}
?>