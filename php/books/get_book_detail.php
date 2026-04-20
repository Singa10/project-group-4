<?php
// =============================================
// FETCH SINGLE BOOK DETAILS
// =============================================

require_once '../../config/db.php';

header('Content-Type: application/json');

$id = (int)($_GET['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT b.*, c.name as category_name, c.slug as category_slug 
                           FROM books b 
                           LEFT JOIN categories c ON b.category_id = c.id 
                           WHERE b.id = ?");
    $stmt->execute([$id]);
    $book = $stmt->fetch();

    if (!$book) {
        echo json_encode(['success' => false, 'message' => 'Book not found.']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'data' => $book
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch book details.'
    ]);
}
?>