/**
 * Next.js Middleware Entry Point
 *
 * This file is required by Next.js at the root of src/
 * It composes and exports middleware from modular middleware functions
 *
 * See: src/middleware/auth.ts for authentication middleware logic
 */

import { NextRequest } from "next/server";
import { authMiddleware } from "./middleware/auth";

/**
 * Main middleware handler
 * Composes all middleware functions
 *
 * Order matters: auth runs first to ensure token validation
 * before any other middleware checks
 */
export function middleware(request: NextRequest) {
  // Run authentication middleware
  return authMiddleware(request);
}

/**
 * Middleware matcher configuration
 * Specifies which routes trigger middleware execution
 * Exclude static files, api routes, and _next internal routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     *
     * This ensures middleware runs on all app routes but skips technical paths
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
