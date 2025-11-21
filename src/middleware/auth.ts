/**
 * Authentication middleware
 * Handles protected routes, token validation, and redirects
 * Runs on every request before reaching route handlers
 */

import { NextRequest, NextResponse } from "next/server";

// Public routes (don't require authentication)
// These routes can be accessed without a token
const PUBLIC_ROUTES = ["/login", "/signup"];

// Protected routes (require authentication)
// These routes redirect to /login if no valid token is present
const PROTECTED_ROUTES = [
  "/associations",
  "/tournaments",
  "/draws",
  "/player-rankings",
  "/registration",
  "/", // Dashboard/root route is protected
];

/**
 * Checks if a route is public
 * Returns true if pathname matches any public route
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

/**
 * Checks if a route is protected
 * Returns true if pathname matches any protected route
 */
function isProtectedRoute(pathname: string): boolean {
  // Check exact match for root route
  if (pathname === "/") return true;

  // Check prefix match for other protected routes
  // Note: Route groups like /(root) don't appear in pathname,
  // so we just match the actual URL path
  return PROTECTED_ROUTES.some(
    (route) => route !== "/" && pathname.startsWith(route)
  );
}

/**
 * Main authentication middleware function
 */
export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  // The token is set as httpOnly cookie during login
  const token = request.cookies.get("auth_token")?.value;
  const hasValidToken = !!token;

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute(pathname) && !hasValidToken) {
    const loginUrl = new URL("/login", request.url);
    // Add return_to param to redirect back after login
    loginUrl.searchParams.set("return_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing public auth routes with valid token, redirect to dashboard
  if (isPublicRoute(pathname) && hasValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}
