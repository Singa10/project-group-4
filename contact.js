// contact.js
document.addEventListener("DOMContentLoaded", function () {
    // Contact Form Submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => (formObject[key] = value));
  
        // Simulate form submission
        submitForm(formObject);
      });
    }
  
    function submitForm(data) {
      // Show loading state
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
  
      // Simulate API call
      setTimeout(() => {
        showNotification(
          "Message sent successfully! We'll get back to you soon."
        );
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }
  
    // FAQ Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Close other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
          }
        });
  
        // Toggle current item
        this.classList.toggle("active");
      });
    });
  
    // Chat Widget Functionality
    const chatBtn = document.querySelector(".chat-btn");
    const chatWidget = document.getElementById("chat-widget");
    const closeChat = document.querySelector(".close-chat");
    const chatInput = document.querySelector(".chat-input input");
    const chatSend = document.querySelector(".chat-input button");
    const chatMessages = document.querySelector(".chat-messages");
  
    if (chatBtn) {
      chatBtn.addEventListener("click", function () {
        chatWidget.classList.add("active");
      });
    }
  
    if (closeChat) {
      closeChat.addEventListener("click", function () {
        chatWidget.classList.remove("active");
      });
    }
  
    // Send chat message
    function sendMessage(message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "user");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      // Simulate response
      setTimeout(() => {
        const responseElement = document.createElement("div");
        responseElement.classList.add("message", "system");
        responseElement.textContent =
          "Thank you for your message. Our team will assist you shortly.";
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  
    if (chatSend) {
      chatSend.addEventListener("click", function () {
        const message = chatInput.value.trim();
        if (message) {
          sendMessage(message);
          chatInput.value = "";
        }
      });
    }
  
    if (chatInput) {
      chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const message = this.value.trim();
          if (message) {
            sendMessage(message);
            this.value = "";
          }
        }
      });
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
  
      // Animate notification
      setTimeout(() => {
        notification.classList.add("show");
      }, 10);
  
      // Remove notification
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  });