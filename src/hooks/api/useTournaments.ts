/**
 * Tournament query hooks
 * React Query hooks for fetching tournament data with pagination support
 */

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTournaments,
  fetchTournament,
  fetchTournamentsByStatus,
  fetchTournamentsByDateRange,
} from "@/services/tournaments.service";
import { tournamentKeys } from "@/lib/query-keys";
import type { Tournament, TournamentStatus } from "@/types/api/tournaments";

/**
 * Hook for fetching all tournaments with pagination
 */
export function useTournaments(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: tournamentKeys.list(page, limit),
    queryFn: () => fetchTournaments({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single tournament by ID
 */
export function useTournament(id: string | number | null | undefined) {
  return useQuery({
    queryKey: tournamentKeys.detail(id),
    queryFn: () => fetchTournament(id!),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching tournaments filtered by status with pagination
 */
export function useTournamentsByStatus(
  status: TournamentStatus,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: tournamentKeys.status(status, page, limit),
    queryFn: () => fetchTournamentsByStatus({ status, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching tournaments filtered by date range with pagination
 * Returns tournaments that overlap with the specified date range
 */
export function useTournamentsByDateRange(
  startDate: string,
  endDate: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: tournamentKeys.dateRange(startDate, endDate, page, limit),
    queryFn: () =>
      fetchTournamentsByDateRange({ startDate, endDate, page, limit }),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
