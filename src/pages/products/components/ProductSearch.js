/**
 * Product Search Component
 * Provides search and filter functionality for products
 */

// Create search bar
const createSearchBar = () => {
  const searchBar = document.createElement("div");
  searchBar.classList.add("search-bar");
  searchBar.innerHTML = `
    <input type="text" id="product-search" placeholder="Search products...">
    <select id="category-filter">
      <option value="">All Categories</option>
    </select>
  `;

  return searchBar;
};

// Populate category filter with available categories
const populateCategoryFilter = (selectElement, products) => {
  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Clear existing options except the first one
  const firstOption = selectElement.options[0];
  selectElement.innerHTML = "";
  selectElement.appendChild(firstOption);

  // Add category options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectElement.appendChild(option);
  });
};

// Filter products based on search term and category
const filterProducts = (products, searchTerm = "", category = "") => {
  let filteredProducts = products;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  return filteredProducts;
};

// Debounce function for search input
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// Add event listeners for search and filter
const addSearchListeners = (container, products, onSearchResults) => {
  const searchInput = container.querySelector("#product-search");
  const categoryFilter = container.querySelector("#category-filter");

  const handleSearch = () => {
    const searchTerm = searchInput.value;
    const category = categoryFilter.value;
    const filteredProducts = filterProducts(products, searchTerm, category);

    if (onSearchResults && typeof onSearchResults === "function") {
      onSearchResults(filteredProducts);
    }
  };

  // Populate category filter
  populateCategoryFilter(categoryFilter, products);

  // Add event listeners
  searchInput.addEventListener("input", debounce(handleSearch, 300));
  categoryFilter.addEventListener("change", handleSearch);
};

export { createSearchBar, filterProducts, addSearchListeners };
