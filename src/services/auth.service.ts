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
 * Login user and store access token
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

  // Store token for future requests
  if (response.accessToken) {
    client.setAuthToken(response.accessToken, response.tokenType);
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
 * Logout user (clear stored token)
 */
export function logoutUser(client: ApiClient = apiClient): void {
  client.clearAuthToken();
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(client: ApiClient = apiClient): boolean {
  return client.isAuthenticated();
}
