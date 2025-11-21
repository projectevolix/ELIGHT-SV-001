/**
 * Auth service
 * Pure HTTP service for authentication endpoints (login, signup)
 * Handles token management and Auth API calls
 */

import { apiClient, type ApiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api/auth";

/**
 * Login user and store access token securely
 * Uses industrial-grade session management with httpOnly cookies + localStorage
 */
export async function loginUser(
  credentials: LoginRequest,
  client: ApiClient = apiClient
): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    credentials,
    { skipAuth: true } // Don't require auth for login
  );

  // Store token for future requests (legacy compatibility)
  if (response.accessToken) {
    client.setAuthToken(response.accessToken, response.tokenType);
  }

  // Store token securely using new session management
  if (response.accessToken && typeof window !== "undefined") {
    const { storeAuthToken } = await import("@/lib/auth/client");
    const expiresIn = response.expiresIn || 86400000; // 24 hours default
    storeAuthToken(response.accessToken, expiresIn);
  }

  return response;
}

/**
 * Sign up new user
 */
export async function signupUser(
  credentials: SignupRequest,
  client: ApiClient = apiClient
): Promise<SignupResponse> {
  const response = await client.post<SignupResponse>(
    API_PATHS.AUTH.SIGNUP,
    credentials,
    { skipAuth: true } // Don't require auth for signup
  );

  return response;
}

/**
 * Logout user (clear stored token and session)
 * Clears token from localStorage and cookies
 * Backend doesn't have logout endpoint, so we just clear client-side storage
 */
export async function logoutUser(client: ApiClient = apiClient): Promise<void> {
  try {
    // Clear legacy token storage
    client.clearAuthToken();

    // Clear secure session (httpOnly cookies + localStorage)
    if (typeof window !== "undefined") {
      const { clearAuthToken } = await import("@/lib/auth/client");
      clearAuthToken();
    }
  } catch (error) {
    // Log error but don't fail logout
    console.error("Error during logout cleanup:", error);
    // Still clear what we can
    if (typeof window !== "undefined") {
      const { clearAuthToken } = await import("@/lib/auth/client");
      clearAuthToken();
    }
  }
}

/**
 * Check if user is authenticated
 * Validates token existence and non-expiry
 */
export async function isUserAuthenticated(
  client: ApiClient = apiClient
): Promise<boolean> {
  // Check legacy token storage first
  if (client.isAuthenticated()) {
    // Also validate with new session management
    if (typeof window !== "undefined") {
      const { isAuthenticated } = await import("@/lib/auth/client");
      return isAuthenticated();
    }
    return true;
  }
  return false;
}
