"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { drawKeys, getDrawInvalidationKeys } from "@/lib/query-keys";
import {
  fetchDrawByTournamentAndEvent,
  publishDraw,
} from "@/services/draws.service";
import { DrawDTO, PublishDrawPayload } from "@/types/api/draws";

/**
 * Fetch draw for a specific tournament and event
 */
export function useDrawByTournamentAndEvent(
  tournamentId: number | null,
  eventId: number | null
) {
  return useQuery<DrawDTO>({
    queryKey: drawKeys.byTournamentAndEvent(tournamentId || 0, eventId || 0),
    queryFn: () => fetchDrawByTournamentAndEvent(tournamentId!, eventId!),
    enabled:
      tournamentId !== null &&
      tournamentId !== undefined &&
      eventId !== null &&
      eventId !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Publish a draw mutation
 */
export function usePublishDraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { drawId: string; payload?: PublishDrawPayload }) =>
      publishDraw(variables.drawId, variables.payload),
    onSuccess: (data) => {
      // Invalidate draw queries
      queryClient.invalidateQueries({
        queryKey: drawKeys.lists(),
      });
    },
  });
}
