# Pharmacy Stock Management System

A modern pharmacy inventory management system built with Vite and Vanilla JavaScript.

## Features

- **Dashboard**: Real-time inventory overview with key metrics and low stock alerts
- **Product Management**: Complete CRUD operations for pharmacy products
- **Inventory Tracking**: Record and track stock movements (in/out)
- **Transaction History**: Detailed history with filtering and pagination
- **User Authentication**: Role-based access with different permission levels
- **Responsive UI**: Clean, intuitive interface with notifications system

## Project Structure

```
/
├── public/               # Static assets
│   ├── data/             # JSON data files
│   │   ├── inventory.json  # Product inventory data
│   │   ├── transactions.json # Transaction records
│   │   └── users.json     # User credentials and permissions
├── src/                  # Source code
│   ├── pages/            # Application pages
│   │   ├── dashboard/    # Dashboard components
│   │   │   └── components/ # Dashboard UI components
│   │   ├── inventory/    # Inventory tracking components
│   │   │   └── components/ # Inventory UI components
│   │   ├── login/        # Authentication components
│   │   └── products/     # Product management components
│   │       └── components/ # Product UI components
│   ├── utils/            # Utility functions
│   │   ├── authService.js # Authentication service
│   │   └── inventoryService.js # Inventory data service
│   └── main.js           # Main application entry point
├── index.html            # Main HTML file
├── style.css             # Global styles
└── package.json          # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone
   cd pharmacy-stock
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to the URL displayed in the terminal (usually http://localhost:5173)

## Usage

### Demo Credentials

The application includes pre-configured users for testing:

- **Admin**: admin@pharmacy.com / admin123
- **Pharmacist**: john.smith@pharmacy.com / pharm123
- **Inventory Manager**: sarah.wilson@pharmacy.com / stock123

### Core Features

- **Dashboard**: View inventory statistics, low stock alerts, and visual charts
- **Products**: Add, edit, delete, and search pharmacy products
- **Inventory**: Track stock movements with detailed transaction history
- **Advanced Filtering**: Filter transaction history by date, type, and product
- **Pagination**: Navigate through large datasets efficiently

## Data Storage

This application uses localStorage for data persistence, with initial data loaded from JSON files:

- `inventory.json`: Contains product catalog information
- `transactions.json`: Stores stock movement records
- `users.json`: Manages user authentication details

In a production environment, this would be replaced with a proper database and API.

## Technical Details

### Components

The application follows a component-based architecture with these core modules:

- **AuthService**: Handles user authentication and permission management
- **InventoryService**: Manages data persistence and inventory operations
- **TransactionHistory**: Tracks and displays stock movements
- **Dashboard**: Visualizes inventory statistics and alerts

### UI Features

- **Toast Notifications**: Displays success/error messages to users
- **Responsive Cards**: Content organized in clean card layout
- **Filtering System**: Advanced filtering for transaction data
- **Pagination**: Efficient navigation of large datasets

## License

This project is licensed under the MIT License.
