<?php
// =============================================
// NEWSLETTER HANDLER — Returns JSON
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 0);

if (!file_exists('../../config/db.php')) {
    echo json_encode(['success' => false, 'message' => 'Server config error.']);
    exit();
}

require_once '../../config/db.php';

header('Content-Type: application/json');

// ---- Only accept POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit();
}

// ---- Get Input (supports JSON and form data) ----
$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim(htmlspecialchars($data['email'] ?? ''));
} else {
    $email = trim(htmlspecialchars($_POST['email'] ?? ''));
}

// ---- Validation ----
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email is required.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email.']);
    exit();
}

if (strlen($email) > 100) {
    echo json_encode(['success' => false, 'message' => 'Email is too long.']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        echo json_encode([
            'success' => true,
            'message' => "You're already subscribed! Thank you."
        ]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
        $result = $stmt->execute([$email]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Successfully subscribed! Thank you.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to subscribe.'
            ]);
        }
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again.'
    ]);
}
?>