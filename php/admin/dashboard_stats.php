<?php
// =============================================
// ADMIN DASHBOARD — REAL STATS
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');
requireAdmin();

try {
    // Total Orders
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $totalOrders = $stmt->fetch()['total'];

    // Total Users
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
    $totalUsers = $stmt->fetch()['total'];

    // Total Revenue
    $stmt = $pdo->query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'");
    $totalRevenue = $stmt->fetch()['total'];

    // Total Books
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM books");
    $totalBooks = $stmt->fetch()['total'];

    // Recent Orders (last 10)
    $stmt = $pdo->query("SELECT o.*, u.username 
                         FROM orders o 
                         JOIN users u ON o.user_id = u.id 
                         ORDER BY o.created_at DESC 
                         LIMIT 10");
    $recentOrders = $stmt->fetchAll();

    // Orders by status
    $stmt = $pdo->query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
    $ordersByStatus = $stmt->fetchAll();

    // Sales by month (last 6 months)
    $stmt = $pdo->query("SELECT 
                            DATE_FORMAT(created_at, '%b') as month,
                            COALESCE(SUM(total_amount), 0) as total
                         FROM orders 
                         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                         AND status != 'cancelled'
                         GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
                         ORDER BY MONTH(created_at) ASC");
    $salesByMonth = $stmt->fetchAll();

    // Books by category
    $stmt = $pdo->query("SELECT c.name, COUNT(b.id) as count 
                         FROM categories c 
                         LEFT JOIN books b ON c.id = b.category_id 
                         GROUP BY c.id 
                         ORDER BY count DESC 
                         LIMIT 5");
    $booksByCategory = $stmt->fetchAll();

    // New users this month
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users 
                         WHERE MONTH(created_at) = MONTH(NOW()) 
                         AND YEAR(created_at) = YEAR(NOW())");
    $newUsersThisMonth = $stmt->fetch()['total'];

    // Pending orders count
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
    $pendingOrders = $stmt->fetch()['total'];

    // Unread messages
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM contact_messages WHERE is_read = 0");
    $unreadMessages = $stmt->fetch()['total'];

    echo json_encode([
        'success' => true,
        'data' => [
            'totalOrders' => (int) $totalOrders,
            'totalUsers' => (int) $totalUsers,
            'totalRevenue' => round($totalRevenue, 2),
            'totalBooks' => (int) $totalBooks,
            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'salesByMonth' => $salesByMonth,
            'booksByCategory' => $booksByCategory,
            'newUsersThisMonth' => (int) $newUsersThisMonth,
            'pendingOrders' => (int) $pendingOrders,
            'unreadMessages' => (int) $unreadMessages
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch dashboard stats.'
    ]);
}
?>