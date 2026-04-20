<?php
// =============================================
// DATABASE CONNECTION — TechBooks
// =============================================
// This file connects your PHP code to MySQL
// Used by every PHP file that needs database access
// =============================================

$host = "localhost";         // XAMPP default
$dbname = "bookstore";       // Your database name
$username = "root";          // XAMPP default username
$password = "";              // XAMPP default password (empty)

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            // Throw exceptions on errors
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,

            // Return results as associative arrays
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

            // Use real prepared statements (not emulated)
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    // =============================================
    // In DEVELOPMENT: Show error details
    // Uncomment the line below to debug
    // =============================================
    // die("Connection failed: " . $e->getMessage());

    // =============================================
    // In PRODUCTION: Hide error details
    // =============================================
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed. Please try again later."
    ]));
}
?>