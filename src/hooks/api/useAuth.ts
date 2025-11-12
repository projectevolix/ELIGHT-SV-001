/**
 * Auth hooks
 * React Query hooks for authentication
 */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, signupUser, logoutUser } from "@/services/auth.service";
import { authKeys } from "@/lib/query-keys";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for user login
 * Mutation that stores token on success
 */
export function useLogin() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data: LoginResponse) => {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error?.message || "An error occurred during login",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for user signup
 */
export function useSignup() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: SignupRequest) => signupUser(credentials),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error?.message || "An error occurred during signup",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      logoutUser();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
  });
}
