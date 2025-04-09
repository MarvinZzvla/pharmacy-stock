/**
 * Product Table Component
 * Displays a table of products with sorting, filtering, and pagination
 */

import { deleteProduct } from "../../../utils/inventoryService.js";

// Create product table
const createProductTable = () => {
  const table = document.createElement("table");
  table.classList.add("product-table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Price</th>
        <th>Expiry Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="product-table-body">
      <tr>
        <td colspan="7">Loading products...</td>
      </tr>
    </tbody>
  `;

  return table;
};

// Render product rows
const renderProductRows = async (container, products, page = 1, limit = 10) => {
  const tableBody = container.querySelector("#product-table-body");

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  if (paginatedProducts.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">No products found</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  paginatedProducts.forEach((product) => {
    const row = document.createElement("tr");

    // Add stock level indicator class
    if (product.stock <= product.reorderLevel) {
      row.classList.add("low-stock");
    }

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock} ${product.unit}s</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.expiryDate}</td>
      <td>
        <button class="btn small edit" data-id="${product.id}">Edit</button>
        <button class="btn small delete" data-id="${product.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Add event listeners for product actions
const addProductActionListeners = (
  container,
  onEditClick,
  onProductUpdated
) => {
  // Edit buttons
  container.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.id);
      if (onEditClick && typeof onEditClick === "function") {
        onEditClick(productId);
      }
    });
  });

  // Delete buttons
  container.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.dataset.id);
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await deleteProduct(productId);
          // Refresh the product list via callback
          if (onProductUpdated && typeof onProductUpdated === "function") {
            onProductUpdated();
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          alert("Failed to delete product: " + error.message);
        }
      }
    });
  });
};

export { createProductTable, renderProductRows, addProductActionListeners };
