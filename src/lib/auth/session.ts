/**
 * Session management utilities
 * Handles secure token storage with cookies and localStorage fallback
 * Industrial-grade approach with expiration validation
 */

import { cookies } from "next/headers";

interface SessionData {
  token: string;
  expiresAt: number;
  tokenType: string;
}

export class SessionManager {
  private static readonly TOKEN_COOKIE = "auth_token";
  private static readonly EXPIRY_COOKIE = "auth_token_expires";
  private static readonly TYPE_COOKIE = "auth_token_type";

  /**
   * Create a secure session with token
   * Uses httpOnly cookies for security (server-side) + localStorage (client-side)
   */
  static async createSession(
    token: string,
    expiresIn: number = 86400000
  ): Promise<void> {
    const expiresAt = Date.now() + expiresIn; // Default: 24 hours
    const tokenType = "Bearer";

    // Server-side: Set secure httpOnly cookies (can't be accessed by JavaScript)
    try {
      const cookieStore = await cookies();
      cookieStore.set(this.TOKEN_COOKIE, token, {
        httpOnly: true, // Can't be accessed by client JS (XSS protection)
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // CSRF protection
        path: "/",
        maxAge: expiresIn / 1000, // Convert to seconds
      });

      cookieStore.set(this.EXPIRY_COOKIE, expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: expiresIn / 1000,
      });

      cookieStore.set(this.TYPE_COOKIE, tokenType, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: expiresIn / 1000,
      });
    } catch (error) {
      // Graceful fallback for client components (cookies() is server-only)
      console.warn(
        "Failed to set httpOnly cookies, using localStorage fallback"
      );
    }

    // Client-side: Also store in localStorage (for client-side requests)
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_COOKIE, token);
      localStorage.setItem(this.EXPIRY_COOKIE, expiresAt.toString());
      localStorage.setItem(this.TYPE_COOKIE, tokenType);
    }
  }

  /**
   * Get current session data
   * Checks cookies first (server), then localStorage (client)
   */
  static async getSession(): Promise<SessionData | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(this.TOKEN_COOKIE)?.value;
      const expiresAtStr = cookieStore.get(this.EXPIRY_COOKIE)?.value;
      const tokenType = cookieStore.get(this.TYPE_COOKIE)?.value || "Bearer";

      if (!token || !expiresAtStr) return null;

      const expiresAt = parseInt(expiresAtStr, 10);

      // Check if session has expired
      if (Date.now() > expiresAt) {
        await this.destroySession();
        return null;
      }

      return { token, expiresAt, tokenType };
    } catch (error) {
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(this.TOKEN_COOKIE);
        const expiresAtStr = localStorage.getItem(this.EXPIRY_COOKIE);
        const tokenType = localStorage.getItem(this.TYPE_COOKIE) || "Bearer";

        if (!token || !expiresAtStr) return null;

        const expiresAt = parseInt(expiresAtStr, 10);

        if (Date.now() > expiresAt) {
          this.clearLocalStorageSession();
          return null;
        }

        return { token, expiresAt, tokenType };
      }

      return null;
    }
  }

  /**
   * Check if session is still valid
   */
  static async isSessionValid(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  /**
   * Destroy session (logout)
   * Clears both cookies and localStorage
   */
  static async destroySession(): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(this.TOKEN_COOKIE);
      cookieStore.delete(this.EXPIRY_COOKIE);
      cookieStore.delete(this.TYPE_COOKIE);
    } catch (error) {
      console.warn("Failed to delete httpOnly cookies");
    }

    // Also clear localStorage
    if (typeof window !== "undefined") {
      this.clearLocalStorageSession();
    }
  }

  /**
   * Clear localStorage session (client-side)
   */
  private static clearLocalStorageSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_COOKIE);
      localStorage.removeItem(this.EXPIRY_COOKIE);
      localStorage.removeItem(this.TYPE_COOKIE);
    }
  }

  /**
   * Get remaining time before expiration (in milliseconds)
   */
  static async getTimeUntilExpiry(): Promise<number | null> {
    const session = await this.getSession();
    if (!session) return null;

    const remaining = session.expiresAt - Date.now();
    return remaining > 0 ? remaining : null;
  }

  /**
   * Refresh session (extend expiry time)
   * Useful for keeping user logged in during activity
   */
  static async refreshSession(expiresIn: number = 86400000): Promise<void> {
    const session = await this.getSession();
    if (session) {
      await this.createSession(session.token, expiresIn);
    }
  }
}
