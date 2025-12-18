// DOM Elements
const cartIcon = document.querySelector(".cart-icon");
const cartDropdown = document.querySelector(".cart-dropdown");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartEmpty = document.querySelector(".cart-empty");
const totalAmount = document.querySelector(".total-amount");
const checkoutBtn = document.querySelector(".checkout-btn");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const modalBody = document.querySelector(".modal-body");
const toastContainer = document.querySelector(".toast-container");
const newsletterForm = document.getElementById("newsletter-form");

// Cart State
let cart = [];
let isCartOpen = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
  setupEventListeners();
  updateCartUI();
});

// Event Listeners Setup
function setupEventListeners() {
  cartIcon.addEventListener("click", toggleCart);
  document.addEventListener("click", handleOutsideClick);
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  closeModal.addEventListener("click", closeModalView);
  checkoutBtn.addEventListener("click", handleCheckout);
  newsletterForm.addEventListener("submit", handleNewsletterSubmit);

  // Add to Cart Buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });

  // Quick View Buttons
  document.querySelectorAll(".quick-view").forEach((button) => {
    button.addEventListener("click", handleQuickView);
  });

  // Back to Top Button
  window.addEventListener("scroll", handleScroll);
}

// Cart Functions
function toggleCart() {
  isCartOpen = !isCartOpen;
  cartDropdown.style.display = isCartOpen ? "block" : "none";
}

function handleOutsideClick(e) {
  if (
    !e.target.closest(".cart-wrapper") &&
    !e.target.closest(".modal") &&
    isCartOpen
  ) {
    toggleCart();
  }
}

function handleAddToCart(e) {
  const bookCard = e.target.closest(".book-card");
  const book = {
    id: Date.now(),
    title: bookCard.querySelector("h3").textContent,
    price: parseFloat(
      bookCard.querySelector(".price").textContent.replace("$", "")
    ),
    image: bookCard.querySelector("img").src,
    quantity: 1,
  };

  const existingItem = cart.find((item) => item.title === book.title);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(book);
  }

  updateCartUI();
  saveCartToLocalStorage();
  showToast(`${book.title} added to cart!`);
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);
  const removedItem = cart[index];
  cart.splice(index, 1);
  updateCartUI();
  saveCartToLocalStorage();
  showToast(`${removedItem.title} removed from cart!`);
}

function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
      saveCartToLocalStorage();
    }
  }
}

function updateCartUI() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartEmpty.style.display = cart.length === 0 ? "block" : "none";

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = `$${total.toFixed(2)}`;

  renderCartItems();
}

function renderCartItems() {
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `
    )
    .join("");
}

// Local Storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Quick View Modal
function handleQuickView(e) {
  const bookCard = e.target.closest(".book-card");
  const modalContent = `
        <div class="quick-view-content">
            <img src="${bookCard.querySelector("img").src}" alt="${
    bookCard.querySelector("h3").textContent
  }">
            <div class="quick-view-details">
                <h2>${bookCard.querySelector("h3").textContent}</h2>
                <p class="author">${
                  bookCard.querySelector(".author").textContent
                }</p>
                <div class="rating">${
                  bookCard.querySelector(".book-rating").innerHTML
                }</div>
                <p class="price">${
                  bookCard.querySelector(".price").textContent
                }</p>
                <button class="add-to-cart" onclick="handleAddToCart(event)">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

  modalBody.innerHTML = modalContent;
  modal.style.display = "block";
}

function closeModalView() {
  modal.style.display = "none";
}

// Toast Notifications
function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// Mobile Menu
function toggleMobileMenu() {
  navLinks.classList.toggle("active");
  mobileMenuToggle.querySelector("i").classList.toggle("fa-bars");
  mobileMenuToggle.querySelector("i").classList.toggle("fa-times");
}

// Newsletter
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  showToast(`Thank you for subscribing with ${email}!`);
  e.target.reset();
}

// Checkout
function handleCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  showToast("Proceeding to checkout...");
  // Add your checkout logic here
}

// Back to Top
function handleScroll() {
  const backToTop = document.querySelector(".back-to-top");
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

// Add this to your CSS if not already present
const style = document.createElement("style");
style.textContent = `
    .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    .toast {
        background: var(--gradient);
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    }
    .toast.show {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(style);