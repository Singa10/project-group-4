// Shop Page JavaScript
class ShopManager {
    constructor() {
      // State
      this.products = [];
      this.filteredProducts = [];
      this.currentPage = 1;
      this.itemsPerPage = 12;
      this.currentView = "grid";
      this.currentSort = "featured";
      this.filters = {
        category: "",
        price: "",
        rating: "",
        search: "",
      };
  
      // DOM Elements
      this.shopGrid = document.getElementById("shop-grid");
      this.categoryFilter = document.getElementById("category-filter");
      this.priceFilter = document.getElementById("price-filter");
      this.ratingFilter = document.getElementById("rating-filter");
      this.searchFilter = document.getElementById("search-filter");
      this.sortSelect = document.getElementById("sort-options");
      this.viewOptions = document.querySelectorAll(".view-option");
      this.pagination = document.getElementById("pagination");
  
      // Initialize
      this.init();
    }
  
    async init() {
      await this.fetchProducts();
      this.setupEventListeners();
      this.applyFilters();
      this.renderProducts();
    }
  
    async fetchProducts() {
      // Simulated product data - Replace with actual API call
      this.products = [
        {
          id: 1,
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 44.99,
          rating: 4.8,
          reviews: 1250,
          category: "programming",
          image:
            "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg",
          description: "A Handbook of Agile Software Craftsmanship",
          inStock: true,
        },
        {
          id: 2,
          title: "Design Patterns",
          author: "Erich Gamma et al.",
          price: 54.99,
          rating: 4.7,
          reviews: 980,
          category: "design-patterns",
          image:
            "https://i1.wp.com/springframework.guru/wp-content/uploads/2015/04/9780201633610.jpg?resize=520%2C648",
          description: "Elements of Reusable Object-Oriented Software",
          inStock: true,
        },
        {
          id: 3,
          title: "The Pragmatic Programmer",
          author: "Andrew Hunt & David Thomas",
          price: 49.99,
          rating: 4.9,
          reviews: 1500,
          category: "programming",
          image: "https://th.bing.com/th/id/OIP.qj6BQ0g14hMcS78qxOl9iwHaJp",
          description: "Your Journey to Mastery",
          inStock: true,
        },
        {
          id: 4,
          title: "Code Complete",
          author: "Steve McConnell",
          price: 47.99,
          rating: 4.7,
          reviews: 1120,
          category: "software-construction",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/41JOmGowq-L._SX408_BO1,204,203,200_.jpg",
          description: "A Practical Handbook of Software Construction",
          inStock: true,
        },
        {
          id: 5,
          title: "Head First Design Patterns",
          author: "Eric Freeman & Elisabeth Robson",
          price: 45.99,
          rating: 4.7,
          reviews: 900,
          category: "design-patterns",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/61APhXCksuL._SX430_BO1,204,203,200_.jpg",
          description: "A Brain-Friendly Guide",
          inStock: true,
        },
        {
          id: 6,
          title: "Refactoring",
          author: "Martin Fowler",
          price: 46.99,
          rating: 4.8,
          reviews: 850,
          category: "code-improvement",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg",
          description: "Improving the Design of Existing Code",
          inStock: true,
        },
        {
          id: 7,
          title: "You Don't Know JS",
          author: "Kyle Simpson",
          price: 39.99,
          rating: 4.6,
          reviews: 700,
          category: "javascript",
          image: "https://eloquentjavascript.net/img/cover.jpg",
          description: "A deep dive into the core mechanisms of JavaScript",
          inStock: true,
        },
        {
          id: 8,
          title: "Eloquent JavaScript",
          author: "Marijn Haverbeke",
          price: 35.99,
          rating: 4.5,
          reviews: 580,
          category: "javascript",
          image:
            "https://images-na.ssl-images-amazon.com/images/I/91asIC1fRwL.jpg",
          description: "A Modern Introduction to Programming",
          inStock: true,
        },
        {
          id: 9,
          title: "The Art of Computer Programming",
          author: "Donald E. Knuth",
          price: 190.0,
          rating: 4.9,
          reviews: 400,
          category: "computer-science",
          image:
            "https://media.elefant.ro/mnresize/1000/-/images/28/1736328/the-art-of-computer-programming-volume-1-fundamental-algorithms-hardcover-3rd-ed_1_fullsize.jpg",
          description: "Comprehensive coverage of algorithms and data structures",
          inStock: true,
        },
        {
          id: 10,
          title: "Introduction to Algorithms",
          author: "Thomas H. Cormen et al.",
          price: 80.0,
          rating: 4.8,
          reviews: 650,
          category: "algorithms",
          image:
            "https://imgv2-2-f.scribdassets.com/img/document/544555770/original/1f27e81b4c/1702740355?v=1",
          description:
            "Comprehensive introduction to the modern study of computer algorithms",
          inStock: true,
        },
        {
          id: 11,
          title: "Cracking the Coding Interview",
          author: "Gayle Laakmann McDowell",
          price: 35.99,
          rating: 4.9,
          reviews: 2200,
          category: "career",
          image:
            "https://th.bing.com/th/id/R.1146e2b3ef30e028082c77d4ddb746fe?rik=qlLBpCdkVLbFBQ&pid=ImgRaw&r=0",
          description: "189 Programming Questions and Solutions",
          inStock: true,
        },
        {
          id: 12,
          title: "Programming Pearls",
          author: "Jon Bentley",
          price: 29.99,
          rating: 4.6,
          reviews: 450,
          category: "programming",
          image:
            "https://th.bing.com/th/id/R.66ba7d2264d2c26b783d5a705571b6fd?rik=Bhl4gfKS5dyk0g&riu=http%3a%2f%2fimg.valorebooks.com%2fFULL%2f97%2f9780%2f978020%2f9780201657883.jpg&ehk=PWGlWg2uGdkyWxnWyLR4mc%2fR1Zj2Jhccg97l5spGP20%3d&risl=&pid=ImgRaw&r=0",
          description: "A treasure trove of practical programming techniques",
          inStock: true,
        },
      ];
  
      this.setupEventListeners();
    }
    setupEventListeners() {
      // Filter listeners
      this.categoryFilter.addEventListener("change", () =>
        this.handleFilterChange()
      );
      this.priceFilter.addEventListener("change", () =>
        this.handleFilterChange()
      );
      this.ratingFilter.addEventListener("change", () =>
        this.handleFilterChange()
      );
      this.searchFilter.addEventListener(
        "input",
        debounce(() => this.handleFilterChange(), 300)
      );
  
      // Sort listener
      this.sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });
  
      // View toggle listeners
      this.viewOptions.forEach((option) => {
        option.addEventListener("click", (e) => this.handleViewChange(e));
      });
    }
  
    handleFilterChange() {
      this.filters = {
        category: this.categoryFilter.value,
        price: this.priceFilter.value,
        rating: this.ratingFilter.value,
        search: this.searchFilter.value.toLowerCase(),
      };
      this.currentPage = 1;
      this.applyFilters();
    }
  
    applyFilters() {
      this.filteredProducts = this.products.filter((product) => {
        // Category filter
        if (this.filters.category && product.category !== this.filters.category)
          return false;
  
        // Price filter
        if (this.filters.price) {
          const [min, max] = this.filters.price.split("-").map(Number);
          if (max && (product.price < min || product.price > max)) return false;
          if (!max && product.price < min) return false;
        }
  
        // Rating filter
        if (this.filters.rating && product.rating < Number(this.filters.rating))
          return false;
  
        // Search filter
        if (
          this.filters.search &&
          !product.title.toLowerCase().includes(this.filters.search) &&
          !product.author.toLowerCase().includes(this.filters.search)
        ) {
          return false;
        }
  
        return true;
      });
  
      // Apply sorting
      this.applySorting();
      this.renderProducts();
      this.updatePagination();
    }
  
    applySorting() {
      switch (this.currentSort) {
        case "price-low":
          this.filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          this.filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          this.filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        default: // featured
          this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
      }
    }
  
    renderProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
  
      this.shopGrid.className = `shop-grid ${this.currentView}-view`;
      this.shopGrid.innerHTML = productsToShow
        .map((product) => this.generateProductHTML(product))
        .join("");
  
      // Reinitialize add to cart buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => this.handleAddToCart(e));
      });
    }
  
    generateProductHTML(product) {
      return `
            <div class="book-card" data-id="${product.id}">
                <div class="book-badge">${
                  product.inStock ? "In Stock" : "Out of Stock"
                }</div>
                <div class="book-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="book-overlay">
                        <button class="quick-view">Quick View</button>
                    </div>
                </div>
                <div class="book-info">
                    <div class="book-category">${product.category}</div>
                    <h3>${product.title}</h3>
                    <div class="author">${product.author}</div>
                    <div class="book-rating">
                        ${this.generateRatingStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" ${
                      !product.inStock ? "disabled" : ""
                    }>
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }
  
    generateRatingStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      let stars = "";
  
      for (let i = 0; i < 5; i++) {
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
      const totalPages = Math.ceil(
        this.filteredProducts.length / this.itemsPerPage
      );
      let paginationHTML = "";
  
      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
                <button class="${i === this.currentPage ? "active" : ""}" 
                        onclick="shopManager.goToPage(${i})">
                    ${i}
                </button>
            `;
      }
  
      this.pagination.innerHTML = paginationHTML;
    }
  
    goToPage(page) {
      this.currentPage = page;
      this.renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    handleViewChange(e) {
      const button = e.currentTarget;
      this.currentView = button.dataset.view;
  
      this.viewOptions.forEach((option) => option.classList.remove("active"));
      button.classList.add("active");
  
      this.renderProducts();
    }
  
    handleAddToCart(e) {
      const bookCard = e.target.closest(".book-card");
      const productId = bookCard.dataset.id;
      const product = this.products.find((p) => p.id === Number(productId));
  
      if (product) {
        // Integrate with your existing cart functionality
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
  
        // Dispatch custom event for cart update
        const event = new CustomEvent("addToCart", { detail: cartItem });
        document.dispatchEvent(event);
  
        showToast(`${product.title} added to cart!`);
      }
    }
  }
  
  // Utility function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      if (!func) {
        throw new Error("Debounce function cannot be null or undefined.");
      }
      const later = () => {
        clearTimeout(timeout);
        try {
          func(...args);
        } catch (error) {
          console.error(error);
        }
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Initialize shop manager
  const shopManager = new ShopManager();
  
  // Toast notification function (if not already defined in your main JS)
  function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
  
    const toastContainer = document.querySelector(".toast-container");
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
  
  // Cart integration
  document.addEventListener("addToCart", (e) => {
    // This should integrate with your existing cart functionality
    const cartItem = e.detail;
    // Add your cart update logic here
  });
  // shop.js
  
  // First, let's ensure we have the same header functionality as the home page
  document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const header = document.querySelector(".main-header");
    let lastScroll = 0;
  
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
  
      if (currentScroll <= 0) {
        header.classList.remove("scroll-up");
        return;
      }
  
      if (
        currentScroll > lastScroll &&
        !header.classList.contains("scroll-down")
      ) {
        header.classList.remove("scroll-up");
        header.classList.add("scroll-down");
      } else if (
        currentScroll < lastScroll &&
        header.classList.contains("scroll-down")
      ) {
        header.classList.remove("scroll-down");
        header.classList.add("scroll-up");
      }
      lastScroll = currentScroll;
    });
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
  
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileMenuToggle.querySelector("i").classList.toggle("fa-bars");
      mobileMenuToggle.querySelector("i").classList.toggle("fa-times");
    });
  
    const cartIcon = document.querySelector(".cart-icon");
    const cartDropdown = document.querySelector(".cart-dropdown");
    const cartItems = document.querySelector(".cart-items");
    const cartCount = document.querySelector(".cart-count");
    const cartEmpty = document.querySelector(".cart-empty");
    const totalAmount = document.querySelector(".total-amount");
    let isCartOpen = false;
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    function updateCartUI() {
      cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartEmpty.style.display = cart.length === 0 ? "block" : "none";
  
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      totalAmount.textContent = `$${total.toFixed(2)}`;
  
      cartItems.innerHTML = cart
        .map(
          (item) => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${
                          item.id
                        }, -1)">-</button>
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
  
    // Toggle cart
    cartIcon.addEventListener("click", () => {
      isCartOpen = !isCartOpen;
      cartDropdown.style.display = isCartOpen ? "block" : "none";
    });
  
    // Close cart when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".cart-wrapper") && isCartOpen) {
        isCartOpen = false;
        cartDropdown.style.display = "none";
      }
    });
  
    // Update quantity
    window.updateQuantity = (id, change) => {
      const itemIndex = cart.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      }
    };
  
    // Remove from cart
    window.removeFromCart = (id) => {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
      showToast("Item removed from cart");
    };
  
    // Add to cart function
    window.addToCart = (product) => {
      const existingItem = cart.find((item) => item.id === product.id);
  
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          ...product,
          quantity: 1,
        });
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
      showToast(`${product.title} added to cart!`);
    };
  
    // Initial cart update
    updateCartUI();
  
    // Shop specific functionality
    class ShopManager {
      // ... (rest of the shop manager code remains the same)
  
      handleAddToCart(e) {
        const bookCard = e.target.closest(".book-card");
        const productId = parseInt(bookCard.dataset.id);
        const product = this.products.find((p) => p.id === productId);
  
        if (product) {
          const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
          };
  
          window.addToCart(cartItem); // Use the global addToCart function
        }
      }
    }
  
    // Initialize shop manager
    const shopManager = new ShopManager();
  });
  
  // Toast notification function
  function showToast(message) {
    const toastContainer = document.querySelector(".toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
  
    toastContainer.appendChild(toast);
  
    setTimeout(() => toast.classList.add("show"), 100);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toastContainer.removeChild(toast), 300);
    }, 3000);
  }