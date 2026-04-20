<?php
// =============================================
// FETCH ALL CATEGORIES
// =============================================

require_once '../../config/db.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT c.*, COUNT(b.id) as book_count 
                         FROM categories c 
                         LEFT JOIN books b ON c.id = b.category_id 
                         GROUP BY c.id 
                         ORDER BY c.name ASC");
    $categories = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $categories
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch categories.'
    ]);
}
?>