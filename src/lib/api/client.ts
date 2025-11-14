/**
 * Typed HTTP client wrapper
 * Handles all HTTP communication with standardized error handling, headers, and auth token injection
 */

import type { ApiResponse, ApiError } from "@/types/api/common";
import { API_BASE_URL, DEFAULT_HEADERS, TIMEOUTS } from "./config";

/**
 * Request options for the API client
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

/**
 * Normalized error thrown by the client
 */
class ApiClientError extends Error implements ApiError {
  status: number;
  code?: string;
  message: string;
  meta?: Record<string, unknown>;

  constructor(
    status: number,
    message: string,
    code?: string,
    meta?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.message = message;
    this.code = code;
    this.meta = meta;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

/**
 * Token storage helper (uses localStorage for now, can be swapped with cookie-based approach)
 */
class TokenStorage {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly TOKEN_TYPE_KEY = "auth_token_type";

  static setToken(token: string, tokenType: string = "Bearer"): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static getTokenType(): string {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_TYPE_KEY) || "Bearer";
    }
    return "Bearer";
  }

  static clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_TYPE_KEY);
    }
  }
}

/**
 * Core API client class
 * Handles all HTTP communication with standardized error handling
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an HTTP request with standardized handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = TIMEOUTS.DEFAULT,
      skipAuth = false,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers({
      ...DEFAULT_HEADERS,
      ...fetchOptions.headers,
    });

    // Inject auth token if available and not skipped
    if (!skipAuth) {
      const token = TokenStorage.getToken();
      if (token) {
        const tokenType = TokenStorage.getTokenType();
        headers.set("Authorization", `${tokenType} ${token}`);
      }
    }

    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: abortController.signal,
      });

      // Handle 204 No Content (successful deletion with no body)
      if (response.status === 204) {
        return undefined as T;
      }

      // Parse response
      let data: ApiResponse<T> | T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new ApiClientError(
          response.status,
          "Invalid response format",
          "INVALID_RESPONSE"
        );
      }

      // Check HTTP status
      if (!response.ok) {
        const errorData = data as any;
        throw new ApiClientError(
          response.status,
          errorData?.message || `HTTP ${response.status}`,
          errorData?.code,
          errorData?.meta
        );
      }

      // Check API success flag if present
      const apiResponse = data as any;
      if ("success" in apiResponse && !apiResponse.success) {
        throw new ApiClientError(
          response.status,
          apiResponse.message || "API request failed",
          "API_ERROR",
          apiResponse.meta
        );
      }

      // Return the data payload (extract from ApiResponse wrapper if present)
      return ("data" in apiResponse ? apiResponse.data : apiResponse) as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new ApiClientError(
          0,
          "Network error. Please check your connection.",
          "NETWORK_ERROR"
        );
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiClientError(
          0,
          `Request timeout after ${timeout}ms`,
          "TIMEOUT"
        );
      }

      throw new ApiClientError(
        0,
        error instanceof Error ? error.message : "Unknown error",
        "UNKNOWN_ERROR"
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Set auth token for subsequent requests
   */
  setAuthToken(token: string, tokenType: string = "Bearer"): void {
    TokenStorage.setToken(token, tokenType);
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    TokenStorage.clearToken();
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!TokenStorage.getToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export error class and type for type checking
export { ApiClientError };
export type { ApiClient };
