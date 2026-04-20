// =============================================
// SHOP MANAGER — Connected to PHP/MySQL Backend
// =============================================

class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = "grid";
        this.currentSort = "featured";
        this.totalPages = 1;
        this.isLoggedIn = false;
        this.filters = {
            category: "",
            price: "",
            rating: "",
            search: "",
        };

        this.shopGrid = document.getElementById("shop-grid");
        this.categoryFilter = document.getElementById("category-filter");
        this.priceFilter = document.getElementById("price-filter");
        this.ratingFilter = document.getElementById("rating-filter");
        this.searchFilter = document.getElementById("search-filter");
        this.sortSelect = document.getElementById("sort-options");
        this.viewOptions = document.querySelectorAll(".view-option");
        this.pagination = document.getElementById("pagination");

        this.init();
    }

    async init() {
        await this.checkLoginStatus();
        await this.fetchProducts();
        this.setupEventListeners();
    }

    // ---- Check Login Status ----
    async checkLoginStatus() {
        try {
            var res = await fetch("../php/user/get_profile.php");
            var data = await res.json();
            this.isLoggedIn = data.loggedIn;

            if (data.loggedIn && data.data) {
                this.updateNavForLoggedInUser(data.data);
            }
        } catch (e) {
            this.isLoggedIn = false;
        }
    }

    updateNavForLoggedInUser(user) {
        var loginBtn = document.querySelector(".login-btn");
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> ' + user.username;
            loginBtn.href = "#";
            loginBtn.addEventListener("click", function(e) { e.preventDefault(); });
        }

        var navLinks = document.querySelector(".nav-links");
        if (navLinks && !navLinks.querySelector(".logout-link")) {
            var logoutItem = document.createElement("li");
            logoutItem.classList.add("logout-link");
            logoutItem.innerHTML = '<a href="../php/auth/logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>';
            navLinks.appendChild(logoutItem);
        }

        var cartCount = document.querySelector(".cart-count");
        if (cartCount && user.cartCount !== undefined) {
            cartCount.textContent = user.cartCount;
        }
    }

    // ---- Fetch Products from PHP ----
    async fetchProducts() {
        try {
            var params = new URLSearchParams({
                category: this.filters.category,
                price: this.filters.price,
                rating: this.filters.rating,
                search: this.filters.search,
                sort: this.currentSort,
                page: this.currentPage,
                limit: this.itemsPerPage,
            });

            var res = await fetch("../php/books/get_books.php?" + params);
            var data = await res.json();

            if (data.success) {
                this.products = data.data;
                this.filteredProducts = data.data;
                this.totalPages = data.totalPages;
                this.renderProducts();
                this.updatePagination();
            } else {
                if (this.shopGrid) {
                    this.shopGrid.innerHTML = '<p class="no-results">Failed to load books.</p>';
                }
            }
        } catch (e) {
            if (this.shopGrid) {
                this.shopGrid.innerHTML = '<p class="no-results">Error connecting to server.</p>';
            }
        }
    }

    setupEventListeners() {
        var self = this;

        if (this.categoryFilter) {
            this.categoryFilter.addEventListener("change", function() { self.handleFilterChange(); });
        }
        if (this.priceFilter) {
            this.priceFilter.addEventListener("change", function() { self.handleFilterChange(); });
        }
        if (this.ratingFilter) {
            this.ratingFilter.addEventListener("change", function() { self.handleFilterChange(); });
        }
        if (this.searchFilter) {
            this.searchFilter.addEventListener("input", debounce(function() { self.handleFilterChange(); }, 300));
        }
        if (this.sortSelect) {
            this.sortSelect.addEventListener("change", function(e) {
                self.currentSort = e.target.value;
                self.currentPage = 1;
                self.fetchProducts();
            });
        }
        if (this.viewOptions) {
            this.viewOptions.forEach(function(option) {
                option.addEventListener("click", function(e) { self.handleViewChange(e); });
            });
        }
    }

    handleFilterChange() {
        this.filters = {
            category: this.categoryFilter ? this.categoryFilter.value : "",
            price: this.priceFilter ? this.priceFilter.value : "",
            rating: this.ratingFilter ? this.ratingFilter.value : "",
            search: this.searchFilter ? this.searchFilter.value.toLowerCase() : "",
        };
        this.currentPage = 1;
        this.fetchProducts();
    }

    renderProducts() {
        if (!this.shopGrid) return;

        if (this.filteredProducts.length === 0) {
            this.shopGrid.innerHTML = '<p class="no-results">No books found matching your criteria.</p>';
            return;
        }

        this.shopGrid.className = "shop-grid " + this.currentView + "-view";

        var self = this;
        this.shopGrid.innerHTML = this.filteredProducts.map(function(product) {
            return self.generateProductHTML(product);
        }).join("");

        document.querySelectorAll(".add-to-cart").forEach(function(button) {
            button.addEventListener("click", function(e) { self.handleAddToCart(e); });
        });
    }

    generateProductHTML(product) {
        var stars = this.generateRatingStars(parseFloat(product.rating));
        var inStock = product.in_stock == 1;
        var badge = product.badge ? product.badge : (inStock ? "In Stock" : "Out of Stock");
        var categoryName = product.category_name || product.category_slug || "";
        var price = parseFloat(product.price).toFixed(2);

        return '<div class="book-card" data-id="' + product.id + '">' +
            '<div class="book-badge">' + badge + '</div>' +
            '<div class="book-image">' +
                '<img src="' + product.image + '" alt="' + product.title + '" onerror="this.onerror=null;this.style.display=\'none\'">' +
                '<div class="book-overlay"><button class="quick-view">Quick View</button></div>' +
            '</div>' +
            '<div class="book-info">' +
                '<div class="book-category">' + categoryName + '</div>' +
                '<h3>' + product.title + '</h3>' +
                '<div class="author">' + product.author + '</div>' +
                '<div class="book-rating">' + stars + '<span>(' + product.reviews + ')</span></div>' +
                '<div class="price">$' + price + '</div>' +
                '<button class="add-to-cart"' + (!inStock ? ' disabled' : '') + '>' +
                    '<i class="fas fa-shopping-cart"></i> Add to Cart' +
                '</button>' +
            '</div>' +
        '</div>';
    }

    generateRatingStars(rating) {
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 >= 0.5;
        var stars = "";

        for (var i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    updatePagination() {
        if (!this.pagination) return;

        var html = "";
        var self = this;

        if (this.currentPage > 1) {
            html += '<button onclick="shopManager.goToPage(' + (this.currentPage - 1) + ')"><i class="fas fa-chevron-left"></i></button>';
        }

        for (var i = 1; i <= this.totalPages; i++) {
            html += '<button class="' + (i === this.currentPage ? "active" : "") + '" onclick="shopManager.goToPage(' + i + ')">' + i + '</button>';
        }

        if (this.currentPage < this.totalPages) {
            html += '<button onclick="shopManager.goToPage(' + (this.currentPage + 1) + ')"><i class="fas fa-chevron-right"></i></button>';
        }

        this.pagination.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.fetchProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    handleViewChange(e) {
        var button = e.currentTarget;
        this.currentView = button.dataset.view;
        this.viewOptions.forEach(function(option) { option.classList.remove("active"); });
        button.classList.add("active");
        this.renderProducts();
    }

    // ---- Add to Cart — Sends to PHP ----
    async handleAddToCart(e) {
        var bookCard = e.target.closest(".book-card");
        var productId = bookCard.dataset.id;

        if (!this.isLoggedIn) {
            showToast("Please login to add items to cart!");
            setTimeout(function() {
                window.location.href = "login.html";
            }, 1500);
            return;
        }

        try {
            var res = await fetch("../php/shop/add_to_cart.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_id: parseInt(productId) }),
            });

            var data = await res.json();

            if (data.success) {
                showToast(data.message);
                var cartCount = document.querySelector(".cart-count");
                if (cartCount) cartCount.textContent = data.cartCount;
                await loadCartItems();
            } else if (data.requireLogin) {
                showToast("Please login first!");
                setTimeout(function() {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                showToast(data.message || "Failed to add to cart.");
            }
        } catch (err) {
            showToast("Error connecting to server.");
        }
    }
}

// =============================================
// CART MANAGEMENT — Database Backed
// =============================================

async function loadCartItems() {
    try {
        var res = await fetch("../php/shop/view_cart.php");
        var data = await res.json();

        var cartItems = document.querySelector(".cart-items");
        var cartEmpty = document.querySelector(".cart-empty");
        var cartCount = document.querySelector(".cart-count");
        var totalAmount = document.querySelector(".total-amount");

        if (!data.success || data.data.length === 0) {
            if (cartEmpty) cartEmpty.style.display = "block";
            if (cartItems) cartItems.innerHTML = "";
            if (cartCount) cartCount.textContent = "0";
            if (totalAmount) totalAmount.textContent = "$0.00";
            return;
        }

        if (cartEmpty) cartEmpty.style.display = "none";
        if (cartCount) cartCount.textContent = data.count;
        if (totalAmount) totalAmount.textContent = "$" + data.total.toFixed(2);

        if (cartItems) {
            cartItems.innerHTML = data.data.map(function(item) {
                return '<div class="cart-item" data-id="' + item.book_id + '">' +
                    '<img src="' + item.image + '" alt="' + item.title + '" onerror="this.onerror=null;this.style.display=\'none\'">' +
                    '<div class="cart-item-details">' +
                        '<h4>' + item.title + '</h4>' +
                        '<p>$' + parseFloat(item.price).toFixed(2) + '</p>' +
                        '<div class="quantity-controls">' +
                            '<button onclick="updateCartQuantity(' + item.book_id + ', -1)">-</button>' +
                            '<span>' + item.quantity + '</span>' +
                            '<button onclick="updateCartQuantity(' + item.book_id + ', 1)">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="removeCartItem(' + item.book_id + ')" class="remove-item">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                '</div>';
            }).join("");
        }
    } catch (e) {
        console.error("Failed to load cart:", e);
    }
}

async function updateCartQuantity(bookId, change) {
    try {
        var res = await fetch("../php/shop/update_cart.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book_id: bookId, change: change }),
        });
        var data = await res.json();
        if (data.success) await loadCartItems();
    } catch (e) {
        showToast("Failed to update cart.");
    }
}

async function removeCartItem(bookId) {
    try {
        var res = await fetch("../php/shop/remove_from_cart.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book_id: bookId }),
        });
        var data = await res.json();
        if (data.success) {
            showToast(data.message);
            await loadCartItems();
        }
    } catch (e) {
        showToast("Failed to remove item.");
    }
}

// =============================================
// DEBOUNCE
// =============================================
function debounce(func, wait) {
    var timeout;
    return function() {
        var args = arguments;
        var context = this;
        clearTimeout(timeout);
        timeout = setTimeout(function() { func.apply(context, args); }, wait);
    };
}

// =============================================
// TOAST
// =============================================
function showToast(message) {
    var toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        toastContainer.style.cssText = "position:fixed;top:100px;right:20px;z-index:99999;";
        document.body.appendChild(toastContainer);
    }

    var toast = document.createElement("div");
    toast.classList.add("toast");
    toast.style.cssText = "background:linear-gradient(135deg,#f3971b,#e08515);color:white;padding:15px 25px;border-radius:10px;margin-bottom:10px;display:flex;align-items:center;gap:10px;opacity:0;transform:translateX(100%);transition:all 0.3s ease;";
    toast.innerHTML = '<i class="fas fa-check-circle"></i><span>' + message + '</span>';
    toastContainer.appendChild(toast);

    setTimeout(function() { toast.style.opacity = "1"; toast.style.transform = "translateX(0)"; }, 100);
    setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(function() { if (toast.parentElement) toastContainer.removeChild(toast); }, 300);
    }, 3000);
}

// =============================================
// INITIALIZE
// =============================================

var shopManager;

document.addEventListener("DOMContentLoaded", function() {
    // Initialize ShopManager only on shop page
    if (document.getElementById("shop-grid")) {
        shopManager = new ShopManager();
    }

    // Load cart on every page
    loadCartItems();

    // Cart toggle
    var cartIcon = document.querySelector(".cart-icon");
    var cartDropdown = document.querySelector(".cart-dropdown");
    var closeCart = document.querySelector(".close-cart");
    var isCartOpen = false;

    if (cartIcon) {
        cartIcon.addEventListener("click", function() {
            isCartOpen = !isCartOpen;
            cartDropdown.style.display = isCartOpen ? "block" : "none";
        });
    }

    if (closeCart) {
        closeCart.addEventListener("click", function() {
            isCartOpen = false;
            cartDropdown.style.display = "none";
        });
    }

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".cart-wrapper") && isCartOpen) {
            isCartOpen = false;
            if (cartDropdown) cartDropdown.style.display = "none";
        }
    });

    // Checkout button
    var checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            window.location.href = "checkout.html";
        });
    }

    // Header scroll
    var header = document.querySelector(".main-header");
    var lastScroll = 0;

    window.addEventListener("scroll", function() {
        var currentScroll = window.pageYOffset;
        if (currentScroll <= 0) { header.classList.remove("scroll-up"); return; }
        if (currentScroll > lastScroll && !header.classList.contains("scroll-down")) {
            header.classList.remove("scroll-up");
            header.classList.add("scroll-down");
        } else if (currentScroll < lastScroll && header.classList.contains("scroll-down")) {
            header.classList.remove("scroll-down");
            header.classList.add("scroll-up");
        }
        lastScroll = currentScroll;
    });

    // Mobile menu
    var mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    var navLinks = document.querySelector(".nav-links");

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", function() {
            navLinks.classList.toggle("active");
            mobileMenuToggle.querySelector("i").classList.toggle("fa-bars");
            mobileMenuToggle.querySelector("i").classList.toggle("fa-times");
        });
    }
}); 