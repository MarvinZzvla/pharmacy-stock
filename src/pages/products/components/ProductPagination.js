/**
 * Product Pagination Component
 * Handles pagination for product lists
 */

// Create pagination controls
const createPagination = () => {
  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  pagination.innerHTML = `
    <button id="prev-page" disabled>Previous</button>
    <span id="page-info">Page 1</span>
    <button id="next-page">Next</button>
  `;

  return pagination;
};

// Update pagination based on current page and total pages
const updatePagination = (container, currentPage, totalPages) => {
  const prevButton = container.querySelector("#prev-page");
  const nextButton = container.querySelector("#next-page");
  const pageInfo = container.querySelector("#page-info");

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
};

// Add event listeners for pagination controls
const addPaginationListeners = (container, onPageChange) => {
  const prevButton = container.querySelector("#prev-page");
  const nextButton = container.querySelector("#next-page");

  prevButton.addEventListener("click", () => {
    const pageInfo = container.querySelector("#page-info").textContent;
    const currentPage = parseInt(pageInfo.split(" ")[1]);

    if (currentPage > 1 && onPageChange && typeof onPageChange === "function") {
      onPageChange(currentPage - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    const pageInfo = container.querySelector("#page-info").textContent;
    const parts = pageInfo.split(" of ");
    const currentPage = parseInt(parts[0].split(" ")[1]);
    const totalPages = parseInt(parts[1]);

    if (
      currentPage < totalPages &&
      onPageChange &&
      typeof onPageChange === "function"
    ) {
      onPageChange(currentPage + 1);
    }
  });
};

export { createPagination, updatePagination, addPaginationListeners };
