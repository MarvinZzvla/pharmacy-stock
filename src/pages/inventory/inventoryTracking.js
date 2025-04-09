/**
 * Inventory Tracking Module
 * Manages inventory stock changes and transaction history for the pharmacy.
 * Provides UI for adding/removing stock and viewing transaction history.
 */

import { getAllProducts } from "../../utils/inventoryService.js";
import {
  createTransactionForm,
  addTransactionFormListeners,
} from "./components/TransactionForm.js";
import transactionHistory from "./components/TransactionHistory.js";

// Create inventory tracking UI
const createInventoryTracking = async () => {
  const container = document.createElement("div");
  container.classList.add("inventory-tracking-container");

  // Create header with action buttons
  const header = document.createElement("div");
  header.classList.add("inventory-header");
  header.innerHTML = `
    <h2>Inventory Tracking</h2>
    <div class="action-buttons">
      <button id="add-stock-btn" class="btn primary">Add Stock</button>
      <button id="remove-stock-btn" class="btn">Remove Stock</button>
    </div>
  `;
  container.appendChild(header);

  // Create transaction form
  const transactionForm = createTransactionForm();
  container.appendChild(transactionForm);

  // Create transaction history section
  const historySection = document.createElement("div");
  historySection.classList.add("transaction-history-container");
  container.appendChild(historySection);

  return container;
};

// Initialize inventory tracking
const initInventoryTracking = async (targetElement) => {
  try {
    // Create and append the container
    const inventoryContainer = await createInventoryTracking();
    targetElement.innerHTML = ""; // Clear loading message
    targetElement.appendChild(inventoryContainer);

    // Load products for the form dropdown
    const products = await getAllProducts();

    // Initialize transaction history
    const historyContainer = inventoryContainer.querySelector(
      ".transaction-history-container"
    );
    await transactionHistory.init(historyContainer);

    // Add form listeners and get form controller
    const formController = addTransactionFormListeners(
      inventoryContainer.querySelector(".transaction-form"),
      products,
      async () => {
        // Refresh transaction history when a transaction is completed
        await transactionHistory.loadTransactions();
        transactionHistory.render();
      }
    );

    // Add button event listeners
    const addStockBtn = inventoryContainer.querySelector("#add-stock-btn");
    const removeStockBtn =
      inventoryContainer.querySelector("#remove-stock-btn");

    addStockBtn.addEventListener("click", () => {
      formController.showForm("in");
    });

    removeStockBtn.addEventListener("click", () => {
      formController.showForm("out");
    });
  } catch (error) {
    console.error("Error initializing inventory tracking:", error);
    targetElement.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Inventory Tracking</h2>
        <p>There was a problem loading the inventory tracking module. Please try again later.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `;
  }
};

export { initInventoryTracking };
