<?php
// =============================================
// EMAIL HELPER — Send Emails via PHPMailer
// =============================================

require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';
require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/../config/mail.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// =============================================
// VALIDATE EMAIL — Check if domain is real
// =============================================
function isRealEmail($email) {
    // Step 1: Basic format check
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    // Step 2: Extract domain
    $domain = substr(strrchr($email, "@"), 1);

    // Step 3: Check if domain has MX (mail exchange) records
    if (!checkdnsrr($domain, "MX")) {
        // Also check A record as fallback
        if (!checkdnsrr($domain, "A")) {
            return false;
        }
    }

    return true;
}

// =============================================
// SEND EMAIL — Core function
// =============================================
function sendEmail($to, $subject, $htmlBody) {
    $mail = new PHPMailer(true);

    try {
        // SMTP Settings
        $mail->isSMTP();
        $mail->Host       = MAIL_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = MAIL_USERNAME;
        $mail->Password   = MAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = MAIL_PORT;

        // From/To
        $mail->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
        $mail->addAddress($to);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $htmlBody));

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Email failed: " . $mail->ErrorInfo);
        return false;
    }
}

// =============================================
// ORDER CONFIRMATION EMAIL
// =============================================
function sendOrderConfirmation($email, $orderData) {
    $orderId = $orderData['order_id'];
    $total = number_format($orderData['total'], 2);
    $method = ucfirst($orderData['payment_method']);
    $txnId = $orderData['transaction_id'];
    $name = $orderData['shipping_name'];
    $address = $orderData['shipping_address'];
    $city = $orderData['shipping_city'];
    $zip = $orderData['shipping_zip'];

    // Build items HTML
    $itemsHtml = '';
    if (isset($orderData['items']) && is_array($orderData['items'])) {
        foreach ($orderData['items'] as $item) {
            $itemTotal = number_format($item['price'] * $item['quantity'], 2);
            $itemsHtml .= '
            <tr>
                <td style="padding:10px;border-bottom:1px solid #eee">' . htmlspecialchars($item['title']) . '</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:center">' . $item['quantity'] . '</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">$' . number_format($item['price'], 2) . '</td>
                <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">$' . $itemTotal . '</td>
            </tr>';
        }
    }

    $subject = "Order Confirmation #" . $orderId . " - " . STORE_NAME;

    $html = '
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f5f5f5">
        <div style="max-width:600px;margin:20px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center">
                <h1 style="color:#f3971b;margin:0;font-size:28px">📚 ' . STORE_NAME . '</h1>
                <p style="color:#ccc;margin:10px 0 0">Order Confirmation</p>
            </div>

            <!-- Body -->
            <div style="padding:30px">
                <h2 style="color:#1a1a2e;margin-top:0">Thank you for your order, ' . htmlspecialchars($name) . '!</h2>
                <p style="color:#666">Your order has been received and is being processed.</p>

                <!-- Order Info -->
                <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #f3971b">
                    <p style="margin:5px 0"><strong>Order ID:</strong> #' . $orderId . '</p>
                    <p style="margin:5px 0"><strong>Payment Method:</strong> ' . $method . '</p>
                    <p style="margin:5px 0"><strong>Transaction ID:</strong> ' . htmlspecialchars($txnId) . '</p>
                    <p style="margin:5px 0"><strong>Status:</strong> <span style="color:#4caf50;font-weight:bold">Paid ✓</span></p>
                </div>

                <!-- Items -->
                <h3 style="color:#1a1a2e">Order Items:</h3>
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f3971b;color:white">
                            <th style="padding:10px;text-align:left">Book</th>
                            <th style="padding:10px;text-align:center">Qty</th>
                            <th style="padding:10px;text-align:right">Price</th>
                            <th style="padding:10px;text-align:right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ' . $itemsHtml . '
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding:15px;text-align:right;font-weight:bold;font-size:1.1em">Total:</td>
                            <td style="padding:15px;text-align:right;font-weight:bold;font-size:1.1em;color:#f3971b">$' . $total . '</td>
                        </tr>
                    </tfoot>
                </table>

                <!-- Shipping -->
                <h3 style="color:#1a1a2e;margin-top:25px">Shipping Address:</h3>
                <div style="background:#f9f9f9;border-radius:8px;padding:15px">
                    <p style="margin:3px 0">' . htmlspecialchars($name) . '</p>
                    <p style="margin:3px 0">' . htmlspecialchars($address) . '</p>
                    <p style="margin:3px 0">' . htmlspecialchars($city) . ' ' . htmlspecialchars($zip) . '</p>
                </div>

                <hr style="border:none;border-top:1px solid #eee;margin:25px 0">

                <p style="color:#666;font-size:0.9em">If you have any questions about your order, please contact us at <a href="mailto:' . MAIL_FROM_EMAIL . '" style="color:#f3971b">' . MAIL_FROM_EMAIL . '</a></p>
            </div>

            <!-- Footer -->
            <div style="background:#1a1a2e;padding:20px;text-align:center">
                <p style="color:#888;margin:0;font-size:0.85em">&copy; 2025 ' . STORE_NAME . ' | All Rights Reserved</p>
            </div>
        </div>
    </body>
    </html>';

    return sendEmail($email, $subject, $html);
}

// =============================================
// WELCOME EMAIL (after registration)
// =============================================
function sendWelcomeEmail($email, $username) {
    $subject = "Welcome to " . STORE_NAME . "!";

    $html = '
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f5f5f5">
        <div style="max-width:600px;margin:20px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center">
                <h1 style="color:#f3971b;margin:0;font-size:28px">📚 ' . STORE_NAME . '</h1>
            </div>
            <div style="padding:30px;text-align:center">
                <h2 style="color:#1a1a2e">Welcome, ' . htmlspecialchars($username) . '! 🎉</h2>
                <p style="color:#666;font-size:1.1em">Thanks for joining ' . STORE_NAME . '!</p>
                <p style="color:#666">You now have access to our entire collection of books.</p>
                <a href="' . STORE_URL . '/docs/shop.html" style="display:inline-block;margin:20px 0;padding:15px 40px;background:#f3971b;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:1.1em">Start Shopping →</a>
                <p style="color:#999;font-size:0.85em">If you didn\'t create this account, please ignore this email.</p>
            </div>
            <div style="background:#1a1a2e;padding:20px;text-align:center">
                <p style="color:#888;margin:0;font-size:0.85em">&copy; 2025 ' . STORE_NAME . '</p>
            </div>
        </div>
    </body>
    </html>';

    return sendEmail($email, $subject, $html);
}

// =============================================
// CONTACT FORM AUTO-REPLY EMAIL
// =============================================
function sendContactAutoReply($email, $name, $subject) {
    $replySubject = "Re: " . $subject . " - " . STORE_NAME;

    $html = '
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f5f5f5">
        <div style="max-width:600px;margin:20px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center">
                <h1 style="color:#f3971b;margin:0;font-size:28px">📚 ' . STORE_NAME . '</h1>
            </div>
            <div style="padding:30px">
                <h2 style="color:#1a1a2e;margin-top:0">Hi ' . htmlspecialchars($name) . ',</h2>
                <p style="color:#666">Thank you for contacting us! We\'ve received your message regarding:</p>
                <div style="background:#f9f9f9;border-radius:8px;padding:15px;margin:15px 0;border-left:4px solid #f3971b">
                    <p style="margin:0;font-weight:bold;color:#1a1a2e">' . htmlspecialchars($subject) . '</p>
                </div>
                <p style="color:#666">Our team will review your message and get back to you within 24 hours.</p>
                <p style="color:#666">In the meantime, you can check our <a href="' . STORE_URL . '/docs/contact.html" style="color:#f3971b">FAQ section</a> for quick answers.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:25px 0">
                <p style="color:#999;font-size:0.85em">This is an automated response. Please do not reply to this email.</p>
            </div>
            <div style="background:#1a1a2e;padding:20px;text-align:center">
                <p style="color:#888;margin:0;font-size:0.85em">&copy; 2025 ' . STORE_NAME . '</p>
            </div>
        </div>
    </body>
    </html>';

    return sendEmail($email, $replySubject, $html);
}

function sendVerificationEmail($email, $username, $token) {
    $verifyUrl = STORE_URL . "/php/auth/verify_email.php?token=" . $token . "&email=" . urlencode($email);
    $subject = "Verify Your Email — " . STORE_NAME;

    $html = '
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f5f5f5">
        <div style="max-width:600px;margin:20px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center">
                <h1 style="color:#f3971b;margin:0;font-size:28px">📚 ' . STORE_NAME . '</h1>
                <p style="color:#ccc;margin:10px 0 0">Email Verification</p>
            </div>
            <div style="padding:30px;text-align:center">
                <h2 style="color:#1a1a2e;margin-top:0">Hi ' . htmlspecialchars($username) . '! 👋</h2>
                <p style="color:#666;font-size:1.05em">Thanks for registering at ' . STORE_NAME . '!</p>
                <p style="color:#666">Please verify your email address to activate your account.</p>
                
                <a href="' . $verifyUrl . '" 
                   style="display:inline-block;margin:25px 0;padding:15px 40px;background:#f3971b;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:1.1em">
                    ✅ Verify My Email
                </a>
                
                <p style="color:#999;font-size:0.85em">This link expires in <strong>24 hours</strong>.</p>
                <p style="color:#999;font-size:0.85em">If you did not create this account, please ignore this email.</p>
                
                <hr style="border:none;border-top:1px solid #eee;margin:25px 0">
                
                <p style="color:#999;font-size:0.8em">Or copy this link:</p>
                <p style="color:#f3971b;font-size:0.75em;word-break:break-all">' . $verifyUrl . '</p>
            </div>
            <div style="background:#1a1a2e;padding:20px;text-align:center">
                <p style="color:#888;margin:0;font-size:0.85em">&copy; 2025 ' . STORE_NAME . ' | All Rights Reserved</p>
            </div>
        </div>
    </body>
    </html>';

    return sendEmail($email, $subject, $html);
}
?>