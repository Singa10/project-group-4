var swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});



document.addEventListener("DOMContentLoaded", function () {
    const stats = document.querySelectorAll(".stat-number");
  
    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px",
    };
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    stats.forEach((stat) => observer.observe(stat));
  
    function animateValue(element) {
      const final = parseInt(element.textContent);
      const duration = 2000;
      const start = 0;
      const increment = final / (duration / 16);
      let current = start;
  
      const timer = setInterval(() => {
        current += increment;
        if (current >= final) {
          element.textContent = final.toLocaleString() + "+";
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current).toLocaleString() + "+";
        }
      }, 16);
    }

    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
  
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  });