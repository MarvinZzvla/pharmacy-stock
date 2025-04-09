/**
 * Product List Module
 * Displays and manages the list of pharmacy products
 */

import { getAllProducts } from "../../utils/inventoryService.js";
import {
  createSearchBar,
  addSearchListeners,
} from "./components/ProductSearch.js";
import {
  createProductTable,
  renderProductRows,
  addProductActionListeners,
} from "./components/ProductTable.js";
import {
  createPagination,
  updatePagination,
  addPaginationListeners,
} from "./components/ProductPagination.js";
import {
  createProductForm,
  initProductForm,
} from "./components/ProductForm.js";

// Create product list UI
const createProductList = () => {
  const container = document.createElement("div");
  container.classList.add("product-list-container");

  // Create header
  const header = document.createElement("div");
  header.classList.add("product-list-header");
  header.innerHTML = `
    <h2>Product Inventory</h2>
    <button id="add-product-btn" class="btn primary">Add New Product</button>
  `;
  container.appendChild(header);

  // Add search bar
  const searchBar = createSearchBar();
  container.appendChild(searchBar);

  // Add product table
  const table = createProductTable();
  container.appendChild(table);

  // Add pagination controls
  const pagination = createPagination();
  container.appendChild(pagination);

  // Add product form (initially hidden)
  const productForm = createProductForm();
  container.appendChild(productForm);

  return container;
};

// Handle product list state and rendering
class ProductListManager {
  constructor(container) {
    this.container = container;
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.limit = 10;
    this.formController = null;
  }

  // Initialize the product list
  async initialize() {
    try {
      // Load products
      await this.refreshProducts();

      // Initialize product form
      this.formController = initProductForm(this.container, () =>
        this.refreshProducts()
      );

      // Set up search functionality
      addSearchListeners(this.container, this.products, (filteredProducts) => {
        this.filteredProducts = filteredProducts;
        this.currentPage = 1;
        this.renderCurrentPage();
      });

      // Set up pagination
      addPaginationListeners(this.container, (page) => {
        this.currentPage = page;
        this.renderCurrentPage();
      });

      // Render the initial page
      this.renderCurrentPage();

      // Add event listener for add product button
      const addButton = this.container.querySelector("#add-product-btn");
      addButton.addEventListener("click", () => {
        this.formController.showAddForm();
      });
    } catch (error) {
      console.error("Error initializing product list:", error);
      this.showError(error);
    }
  }

  // Render the current page of products
  async renderCurrentPage() {
    // Calculate total pages
    const totalPages = Math.ceil(this.filteredProducts.length / this.limit);

    // Update pagination controls
    updatePagination(this.container, this.currentPage, totalPages);

    // Render products
    await renderProductRows(
      this.container,
      this.filteredProducts,
      this.currentPage,
      this.limit
    );

    // Add event listeners to actions
    addProductActionListeners(
      this.container,
      (productId) => this.formController.showEditForm(productId),
      () => this.refreshProducts()
    );
  }

  // Refresh the product list
  async refreshProducts() {
    try {
      this.products = await getAllProducts();

      // Apply current filters
      const searchTerm =
        this.container.querySelector("#product-search")?.value || "";
      const category =
        this.container.querySelector("#category-filter")?.value || "";

      if (searchTerm || category) {
        // Re-apply search and filter
        if (this.container.querySelector("#product-search")) {
          const searchInput = this.container.querySelector("#product-search");
          const event = new Event("input", { bubbles: true });
          searchInput.dispatchEvent(event);
        }
      } else {
        this.filteredProducts = [...this.products];
        this.renderCurrentPage();
      }
    } catch (error) {
      console.error("Error refreshing products:", error);
      this.showError(error);
    }
  }

  // Show error message
  showError(error) {
    const tableBody = this.container.querySelector("#product-table-body");
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="error-message">
              <p>Error loading products: ${error.message}</p>
              <button class="btn small" id="retry-btn">Retry</button>
            </div>
          </td>
        </tr>
      `;

      const retryBtn = tableBody.querySelector("#retry-btn");
      retryBtn.addEventListener("click", () => this.refreshProducts());
    }
  }
}

// Initialize product list
const initProductList = async (targetElement) => {
  try {
    const productListContainer = createProductList();
    targetElement.innerHTML = ""; // Clear loading message
    targetElement.appendChild(productListContainer);

    const manager = new ProductListManager(productListContainer);
    await manager.initialize();
  } catch (error) {
    console.error("Error initializing product list:", error);
    targetElement.innerHTML = `
      <div class="error-container">
        <h2>Error Loading Products</h2>
        <p>There was a problem loading the product list. Please try again later.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `;
  }
};

export { initProductList };
