"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registrationKeys,
  getRegistrationInvalidationKeys,
} from "@/lib/query-keys";
import {
  createRegistration,
  updateRegistration,
  updateRegistrationStatus,
  deleteRegistration,
} from "@/services/registrations.service";
import type {
  CreateRegistrationPayload,
  UpdateRegistrationPayload,
  RegistrationDTO,
  RegistrationStatus,
} from "@/types/api/registrations";
import { useToast } from "@/hooks/use-toast";

/**
 * Create a new registration
 */
export function useCreateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateRegistrationPayload) =>
      createRegistration(payload),
    onSuccess: (data: RegistrationDTO) => {
      // Invalidate related registrations queries
      const invalidationKeys = getRegistrationInvalidationKeys(
        data.tournament.id,
        data.player.id,
        data.event.id
      );
      invalidationKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast({
        title: "Success",
        description: "Registration created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create registration",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update a registration
 */
export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateRegistrationPayload;
    }) => updateRegistration(id, payload),
    onSuccess: (data: RegistrationDTO) => {
      // Invalidate related registrations queries
      const invalidationKeys = getRegistrationInvalidationKeys(
        data.tournament.id,
        data.player.id,
        data.event.id
      );
      invalidationKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast({
        title: "Success",
        description: "Registration updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update registration",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update registration status
 */
export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: RegistrationStatus }) =>
      updateRegistrationStatus(id, status),
    onSuccess: (data: RegistrationDTO) => {
      // Invalidate related registrations queries
      const invalidationKeys = getRegistrationInvalidationKeys(
        data.tournament.id,
        data.player.id,
        data.event.id
      );
      invalidationKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast({
        title: "Success",
        description: `Registration ${data.status.toLowerCase()}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update registration status",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete a registration
 */
export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      tournamentId,
      playerId,
      eventId,
    }: {
      id: number;
      tournamentId: number;
      playerId: number;
      eventId: number;
    }) =>
      deleteRegistration(id).then(() => ({ tournamentId, playerId, eventId })),
    onSuccess: ({ tournamentId, playerId, eventId }) => {
      // Invalidate related registrations queries
      const invalidationKeys = getRegistrationInvalidationKeys(
        tournamentId,
        playerId,
        eventId
      );
      invalidationKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete registration",
        variant: "destructive",
      });
    },
  });
}
