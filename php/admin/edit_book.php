<?php
// =============================================
// ADMIN — EDIT BOOK
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

$data = json_decode(file_get_contents('php://input'), true);

$id = (int)($data['id'] ?? 0);
$title = trim(htmlspecialchars($data['title'] ?? ''));
$author = trim(htmlspecialchars($data['author'] ?? ''));
$description = trim(htmlspecialchars($data['description'] ?? ''));
$price = (float)($data['price'] ?? 0);
$rating = (float)($data['rating'] ?? 0);
$reviews = (int)($data['reviews'] ?? 0);
$categoryId = (int)($data['category_id'] ?? 0);
$image = trim($data['image'] ?? '');
$badge = trim(htmlspecialchars($data['badge'] ?? ''));
$inStock = (int)($data['in_stock'] ?? 1);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

$errors = [];
if (empty($title)) $errors[] = "Title is required.";
if (empty($author)) $errors[] = "Author is required.";
if ($price <= 0) $errors[] = "Price must be greater than 0.";

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE books SET title=?, author=?, description=?, price=?, rating=?, reviews=?, category_id=?, image=?, badge=?, in_stock=?, updated_at=NOW() 
                           WHERE id=?");
    $stmt->execute([$title, $author, $description, $price, $rating, $reviews, $categoryId, $image, $badge, $inStock, $id]);

    echo json_encode([
        'success' => true,
        'message' => "Book '$title' updated successfully!"
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update book.']);
}
?>