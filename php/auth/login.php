<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';
require_once 'session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../../docs/login.html");
    exit();
}

$username = trim(htmlspecialchars($_POST['username'] ?? ''));
$password = $_POST['password'] ?? '';

if (empty($username) && empty($password)) {
    die("ERROR: No form data received.");
}

$errors = array();

if (empty($username)) {
    $errors[] = "Please fill in all fields.";
}
if (empty($password)) {
    $errors[] = "Please fill in all fields.";
}

if (!empty($errors)) {
    $_SESSION['error'] = "Please fill in all fields.";
    header("Location: ../../docs/login.html");
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, username, email, password, role, is_verified FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        $_SESSION['error'] = "Invalid entry. Please check your credentials and try again.";
        header("Location: ../../docs/login.html");
        exit();
    }

    if (!$user['is_verified']) {
        $_SESSION['error'] = "Please verify your email first. Check your inbox for the verification link.";
        header("Location: ../../docs/login.html");
        exit();
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];

    if ($user['role'] === 'admin') {
        $_SESSION['success'] = "Welcome back, Admin!";
        header("Location: ../../docs/admin.html");
    } else {
        $_SESSION['success'] = "Welcome back, " . $user['username'] . "!";
        header("Location: ../../docs/shop.html");
    }
    exit();

} catch (PDOException $e) {
    $_SESSION['error'] = "Something went wrong. Please try again.";
    header("Location: ../../docs/login.html");
    exit();
}
?>