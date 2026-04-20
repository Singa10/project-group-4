<?php
// =============================================
// REGISTRATION — WITH EMAIL VERIFICATION
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/db.php';
require_once 'session.php';

// Load email helper
$canSendEmail = false;
if (file_exists('../../includes/email_helper.php') && file_exists('../../config/mail.php')) {
    require_once '../../includes/email_helper.php';
    $canSendEmail = true;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../../docs/login.html");
    exit();
}

// Get input
$username = trim(htmlspecialchars($_POST['username'] ?? ''));
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) && empty($email) && empty($password)) {
    $_SESSION['error'] = "No form data received.";
    header("Location: ../../docs/login.html?form=register");
    exit();
}

// =============================================
// VALIDATION
// =============================================
$errors = array();

// Username
if (empty($username)) {
    $errors[] = "Username is required.";
} elseif (strlen($username) < 3 || strlen($username) > 50) {
    $errors[] = "Username must be 3-50 characters.";
} elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    $errors[] = "Username: only letters, numbers, underscores.";
}

// Email — Basic validation + domain check
if (empty($email)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
} elseif (strlen($email) > 100) {
    $errors[] = "Email is too long.";
} else {
    $domain = strtolower(substr($email, strrpos($email, '@') + 1));

    // Block disposable
    $blocked = array(
        'mailinator.com', 'guerrillamail.com', 'tempmail.com',
        'yopmail.com', 'trashmail.com', 'fakeinbox.com',
        'throwaway.email', 'temp-mail.org', '10minutemail.com',
        'maildrop.cc', 'discard.email', 'sharklasers.com'
    );
    if (in_array($domain, $blocked)) {
        $errors[] = "Disposable emails are not allowed.";
    }
}

// Password
if (empty($password)) {
    $errors[] = "Password is required.";
} elseif (strlen($password) < 6) {
    $errors[] = "Password must be at least 6 characters.";
} elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/', $password)) {
    $errors[] = "Password: 1 uppercase, 1 lowercase, 1 number required.";
}

// Stop if errors
if (!empty($errors)) {
    $_SESSION['error'] = implode("<br>", $errors);
    header("Location: ../../docs/login.html?form=register");
    exit();
}

$email = htmlspecialchars($email);

// =============================================
// DATABASE OPERATIONS
// =============================================
try {
    // Check username exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute(array($username));
    if ($stmt->fetch()) {
        $_SESSION['error'] = "Username already taken.";
        header("Location: ../../docs/login.html?form=register");
        exit();
    }

    // Check email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute(array($email));
    if ($stmt->fetch()) {
        $_SESSION['error'] = "Email already registered.";
        header("Location: ../../docs/login.html?form=register");
        exit();
    }

    // Generate verification token
    $token = bin2hex(random_bytes(32));
    $tokenExpires = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Insert user (NOT verified yet)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role, verification_token, is_verified, token_expires) VALUES (?, ?, ?, 'user', ?, 0, ?)");
    $result = $stmt->execute(array($username, $email, $hashedPassword, $token, $tokenExpires));

    if (!$result) {
        $_SESSION['error'] = "Registration failed. Please try again.";
        header("Location: ../../docs/login.html?form=register");
        exit();
    }

    // Send verification email
    if ($canSendEmail) {
        $emailSent = sendVerificationEmail($email, $username, $token);

        if ($emailSent) {
            $_SESSION['success'] = "Registration successful! Please check your email to verify your account.";
        } else {
            $_SESSION['success'] = "Registered! But verification email failed. Contact support.";
        }
    } else {
        // If email not configured — auto verify (for development)
        $userId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
        $stmt->execute([$userId]);

        $userId = $pdo->lastInsertId();
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        $_SESSION['role'] = 'user';
        $_SESSION['success'] = "Registration successful! Welcome, $username!";
        header("Location: ../../docs/shop.html");
        exit();
    }

    // Redirect to login page — user must verify email first
    header("Location: ../../docs/login.html?verify=1");
    exit();

} catch (PDOException $e) {
    $_SESSION['error'] = "Something went wrong. Please try again.";
    header("Location: ../../docs/login.html?form=register");
    exit();
}
?>