/**
 * Association mutation hooks
 * React Query hooks for modifying association data (create, update, delete)
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAssociation,
  updateAssociation,
  deleteAssociation,
} from "@/services/associations.service";
import {
  associationKeys,
  getAssociationInvalidationKeys,
} from "@/lib/query-keys";
import type {
  Association,
  CreateAssociationRequest,
  UpdateAssociationRequest,
} from "@/types/api/associations";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for creating a new association
 * Invalidates associations list on success
 */
export function useCreateAssociation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAssociationRequest) => createAssociation(data),
    onSuccess: (newAssociation: Association) => {
      // Invalidate relevant queries to refetch
      queryClient.invalidateQueries({
        queryKey: associationKeys.lists(),
      });

      toast({
        title: "Success",
        description: "Association created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create association",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating an association
 * Invalidates the specific association and list queries on success
 */
export function useUpdateAssociation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateAssociationRequest;
    }) => updateAssociation(id, data),
    onSuccess: (updatedAssociation: Association) => {
      // Invalidate all association queries
      const invalidationKeys = getAssociationInvalidationKeys(
        updatedAssociation.id
      );
      for (const key of invalidationKeys) {
        queryClient.invalidateQueries({ queryKey: key as any });
      }

      toast({
        title: "Success",
        description: "Association updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update association",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting an association
 * Invalidates the associations list on success
 */
export function useDeleteAssociation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => deleteAssociation(id),
    onSuccess: (_, deletedId: string | number) => {
      // Invalidate all association queries
      const invalidationKeys = getAssociationInvalidationKeys(deletedId);
      for (const key of invalidationKeys) {
        queryClient.invalidateQueries({ queryKey: key as any });
      }

      toast({
        title: "Success",
        description: "Association deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete association",
        variant: "destructive",
      });
    },
  });
}
