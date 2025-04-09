/**
 * Dashboard Stats Component
 * Displays statistics cards for the dashboard
 */

// Create stats cards container
const createStatsContainer = () => {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");
  statsContainer.innerHTML = `
    <div class="stat-card" id="total-products">
      <h3>Total Products</h3>
      <p class="stat-value">Loading...</p>
    </div>
    <div class="stat-card" id="low-stock">
      <h3>Low Stock Items</h3>
      <p class="stat-value">Loading...</p>
    </div>
    <div class="stat-card" id="inventory-value">
      <h3>Total Inventory Value</h3>
      <p class="stat-value">Loading...</p>
    </div>
    <div class="stat-card" id="categories">
      <h3>Product Categories</h3>
      <p class="stat-value">Loading...</p>
    </div>
  `;

  return statsContainer;
};

// Update stats with data
const updateStats = (container, products, lowStockProducts) => {
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const categories = [...new Set(products.map((product) => product.category))];

  container.querySelector("#total-products .stat-value").textContent =
    totalProducts;
  container.querySelector("#low-stock .stat-value").textContent =
    lowStockProducts.length;
  container.querySelector(
    "#inventory-value .stat-value"
  ).textContent = `$${totalValue.toFixed(2)}`;
  container.querySelector("#categories .stat-value").textContent =
    categories.length;
};

export { createStatsContainer, updateStats };
