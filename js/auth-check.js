// =============================================
// GLOBAL AUTH CHECK — Updates Navbar on ALL Pages
// =============================================

document.addEventListener("DOMContentLoaded", async function() {
    await checkAuthStatus();
});

async function checkAuthStatus() {
    try {
        var basePath = "";
        if (window.location.pathname.includes("/docs/")) {
            basePath = "../";
        }

        var res = await fetch(basePath + "php/user/get_profile.php");
        var data = await res.json();

        if (data.loggedIn && data.data) {
            updateNavbar(data.data, basePath);
        }
    } catch (e) {
        console.log("Auth check: not logged in");
    }
}

function updateNavbar(user, basePath) {
    // Change Login button to Username
    var loginBtn = document.querySelector(".login-btn");
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + user.username;
        loginBtn.href = "#";
        loginBtn.addEventListener("click", function(e) {
            e.preventDefault();
        });
    }

    // Add Logout link
    var navLinks = document.querySelector(".nav-links");
    if (navLinks && !navLinks.querySelector(".logout-link")) {
        var logoutItem = document.createElement("li");
        logoutItem.classList.add("logout-link");
        logoutItem.innerHTML = '<a href="' + basePath + 'php/auth/logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>';
        navLinks.appendChild(logoutItem);
    }

    // Update cart count
    var cartCount = document.querySelector(".cart-count");
    if (cartCount && user.cartCount !== undefined) {
        cartCount.textContent = user.cartCount;
    }

    // Add Admin link if admin
    if (user.role === "admin" && navLinks && !navLinks.querySelector(".admin-link")) {
        var adminItem = document.createElement("li");
        adminItem.classList.add("admin-link");
        adminItem.innerHTML = '<a href="' + basePath + 'docs/admin.html"><i class="fas fa-tachometer-alt"></i> Admin</a>';
        var logoutLink = navLinks.querySelector(".logout-link");
        if (logoutLink) {
            navLinks.insertBefore(adminItem, logoutLink);
        } else {
            navLinks.appendChild(adminItem);
        }
    }
}