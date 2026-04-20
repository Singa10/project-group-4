<?php
// =============================================
// UPDATE USER PROFILE
// =============================================

require_once '../../config/db.php';
require_once '../auth/session.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode([
        'success' => false, 
        'message' => 'Please login first.'
    ]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = getUserId();

$action = $data['action'] ?? 'update_info';

// =============================================
// ACTION 1: Update Username & Email
// =============================================
if ($action === 'update_info') {
    $username = trim(htmlspecialchars($data['username'] ?? ''));
    $email = trim(htmlspecialchars($data['email'] ?? ''));

    // Validation
    $errors = [];

    if (empty($username)) {
        $errors[] = "Username is required.";
    } elseif (strlen($username) < 3 || strlen($username) > 50) {
        $errors[] = "Username must be 3-50 characters.";
    } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        $errors[] = "Username can only contain letters, numbers, and underscores.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    if (!empty($errors)) {
        echo json_encode([
            'success' => false, 
            'message' => implode(' ', $errors)
        ]);
        exit();
    }

    try {
        // Check if username is taken by another user
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->execute([$username, $userId]);
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false, 
                'message' => 'Username already taken.'
            ]);
            exit();
        }

        // Check if email is taken by another user
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false, 
                'message' => 'Email already in use.'
            ]);
            exit();
        }

        // Update user
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$username, $email, $userId]);

        // Update session
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;

        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully!',
            'data' => [
                'username' => $username,
                'email' => $email
            ]
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to update profile.'
        ]);
    }
}

// =============================================
// ACTION 2: Change Password
// =============================================
elseif ($action === 'change_password') {
    $currentPassword = $data['current_password'] ?? '';
    $newPassword = $data['new_password'] ?? '';
    $confirmPassword = $data['confirm_password'] ?? '';

    // Validation
    $errors = [];

    if (empty($currentPassword)) {
        $errors[] = "Current password is required.";
    }

    if (empty($newPassword)) {
        $errors[] = "New password is required.";
    } elseif (strlen($newPassword) < 6) {
        $errors[] = "New password must be at least 6 characters.";
    } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/', $newPassword)) {
        $errors[] = "Password must have 1 uppercase, 1 lowercase, and 1 number.";
    }

    if ($newPassword !== $confirmPassword) {
        $errors[] = "New passwords do not match.";
    }

    if ($currentPassword === $newPassword) {
        $errors[] = "New password must be different from current password.";
    }

    if (!empty($errors)) {
        echo json_encode([
            'success' => false, 
            'message' => implode(' ', $errors)
        ]);
        exit();
    }

    try {
        // Verify current password
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($currentPassword, $user['password'])) {
            echo json_encode([
                'success' => false, 
                'message' => 'Current password is incorrect.'
            ]);
            exit();
        }

        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);

        echo json_encode([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to change password.'
        ]);
    }
}

// =============================================
// INVALID ACTION
// =============================================
else {
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid action.'
    ]);
}
?>