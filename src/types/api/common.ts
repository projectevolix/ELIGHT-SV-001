/**
 * Common API types and utilities
 * Defines the standard response envelope, error shapes, and shared types across all API endpoints
 */

/**
 * Standard API response envelope from backend
 * All endpoints wrap responses in this structure
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
  httpStatus: number;
  count: number;
  success: boolean;
}

/**
 * Standardized error shape for normalized API errors
 * Used internally to represent errors consistently across the client
 */
export interface ApiError {
  status: number;
  code?: string;
  message: string;
  meta?: Record<string, unknown>;
}

/**
 * ID types for domain entities
 */
export type EntityId = number | string;

/**
 * ISO 8601 date string from backend
 */
export type DateString = string;

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * Common entity fields (timestamps)
 */
export interface EntityTimestamps {
  createdAt: DateString | null;
  updatedAt: DateString | null;
}
