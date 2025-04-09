/**
 * TransactionHistory Component
 * Manages and displays the history of inventory transactions, allowing users
 * to track stock movements, apply filters, and add/remove stock items.
 */

import {
  getAllTransactions,
  addTransaction as addInventoryTransaction,
  saveTransactionsData,
  loadTransactionsData,
} from "../../../utils/inventoryService.js";

/**
 * Initialize sample transaction data if needed
 */
const initializeSampleData = async () => {
  // Check if transactions data exists
  const storedData = localStorage.getItem("pharmacy_transactions");
  if (!storedData) {
    console.log("Initializing sample transaction data");
    // Sample data provided by the user
    const sampleData = {
      transactions: [
        {
          id: 1,
          date: "2024-04-01T09:15:30Z",
          productId: 2,
          type: "out",
          quantity: 10,
          previousStock: 30,
          newStock: 20,
          userId: 1,
          notes: "Dispensed to customer #1045",
        },
        {
          id: 2,
          date: "2024-04-01T10:20:45Z",
          productId: 5,
          type: "out",
          quantity: 2,
          previousStock: 92,
          newStock: 90,
          userId: 2,
          notes: "Dispensed to customer #1046",
        },
        {
          id: 3,
          date: "2024-04-02T08:30:15Z",
          productId: 9,
          type: "out",
          quantity: 5,
          previousStock: 10,
          newStock: 5,
          userId: 1,
          notes: "Dispensed to customer #1047",
        },
        {
          id: 4,
          date: "2024-04-02T14:45:00Z",
          productId: 1,
          type: "in",
          quantity: 50,
          previousStock: 100,
          newStock: 150,
          userId: 2,
          notes: "Received from Johnson & Johnson, Order #JJ2024-123",
        },
        {
          id: 5,
          date: "2024-04-03T09:10:20Z",
          productId: 13,
          type: "out",
          quantity: 3,
          previousStock: 10,
          newStock: 7,
          userId: 1,
          notes: "Dispensed to customer #1048",
        },
        {
          id: 6,
          date: "2024-04-03T11:25:30Z",
          productId: 8,
          type: "out",
          quantity: 2,
          previousStock: 10,
          newStock: 8,
          userId: 2,
          notes: "Dispensed to customer #1049",
        },
        {
          id: 7,
          date: "2024-04-04T15:40:10Z",
          productId: 3,
          type: "out",
          quantity: 3,
          previousStock: 15,
          newStock: 12,
          userId: 1,
          notes: "Dispensed to customer #1050",
        },
        {
          id: 8,
          date: "2024-04-05T10:05:45Z",
          productId: 18,
          type: "out",
          quantity: 7,
          previousStock: 35,
          newStock: 28,
          userId: 2,
          notes: "Dispensed to customer #1051",
        },
        {
          id: 9,
          date: "2024-04-05T16:30:00Z",
          productId: 20,
          type: "out",
          quantity: 1,
          previousStock: 10,
          newStock: 9,
          userId: 1,
          notes: "Dispensed to customer #1052",
        },
        {
          id: 10,
          date: "2024-04-06T08:50:15Z",
          productId: 7,
          type: "in",
          quantity: 25,
          previousStock: 60,
          newStock: 85,
          userId: 2,
          notes: "Received from AstraZeneca, Order #AZ2024-456",
        },
        {
          productId: 1,
          quantity: 2,
          type: "in",
          notes: "",
          id: 11,
          date: "2025-04-09T20:05:51.981Z",
          previousStock: 150,
          newStock: 152,
          userId: 1,
        },
      ],
    };

    // Save to localStorage
    localStorage.setItem("pharmacy_transactions", JSON.stringify(sampleData));
  }
};

class TransactionHistory {
  constructor() {
    this.transactions = [];
    this.filteredTransactions = [];
    this.container = null;
    this.isAddingStock = false;
    this.isRemovingStock = false;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.initialized = false;
    this.tableContainer = null;
    this.filterForm = null;
    this.component = null;
    this.transactionFilters = {
      type: "all",
      dateFrom: "",
      dateTo: "",
      productName: "",
    };
  }

  /**
   * Initialize the transaction history component
   * @param {HTMLElement} container - Container element to render in
   */
  async init(container) {
    if (!container) return;

    this.container = container;

    try {
      // Initialize sample data if needed
      await initializeSampleData();

      // First load data from the file if not in localStorage
      await loadTransactionsData();

      // Then load transactions into the component
      this.loadTransactions();
      this.render();
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing transaction history:", error);
      this.container.innerHTML = `
        <div class="error-container">
          <h3>Error Loading Transactions</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * Load transactions from the data service
   */
  loadTransactions() {
    try {
      this.transactions = getAllTransactions();

      if (!this.transactions || this.transactions.length === 0) {
        console.warn("No transactions found");
        this.transactions = [];
      }

      // Sort transactions by date in descending order (most recent first)
      this.transactions.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      this.filteredTransactions = [...this.transactions];
      this.calculateTotalPages();

      console.log("Loaded transactions:", this.transactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      this.transactions = [];
      this.filteredTransactions = [];
      this.totalPages = 1;
    }
  }

  /**
   * Calculate total pages based on filtered transactions
   */
  calculateTotalPages() {
    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.itemsPerPage
    );
    if (this.totalPages === 0) this.totalPages = 1;

    // Make sure current page is not higher than total pages
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  /**
   * Save transactions to localStorage
   */
  async saveTransactions() {
    try {
      const result = await saveTransactionsData({
        transactions: this.transactions,
      });
      console.log("Save transactions result:", result);
      return result.success;
    } catch (error) {
      console.error("Error saving transactions:", error);
      return false;
    }
  }

  /**
   * Add a new transaction
   * @param {Object} transaction - Transaction object to add
   */
  addTransaction(transaction) {
    if (!transaction) return;

    // Add timestamp if not present
    if (!transaction.timestamp) {
      transaction.timestamp = new Date().toISOString();
    }

    // Add to inventory service
    addInventoryTransaction(transaction);

    // Refresh local copy
    this.loadTransactions();

    // Update UI if initialized
    if (this.initialized && this.tableContainer) {
      this.applyFilters();
    }
  }

  /**
   * Records a stock transaction (in/out) and updates product inventory
   * @param {string} type - Type of transaction (in/out)
   * @param {Object} product - Product being affected
   * @param {number} quantity - Amount of stock affected
   * @param {string} notes - Optional notes about transaction
   * @returns {Promise<Object>} - Result of transaction
   */
  async recordStockTransaction(type, product, quantity, notes = "") {
    try {
      if (!product || !product.id) {
        throw new Error("Invalid product");
      }

      if (!quantity || isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const transaction = {
        type,
        productId: product.id,
        productName: product.name,
        quantity: parseInt(quantity),
        notes: notes || "",
        timestamp: new Date().toISOString(),
      };

      await addInventoryTransaction(transaction);
      this.loadTransactions();
      this.render();

      return { success: true };
    } catch (error) {
      console.error("Error recording stock transaction:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Show the add stock form
   */
  showAddStockForm() {
    this.isAddingStock = true;
    this.isRemovingStock = false;
    this.render();
  }

  /**
   * Show the remove stock form
   */
  showRemoveStockForm() {
    this.isAddingStock = false;
    this.isRemovingStock = true;
    this.render();
  }

  /**
   * Cancel the current form
   */
  cancelForm() {
    this.isAddingStock = false;
    this.isRemovingStock = false;
    this.render();
  }

  /**
   * Go to a specific page
   * @param {number} page - The page number to navigate to
   */
  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.render();
  }

  /**
   * Filter transactions by various criteria
   * @param {Object} filters - Filters to apply
   * @returns {Array} Filtered transactions
   */
  filterTransactions(filters = {}) {
    this.filteredTransactions = this.transactions.filter((transaction) => {
      let matches = true;

      if (filters.transactionId && transaction.id !== filters.transactionId) {
        matches = false;
      }

      if (filters.productId && transaction.productId !== filters.productId) {
        matches = false;
      }

      if (filters.type && transaction.type !== filters.type) {
        matches = false;
      }

      if (filters.userId && transaction.userId !== filters.userId) {
        matches = false;
      }

      if (filters.dateFrom) {
        const transactionDate = new Date(transaction.date);
        const fromDate = new Date(filters.dateFrom);
        if (transactionDate < fromDate) {
          matches = false;
        }
      }

      if (filters.dateTo) {
        const transactionDate = new Date(transaction.date);
        const toDate = new Date(filters.dateTo);
        if (transactionDate > toDate) {
          matches = false;
        }
      }

      return matches;
    });

    // Reset to the first page when filtering
    this.currentPage = 1;
    this.calculateTotalPages();

    return this.filteredTransactions;
  }

  /**
   * Render the transaction history component
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = "";

    // Create main transaction container
    const transactionContainer = document.createElement("div");
    transactionContainer.className = "transaction-container";

    // Create form if adding or removing stock
    if (this.isAddingStock || this.isRemovingStock) {
      // Create card for the transaction form
      const formCard = document.createElement("div");
      formCard.className = "card";

      const formCardHeader = document.createElement("div");
      formCardHeader.className = "card-header";
      const formTitle = this.isAddingStock ? "Add Stock" : "Remove Stock";
      formCardHeader.innerHTML = `<h3>${formTitle}</h3>`;

      const formCardBody = document.createElement("div");
      formCardBody.className = "card-body";

      const formDiv = document.createElement("div");
      formDiv.className = "transaction-form";

      const transactionType = this.isAddingStock ? "in" : "out";

      formDiv.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label for="product-id">Product ID</label>
            <input type="number" id="product-id" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input type="number" id="quantity" class="form-control" min="1" required>
          </div>
        </div>
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea id="notes" class="form-control" rows="2"></textarea>
        </div>
        <div class="form-actions">
          <button id="save-transaction" class="btn primary">Save</button>
          <button id="cancel-transaction" class="btn">Cancel</button>
        </div>
      `;

      formCardBody.appendChild(formDiv);
      formCard.appendChild(formCardHeader);
      formCard.appendChild(formCardBody);

      transactionContainer.appendChild(formCard);
    }

    // Only show filters if not adding/removing stock
    if (!this.isAddingStock && !this.isRemovingStock) {
      // Create card for filters
      const filtersCard = document.createElement("div");
      filtersCard.className = "card";

      const filtersCardHeader = document.createElement("div");
      filtersCardHeader.className = "card-header";
      filtersCardHeader.innerHTML = `<h3>Filter Transactions</h3>`;

      const filtersCardBody = document.createElement("div");
      filtersCardBody.className = "card-body";

      // Create filters section
      const filtersSection = document.createElement("div");
      filtersSection.className = "transaction-filters";
      filtersSection.innerHTML = `
        <div class="filters-form">
          <div class="form-group">
            <label for="filter-transaction-id">Transaction ID:</label>
            <input type="number" id="filter-transaction-id" class="form-control">
          </div>
          <div class="form-group">
            <label for="filter-product">Product ID:</label>
            <input type="number" id="filter-product" class="form-control">
          </div>
          <div class="form-group">
            <label for="filter-type">Type:</label>
            <select id="filter-type" class="form-control">
              <option value="">All</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
          <div class="form-group">
            <label for="filter-date-from">From Date:</label>
            <input type="date" id="filter-date-from" class="form-control">
          </div>
          <div class="form-group">
            <label for="filter-date-to">To Date:</label>
            <input type="date" id="filter-date-to" class="form-control">
          </div>
          <button id="apply-filters" class="btn primary">Apply Filters</button>
          <button id="reset-filters" class="btn">Reset</button>
        </div>
      `;

      filtersCardBody.appendChild(filtersSection);
      filtersCard.appendChild(filtersCardHeader);
      filtersCard.appendChild(filtersCardBody);

      transactionContainer.appendChild(filtersCard);
    }

    // Create card for transaction table
    const tableCard = document.createElement("div");
    tableCard.className = "card";

    const tableCardHeader = document.createElement("div");
    tableCardHeader.className = "card-header";
    tableCardHeader.innerHTML = `<h3>Transaction History</h3>`;

    const tableCardBody = document.createElement("div");
    tableCardBody.className = "card-body";

    // Create transactions table
    const tableSection = document.createElement("div");
    tableSection.className = "transaction-table";

    if (this.filteredTransactions.length === 0) {
      tableSection.innerHTML = "<p>No transactions found.</p>";
    } else {
      const table = document.createElement("table");
      table.className = "table";

      // Create table header
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Product ID</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Previous Stock</th>
          <th>New Stock</th>
          <th>User</th>
          <th>Notes</th>
        </tr>
      `;

      // Create table body with pagination
      const tbody = document.createElement("tbody");

      // Calculate start and end index for current page
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(
        startIndex + this.itemsPerPage,
        this.filteredTransactions.length
      );

      // Get transactions for current page
      const currentPageTransactions = this.filteredTransactions.slice(
        startIndex,
        endIndex
      );

      currentPageTransactions.forEach((transaction) => {
        const tr = document.createElement("tr");
        tr.className = transaction.type === "in" ? "stock-in" : "stock-out";

        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleString();

        tr.innerHTML = `
          <td>${transaction.id}</td>
          <td>${formattedDate}</td>
          <td>${transaction.productId}</td>
          <td>${transaction.type === "in" ? "Stock In" : "Stock Out"}</td>
          <td>${transaction.quantity}</td>
          <td>${transaction.previousStock}</td>
          <td>${transaction.newStock}</td>
          <td>${transaction.userId || "-"}</td>
          <td>${transaction.notes || "-"}</td>
        `;

        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableSection.appendChild(table);

      // Add pagination controls
      if (this.totalPages > 1) {
        const paginationDiv = document.createElement("div");
        paginationDiv.className = "pagination";

        // Previous button
        const prevButton = document.createElement("button");
        prevButton.className = "btn pagination-btn";
        prevButton.textContent = "Previous";
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener("click", () =>
          this.goToPage(this.currentPage - 1)
        );

        // Page info
        const pageInfo = document.createElement("span");
        pageInfo.className = "page-info";
        pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;

        // Next button
        const nextButton = document.createElement("button");
        nextButton.className = "btn pagination-btn";
        nextButton.textContent = "Next";
        nextButton.disabled = this.currentPage === this.totalPages;
        nextButton.addEventListener("click", () =>
          this.goToPage(this.currentPage + 1)
        );

        // Page selector
        const pageSelector = document.createElement("select");
        pageSelector.className = "page-selector";
        pageSelector.addEventListener("change", (e) => {
          this.goToPage(parseInt(e.target.value));
        });

        for (let i = 1; i <= this.totalPages; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = `Page ${i}`;
          option.selected = i === this.currentPage;
          pageSelector.appendChild(option);
        }

        paginationDiv.appendChild(prevButton);
        paginationDiv.appendChild(pageInfo);
        paginationDiv.appendChild(nextButton);
        paginationDiv.appendChild(pageSelector);

        tableSection.appendChild(paginationDiv);
      }
    }

    tableCardBody.appendChild(tableSection);
    tableCard.appendChild(tableCardHeader);
    tableCard.appendChild(tableCardBody);

    transactionContainer.appendChild(tableCard);

    // Add the transaction container to the main container
    this.container.appendChild(transactionContainer);

    // Add event listeners
    this.addEventListeners();
  }

  /**
   * Add event listeners to the UI elements
   */
  addEventListeners() {
    // Save transaction button
    const saveTransactionBtn = document.getElementById("save-transaction");
    if (saveTransactionBtn) {
      saveTransactionBtn.addEventListener("click", async () => {
        const productId = parseInt(document.getElementById("product-id").value);
        const quantity = parseInt(document.getElementById("quantity").value);
        const notes = document.getElementById("notes").value;

        if (!productId || !quantity) {
          alert("Please fill in all required fields");
          return;
        }

        const type = this.isAddingStock ? "in" : "out";

        try {
          await this.recordStockTransaction(
            type,
            { id: productId, name: "" },
            quantity,
            notes
          );
        } catch (error) {
          alert(error.message);
        }
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancel-transaction");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.cancelForm());
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById("apply-filters");
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", () => {
        const filters = {
          transactionId: document.getElementById("filter-transaction-id").value
            ? parseInt(document.getElementById("filter-transaction-id").value)
            : null,
          productId: document.getElementById("filter-product").value
            ? parseInt(document.getElementById("filter-product").value)
            : null,
          type: document.getElementById("filter-type").value || null,
          dateFrom: document.getElementById("filter-date-from").value || null,
          dateTo: document.getElementById("filter-date-to").value || null,
        };

        this.filterTransactions(filters);
        this.render();
      });
    }

    // Reset filters button
    const resetFiltersBtn = document.getElementById("reset-filters");
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        document.getElementById("filter-transaction-id").value = "";
        document.getElementById("filter-product").value = "";
        document.getElementById("filter-type").value = "";
        document.getElementById("filter-date-from").value = "";
        document.getElementById("filter-date-to").value = "";

        this.filteredTransactions = [...this.transactions];
        this.currentPage = 1;
        this.calculateTotalPages();
        this.render();
      });
    }
  }

  /**
   * Handle button clicks for various actions
   * @param {Event} event - The click event
   */
  handleButtonClick(event) {
    const target = event.target;
    const action = target.dataset.action;

    if (action === "add-stock" || action === "remove-stock") {
      const form = document.querySelector(".transaction-form");

      if (form) {
        const productId = parseInt(form.querySelector("#product-id").value);
        const quantity = parseInt(form.querySelector("#quantity").value);
        const notes = form.querySelector("#notes").value;

        const type = action === "add-stock" ? "in" : "out";

        try {
          this.recordStockTransaction(
            type,
            { id: productId, name: "" },
            quantity,
            notes
          );

          // Reset form
          form.reset();

          // Hide form
          form.classList.add("hidden");

          // Show success message
          this.showMessage(
            `Stock ${type === "in" ? "added" : "removed"} successfully!`,
            "success"
          );
        } catch (error) {
          this.showMessage(`Error: ${error.message}`, "error");
        }
      }
    }
  }

  /**
   * Show a message to the user
   * @param {string} message - The message to display
   * @param {string} type - The message type (success, error, warning, info)
   */
  showMessage(message, type = "info") {
    // Create message container if it doesn't exist
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.className = "message-container";
      document.body.appendChild(messageContainer);
    }

    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `message message-${type}`;
    messageElement.innerHTML = `
      <span class="message-text">${message}</span>
      <button class="message-close">&times;</button>
    `;

    // Add to container
    messageContainer.appendChild(messageElement);

    // Add close handler
    const closeButton = messageElement.querySelector(".message-close");
    closeButton.addEventListener("click", () => {
      messageElement.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

export default new TransactionHistory();
