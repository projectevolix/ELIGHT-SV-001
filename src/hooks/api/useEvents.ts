"use client";

import { useQuery } from "@tanstack/react-query";
import { eventKeys } from "@/lib/query-keys";
import {
  fetchAllEvents,
  fetchEventById,
  fetchEventsByTournament,
  fetchEventsByStatus,
} from "@/services/events.service";
import { EventDTO, EventStatus } from "@/types/api/events";

/**
 * Fetch all events with pagination
 */
export function useAllEvents(page: number = 1, limit: number = 10) {
  return useQuery<EventDTO[]>({
    queryKey: eventKeys.list(page, limit),
    queryFn: () => fetchAllEvents(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single event by ID
 */
export function useEventById(id: number | null | undefined) {
  return useQuery<EventDTO>({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEventById(id!),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch events for a specific tournament
 */
export function useEventsByTournament(
  tournamentId: number | null,
  page: number = 1,
  limit: number = 10
) {
  return useQuery<EventDTO[]>({
    queryKey: eventKeys.byTournamentList(tournamentId || 0, page, limit),
    queryFn: () => fetchEventsByTournament(tournamentId!, page, limit),
    enabled: tournamentId !== null && tournamentId !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch events filtered by status
 */
export function useEventsByStatus(
  status: EventStatus,
  page: number = 1,
  limit: number = 10
) {
  return useQuery<EventDTO[]>({
    queryKey: eventKeys.status(status, page, limit),
    queryFn: () => fetchEventsByStatus(status, page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
