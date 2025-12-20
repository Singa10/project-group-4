document.addEventListener("DOMContentLoaded", function () {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const adminSidebar = document.querySelector(".admin-sidebar");
    const notificationBtn = document.querySelector(".admin-notifications");
    const notificationDropdown = document.querySelector(".notification-dropdown");
    const profileBtn = document.querySelector(".admin-profile");
    const profileDropdown = document.querySelector(".profile-dropdown");

    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        adminSidebar.classList.toggle("active");
      });
    }

    if (notificationBtn) {
      notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("active");
        profileDropdown.classList.remove("active");
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("active");
        notificationDropdown.classList.remove("active");
      });
    }

    document.addEventListener("click", () => {
      notificationDropdown?.classList.remove("active");
      profileDropdown?.classList.remove("active");
    });

    initializeCharts();
    const searchInput = document.querySelector(".table-search");
    if (searchInput) {
      searchInput.addEventListener("input", handleTableSearch);
    }

    const sortButtons = document.querySelectorAll(".sort-btn");
    sortButtons.forEach((button) => {
      button.addEventListener("click", handleTableSort);
    });

    const statusSelects = document.querySelectorAll(".status-select");
    statusSelects.forEach((select) => {
      select.addEventListener("change", handleStatusUpdate);
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", handleDelete);
    });
  });

  function initializeCharts() {
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

  function handleTableSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll("tbody tr");
  
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? "" : "none";
    });
  }

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

  function handleStatusUpdate(e) {
    const select = e.target;
    const orderId = select.dataset.orderId;
    const newStatus = select.value;

    select.disabled = true;

    setTimeout(() => {
      console.log(`Updated order ${orderId} status to ${newStatus}`);
      const statusBadge = select.closest("tr").querySelector(".status-badge");
      statusBadge.className = `status-badge status-${newStatus.toLowerCase()}`;
      statusBadge.textContent = newStatus;
      select.disabled = false;

      showNotification("Status updated successfully", "success");
    }, 1000);
  }

  function handleDelete(e) {
    const button = e.target;
    const itemId = button.dataset.id;
  
    if (confirm("Are you sure you want to delete this item?")) {
      button.disabled = true;
      setTimeout(() => {
        console.log(`Deleted item ${itemId}`);
        button.closest("tr").remove();

        showNotification("Item deleted successfully", "success");
      }, 1000);
    }
  }
  

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
    setTimeout(() => notification.classList.add("show"), 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }