document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const userTypeSelection = document.getElementById("userTypeSelection");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const userTypeButtons = document.querySelectorAll(".user-type-btn");
    const backButtons = document.querySelectorAll(".back-btn");
    const switchToRegisterLink = document.getElementById("switchToRegister");
    const switchToLoginLink = document.getElementById("switchToLogin");
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  
    let currentUserType = null;
  
    // User Type Selection
    userTypeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        currentUserType = this.dataset.type;
        userTypeSelection.classList.add("fade-out");
        setTimeout(() => {
          userTypeSelection.classList.add("hidden");
          loginForm.classList.remove("hidden");
          loginForm.classList.add("fade-in");
        }, 300);
      });
    });
  
    // Back Button
    backButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const currentForm = this.closest(".auth-form-container");
        currentForm.classList.add("fade-out");
        setTimeout(() => {
          currentForm.classList.add("hidden");
          userTypeSelection.classList.remove("hidden", "fade-out");
          userTypeSelection.classList.add("fade-in");
        }, 300);
      });
    });
  
    // Switch between Login and Register
    switchToRegisterLink.addEventListener("click", function (e) {
      e.preventDefault();
      switchForms(loginForm, registerForm);
    });
  
    switchToLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      switchForms(registerForm, loginForm);
    });
  
    function switchForms(fromForm, toForm) {
      fromForm.classList.add("fade-out");
      setTimeout(() => {
        fromForm.classList.add("hidden");
        toForm.classList.remove("hidden");
        toForm.classList.add("fade-in");
      }, 300);
    }
  
    // Toggle Password Visibility
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const input = this.previousElementSibling;
        const type =
          input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
      });
    });
  
    // Form Submission
    document
      .getElementById("loginFormElement")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        handleLogin(this);
      });
  
    document
      .getElementById("registerFormElement")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        handleRegister(this);
      });
  
    function handleLogin(form) {
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;
      const remember = form.querySelector('input[type="checkbox"]').checked;
  
      // Add loading state
      const submitButton = form.querySelector(".auth-btn");
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  
      // Simulate API call
      setTimeout(() => {
        if (currentUserType === "admin") {
          // Redirect to admin dashboard
          window.location.href = "admin/dashboard.html";
        } else {
          // Redirect to customer dashboard or home
          window.location.href = "index.html";
        }
      }, 1500);
    }
  
    function handleRegister(form) {
      const name = form.querySelector('input[type="text"]').value;
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelectorAll('input[type="password"]')[0].value;
      const confirmPassword = form.querySelectorAll('input[type="password"]')[1]
        .value;
  
      if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error");
        return;
      }
  
      // Add loading state
      const submitButton = form.querySelector(".auth-btn");
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Registering...';
  
      // Simulate API call
      setTimeout(() => {
        showNotification("Registration successful! Please login.", "success");
        setTimeout(() => {
          switchForms(registerForm, loginForm);
        }, 1500);
      }, 1500);
    }
  
    // Notification System
    function showNotification(message, type = "success") {
      const notification = document.createElement("div");
      notification.classList.add("notification", `notification-${type}`);
      notification.innerHTML = `
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;
  
      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add("show"), 10);
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  });