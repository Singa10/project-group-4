<?php
// =============================================
// SESSION MANAGEMENT — TechBooks
// =============================================
// This file is included in every PHP file that
// needs to check login status or admin access
// =============================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Check if user is admin
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Redirect to login if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: ../../docs/login.html");
        exit();
    }
}

// Redirect to login if not admin
function requireAdmin() {
    if (!isAdmin()) {
        header("Location: ../../docs/login.html");
        exit();
    }
}

// Get current user ID
function getUserId() {
    return $_SESSION['user_id'] ?? null;
}

// Get current username
function getUsername() {
    return $_SESSION['username'] ?? null;
}

// Get current user role
function getUserRole() {
    return $_SESSION['role'] ?? null;
}

// Get current user email
function getUserEmail() {
    return $_SESSION['email'] ?? null;
}
?>