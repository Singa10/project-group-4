// =============================================
// AUTH — Login/Register Toggle + Validation
// =============================================

const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');

if (registerTrigger) {
    registerTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        authWrapper.classList.add('toggled');
    });
}

if (loginTrigger) {
    loginTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        authWrapper.classList.remove('toggled');
    });
}

// =============================================
// ON PAGE LOAD
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Show register form if redirected back with error
    if (urlParams.get('form') === 'register') {
        authWrapper.classList.add('toggled');
    }

    // Show verify notice after registration
    if (urlParams.get('verify') === '1') {
        const notice = document.getElementById('verify-notice');
        if (notice) notice.style.display = 'block';
    }

    // Check session messages from PHP
    await checkSessionMessages();
});

// =============================================
// CHECK SESSION MESSAGES FROM PHP
// =============================================
async function checkSessionMessages() {
    try {
        const res = await fetch('../php/auth/check_message.php');
        const data = await res.json();

        if (data.error) {
            showAuthToast(data.error, 'error');
        }
        if (data.success) {
            showAuthToast(data.success, 'success');
        }
    } catch (e) {
        console.log('Message check skipped');
    }
}

// =============================================
// LOGIN FORM VALIDATION
// =============================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        const username = document.getElementById('login-username');
        const password = document.getElementById('login-password');
        let isValid = true;

        if (username.value.trim().length < 3) {
            showFieldError(username, 'Username must be at least 3 characters');
            isValid = false;
        } else {
            clearFieldError(username);
        }

        if (password.value.length < 6) {
            showFieldError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearFieldError(password);
        }

        // If invalid — stop form (don't go to PHP)
        if (!isValid) e.preventDefault();
        // If valid — form submits normally to php/auth/login.php
    });

    document.getElementById('login-username')?.addEventListener('input', function () {
        if (this.value.trim().length >= 3) clearFieldError(this);
    });

    document.getElementById('login-password')?.addEventListener('input', function () {
        if (this.value.length >= 6) clearFieldError(this);
    });
}

// =============================================
// REGISTER FORM VALIDATION
// =============================================
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        const username = document.getElementById('reg-username');
        const email = document.getElementById('reg-email');
        const password = document.getElementById('reg-password');
        let isValid = true;

        if (username.value.trim().length < 3) {
            showFieldError(username, 'Username must be at least 3 characters');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
            showFieldError(username, 'Only letters, numbers, and underscores');
            isValid = false;
        } else {
            clearFieldError(username);
        }

        if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError(email);
        }

        if (password.value.length < 6) {
            showFieldError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
            showFieldError(password, 'Need 1 uppercase, 1 lowercase, and 1 number');
            isValid = false;
        } else {
            clearFieldError(password);
        }

        // If invalid — stop form
        if (!isValid) e.preventDefault();
        // If valid — form submits normally to php/auth/register.php
    });

    document.getElementById('reg-username')?.addEventListener('input', function () {
        if (this.value.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(this.value)) clearFieldError(this);
    });

    document.getElementById('reg-email')?.addEventListener('input', function () {
        if (this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) clearFieldError(this);
    });

    document.getElementById('reg-password')?.addEventListener('input', function () {
        if (this.value.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.value)) clearFieldError(this);
    });
}

// =============================================
// RESEND VERIFICATION EMAIL
// =============================================
async function resendVerification() {
    const email = prompt('Enter your email address:');
    if (!email) return;

    try {
        const res = await fetch('../php/auth/resend_verification.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        showAuthToast(data.message, data.success ? 'success' : 'error');
    } catch (e) {
        showAuthToast('Error connecting to server.', 'error');
    }
}

// =============================================
// HELPER FUNCTIONS
// =============================================
function showFieldError(input, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = message;
}

function clearFieldError(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    const errorSpan = input.parentElement.querySelector('.error-message');
    if (errorSpan) errorSpan.textContent = '';
}

function showAuthToast(message, type) {
    type = type || 'success';

    // Create or find toast container
    let container = document.getElementById('auth-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'auth-toast-container';
        container.style.cssText = 'position:fixed;top:100px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;max-width:420px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        padding: 15px 45px 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
        background: ${type === 'success'
            ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
            : 'linear-gradient(135deg, #ff4444, #c62828)'};
        color: white;
    `;

    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="font-size:1.2rem;color:white"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="position:absolute;top:50%;right:12px;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:0.9rem;">
            <i class="fas fa-times"></i>
        </button>
    `;

    toast.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 400);
    });

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 400);
    }, 6000);
}