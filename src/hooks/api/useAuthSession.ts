/**
 * Hook for session expiry notifications and auto-logout
 * Warns user before session expires and automatically logs out when expired
 */

"use client";

import { useEffect, useRef } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useToast } from "@/hooks/use-toast";

interface UseAuthSessionWarningOptions {
  warningThreshold?: number; // ms before expiry to show warning (default: 5 minutes)
  autoLogoutOnExpiry?: boolean; // Auto logout when session expires (default: true)
}

export function useAuthSessionWarning({
  warningThreshold = 5 * 60 * 1000, // 5 minutes
  autoLogoutOnExpiry = true,
}: UseAuthSessionWarningOptions = {}) {
  const { isAuthenticated, timeUntilExpiry, logout } = useAuthSession();
  const { toast } = useToast();
  const warningShownRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !timeUntilExpiry) return;

    // Show warning if close to expiry
    if (timeUntilExpiry <= warningThreshold && !warningShownRef.current) {
      warningShownRef.current = true;
      const minutesRemaining = Math.floor(timeUntilExpiry / 60000);

      toast({
        title: "Session expiring soon",
        description: `Your session will expire in ${minutesRemaining} minute${
          minutesRemaining !== 1 ? "s" : ""
        }. Please save your work.`,
        variant: "default",
      });
    }

    // Auto logout when expired
    if (timeUntilExpiry <= 0 && autoLogoutOnExpiry) {
      toast({
        title: "Session expired",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      });
      logout();
    }
  }, [
    timeUntilExpiry,
    isAuthenticated,
    warningThreshold,
    autoLogoutOnExpiry,
    logout,
    toast,
  ]);
}
