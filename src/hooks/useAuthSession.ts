/**
 * Hook for managing authentication session
 * Handles token storage, expiration, and cleanup
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getCurrentToken,
  isAuthenticated,
  getTimeUntilExpiry,
  clearAuthToken,
} from "@/lib/auth/client";

interface AuthSessionState {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: Date | null;
  timeUntilExpiry: number | null;
  isLoading: boolean;
}

export function useAuthSession() {
  const [state, setState] = useState<AuthSessionState>({
    isAuthenticated: false,
    token: null,
    expiresAt: null,
    timeUntilExpiry: null,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const token = getCurrentToken();
    const authenticated = isAuthenticated();
    const timeUntilExpiry = getTimeUntilExpiry();

    setState({
      isAuthenticated: authenticated,
      token,
      expiresAt: timeUntilExpiry
        ? new Date(Date.now() + timeUntilExpiry)
        : null,
      timeUntilExpiry,
      isLoading: false,
    });
  }, []);

  // Update time until expiry every minute
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      const timeUntilExpiry = getTimeUntilExpiry();

      setState((prev) => ({
        ...prev,
        timeUntilExpiry,
        expiresAt: timeUntilExpiry
          ? new Date(Date.now() + timeUntilExpiry)
          : null,
      }));

      // If token has expired, clear it
      if (timeUntilExpiry === null) {
        clearAuthToken();
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          token: null,
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthToken();
    setState({
      isAuthenticated: false,
      token: null,
      expiresAt: null,
      timeUntilExpiry: null,
      isLoading: false,
    });
  }, []);

  return { ...state, logout };
}
