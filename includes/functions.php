<?php
// =============================================
// COMMON HELPER FUNCTIONS — TechBooks
// =============================================
// Reusable functions used across the project
// Include this file wherever you need these helpers
// =============================================

// =============================================
// 1. SANITIZE USER INPUT
// Removes whitespace, backslashes, and HTML tags
// =============================================
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// =============================================
// 2. REDIRECT WITH MESSAGE
// Stores a message in session and redirects
// Usage: redirectWithMessage('page.html', 'success', 'Done!')
// =============================================
function redirectWithMessage($url, $type, $message) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION[$type] = $message;
    header("Location: $url");
    exit();
}

// =============================================
// 3. DISPLAY ERROR MESSAGE (HTML)
// Checks session for 'error' and returns HTML
// =============================================
function displayError() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION['error'])) {
        $error = $_SESSION['error'];
        unset($_SESSION['error']);
        return "<div class='alert alert-error'>
                    <i class='fas fa-exclamation-circle'></i>
                    <span>$error</span>
                </div>";
    }
    return "";
}

// =============================================
// 4. DISPLAY SUCCESS MESSAGE (HTML)
// Checks session for 'success' and returns HTML
// =============================================
function displaySuccess() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION['success'])) {
        $success = $_SESSION['success'];
        unset($_SESSION['success']);
        return "<div class='alert alert-success'>
                    <i class='fas fa-check-circle'></i>
                    <span>$success</span>
                </div>";
    }
    return "";
}

// =============================================
// 5. FORMAT PRICE
// Converts number to dollar format
// Usage: formatPrice(49.99) → "$49.99"
// =============================================
function formatPrice($price) {
    return "$" . number_format((float)$price, 2);
}

// =============================================
// 6. GENERATE STAR RATING HTML
// Converts rating number to star icons
// Usage: generateStars(4.5) → ★★★★½
// =============================================
function generateStars($rating) {
    $html = '';
    $rating = (float)$rating;
    $fullStars = floor($rating);
    $hasHalf = ($rating - $fullStars) >= 0.5;

    for ($i = 0; $i < 5; $i++) {
        if ($i < $fullStars) {
            $html .= '<i class="fas fa-star"></i>';
        } elseif ($i == $fullStars && $hasHalf) {
            $html .= '<i class="fas fa-star-half-alt"></i>';
        } else {
            $html .= '<i class="far fa-star"></i>';
        }
    }
    return $html;
}

// =============================================
// 7. VALIDATE EMAIL
// Returns true if email is valid format
// =============================================
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// =============================================
// 8. VALIDATE PASSWORD STRENGTH
// Must have: 6+ chars, 1 upper, 1 lower, 1 number
// Returns: true or error message string
// =============================================
function validatePassword($password) {
    if (strlen($password) < 6) {
        return "Password must be at least 6 characters.";
    }
    if (!preg_match('/[A-Z]/', $password)) {
        return "Password must contain at least 1 uppercase letter.";
    }
    if (!preg_match('/[a-z]/', $password)) {
        return "Password must contain at least 1 lowercase letter.";
    }
    if (!preg_match('/[0-9]/', $password)) {
        return "Password must contain at least 1 number.";
    }
    return true;
}

// =============================================
// 9. VALIDATE USERNAME
// Must be: 3-50 chars, only letters/numbers/underscores
// Returns: true or error message string
// =============================================
function validateUsername($username) {
    if (strlen($username) < 3 || strlen($username) > 50) {
        return "Username must be 3-50 characters.";
    }
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        return "Username can only contain letters, numbers, and underscores.";
    }
    return true;
}

// =============================================
// 10. TRUNCATE TEXT
// Shortens text to a max length with "..."
// Usage: truncateText("Long text here...", 50)
// =============================================
function truncateText($text, $maxLength = 100) {
    if (strlen($text) <= $maxLength) {
        return $text;
    }
    return substr($text, 0, $maxLength) . '...';
}

// =============================================
// 11. FORMAT DATE
// Converts MySQL timestamp to readable format
// Usage: formatDate('2025-01-15 14:30:00') → "Jan 15, 2025"
// =============================================
function formatDate($date, $format = 'M d, Y') {
    return date($format, strtotime($date));
}

// =============================================
// 12. FORMAT DATE WITH TIME
// Usage: formatDateTime('2025-01-15 14:30:00') → "Jan 15, 2025 2:30 PM"
// =============================================
function formatDateTime($date) {
    return date('M d, Y g:i A', strtotime($date));
}

// =============================================
// 13. GENERATE ORDER ID DISPLAY
// Usage: formatOrderId(42) → "#ORD-042"
// =============================================
function formatOrderId($id) {
    return "#ORD-" . str_pad($id, 3, '0', STR_PAD_LEFT);
}

// =============================================
// 14. GET STATUS BADGE CLASS
// Returns CSS class based on order status
// =============================================
function getStatusClass($status) {
    $classes = [
        'pending'    => 'status-pending',
        'processing' => 'status-processing',
        'shipped'    => 'status-shipped',
        'completed'  => 'status-completed',
        'cancelled'  => 'status-cancelled',
    ];
    return $classes[$status] ?? 'status-pending';
}

// =============================================
// 15. SEND JSON RESPONSE
// Quick way to return JSON from PHP
// Usage: sendJson(true, 'Success!', ['id' => 1])
// =============================================
function sendJson($success, $message = '', $data = null) {
    header('Content-Type: application/json');
    $response = [
        'success' => $success,
        'message' => $message,
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit();
}

// =============================================
// 16. CHECK IF REQUEST IS AJAX
// Returns true if request was made via fetch/XHR
// =============================================
function isAjaxRequest() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

// =============================================
// 17. GET CLIENT IP ADDRESS
// Useful for logging/security
// =============================================
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

// =============================================
// 18. GENERATE RANDOM TOKEN
// Useful for password reset, CSRF, etc.
// Usage: generateToken(32) → "a1b2c3d4..."
// =============================================
function generateToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}
?>