/**
 * Client-side authentication utilities
 * Handles token storage, retrieval, and cookie synchronization
 */

/**
 * Get token from cookies (for API requests)
 * Note: In client components, we can only read non-httpOnly cookies
 * For httpOnly cookies, use fetch with credentials: 'include'
 */
export function getTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie
    .split(";")
    .map((c) => c.trim().split("="))
    .reduce((acc: Record<string, string>, [key, value]) => {
      if (key) acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

  return cookies["auth_token"] || cookies["sv_auth_token"] || null;
}

/**
 * Store token in both localStorage and attempt to set as cookie
 * Useful for initial login when server cookies might not be available
 */
export function storeAuthToken(
  token: string,
  expiresIn: number = 86400000
): void {
  const expiresAt = new Date(Date.now() + expiresIn);

  // Store in localStorage (accessible to client)
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_token_expires", expiresAt.toISOString());
  localStorage.setItem("auth_token_type", "Bearer");

  // Also set as cookie (for middleware access)
  const cookieString = `auth_token=${encodeURIComponent(
    token
  )}; path=/; expires=${expiresAt.toUTCString()};`;
  document.cookie = cookieString;
}

/**
 * Clear authentication data
 */
export function clearAuthToken(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_token_expires");
  localStorage.removeItem("auth_token_type");

  // Clear cookie
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

/**
 * Check if token has expired
 */
export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true;

  const expiresAt = localStorage.getItem("auth_token_expires");
  if (!expiresAt) return true;

  return new Date(expiresAt) <= new Date();
}

/**
 * Get current user token
 * Returns token from localStorage if valid and not expired
 */
export function getCurrentToken(): string | null {
  if (typeof window === "undefined") return null;

  if (isTokenExpired()) {
    clearAuthToken();
    return null;
  }

  return localStorage.getItem("auth_token");
}

/**
 * Get token expiration time
 */
export function getTokenExpiresAt(): Date | null {
  if (typeof window === "undefined") return null;

  const expiresAt = localStorage.getItem("auth_token_expires");
  if (!expiresAt) return null;

  return new Date(expiresAt);
}

/**
 * Get time remaining until expiration (in milliseconds)
 */
export function getTimeUntilExpiry(): number | null {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return null;

  const remaining = expiresAt.getTime() - Date.now();
  return remaining > 0 ? remaining : null;
}

/**
 * Refresh token (extend expiry time)
 * Call this periodically to keep user logged in
 */
export function refreshAuthToken(
  currentToken: string,
  expiresIn: number = 86400000
): void {
  storeAuthToken(currentToken, expiresIn);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentToken() !== null;
}
