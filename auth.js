// Wait for DOM to fully load before attaching event handlers
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegister);
});

/*-------------------------
  Helper: Simple email validation
--------------------------*/
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*-------------------------
  Helper: Show message in container
--------------------------*/
function showMessage(container, message, isError = true, duration = 3000) {
    container.textContent = message;
    container.style.color = isError ? "#b91c1c" : "#16a34a"; // red for error, green for success

    if (!isError) {
        // Clear success message after duration
        setTimeout(() => {
            container.textContent = "";
        }, duration);
    }
}

/*-------------------------
  Login form handler
--------------------------*/
function handleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const remember = event.target.rememberMe.checked;
    const errorEl = document.getElementById("loginError");

    // Clear previous errors
    errorEl.textContent = "";

    // Validation
    if (!email) return showMessage(errorEl, "Email is required.");
    if (!isValidEmail(email)) return showMessage(errorEl, "Enter a valid email.");
    if (!password || password.length < 6) return showMessage(errorEl, "Password must be at least 6 characters.");

    // Success
    console.log({ email, remember });
    showMessage(errorEl, "Login successful!", false);
}

/*-------------------------
  Register form handler
--------------------------*/
function handleRegister(event) {
    event.preventDefault();

    const name = event.target.fullName.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const termsChecked = event.target.terms.checked;
    const errorEl = document.getElementById("registerError");

    // Clear previous errors
    errorEl.textContent = "";

    // Validation
    if (!name) return showMessage(errorEl, "Full name is required.");
    if (!email) return showMessage(errorEl, "Email is required.");
    if (!isValidEmail(email)) return showMessage(errorEl, "Enter a valid email.");
    if (!password || password.length < 6) return showMessage(errorEl, "Password must be at least 6 characters.");
    if (password !== confirmPassword) return showMessage(errorEl, "Passwords do not match.");
    if (!termsChecked) return showMessage(errorEl, "You must agree to the terms.");

    // Success
    console.log({ name, email });
    showMessage(errorEl, "Registration successful!", false);
}
