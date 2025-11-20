/**
 * Tournament mutation hooks
 * React Query hooks for creating, updating, and deleting tournaments
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTournament,
  updateTournament,
  updateTournamentStatus,
  deleteTournament,
  resendAdminInvite,
} from "@/services/tournaments.service";
import { getTournamentInvalidationKeys } from "@/lib/query-keys";
import { useToast } from "@/hooks/use-toast";
import type {
  CreateTournamentRequest,
  UpdateTournamentRequest,
  TournamentStatus,
} from "@/types/api/tournaments";

/**
 * Hook for creating a new tournament
 */
export function useCreateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTournamentRequest) => createTournament(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
      // Invalidate all tournament-related queries to show the new tournament
      const invalidationKeys = getTournamentInvalidationKeys();
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create tournament",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating an existing tournament
 */
export function useUpdateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateTournamentRequest;
    }) => updateTournament(id, data),
    onSuccess: (updatedTournament) => {
      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
      // Invalidate all tournament-related queries to show the updated tournament
      const invalidationKeys = getTournamentInvalidationKeys(updatedTournament.id);
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update tournament",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating tournament status
 */
export function useUpdateTournamentStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: TournamentStatus;
    }) => updateTournamentStatus(id, status),
    onSuccess: (updatedTournament) => {
      toast({
        title: "Success",
        description: "Tournament status updated successfully",
      });
      // Invalidate all tournament-related queries to show the updated status
      const invalidationKeys = getTournamentInvalidationKeys(updatedTournament.id, updatedTournament.status);
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting a tournament
 */
export function useDeleteTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => deleteTournament(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tournament deleted successfully",
      });
      // Invalidate all tournament-related queries to remove the deleted tournament
      const invalidationKeys = getTournamentInvalidationKeys();
      invalidationKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete tournament",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for resending admin invitation email
 */
export function useResendAdminInvite() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (tournamentId: string | number) =>
      resendAdminInvite(tournamentId),
    onSuccess: (response) => {
      if (response.status === "SENT" || response.status === "PENDING") {
        toast({
          title: "Success",
          description: "Admin invitation email sent successfully",
        });
      } else if (response.status === "FAILED") {
        toast({
          title: "Email Failed",
          description:
            response.errorMessage ||
            "Failed to send invitation email. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend invitation",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
}
