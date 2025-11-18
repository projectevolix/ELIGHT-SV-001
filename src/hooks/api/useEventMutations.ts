"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { eventKeys } from "@/lib/query-keys";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
} from "@/services/events.service";
import {
  EventDTO,
  CreateEventPayload,
  UpdateEventPayload,
  EventStatus,
} from "@/types/api/events";

/**
 * Create event mutation
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      tournamentId,
      payload,
    }: {
      tournamentId: number;
      payload: CreateEventPayload;
    }) => createEvent(tournamentId, payload),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event created successfully.",
        variant: "default",
      });
      // Auto-refresh all event queries
      queryClient.refetchQueries({
        queryKey: eventKeys.all,
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create event.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update event mutation
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      tournamentId,
      payload,
    }: {
      id: number;
      tournamentId: number;
      payload: UpdateEventPayload;
    }) => updateEvent(id, tournamentId, payload),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event updated successfully.",
        variant: "default",
      });
      // Auto-refresh all event queries
      queryClient.refetchQueries({
        queryKey: eventKeys.all,
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update event.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete event mutation
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event deleted successfully.",
        variant: "default",
      });
      // Auto-refresh all event queries
      queryClient.refetchQueries({
        queryKey: eventKeys.all,
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete event.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update event status mutation
 */
export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: EventStatus }) =>
      updateEventStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event status updated successfully.",
        variant: "default",
      });
      // Auto-refresh all event queries
      queryClient.refetchQueries({
        queryKey: eventKeys.all,
        type: "all",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update event status.",
        variant: "destructive",
      });
    },
  });
}
