<?php
// =============================================
// FETCH ALL BOOKS FROM DATABASE
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';

header('Content-Type: application/json');

// ---- Get filter parameters ----
$category = $_GET['category'] ?? '';
$priceRange = $_GET['price'] ?? '';
$rating = $_GET['rating'] ?? '';
$search = $_GET['search'] ?? '';
$sort = $_GET['sort'] ?? 'featured';
$page = (int)($_GET['page'] ?? 1);
$limit = (int)($_GET['limit'] ?? 12);
$offset = ($page - 1) * $limit;

try {
    // ---- Build query dynamically ----
    $where = [];
    $params = [];

    // Category filter
    if (!empty($category)) {
        $where[] = "c.slug = ?";
        $params[] = $category;
    }

    // Price filter
    if (!empty($priceRange)) {
        if (strpos($priceRange, '+') !== false) {
            $min = (float) str_replace('+', '', $priceRange);
            $where[] = "b.price >= ?";
            $params[] = $min;
        } else {
            $parts = explode('-', $priceRange);
            if (count($parts) === 2) {
                $where[] = "b.price >= ? AND b.price <= ?";
                $params[] = (float) $parts[0];
                $params[] = (float) $parts[1];
            }
        }
    }

    // Rating filter
    if (!empty($rating)) {
        $where[] = "b.rating >= ?";
        $params[] = (float) $rating;
    }

    // Search filter
    if (!empty($search)) {
        $where[] = "(b.title LIKE ? OR b.author LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    // Only in-stock books
    $where[] = "b.in_stock = 1";

    // Build WHERE clause
    $whereClause = '';
    if (!empty($where)) {
        $whereClause = 'WHERE ' . implode(' AND ', $where);
    }

    // ---- Sorting (PHP 7 compatible) ----
    switch ($sort) {
        case 'price-low':
            $orderBy = 'b.price ASC';
            break;
        case 'price-high':
            $orderBy = 'b.price DESC';
            break;
        case 'rating':
            $orderBy = 'b.rating DESC';
            break;
        default:
            $orderBy = 'b.reviews DESC';
            break;
    }

    // ---- Count total results ----
    $countSql = "SELECT COUNT(*) as total 
                 FROM books b 
                 LEFT JOIN categories c ON b.category_id = c.id 
                 $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];

    // ---- Fetch books ----
    $sql = "SELECT b.*, c.name as category_name, c.slug as category_slug 
            FROM books b 
            LEFT JOIN categories c ON b.category_id = c.id 
            $whereClause 
            ORDER BY $orderBy 
            LIMIT $limit OFFSET $offset";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll();

    // ---- Return JSON ----
    echo json_encode([
        'success' => true,
        'data' => $books,
        'total' => (int) $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch books: ' . $e->getMessage()
    ]);
}
?>