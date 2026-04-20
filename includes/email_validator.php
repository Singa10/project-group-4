<?php
// =============================================
// EMAIL VALIDATOR — Works on Windows XAMPP
// =============================================

function validateRealEmail($email) {
    // Step 1: Basic format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['valid' => false, 'message' => 'Invalid email format.'];
    }

    // Step 2: Check length
    if (strlen($email) > 100) {
        return ['valid' => false, 'message' => 'Email is too long.'];
    }

    // Step 3: Extract domain
    $parts = explode('@', $email);
    if (count($parts) !== 2) {
        return ['valid' => false, 'message' => 'Invalid email format.'];
    }

    $domain = strtolower($parts[1]);

    // Step 4: Block common fake/disposable domains
    $blockedDomains = [
        'mailinator.com', 'guerrillamail.com', 'tempmail.com',
        'throwaway.email', 'fakeinbox.com', 'sharklasers.com',
        'guerrillamailblock.com', 'grr.la', 'dispostable.com',
        'yopmail.com', 'trashmail.com', 'tempail.com',
        'temp-mail.org', '10minutemail.com', 'mailnesia.com',
        'maildrop.cc', 'discard.email', 'emailondeck.com',
        'getairmail.com', 'mailcatch.com'
    ];

    if (in_array($domain, $blockedDomains)) {
        return ['valid' => false, 'message' => 'Disposable email addresses are not allowed.'];
    }

    // Step 5: Only allow known real email providers + common domains
    $trustedDomains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'live.com', 'icloud.com', 'aol.com', 'protonmail.com',
        'zoho.com', 'mail.com', 'gmx.com', 'yandex.com',
        'qq.com', '163.com', 'sina.com', 'msn.com',
        'proton.me', 'tutanota.com', 'fastmail.com',
        'hey.com', 'pm.me', 'duck.com',
        // Ethiopian domains
        'ethionet.et', 'ethiotelecom.et',
        // Education
        'edu', 'ac.uk', 'edu.et'
    ];

    // Check if domain is trusted
    $isTrusted = false;
    foreach ($trustedDomains as $trusted) {
        if ($domain === $trusted || substr($domain, -strlen('.' . $trusted)) === '.' . $trusted) {
            $isTrusted = true;
            break;
        }
    }

    // Step 6: If not in trusted list, try DNS check
    if (!$isTrusted) {
        // Try checkdnsrr (might not work on Windows)
        $hasMX = false;
        $hasA = false;

        // Suppress warnings on Windows
        if (function_exists('checkdnsrr')) {
            $hasMX = @checkdnsrr($domain, 'MX');
            $hasA = @checkdnsrr($domain, 'A');
        }

        // Try getmxrr as fallback
        if (!$hasMX && function_exists('getmxrr')) {
            $mxHosts = [];
            $hasMX = @getmxrr($domain, $mxHosts);
        }

        // Try gethostbyname as last fallback
        if (!$hasMX && !$hasA) {
            $ip = @gethostbyname($domain);
            if ($ip !== $domain) {
                $hasA = true;
            }
        }

        if (!$hasMX && !$hasA) {
            return ['valid' => false, 'message' => 'Email domain "' . $domain . '" does not exist.'];
        }
    }

    return ['valid' => true, 'message' => 'Email is valid.'];
}
?>