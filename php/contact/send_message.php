<?php
// =============================================
// CONTACT FORM — With Auto-Reply & Email Validation
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/db.php';
require_once '../../includes/email_validator.php';
require_once '../../includes/email_helper.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit();
}

$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim(htmlspecialchars($data['name'] ?? ''));
    $email = trim(htmlspecialchars($data['email'] ?? ''));
    $subject = trim(htmlspecialchars($data['subject'] ?? ''));
    $message = trim(htmlspecialchars($data['message'] ?? ''));
} else {
    $name = trim(htmlspecialchars($_POST['name'] ?? ''));
    $email = trim(htmlspecialchars($_POST['email'] ?? ''));
    $subject = trim(htmlspecialchars($_POST['subject'] ?? ''));
    $message = trim(htmlspecialchars($_POST['message'] ?? ''));
}

$errors = [];

if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = "Name must be 2-100 characters.";
}

// Email validation — CHECK IF REAL
if (empty($email)) {
    $errors[] = "Email is required.";
} else {
    $emailCheck = validateRealEmail($email);
    if (!$emailCheck['valid']) {
        $errors[] = $emailCheck['message'];
    }
}

if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 255) {
    $errors[] = "Subject must be 3-255 characters.";
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = "Message must be 10-2000 characters.";
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $result = $stmt->execute([$name, $email, $subject, $message]);

    if ($result) {
        // Send auto-reply email
        sendContactAutoReply($email, $name, $subject);

        echo json_encode([
            'success' => true,
            'message' => "Message sent! We've sent a confirmation to your email."
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Server error.']);
}
?>