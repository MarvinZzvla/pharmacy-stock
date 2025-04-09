/**
 * Inventory Service
 * Provides functions for managing pharmacy inventory data, including loading and saving
 * product information, handling transactions, and monitoring stock levels.
 */

// Local storage keys
const INVENTORY_STORAGE_KEY = "pharmacy_inventory";
const TRANSACTIONS_STORAGE_KEY = "pharmacy_transactions";

// Load inventory data
const loadInventoryData = async () => {
  try {
    console.log("Attempting to load inventory data...");

    // First check if we have data in localStorage
    const storedData = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (storedData) {
      console.log("Loaded inventory data from localStorage");
      return JSON.parse(storedData);
    }

    // If not, fetch from the JSON file
    const response = await fetch("/data/inventory.json");
    if (!response.ok) {
      throw new Error(
        `Failed to load inventory data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // Save to localStorage for future use
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data));

    console.log("Inventory data loaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error loading inventory data:", error);
    // Return empty data structure to prevent further errors
    return { products: [] };
  }
};

// Load transactions data
const loadTransactionsData = async () => {
  try {
    // First check if we have data in localStorage
    const storedData = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (storedData) {
      console.log("Loaded transactions data from localStorage");
      return JSON.parse(storedData);
    }

    // If not, fetch from the JSON file
    const response = await fetch("/data/transactions.json");
    if (!response.ok) {
      throw new Error(
        `Failed to load transactions data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    // Save to localStorage for future use
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));

    console.log("Transactions data loaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error loading transactions data:", error);
    return { transactions: [] };
  }
};

// Save inventory data
const saveInventoryData = async (data) => {
  try {
    // Save to localStorage
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data));
    console.log("Saved inventory data to localStorage:", data);

    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error saving inventory data:", error);
    return { success: false, message: "Failed to save data" };
  }
};

// Save transactions data
const saveTransactionsData = async (data) => {
  try {
    // Save to localStorage
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));
    console.log("Saved transactions data to localStorage:", data);

    return { success: true, message: "Transactions saved successfully" };
  } catch (error) {
    console.error("Error saving transactions data:", error);
    return { success: false, message: "Failed to save transactions" };
  }
};

// Clear all stored data (for testing/reset purposes)
const clearStoredData = () => {
  localStorage.removeItem(INVENTORY_STORAGE_KEY);
  localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  console.log("Cleared all stored inventory data");
};

// Get all products
const getAllProducts = async () => {
  const data = await loadInventoryData();
  console.log("All products:", data.products);
  return data.products;
};

// Get product by ID
const getProductById = async (id) => {
  const data = await loadInventoryData();
  return data.products.find((product) => product.id === id);
};

// Add new product
const addProduct = async (product) => {
  const data = await loadInventoryData();

  // Generate new ID
  const newId = Math.max(...data.products.map((p) => p.id), 0) + 1;

  // Add new product with generated ID and current date
  const newProduct = {
    ...product,
    id: newId,
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  data.products.push(newProduct);

  // Save updated data
  const result = await saveInventoryData(data);

  if (result.success) {
    return newProduct;
  } else {
    throw new Error(result.message);
  }
};

// Update product
const updateProduct = async (id, updatedProduct) => {
  const data = await loadInventoryData();

  // Find product index
  const index = data.products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  // Update product with current date
  data.products[index] = {
    ...updatedProduct,
    id: id, // Ensure ID doesn't change
    lastUpdated: new Date().toISOString().split("T")[0],
  };

  // Save updated data
  const result = await saveInventoryData(data);

  if (result.success) {
    return data.products[index];
  } else {
    throw new Error(result.message);
  }
};

// Delete product
const deleteProduct = async (id) => {
  const data = await loadInventoryData();

  // Filter out the product to delete
  data.products = data.products.filter((product) => product.id !== id);

  // Save updated data
  const result = await saveInventoryData(data);

  if (result.success) {
    return { success: true, message: "Product deleted successfully" };
  } else {
    throw new Error(result.message);
  }
};

// Add transaction
const addTransaction = async (transaction) => {
  // Load inventory data for product updates
  const inventoryData = await loadInventoryData();

  // Load transactions data
  const transactionsData = await loadTransactionsData();

  // Generate new transaction id
  const newId =
    transactionsData.transactions.length > 0
      ? Math.max(...transactionsData.transactions.map((t) => t.id)) + 1
      : 1;

  // Find the product to get current stock
  const product = inventoryData.products.find(
    (p) => p.id === transaction.productId
  );
  if (!product) {
    throw new Error(`Product with ID ${transaction.productId} not found`);
  }

  // Calculate previous and new stock
  const previousStock = product.stock;
  let newStock = previousStock;

  // Update stock based on transaction type
  if (transaction.type === "in") {
    newStock = previousStock + transaction.quantity;
  } else if (transaction.type === "out") {
    newStock = previousStock - transaction.quantity;
    if (newStock < 0) {
      throw new Error("Cannot remove more stock than available");
    }
  }

  // Create complete transaction with all required fields
  const newTransaction = {
    ...transaction,
    id: newId,
    date: new Date().toISOString(),
    previousStock: previousStock,
    newStock: newStock,
    userId: transaction.userId || 1, // Default to user 1 if not specified
  };

  // Add transaction to transactions data
  transactionsData.transactions.push(newTransaction);

  // Update product stock
  const productIndex = inventoryData.products.findIndex(
    (p) => p.id === transaction.productId
  );

  if (productIndex !== -1) {
    // Set the new stock value
    inventoryData.products[productIndex].stock = newStock;

    // Update lastUpdated date
    inventoryData.products[productIndex].lastUpdated = new Date()
      .toISOString()
      .split("T")[0];
  }

  // Save updated data
  const inventoryResult = await saveInventoryData(inventoryData);
  const transactionsResult = await saveTransactionsData(transactionsData);

  if (inventoryResult.success && transactionsResult.success) {
    return { success: true, message: "Transaction added successfully" };
  } else {
    throw new Error("Failed to save transaction");
  }
};

// Get all transactions
const getAllTransactions = () => {
  try {
    // Get transactions from localStorage
    const storedData = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      return data.transactions || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
};

// Get low stock products
const getLowStockProducts = async () => {
  const data = await loadInventoryData();
  return data.products.filter(
    (product) => product.stock <= product.reorderLevel
  );
};

// Export all functions
export {
  loadInventoryData,
  saveInventoryData,
  loadTransactionsData,
  saveTransactionsData,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addTransaction,
  getAllTransactions,
  getLowStockProducts,
  clearStoredData,
};
