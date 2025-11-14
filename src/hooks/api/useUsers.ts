/**
 * Users query hooks
 * React Query hooks for fetching user data (admin only)
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUser,
  fetchCurrentUser,
  searchUsers,
} from "@/services/users.service";
import { userKeys } from "@/lib/query-keys";
import type { User, SearchUsersParams } from "@/types/api/users";

/**
 * Hook for fetching all users (admin only)
 * Lists all users in the system
 */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => fetchUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single user by ID (admin only)
 */
export function useUser(id: string | number | null | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id!),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching current authenticated user
 * Useful for getting current user data, roles, permissions
 */
export function useCurrentUser() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => fetchCurrentUser(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
}

/**
 * Hook for searching users by name or email (admin only)
 */
export function useSearchUsers(params: SearchUsersParams, enabled = true) {
  return useQuery({
    queryKey: userKeys.search(params.q),
    queryFn: () => searchUsers(params),
    enabled: enabled && params.q.length > 0,
    staleTime: 1000 * 60, // 1 minute (search is more dynamic)
  });
}
