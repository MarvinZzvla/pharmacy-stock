/**
 * Product Form Component
 * Handles adding and editing product information
 */

import {
  addProduct,
  updateProduct,
  getProductById,
} from "../../../utils/inventoryService.js";

// Create a form for adding/editing products
const createProductForm = () => {
  const formContainer = document.createElement("div");
  formContainer.classList.add("product-form-container");
  formContainer.style.display = "none";

  formContainer.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="form-title">Add New Product</h3>
          <button class="close-btn">&times;</button>
        </div>
        <form id="product-form">
          <input type="hidden" id="product-id">
          
          <div class="form-group">
            <label for="product-name">Product Name</label>
            <input type="text" id="product-name" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label for="product-category">Category</label>
            <input type="text" id="product-category" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label for="product-description">Description</label>
            <textarea id="product-description" class="form-control" rows="3" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="product-stock">Stock</label>
              <input type="number" id="product-stock" class="form-control" min="0" required>
            </div>
            
            <div class="form-group">
              <label for="product-price">Price ($)</label>
              <input type="number" id="product-price" class="form-control" min="0" step="0.01" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="product-unit">Unit</label>
              <input type="text" id="product-unit" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="product-unit-count">Unit Count</label>
              <input type="number" id="product-unit-count" class="form-control" min="1" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="product-supplier">Supplier</label>
              <input type="text" id="product-supplier" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="product-expiry">Expiry Date</label>
              <input type="date" id="product-expiry" class="form-control" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="product-reorder-level">Reorder Level</label>
            <input type="number" id="product-reorder-level" class="form-control" min="0" required>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn primary">Save Product</button>
            <button type="button" class="btn" id="cancel-form">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  return formContainer;
};

// Initialize form event listeners
const initProductForm = (container, onProductSaved) => {
  const formContainer = container.querySelector(".product-form-container");
  const form = formContainer.querySelector("#product-form");
  const closeBtn = formContainer.querySelector(".close-btn");
  const cancelBtn = formContainer.querySelector("#cancel-form");

  // Close form handlers
  const closeForm = () => {
    form.reset();
    formContainer.style.display = "none";
  };

  closeBtn.addEventListener("click", closeForm);
  cancelBtn.addEventListener("click", closeForm);

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const productId = document.getElementById("product-id").value;

      // Collect form data
      const productData = {
        name: document.getElementById("product-name").value,
        category: document.getElementById("product-category").value,
        description: document.getElementById("product-description").value,
        stock: parseInt(document.getElementById("product-stock").value),
        price: parseFloat(document.getElementById("product-price").value),
        unit: document.getElementById("product-unit").value,
        unitCount: parseInt(
          document.getElementById("product-unit-count").value
        ),
        supplier: document.getElementById("product-supplier").value,
        expiryDate: document.getElementById("product-expiry").value,
        reorderLevel: parseInt(
          document.getElementById("product-reorder-level").value
        ),
      };

      let result;

      // If productId exists, update the product, otherwise add a new one
      if (productId) {
        result = await updateProduct(parseInt(productId), productData);
        alert("Product updated successfully!");
      } else {
        result = await addProduct(productData);
        alert("Product added successfully!");
      }

      closeForm();

      // Call the callback if provided
      if (onProductSaved && typeof onProductSaved === "function") {
        onProductSaved(result);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    }
  });

  // Return controller functions
  return {
    showAddForm: () => {
      document.getElementById("form-title").textContent = "Add New Product";
      document.getElementById("product-id").value = "";
      form.reset();
      formContainer.style.display = "block";
    },

    showEditForm: async (productId) => {
      try {
        document.getElementById("form-title").textContent = "Edit Product";

        // Fetch product data
        const product = await getProductById(productId);

        if (!product) {
          throw new Error("Product not found");
        }

        // Populate form
        document.getElementById("product-id").value = product.id;
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-category").value = product.category;
        document.getElementById("product-description").value =
          product.description;
        document.getElementById("product-stock").value = product.stock;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-unit").value = product.unit;
        document.getElementById("product-unit-count").value = product.unitCount;
        document.getElementById("product-supplier").value = product.supplier;
        document.getElementById("product-expiry").value = product.expiryDate;
        document.getElementById("product-reorder-level").value =
          product.reorderLevel;

        // Show form
        formContainer.style.display = "block";
      } catch (error) {
        console.error("Error loading product for editing:", error);
        alert("Failed to load product: " + error.message);
      }
    },
  };
};

export { createProductForm, initProductForm };
