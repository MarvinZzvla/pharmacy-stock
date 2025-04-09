/**
 * Transaction Form Component
 * Handles the form for adding stock transactions
 */

import {
  getProductById,
  addTransaction,
} from "../../../utils/inventoryService.js";

// Create transaction form
const createTransactionForm = () => {
  const transactionForm = document.createElement("div");
  transactionForm.classList.add("transaction-form");
  transactionForm.style.display = "none"; // Hide form initially

  transactionForm.innerHTML = `
    <h3>Record Stock Transaction</h3>
    <form id="stock-transaction-form">
      <div class="form-group">
        <label for="transaction-type">Transaction Type</label>
        <select id="transaction-type" class="form-control" required>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>
      </div>
      <div class="form-group">
        <label for="product-select">Product</label>
        <select id="product-select" class="form-control" required>
          <option value="">Select a product</option>
        </select>
      </div>
      <div class="form-group">
        <label for="quantity">Quantity</label>
        <input type="number" id="quantity" class="form-control" min="1" required>
      </div>
      <div class="form-group">
        <label for="notes">Notes (Optional)</label>
        <textarea id="notes" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn primary">Record Transaction</button>
        <button type="button" id="cancel-transaction" class="btn">Cancel</button>
      </div>
    </form>
  `;

  return transactionForm;
};

// Add event listeners for transaction form
const addTransactionFormListeners = (
  formContainer,
  products,
  onTransactionComplete
) => {
  const form = formContainer.querySelector("#stock-transaction-form");
  const cancelBtn = formContainer.querySelector("#cancel-transaction");

  // Function to populate product select dropdown
  const populateProductSelect = () => {
    const productSelect = form.querySelector("#product-select");
    productSelect.innerHTML = '<option value="">Select a product</option>';

    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} (${product.stock} in stock)`;
      productSelect.appendChild(option);
    });
  };

  // Populate the product select dropdown
  populateProductSelect();

  // Cancel button handler
  cancelBtn.addEventListener("click", () => {
    form.reset();
    formContainer.style.display = "none";
  });

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const transactionType = form.querySelector("#transaction-type").value;
    const productId = parseInt(form.querySelector("#product-select").value);
    const quantity = parseInt(form.querySelector("#quantity").value);
    const notes = form.querySelector("#notes").value;

    if (!productId || !quantity) {
      alert("Please select a product and enter a quantity");
      return;
    }

    try {
      // Get product details
      const product = await getProductById(productId);

      // Validate stock levels for outgoing transactions
      if (transactionType === "out" && quantity > product.stock) {
        alert(`Not enough stock available. Current stock: ${product.stock}`);
        return;
      }

      // Create transaction object
      const transaction = {
        productId,
        quantity,
        type: transactionType,
        notes,
      };

      // Add transaction
      const result = await addTransaction(transaction);

      if (result.success) {
        alert("Transaction recorded successfully");
        form.reset();

        // Hide form
        formContainer.style.display = "none";

        // Call the callback function if provided
        if (
          onTransactionComplete &&
          typeof onTransactionComplete === "function"
        ) {
          onTransactionComplete();
        }
      } else {
        alert("Failed to record transaction");
      }
    } catch (error) {
      console.error("Error recording transaction:", error);
      alert("An error occurred while recording the transaction");
    }
  });

  return {
    showForm: (type = "in") => {
      form.querySelector("#transaction-type").value = type;
      formContainer.style.display = "block";
    },
  };
};

export { createTransactionForm, addTransactionFormListeners };
