/**
 * Low Stock Alerts Component
 * Displays products with stock levels at or below their reorder points.
 * Includes pagination to handle large numbers of low stock items.
 */

// Create low stock alert section
const createAlertsSection = () => {
  const alertsSection = document.createElement("div");
  alertsSection.classList.add("alerts-section");
  alertsSection.style.width = "100%"; // Ensure full width
  alertsSection.innerHTML = `
    <h3>Low Stock Alerts</h3>
    <div id="low-stock-table" style="width: 100%;">
      <table style="width: 100%;">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Current Stock</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody id="low-stock-body">
          <tr>
            <td colspan="4">Loading low stock items...</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination low-stock-pagination">
      <button class="btn small" id="prev-page-btn" disabled>Previous</button>
      <span class="page-info">Page <span id="current-page">1</span> of <span id="total-pages">1</span></span>
      <button class="btn small" id="next-page-btn" disabled>Next</button>
    </div>
  `;

  return alertsSection;
};

// Render low stock products with pagination
const renderLowStockProducts = (container, lowStockProducts) => {
  const lowStockBody = container.querySelector("#low-stock-body");
  const currentPageEl = container.querySelector("#current-page");
  const totalPagesEl = container.querySelector("#total-pages");
  const prevPageBtn = container.querySelector("#prev-page-btn");
  const nextPageBtn = container.querySelector("#next-page-btn");

  // Pagination settings
  const itemsPerPage = 5;
  let currentPage = 1;
  const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);

  // Update pagination info
  currentPageEl.textContent = currentPage;
  totalPagesEl.textContent = totalPages;

  // Enable/disable pagination buttons
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

  if (lowStockProducts.length === 0) {
    lowStockBody.innerHTML = `<tr><td colspan="4">No low stock items</td></tr>`;
    return;
  }

  // Function to render current page
  const renderPage = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(
      startIndex + itemsPerPage,
      lowStockProducts.length
    );
    const currentPageItems = lowStockProducts.slice(startIndex, endIndex);

    lowStockBody.innerHTML = "";

    currentPageItems.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.stock} ${product.unit}s</td>
        <td>${product.reorderLevel} ${product.unit}s</td>
      `;
      lowStockBody.appendChild(row);
    });

    // Update pagination
    currentPageEl.textContent = page;
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;
  };

  // Initial render
  renderPage(currentPage);

  // Add pagination event listeners
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });
};

export { createAlertsSection, renderLowStockProducts };
