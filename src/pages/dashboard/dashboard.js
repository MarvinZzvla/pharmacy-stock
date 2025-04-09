/**
 * Dashboard Module
 * Provides an overview of inventory status, displaying key metrics,
 * low stock alerts, and inventory visualizations for pharmacy management.
 */

import {
  getAllProducts,
  getLowStockProducts,
  loadInventoryData,
} from "../../utils/inventoryService.js";

import {
  createStatsContainer,
  updateStats,
} from "./components/DashboardStats.js";
import {
  createChartsSection,
  renderCharts,
} from "./components/DashboardCharts.js";
import {
  createAlertsSection,
  renderLowStockProducts,
} from "./components/LowStockAlerts.js";

// Create dashboard UI
const createDashboard = async () => {
  const container = document.createElement("div");
  container.classList.add("dashboard-container");
  container.style.width = "100%";

  // Create header with date display
  const header = document.createElement("div");
  header.classList.add("dashboard-header");
  header.innerHTML = `
    <h2>Pharmacy Inventory Dashboard</h2>
    <div class="date-display">
      <span id="current-date">${new Date().toLocaleDateString()}</span>
    </div>
  `;
  container.appendChild(header);

  // Add statistics section
  const statsContainer = createStatsContainer();
  container.appendChild(statsContainer);

  // Add charts section
  const chartsSection = createChartsSection();
  container.appendChild(chartsSection);

  // Add low stock alerts section
  const alertsWrapper = document.createElement("div");
  alertsWrapper.style.width = "100%";
  alertsWrapper.style.display = "block";

  const alertsSection = createAlertsSection();
  alertsWrapper.appendChild(alertsSection);
  container.appendChild(alertsWrapper);

  return container;
};

// Render dashboard data
const renderDashboard = async (container) => {
  // Load all necessary data
  const products = await getAllProducts();
  const lowStockProducts = await getLowStockProducts();
  const data = await loadInventoryData();

  // Update each dashboard section with data
  updateStats(container, products, lowStockProducts);
  const alertsSection = container.querySelector(".alerts-section");
  renderLowStockProducts(alertsSection, lowStockProducts);
  renderCharts(container, products, data);
};

// Initialize dashboard
const initDashboard = async (targetElement) => {
  try {
    const dashboardContainer = await createDashboard();
    targetElement.innerHTML = ""; // Clear loading message
    targetElement.appendChild(dashboardContainer);
    await renderDashboard(dashboardContainer);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    targetElement.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>There was a problem loading the dashboard. Please try again later.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `;
  }
};

export { initDashboard };
