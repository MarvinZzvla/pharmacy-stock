/**
 * Dashboard Charts Component
 * Creates and renders charts for the dashboard
 */

import Chart from "chart.js/auto";

// Create charts section
const createChartsSection = () => {
  const chartsSection = document.createElement("div");
  chartsSection.classList.add("charts-section");
  chartsSection.innerHTML = `
    <div class="chart-container">
      <h3>Stock Level by Category</h3>
      <div class="chart-wrapper">
        <canvas id="category-chart"></canvas>
      </div>
    </div>
    <div class="chart-container">
      <h3>Recent Transactions</h3>
      <div class="chart-wrapper">
        <canvas id="transactions-chart"></canvas>
      </div>
    </div>
  `;

  return chartsSection;
};

// Create stock by category chart
const createCategoryChart = (container, products) => {
  const ctx = container.querySelector("#category-chart").getContext("2d");

  // Group products by category and sum their stock
  const categoriesMap = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = 0;
    }
    acc[product.category] += product.stock;
    return acc;
  }, {});

  // Prepare data for chart
  const categories = Object.keys(categoriesMap);
  const stockData = Object.values(categoriesMap);

  // Generate colors
  const backgroundColors = categories.map((_, i) => {
    const hue = (210 + i * 40) % 360; // Start with blue-ish and rotate
    return `hsla(${hue}, 70%, 60%, 0.7)`;
  });

  const borderColors = backgroundColors.map((color) =>
    color.replace("0.7", "1")
  );

  // Create chart
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Current Stock",
          data: stockData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Stock: ${context.raw} units`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Units in Stock",
          },
        },
        x: {
          title: {
            display: true,
            text: "Product Categories",
          },
        },
      },
    },
  });
};

// Create transactions chart (mock data for demo)
const createTransactionsChart = (container, data) => {
  const ctx = container.querySelector("#transactions-chart").getContext("2d");

  // Create mock data for last 7 days of transactions
  const today = new Date();
  const dates = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    });

  // Create dummy in/out data
  const inData = dates.map(() => Math.floor(Math.random() * 30 + 10));
  const outData = dates.map(() => Math.floor(Math.random() * 20 + 5));

  // Create chart
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Stock In",
          data: inData,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          label: "Stock Out",
          data: outData,
          borderColor: "#f44336",
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false,
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Transactions",
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  });
};

// Render all charts
const renderCharts = (container, products, data) => {
  try {
    createCategoryChart(container, products);
    createTransactionsChart(container, data);
    return true;
  } catch (error) {
    console.error("Error rendering charts:", error);
    container.querySelector("#category-chart").innerHTML =
      '<p class="chart-error">Failed to load charts. Please refresh the page.</p>';
    container.querySelector("#transactions-chart").innerHTML =
      '<p class="chart-error">Failed to load charts. Please refresh the page.</p>';
    return false;
  }
};

export { createChartsSection, renderCharts };
