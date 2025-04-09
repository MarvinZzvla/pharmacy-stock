/**
 * Main Application Entry Point
 * Initializes the pharmacy stock management application, handles routing,
 * user authentication, and main application structure.
 */

import "../style.css";
import { initDashboard } from "./pages/dashboard/dashboard.js";
import { initProductList } from "./pages/products/productList.js";
import { initInventoryTracking } from "./pages/inventory/inventoryTracking.js";
import { initLoginPage, logout as loginLogout } from "./pages/login/login.js";
import {
  isAuthenticated,
  getCurrentUser,
  logout as authLogout,
} from "./utils/authService.js";

// Define application routes
const routes = {
  dashboard: "#dashboard",
  products: "#products",
  inventory: "#inventory",
  reports: "#reports",
  login: "#login",
};

// Main app container
const appContainer = document.querySelector("#app");

// Logout function
const logout = () => {
  authLogout();
  window.location.hash = routes.login;
  initNavigation();
};

// Initialize navigation
const initNavigation = () => {
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  if (!authenticated) {
    appContainer.innerHTML = `
      <main id="content-area" class="login-page">
        <!-- Login content will be loaded here -->
      </main>
    `;
    const contentArea = document.getElementById("content-area");
    initLoginPage(contentArea);
    return;
  }

  appContainer.innerHTML = `
    <div class="app-wrapper">
      <header class="main-header">
        <div class="logo">
          <h1>Pharmacy Stock</h1>
        </div>
        <nav class="main-nav">
          <ul>
            <li><a href="${
              routes.dashboard
            }" data-route="dashboard" class="active">Dashboard</a></li>
            <li><a href="${
              routes.products
            }" data-route="products">Products</a></li>
            <li><a href="${
              routes.inventory
            }" data-route="inventory">Inventory</a></li>
          </ul>
        </nav>
        <div class="user-info">
          <span class="user-name">${user.firstName || ""} ${
    user.lastName || ""
  }</span>
          <button id="logout-btn" class="icon-btn" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>
      <main id="content-area">
        <!-- Content will be loaded here dynamically -->
        <div class="loading">Loading...</div>
      </main>
      <footer class="main-footer">
        <p>&copy; 2025 Pharmacy Stock Management</p>
      </footer>
    </div>
  `;

  // Setup navigation events
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      document
        .querySelectorAll(".main-nav a")
        .forEach((l) => l.classList.remove("active"));
      e.target.classList.add("active");

      const route = e.target.dataset.route;
      navigateToRoute(route);
    });
  });

  // Setup logout button
  document.getElementById("logout-btn").addEventListener("click", () => {
    logout();
  });
};

// Handle navigation
const navigateToRoute = (route) => {
  // Check authentication for protected routes
  if (!isAuthenticated() && route !== "login") {
    window.location.hash = routes.login;
    return;
  }

  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = '<div class="loading">Loading...</div>';

  switch (route) {
    case "dashboard":
      initDashboard(contentArea);
      break;
    case "products":
      initProductList(contentArea);
      break;
    case "inventory":
      initInventoryTracking(contentArea);
      break;
    case "login":
      initLoginPage(contentArea);
      break;
    default:
      initDashboard(contentArea);
  }
};

// Initialize app
const initApp = () => {
  // Check if user is authenticated
  const authenticated = isAuthenticated();

  // Initialize navigation based on authentication status
  initNavigation();

  // Set appropriate initial route
  if (!authenticated) {
    window.location.hash = routes.login;
    return;
  }

  // Get current route from URL hash or default to dashboard for authenticated users
  const currentRoute = window.location.hash.substring(1) || "dashboard";
  navigateToRoute(currentRoute);

  // Setup hash change listener
  window.addEventListener("hashchange", () => {
    const route = window.location.hash.substring(1) || "dashboard";

    // Check authentication for protected routes
    if (!isAuthenticated() && route !== "login") {
      window.location.hash = routes.login;
      return;
    }

    navigateToRoute(route);

    // Update active nav link if authenticated
    if (isAuthenticated()) {
      document.querySelectorAll(".main-nav a").forEach((link) => {
        link.classList.toggle("active", link.dataset.route === route);
      });
    }
  });
};

// Start the application
document.addEventListener("DOMContentLoaded", initApp);
