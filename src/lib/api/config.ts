/**
 * API configuration and constants
 * Centralized configuration for API endpoints and defaults
 */

/**
 * Base URL for the API
 * Read from environment variable, fallback to localhost for development
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api/v1/sv-backend-service";

/**
 * API endpoint paths
 */
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
  },
  ASSOCIATIONS: {
    LIST: "/associations",
    SEARCH: "/associations/search",
    BY_PROVINCE: "/associations/province",
    GET: (id: string | number) => `/associations/${id}`,
    CREATE: "/associations",
    UPDATE: (id: string | number) => `/associations/${id}`,
    DELETE: (id: string | number) => `/associations/${id}`,
  },
} as const;

/**
 * Default timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000, // 60 seconds for file uploads
} as const;

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 10000,
  BACKOFF_MULTIPLIER: 2,
} as const;
