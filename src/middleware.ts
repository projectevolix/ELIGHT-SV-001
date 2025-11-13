/**
 * Next.js Middleware for authentication
 * Handles protected routes, token validation, and redirects
 * Runs on every request before reaching route handlers
 */

import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup"];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/associations",
  "/tournaments",
  "/draws",
  "/player-rankings",
  "/registration",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies (secure, httpOnly) or localStorage fallback
  const token = request.cookies.get("auth_token")?.value;

  // Check if current path is public or protected
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(`/(root)${route}`)
  );

  // Redirect logic
  if (isProtectedRoute && !token) {
    // No token and trying to access protected route → redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && token) {
    // Has token and trying to access login/signup → redirect to dashboard
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

/**
 * Configure middleware to run on specific paths
 * Exclude static files, api routes, and _next internal routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
