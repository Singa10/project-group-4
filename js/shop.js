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
          price: 19.99,
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
          image: "../images/you don know js book series.jfif",
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
        {
          id: 13,
          title: "To kill a Mockingbird",
          author: "harper Lee",
          price: 44.99,
          rating: 4.8,
          reviews: 650,
          category: "fiction",
          image:
            "../images/to kill a mokingbird.jfif",
          description:
            "Comprehensive introduction to the modern study of computer algorithms",
          inStock: true,
        },
        
{
  id: 14,
  title: "1984",
  author: "George Orwell",
  price: 29.99,
  rating: 4.7,
  reviews: 1200,
  category: "fiction",
  image: "../images/George Orwell BBC Arena Documentary, 1984_ this….jfif",
  description: "A dystopian novel exploring surveillance, control, and truth.",
  inStock: true,
},
{
  id: 15,
  title: "Pride and Prejudice",
  author: "Jane Austen",
  price: 24.99,
  rating: 4.6,
  reviews: 950,
  category: "fiction",
  image: "../images/The image depicts a classic book cover for Jane… (2).jfif",
  description: "A classic romance novel about love, class, and society.",
  inStock: true,
},
{
  id: 16,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  price: 27.99,
  rating: 4.5,
  reviews: 870,
  category: "fiction",
  image: "../images/Vintage Book Cover Print _The Great Gatsby_ - F….jfif",
  description: "A story of wealth, love, and the American dream.",
  inStock: true,
},

{
  id: 17,
  title: "Sapiens: A Brief History of Humankind",
  author: "Yuval Noah Harari",
  price: 39.99,
  rating: 4.8,
  reviews: 2100,
  category: "non-fiction",
  image: "../images/From a renowned historian comes a groundbreaking… (1).jfif",
  description: "Explores the history and impact of Homo sapiens.",
  inStock: true,
},
{
  id: 18,
  title: "Educated",
  author: "Tara Westover",
  price: 34.99,
  rating: 4.7,
  reviews: 1600,
  category: "non-fiction",
  image: "../images/Educated by Tara Westover on Apple Books (1).jfif",
  description: "A memoir about resilience, family, and the pursuit of education.",
  inStock: true,
},
{
  id: 19,
  title: "Becoming",
  author: "Michelle Obama",
  price: 36.99,
  rating: 4.9,
  reviews: 2500,
  category: "non-fiction",
  image: "../images/Becoming - Michelle Obama.jfif",
  description: "The inspiring memoir of the former First Lady of the United States.",
  inStock: true,
},

{
  id: 20,
  title: "Thinking, Fast and Slow",
  author: "Daniel Kahneman",
  price: 42.99,
  rating: 4.8,
  reviews: 3000,
  category: "psychology",
  image: "../images/download (1).jfif",
  description: "Examines two modes of thought: fast, intuitive and slow, deliberate.",
  inStock: true,
},
{
  id: 21,
  title: "Man's Search for Meaning",
  author: "Viktor E. Frankl",
  price:19.99,
  rating: 4.9,
  reviews: 2800,
  category: "psychology",
  image: "../images/Man's search for meaning_.jfif",
  description: "A psychiatrist’s reflections on life in Nazi camps and finding meaning.",
  inStock: true,
},
{
  id: 22,
  title: "The Power of Habit",
  author: "Charles Duhigg",
  price: 33.99,
  rating: 4.6,
  reviews: 1900,
  category: "psychology",
  image: "../images/The Power of Habit_ A Book Review.jfif",
  description: "Explores how habits are formed and how they can be changed.",
  inStock: true,
},
{
  id: 23,
  title: "Influence: The Psychology of Persuasion",
  author: "Robert B. Cialdini",
  price: 15.99,
  rating: 4.7,
  reviews: 2200,
  category: "psychology",
  image: "../images/_Influence_ By Robert Cialdini  This book was….jfif",
  description: "A classic book on persuasion and human behavior.",
  inStock: true,
},
{
  id: 24,
  title: "HTML & CSS: Design and Build Websites",
  author: "Jon Duckett",
  price: 15.99,
  rating: 4.7,
  reviews: 3200,
  category: "web-development",
  image: "../images/abed8b64-1afd-4fc4-bdc2-6f0fa1385941.jfif",
  description: "Beginner-friendly guide to HTML and CSS with visual examples.",
  inStock: true,
},
{
  id: 25,
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  price: 109.99,
  rating: 4.6,
  reviews: 2800,
  category: "web-development",
  image: "../images/JavaScript_ The Modern Parts.jfif",
  description: "A concise guide highlighting the most effective features of JavaScript.",
  inStock: true,
},
{
  id: 26,
  title: "Don't Make Me Think, Revisited",
  author: "Steve Krug",
  price: 102.99,
  rating: 4.9,
  reviews: 5000,
  category: "web-development",
  image: "../images/Great book on user experience_ Don't make me….jfif",
  description: "Classic usability guide for intuitive web design.",
  inStock: true,
},
{
  id: 27,
  title: "Learning Web Design (5th Edition)",
  author: "Jennifer Niederst Robbins",
  price: 119.99,
  rating: 4.7,
  reviews: 2800,
  category: "web-development",
  image: "../images/Learning Web Design_ A Beginner's Guide to HTML… (1).jfif",
  description: "Comprehensive introduction to HTML, CSS, JavaScript, and web graphics.",
  inStock: true,
},


      ];
  
      this.setupEventListeners();
    }
    setupEventListeners() {
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

      this.sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });

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
      
        if (this.filters.category && product.category !== this.filters.category)
          return false;
  
        
          
if (this.filters.price) {
  if (this.filters.price.includes("+")) {
    
    const min = parseFloat(this.filters.price);
    if (product.price < min) return false;
  } else {
   
    const [min, max] = this.filters.price.split("-").map(Number);
    if (product.price < min || product.price > max) return false;
  }
}

        if (this.filters.rating && product.rating < Number(this.filters.rating))
          return false;

        if (
          this.filters.search &&
          !product.title.toLowerCase().includes(this.filters.search) &&
          !product.author.toLowerCase().includes(this.filters.search)
        ) {
          return false;
        }
  
        return true;
      });

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
        default:
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
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        };

        const event = new CustomEvent("addToCart", { detail: cartItem });
        document.dispatchEvent(event);
  
        showToast(`${product.title} added to cart!`);
      }
    }
  }

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

  const shopManager = new ShopManager();

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

  document.addEventListener("addToCart", (e) => {
    const cartItem = e.detail;
  });

  document.addEventListener("DOMContentLoaded", () => {
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
  

    cartIcon.addEventListener("click", () => {
      isCartOpen = !isCartOpen;
      cartDropdown.style.display = isCartOpen ? "block" : "none";
    });


    document.addEventListener("click", (e) => {
      if (!e.target.closest(".cart-wrapper") && isCartOpen) {
        isCartOpen = false;
        cartDropdown.style.display = "none";
      }
    });
  

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
  

    window.removeFromCart = (id) => {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
      showToast("Item removed from cart");
    };
  

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
  

    updateCartUI();
  

    class ShopManager {
  
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
  
          window.addToCart(cartItem);
        }
      }
    }

    const shopManager = new ShopManager();
  });

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