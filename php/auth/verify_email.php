<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';
require_once 'session.php';

$token = trim($_GET['token'] ?? '');
$email = trim($_GET['email'] ?? '');

if (empty($token) || empty($email)) {
    $_SESSION['error'] = "Invalid verification link.";
    header("Location: ../../docs/login.html");
    exit();
}

try {
   
    $stmt = $pdo->prepare("SELECT id, username, verification_token, is_verified, token_expires FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        $_SESSION['error'] = "Invalid verification link.";
        header("Location: ../../docs/login.html");
        exit();
    }

    if ($user['is_verified']) {
        $_SESSION['success'] = "Email already verified! Please login.";
        header("Location: ../../docs/login.html");
        exit();
    }

   
    if ($user['verification_token'] !== $token) {
        $_SESSION['error'] = "Invalid or expired verification link.";
        header("Location: ../../docs/login.html");
        exit();
    }

   
    if (strtotime($user['token_expires']) < time()) {
        $_SESSION['error'] = "Verification link has expired. Please register again.";
        header("Location: ../../docs/login.html?form=register");
        exit();
    }

    
    $stmt = $pdo->prepare("UPDATE users SET is_verified = 1, verification_token = NULL, token_expires = NULL WHERE id = ?");
    $stmt->execute([$user['id']]);

   
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $email;
    $_SESSION['role'] = 'user';

    $_SESSION['success'] = "Email verified successfully! Welcome, " . $user['username'] . "!";
    header("Location: ../../docs/shop.html");
    exit();

} catch (PDOException $e) {
    $_SESSION['error'] = "Something went wrong. Please try again.";
    header("Location: ../../docs/login.html");
    exit();
}
?>