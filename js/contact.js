document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => (formObject[key] = value));

        submitForm(formObject);
      });
    }
  
    function submitForm(data) {
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification(
          "Message sent successfully! We'll get back to you soon."
        );
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      item.addEventListener("click", function () {
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
          }
        });
        this.classList.toggle("active");
      });
    });

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

    function sendMessage(message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "user");
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;

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

      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  });