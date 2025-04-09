/**
 * Authentication Service
 * Centralizes authentication logic and user session management for the application.
 * Handles user login state, permissions, and session storage.
 */

const SESSION_KEY = "pharmacyStockSession";

/**
 * Check if a user is currently authenticated
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
export function isAuthenticated() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;

  try {
    const sessionData = JSON.parse(session);
    // Check if session exists and has a userId
    return !!sessionData.userId;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
}

/**
 * Get the current authenticated user
 * @returns {Object|null} - User data if authenticated, null otherwise
 */
export function getCurrentUser() {
  if (!isAuthenticated()) return null;

  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Set the current user session
 * @param {Object} user - The user object to store in session
 */
export function setCurrentUser(user) {
  if (!user || !user.userId) {
    console.error("Invalid user object provided to setCurrentUser");
    return;
  }

  const session = {
    userId: user.userId,
    username: user.username,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    role: user.role,
    permissions: user.permissions,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Log out the current user
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if the current user has specific permission
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if user has permission, false otherwise
 */
export function hasPermission(permission) {
  const user = getCurrentUser();

  // If no user or no permissions defined, deny access
  if (!user || !user.permissions) return false;

  // If user has admin role, grant all permissions
  if (user.role === "admin") return true;

  // Check if user has the specific permission
  return user.permissions.includes(permission);
}

/**
 * Require authentication for a page/component
 * Redirects to login page if user is not authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    // Redirect to login page
    window.location.hash = "#login";
    return false;
  }

  return true;
}
