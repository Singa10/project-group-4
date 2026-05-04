<?php
// =============================================
// UPLOAD PROFILE PICTURE — PHP 7.3 Compatible
// =============================================
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

header('Content-Type: application/json');

// Manual session check (bypass session.php path issues)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array('success' => false, 'message' => 'Not logged in.'));
    exit();
}

$userId = $_SESSION['user_id'];

// Connect to DB manually (bypass require path issues)
$host = "localhost";
$dbname = "bookstore";
$username = "root";
$password = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        )
    );
} catch (PDOException $e) {
    echo json_encode(array('success' => false, 'message' => 'DB connection failed: ' . $e->getMessage()));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array('success' => false, 'message' => 'Invalid request.'));
    exit();
}

if (!isset($_FILES['profile_picture'])) {
    echo json_encode(array('success' => false, 'message' => 'No file received.'));
    exit();
}

$errorCode = $_FILES['profile_picture']['error'];
if ($errorCode !== 0) {
    echo json_encode(array('success' => false, 'message' => 'Upload error code: ' . $errorCode));
    exit();
}

$file = $_FILES['profile_picture'];

// Max 2MB
if ($file['size'] > 2097152) {
    echo json_encode(array('success' => false, 'message' => 'File too large. Max 2MB.'));
    exit();
}

// Check extension
$allowedExtensions = array('jpg', 'jpeg', 'png', 'gif');
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    echo json_encode(array('success' => false, 'message' => 'Only JPG, PNG, GIF allowed.'));
    exit();
}

// Verify image
$imageCheck = @getimagesize($file['tmp_name']);
if ($imageCheck === false) {
    echo json_encode(array('success' => false, 'message' => 'Not a valid image.'));
    exit();
}

// Upload to ROOT uploads/profiles/ folder
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/project-group-4/uploads/profiles/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = 'user_' . $userId . '_' . time() . '.' . $extension;
$uploadPath = $uploadDir . $filename;
$publicPath = 'uploads/profiles/' . $filename;

// Delete old picture
try {
    $stmt = $pdo->prepare("SELECT profile_picture FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $oldUser = $stmt->fetch();
    if ($oldUser && !empty($oldUser['profile_picture'])) {
        $oldFile = $_SERVER['DOCUMENT_ROOT'] . '/project-group-4/' . $oldUser['profile_picture'];
        if (file_exists($oldFile)) {
            unlink($oldFile);
        }
    }
} catch (Exception $e) {}

// Move file
if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    echo json_encode(array('success' => false, 'message' => 'Failed to save file to: ' . $uploadPath));
    exit();
}

// Save to DB
try {
    $stmt = $pdo->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $result = $stmt->execute(array($publicPath, $userId));

    if ($result) {
        echo json_encode(array(
            'success' => true,
            'message' => 'Profile picture updated!',
            'picture_url' => $publicPath
        ));
    } else {
        if (file_exists($uploadPath)) unlink($uploadPath);
        echo json_encode(array('success' => false, 'message' => 'DB update failed.'));
    }

} catch (PDOException $e) {
    if (file_exists($uploadPath)) unlink($uploadPath);
    echo json_encode(array('success' => false, 'message' => 'DB error: ' . $e->getMessage()));
}
?>