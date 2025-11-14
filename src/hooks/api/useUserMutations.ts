/**
 * Users mutation hooks
 * React Query hooks for modifying user data (admin only)
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, deleteUser } from "@/services/users.service";
import { userKeys, getUserInvalidationKeys } from "@/lib/query-keys";
import type { User, UpdateUserRequest } from "@/types/api/users";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for updating a user (admin only)
 * Invalidates the specific user and user list queries on success
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateUserRequest;
    }) => updateUser(id, data),
    onSuccess: (updatedUser: User) => {
      // Update cache with new user data
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      // Invalidate user list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting a user (admin only)
 * Invalidates the users list on success
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => deleteUser(id),
    onSuccess: (_, deletedId: string | number) => {
      // Immediately update cache by removing the deleted user
      queryClient.setQueryData(userKeys.lists(), (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.filter((user: any) => user.id !== deletedId);
        }
        return oldData;
      });

      // Invalidate all user queries
      const invalidationKeys = getUserInvalidationKeys(deletedId);
      for (const key of invalidationKeys) {
        queryClient.invalidateQueries({ queryKey: key as any });
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });
}
