/**
 * Login Module
 * Handles user authentication, login form creation, and session management.
 * Validates credentials against user data from JSON file and manages login state.
 */

import {
  setCurrentUser,
  getCurrentUser,
  logout as authLogout,
  isAuthenticated,
} from "../../utils/authService.js";

// Login page element
let loginPageElement;
let errorMessageElement;

/**
 * Initialize the login page
 * @param {HTMLElement} contentArea - The main content area to render the login page
 * @returns {HTMLElement} - The login page element
 */
export function initLoginPage(contentArea) {
  // Create login page if it doesn't exist
  if (!loginPageElement) {
    loginPageElement = createLoginPage();
  }

  // Clear content area and append login page
  contentArea.innerHTML = "";
  contentArea.appendChild(loginPageElement);

  // Get form and error elements
  const loginForm = loginPageElement.querySelector(".login-form");
  errorMessageElement = loginPageElement.querySelector(".login-error");

  // Hide error message when page initializes
  if (errorMessageElement) {
    errorMessageElement.classList.remove("visible");
  }

  // Add event listener to form
  loginForm.addEventListener("submit", handleLoginSubmit);

  return loginPageElement;
}

/**
 * Create the login page HTML structure
 * @returns {HTMLElement} - The login page element
 */
function createLoginPage() {
  // Create container
  const container = document.createElement("div");
  container.className = "login-container";

  // Create login card
  const loginCard = document.createElement("div");
  loginCard.className = "login-card";

  // Create login header
  const loginHeader = document.createElement("div");
  loginHeader.className = "login-header";
  loginHeader.innerHTML = `
    <h2>Pharmacy Stock</h2>
    <p>Inventory Management System</p>
  `;

  // Create login body
  const loginBody = document.createElement("div");
  loginBody.className = "login-body";

  // Create demo credentials section
  const demoCredentials = document.createElement("div");
  demoCredentials.className = "demo-credentials";
  demoCredentials.innerHTML = `
    <div class="demo-credentials-header">Demo Credentials</div>
    <div class="demo-credentials-item">
      <strong>Admin:</strong> admin@pharmacy.com / admin123
    </div>
    <div class="demo-credentials-item">
      <strong>Pharmacist:</strong> john.smith@pharmacy.com / pharm123
    </div>
    <div class="demo-credentials-item">
      <strong>Inventory Manager:</strong> sarah.wilson@pharmacy.com / stock123
    </div>
  `;

  // Create login form
  const loginForm = document.createElement("form");
  loginForm.className = "login-form";

  // Create email input
  const emailGroup = document.createElement("div");
  emailGroup.className = "form-group";
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "Email";
  const emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("id", "email");
  emailInput.setAttribute("placeholder", "Enter your email");
  emailInput.setAttribute("required", "true");
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);

  // Create password input
  const passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group";
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Password";
  const passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.setAttribute("id", "password");
  passwordInput.setAttribute("placeholder", "Enter your password");
  passwordInput.setAttribute("required", "true");
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  // Create error message element
  const errorMessage = document.createElement("div");
  errorMessage.className = "login-error";
  errorMessage.textContent = "Invalid email or password";

  // Create submit button
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.className = "btn primary login-btn";
  submitButton.textContent = "Login";

  // Assemble form
  loginForm.appendChild(emailGroup);
  loginForm.appendChild(passwordGroup);
  loginForm.appendChild(errorMessage);
  loginForm.appendChild(submitButton);

  // Assemble login card
  loginBody.appendChild(demoCredentials);
  loginBody.appendChild(loginForm);
  loginCard.appendChild(loginHeader);
  loginCard.appendChild(loginBody);
  container.appendChild(loginCard);

  return container;
}

/**
 * Handle login form submission
 * @param {Event} event - The form submit event
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  // Get form inputs
  const emailInput = event.target.querySelector("#email");
  const passwordInput = event.target.querySelector("#password");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    // Check credentials
    const user = await authenticateUser(email, password);

    if (user) {
      // Login successful
      loginSuccess(user);

      // Redirect to dashboard
      window.location.hash = "#dashboard";

      // Reload the page to reinitialize the application with the authenticated user
      window.location.reload();
    } else {
      // Login failed
      loginFailed();
    }
  } catch (error) {
    console.error("Login error:", error);
    loginFailed();
  }
}

/**
 * Authenticate user with provided credentials
 * @param {string} email - The email
 * @param {string} password - The password
 * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
 */
async function authenticateUser(email, password) {
  try {
    // Fetch users from JSON file
    const response = await fetch("/data/users.json");
    if (!response.ok) {
      throw new Error("Failed to fetch users data");
    }

    const data = await response.json();
    const users = data.users || [];

    // Find user with matching credentials
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    return user || null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

/**
 * Handle successful login
 * @param {Object} user - The authenticated user
 */
function loginSuccess(user) {
  // Store user using the auth service
  setCurrentUser({
    userId: user.id,
    username: user.username,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    role: user.role,
    permissions: user.permissions,
    loggedInAt: new Date().toISOString(),
  });

  // Hide error message if visible
  if (errorMessageElement) {
    errorMessageElement.classList.remove("visible");
  }
}

/**
 * Handle failed login attempt
 */
function loginFailed() {
  // Show error message
  if (errorMessageElement) {
    errorMessageElement.classList.add("visible");
  }

  // Clear password field
  const passwordInput = loginPageElement.querySelector("#password");
  if (passwordInput) {
    passwordInput.value = "";
    passwordInput.focus();
  }
}

/**
 * Log out the current user
 */
export function logout() {
  authLogout();
  window.location.hash = "#login";
}
