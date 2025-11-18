"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getCoachInvalidationKeys, coachKeys } from "@/lib/query-keys";
import {
  createCoach,
  updateCoach,
  deleteCoach,
} from "@/services/coaches.service";
import {
  CoachDTO,
  CreateCoachPayload,
  UpdateCoachPayload,
} from "@/types/api/coaches";

/**
 * Create coach mutation
 */
export function useCreateCoach() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      associationId,
      payload,
    }: {
      associationId: number;
      payload: CreateCoachPayload;
    }) => createCoach(associationId, payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Coach created successfully.",
        variant: "default",
      });
      // Refetch coaches for this association
      queryClient.refetchQueries({
        queryKey: coachKeys.byAssociation(data.associationId),
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create coach.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update coach mutation
 */
export function useUpdateCoach() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      associationId,
      payload,
    }: {
      id: number;
      associationId: number;
      payload: UpdateCoachPayload;
    }) => updateCoach(id, associationId, payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Coach updated successfully.",
        variant: "default",
      });
      // Refetch coaches for this association
      queryClient.refetchQueries({
        queryKey: coachKeys.byAssociation(data.associationId),
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update coach.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete coach mutation
 */
export function useDeleteCoach() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      associationId,
    }: {
      id: number;
      associationId: number;
    }) => deleteCoach(id),
    onSuccess: (_, { id, associationId }) => {
      toast({
        title: "Success",
        description: "Coach deleted successfully.",
        variant: "default",
      });
      // Refetch coaches for this association
      queryClient.refetchQueries({
        queryKey: coachKeys.byAssociation(associationId),
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete coach.",
        variant: "destructive",
      });
    },
  });
}
