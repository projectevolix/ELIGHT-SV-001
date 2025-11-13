/**
 * Auth API types
 * Request/response shapes for login and signup endpoints
 */

import type { DateString } from "./common";

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response data (inside ApiResponse.data)
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn?: number; // Token expiration in milliseconds (optional)
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Signup response data (inside ApiResponse.data)
 */
export interface SignupResponse {
  success: boolean;
  message: string;
}

/**
 * Auth state stored in client
 */
export interface AuthState {
  accessToken: string | null;
  tokenType: "Bearer" | null;
  isAuthenticated: boolean;
}

/**
 * Decoded JWT claims (minimal for now, expand as needed)
 */
export interface JwtClaims {
  sub: string; // user id
  iat: number; // issued at
  exp: number; // expiration
}
