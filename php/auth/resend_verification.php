<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/db.php';
require_once 'session.php';
require_once '../../includes/email_helper.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, username, is_verified FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Email not found.']);
        exit();
    }

    if ($user['is_verified']) {
        echo json_encode(['success' => false, 'message' => 'Email already verified.']);
        exit();
    }

    
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

    $stmt = $pdo->prepare("UPDATE users SET verification_token = ?, token_expires = ? WHERE id = ?");
    $stmt->execute([$token, $expires, $user['id']]);

    
    $sent = sendVerificationEmail($email, $user['username'], $token);

    if ($sent) {
        echo json_encode(['success' => true, 'message' => 'Verification email sent! Check your inbox.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Server error.']);
}
?>