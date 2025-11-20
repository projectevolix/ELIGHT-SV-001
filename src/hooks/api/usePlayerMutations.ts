/**
 * Players API Mutations
 * React Query hooks for player mutations (create, update, delete)
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getPlayerInvalidationKeys, playerKeys } from "@/lib/query-keys";
import {
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "@/services/players.service";
import type {
  CreatePlayerPayload,
  UpdatePlayerPayload,
} from "@/types/api/players";

/**
 * Create player mutation
 */
export function useCreatePlayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      associationId,
      payload,
    }: {
      associationId: number;
      payload: CreatePlayerPayload;
    }) => createPlayer(associationId, payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Player created successfully.",
        variant: "default",
      });
      // Refetch players for this association
      queryClient.refetchQueries({
        queryKey: playerKeys.byAssociation(data.associationId),
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create player.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update player mutation
 */
export function useUpdatePlayer() {
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
      payload: UpdatePlayerPayload;
    }) => updatePlayer(id, associationId, payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Player updated successfully.",
        variant: "default",
      });
      // Refetch players for this association
      queryClient.refetchQueries({
        queryKey: playerKeys.byAssociation(data.associationId),
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update player.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete player mutation
 */
export function useDeletePlayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deletePlayer(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Player deleted successfully.",
        variant: "default",
      });
      // Refetch all player queries
      queryClient.refetchQueries({
        queryKey: playerKeys.all,
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete player.",
        variant: "destructive",
      });
    },
  });
}
