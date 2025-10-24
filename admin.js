document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const mobileToggle = document.querySelector(".mobile-toggle");
    const adminSidebar = document.querySelector(".admin-sidebar");
    const notificationBtn = document.querySelector(".admin-notifications");
    const notificationDropdown = document.querySelector(".notification-dropdown");
    const profileBtn = document.querySelector(".admin-profile");
    const profileDropdown = document.querySelector(".profile-dropdown");
  
    // Toggle Sidebar on Mobile
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        adminSidebar.classList.toggle("active");
      });
    }
  
    // Toggle Notifications
    if (notificationBtn) {
      notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("active");
        profileDropdown.classList.remove("active");
      });
    }
  
    // Toggle Profile Dropdown
    if (profileBtn) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("active");
        notificationDropdown.classList.remove("active");
      });
    }
  
    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      notificationDropdown?.classList.remove("active");
      profileDropdown?.classList.remove("active");
    });
  
    // Initialize Charts
    initializeCharts();
  
    // Handle Table Search
    const searchInput = document.querySelector(".table-search");
    if (searchInput) {
      searchInput.addEventListener("input", handleTableSearch);
    }
  
    // Handle Table Sorting
    const sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach((button) => {
      button.addEventListener("click", handleTableSort);
    });
  
    // Handle Status Updates
    const statusSelects = document.querySelectorAll(".status-select");
    statusSelects.forEach((select) => {
      select.addEventListener("change", handleStatusUpdate);
    });
  
    // Handle Delete Confirmations
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", handleDelete);
    });
  });
  
  // Chart Initialization
  function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById("salesChart");
    if (salesCtx) {
      new Chart(salesCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Sales",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "#f3971b",
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#888",
              },
            },
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#888",
              },
            },
          },
        },
      });
    }
  
    // Categories Chart
    const categoriesCtx = document.getElementById("categoriesChart");
    if (categoriesCtx) {
      new Chart(categoriesCtx, {
        type: "doughnut",
        data: {
          labels: ["Programming", "Web Dev", "Database", "DevOps", "Others"],
          datasets: [
            {
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                "#f3971b",
                "#ff6b6b",
                "#4caf50",
                "#2196f3",
                "#9c27b0",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#888",
              },
            },
          },
        },
      });
    }
  }
  
  // Table Search
  function handleTableSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll("tbody tr");
  
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? "" : "none";
    });
  }
  
  // Table Sorting
  function handleTableSort(e) {
    const button = e.target;
    const column = button.dataset.column;
    const table = button.closest("table");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const isAsc = button.classList.contains("asc");
  
    rows.sort((a, b) => {
      const aVal = a.querySelector(`td[data-column="${column}"]`).textContent;
      const bVal = b.querySelector(`td[data-column="${column}"]`).textContent;
      return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  
    rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    button.classList.toggle("asc");
  }
  
  // Status Update
  function handleStatusUpdate(e) {
    const select = e.target;
    const orderId = select.dataset.orderId;
    const newStatus = select.value;
  
    // Show loading state
    select.disabled = true;
  
    // Simulate API call
    setTimeout(() => {
      console.log(`Updated order ${orderId} status to ${newStatus}`);
      // Update UI
      const statusBadge = select.closest("tr").querySelector(".status-badge");
      statusBadge.className = `status-badge status-${newStatus.toLowerCase()}`;
      statusBadge.textContent = newStatus;
      select.disabled = false;
  
      // Show success message
      showNotification("Status updated successfully", "success");
    }, 1000);
  }
  
  // Delete Confirmation
  function handleDelete(e) {
    const button = e.target;
    const itemId = button.dataset.id;
  
    if (confirm("Are you sure you want to delete this item?")) {
      // Show loading state
      button.disabled = true;
  
      // Simulate API call
      setTimeout(() => {
        console.log(`Deleted item ${itemId}`);
        // Remove row from table
        button.closest("tr").remove();
  
        // Show success message
        showNotification("Item deleted successfully", "success");
      }, 1000);
    }
  }
  
  // Notification System
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
          <i class="fas ${
            type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
          }"></i>
          <span>${message}</span>
      `;
  
    document.body.appendChild(notification);
  
    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);
  
    // Remove notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }