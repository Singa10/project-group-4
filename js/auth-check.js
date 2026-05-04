// =============================================
// GLOBAL AUTH CHECK — Navbar + Profile Dropdown
// =============================================

var _authUser = null;
var _authBasePath = "";

document.addEventListener("DOMContentLoaded", async function() {
    await checkAuthStatus();
});

async function checkAuthStatus() {
    try {
        _authBasePath = window.location.pathname.includes("/docs/") ? "../" : "";

        var res = await fetch(_authBasePath + "php/user/get_profile.php");
        var data = await res.json();

        if (data.loggedIn && data.data) {
            _authUser = data.data;
            updateNavbar(data.data);
        }
    } catch (e) {
        console.log("Auth check failed");
    }
}

function updateNavbar(user) {
    var loginBtn = document.querySelector(".login-btn");
    if (!loginBtn) return;

    var pfpImg = user.profile_picture
        ? '<img src="' + _authBasePath + user.profile_picture + '" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid #f3971b;vertical-align:middle" onerror="this.outerHTML=\'<i class=&quot;fas fa-user-circle&quot; style=&quot;font-size:1.5rem;color:#f3971b&quot;></i>\'">'
        : '<i class="fas fa-user-circle" style="font-size:1.5rem;color:#f3971b;vertical-align:middle"></i>';

    // Replace login button with dropdown
    var li = loginBtn.parentElement;
    li.style.position = "relative";
    li.innerHTML =
        '<div id="upd-trigger" style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:5px 0">' +
            pfpImg +
            '<span style="color:#fff">' + user.username + '</span>' +
            '<i class="fas fa-chevron-down" style="font-size:0.65rem;color:#888"></i>' +
        '</div>' +
        '<div id="upd-menu" style="' +
            'display:none;position:absolute;top:110%;right:0;width:220px;' +
            'background:#1a1a2e;border:1px solid #333;border-radius:12px;' +
            'box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:99999;overflow:hidden' +
        '">' +
            '<div style="padding:15px;text-align:center;background:#16213e;border-bottom:1px solid #333">' +
                '<div style="width:50px;height:50px;border-radius:50%;margin:0 auto 8px;overflow:hidden;border:2px solid #f3971b;display:flex;align-items:center;justify-content:center;background:#0f0f23">' +
                    (user.profile_picture
                        ? '<img src="' + _authBasePath + user.profile_picture + '" style="width:100%;height:100%;object-fit:cover">'
                        : '<i class="fas fa-user" style="color:#f3971b;font-size:1.2rem"></i>'
                    ) +
                '</div>' +
                '<div style="color:#fff;font-weight:600;font-size:0.9rem">' + user.username + '</div>' +
                '<div style="color:#888;font-size:0.75rem">' + (user.email || '') + '</div>' +
            '</div>' +
            '<div style="padding:5px 0">' +
                menuItem("fas fa-user-edit", "Edit Profile", _authBasePath + "docs/profile.html", false) +
                menuItem("fas fa-key", "Change Password", "#", true, "openChangePassModal()") +
                menuItem("fas fa-camera", "Change Photo", "#", true, "openChangePfpModal()") +
                (user.role === "admin" ? menuItem("fas fa-tachometer-alt", "Admin Panel", _authBasePath + "docs/admin.html", false) : "") +
                '<div style="height:1px;background:#333;margin:5px 0"></div>' +
                menuItemRed("fas fa-sign-out-alt", "Logout", _authBasePath + "php/auth/logout.php") +
            '</div>' +
        '</div>';

    // Remove old logout/admin nav items
    var old = document.querySelector(".logout-link");
    if (old) old.remove();
    var oldAdmin = document.querySelector(".admin-link");
    if (oldAdmin) oldAdmin.remove();

    // Attach click to trigger
    var trigger = document.getElementById("upd-trigger");
    var menu = document.getElementById("upd-menu");

    trigger.onclick = function(e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    };

    document.addEventListener("click", function() {
        if (menu) menu.style.display = "none";
    });

    // Update cart count
    var cartCount = document.querySelector(".cart-count");
    if (cartCount && user.cartCount !== undefined) {
        cartCount.textContent = user.cartCount;
    }
}

function menuItem(icon, label, href, isAction, action) {
    var onclick = isAction ? ' onclick="' + action + ';return false"' : '';
    return '<a href="' + href + '"' + onclick + ' style="display:flex;align-items:center;gap:10px;padding:10px 15px;color:#ccc;text-decoration:none;font-size:0.85rem;transition:0.2s" onmouseover="this.style.background=\'rgba(243,151,27,0.1)\'" onmouseout="this.style.background=\'none\'">' +
        '<i class="' + icon + '" style="width:16px;color:#f3971b;text-align:center"></i>' +
        '<span>' + label + '</span>' +
    '</a>';
}

function menuItemRed(icon, label, href) {
    return '<a href="' + href + '" style="display:flex;align-items:center;gap:10px;padding:10px 15px;color:#ff4444;text-decoration:none;font-size:0.85rem;transition:0.2s" onmouseover="this.style.background=\'rgba(255,68,68,0.1)\'" onmouseout="this.style.background=\'none\'">' +
        '<i class="' + icon + '" style="width:16px;text-align:center"></i>' +
        '<span>' + label + '</span>' +
    '</a>';
}

// =============================================
// CHANGE PASSWORD MODAL
// =============================================
function openChangePassModal() {
    var old = document.getElementById("cp-modal");
    if (old) old.remove();

    var modal = document.createElement("div");
    modal.id = "cp-modal";
    modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center";

    modal.innerHTML =
        '<div style="background:#1a1a2e;padding:30px;border-radius:15px;width:90%;max-width:380px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
                '<h3 style="color:#f3971b;margin:0"><i class="fas fa-key"></i> Change Password</h3>' +
                '<button onclick="document.getElementById(\'cp-modal\').remove()" style="background:none;border:none;color:#888;cursor:pointer;font-size:1.2rem">&times;</button>' +
            '</div>' +
            '<div style="margin-bottom:12px">' +
                '<label style="color:#ccc;font-size:0.85rem;display:block;margin-bottom:5px">Current Password</label>' +
                '<input type="password" id="cp-current" placeholder="Current password" style="width:100%;padding:10px;background:#16213e;border:1px solid #333;border-radius:8px;color:white;font-size:0.9rem">' +
            '</div>' +
            '<div style="margin-bottom:12px">' +
                '<label style="color:#ccc;font-size:0.85rem;display:block;margin-bottom:5px">New Password</label>' +
                '<input type="password" id="cp-new" placeholder="New password (min 6 chars)" style="width:100%;padding:10px;background:#16213e;border:1px solid #333;border-radius:8px;color:white;font-size:0.9rem">' +
            '</div>' +
            '<div style="margin-bottom:20px">' +
                '<label style="color:#ccc;font-size:0.85rem;display:block;margin-bottom:5px">Confirm New Password</label>' +
                '<input type="password" id="cp-confirm" placeholder="Confirm new password" style="width:100%;padding:10px;background:#16213e;border:1px solid #333;border-radius:8px;color:white;font-size:0.9rem">' +
            '</div>' +
            '<button id="cp-btn" onclick="submitPasswordChange()" style="width:100%;padding:12px;background:#f3971b;color:white;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;font-family:inherit">' +
                '<i class="fas fa-save"></i> Update Password' +
            '</button>' +
        '</div>';

    modal.addEventListener("click", function(e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

async function submitPasswordChange() {
    var current = document.getElementById("cp-current").value;
    var newPass = document.getElementById("cp-new").value;
    var confirm = document.getElementById("cp-confirm").value;

    if (!current || !newPass || !confirm) {
        showNavToast("Please fill all fields.", "error");
        return;
    }
    if (newPass.length < 6) {
        showNavToast("Password must be at least 6 characters.", "error");
        return;
    }
    if (newPass !== confirm) {
        showNavToast("Passwords do not match.", "error");
        return;
    }

    var btn = document.getElementById("cp-btn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
        var res = await fetch(_authBasePath + "php/user/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "change_password",
                current_password: current,
                new_password: newPass,
                confirm_password: confirm
            })
        });
        var data = await res.json();
        showNavToast(data.message, data.success ? "success" : "error");
        if (data.success) {
            setTimeout(function() {
                document.getElementById("cp-modal").remove();
            }, 1500);
        }
    } catch(e) {
        showNavToast("Error connecting to server.", "error");
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Update Password';
}

// =============================================
// CHANGE PROFILE PICTURE MODAL
// =============================================
function openChangePfpModal() {
    var old = document.getElementById("pfp-modal");
    if (old) old.remove();

    var modal = document.createElement("div");
    modal.id = "pfp-modal";
    modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:999999;display:flex;align-items:center;justify-content:center";

    modal.innerHTML =
        '<div style="background:#1a1a2e;padding:30px;border-radius:15px;width:90%;max-width:380px;text-align:center">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
                '<h3 style="color:#f3971b;margin:0"><i class="fas fa-camera"></i> Change Photo</h3>' +
                '<button onclick="document.getElementById(\'pfp-modal\').remove()" style="background:none;border:none;color:#888;cursor:pointer;font-size:1.2rem">&times;</button>' +
            '</div>' +
            '<div id="pfp-preview" style="width:100px;height:100px;border-radius:50%;background:#16213e;margin:0 auto 15px;border:3px solid #333;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
                '<i class="fas fa-image" style="font-size:2rem;color:#555"></i>' +
            '</div>' +
            '<label for="pfp-file" style="display:inline-block;padding:10px 20px;background:#16213e;color:#f3971b;border:1px solid #f3971b;border-radius:8px;cursor:pointer;margin-bottom:10px;font-size:0.85rem">' +
                '<i class="fas fa-folder-open"></i> Choose Image' +
            '</label>' +
            '<input type="file" id="pfp-file" accept="image/jpeg,image/png,image/gif" style="display:none">' +
            '<p style="color:#888;font-size:0.75rem;margin-bottom:15px">JPG, PNG or GIF — Max 2MB</p>' +
            '<button id="pfp-btn" disabled onclick="submitPfpUpload()" style="width:100%;padding:12px;background:#555;color:white;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:not-allowed;font-family:inherit">' +
                '<i class="fas fa-upload"></i> Upload' +
            '</button>' +
        '</div>';

    modal.addEventListener("click", function(e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);

    document.getElementById("pfp-file").addEventListener("change", function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            document.getElementById("pfp-preview").innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover">';
            var btn = document.getElementById("pfp-btn");
            btn.disabled = false;
            btn.style.background = "#f3971b";
            btn.style.cursor = "pointer";
        };
        reader.readAsDataURL(file);
    });
}

async function submitPfpUpload() {
    var file = document.getElementById("pfp-file").files[0];
    if (!file) return;

    var btn = document.getElementById("pfp-btn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    var formData = new FormData();
    formData.append("profile_picture", file);

    try {
        var res = await fetch(_authBasePath + "php/user/upload_profile_picture.php", {
            method: "POST",
            body: formData
        });
        var data = await res.json();
        showNavToast(data.message, data.success ? "success" : "error");

        if (data.success) {
            setTimeout(function() {
                document.getElementById("pfp-modal").remove();
                window.location.reload();
            }, 1500);
        }
    } catch(e) {
        showNavToast("Error uploading picture.", "error");
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
}

// =============================================
// TOAST
// =============================================
function showNavToast(msg, type) {
    type = type || "success";
    var tc = document.getElementById("nav-toast-container");
    if (!tc) {
        tc = document.createElement("div");
        tc.id = "nav-toast-container";
        tc.style.cssText = "position:fixed;top:100px;right:20px;z-index:9999999;";
        document.body.appendChild(tc);
    }
    var t = document.createElement("div");
    t.style.cssText = "padding:12px 20px;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;gap:8px;color:white;opacity:0;transform:translateX(100%);transition:all 0.3s ease;font-size:0.9rem;max-width:350px;box-shadow:0 5px 15px rgba(0,0,0,0.3);cursor:pointer;background:" + (type === "success" ? "linear-gradient(135deg,#4caf50,#2e7d32)" : "linear-gradient(135deg,#ff4444,#c62828)");
    t.innerHTML = '<i class="fas ' + (type === "success" ? "fa-check-circle" : "fa-exclamation-circle") + '"></i><span>' + msg + '</span>';
    t.onclick = function() { t.style.opacity = "0"; setTimeout(function() { if (t.parentElement) t.remove(); }, 300); };
    tc.appendChild(t);
    setTimeout(function() { t.style.opacity = "1"; t.style.transform = "translateX(0)"; }, 100);
    setTimeout(function() { t.style.opacity = "0"; t.style.transform = "translateX(100%)"; setTimeout(function() { if (t.parentElement) t.remove(); }, 300); }, 4000);
}