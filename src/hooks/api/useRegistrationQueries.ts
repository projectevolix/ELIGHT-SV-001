"use client";

import { useQuery } from "@tanstack/react-query";
import { registrationKeys } from "@/lib/query-keys";
import {
  getRegistrations,
  getRegistrationsByTournament,
  getRegistrationsByPlayer,
  getRegistrationsByEvent,
  getRegistrationById,
} from "@/services/registrations.service";

/**
 * Fetch all registrations with pagination
 */
export function useRegistrations(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: registrationKeys.list(page, limit),
    queryFn: () => getRegistrations(page, limit),
  });
}

/**
 * Fetch registrations for a specific tournament
 */
export function useRegistrationsByTournament(
  tournamentId: number | null,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: registrationKeys.byTournamentList(tournamentId!, page, limit),
    queryFn: () => getRegistrationsByTournament(tournamentId!, page, limit),
    enabled: !!tournamentId,
  });
}

/**
 * Fetch registrations for a specific player
 */
export function useRegistrationsByPlayer(
  playerId: number | null,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: registrationKeys.byPlayerList(playerId!, page, limit),
    queryFn: () => getRegistrationsByPlayer(playerId!, page, limit),
    enabled: !!playerId,
  });
}

/**
 * Fetch registrations for a specific event
 */
export function useRegistrationsByEvent(
  eventId: number | null,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: registrationKeys.byEventList(eventId!, page, limit),
    queryFn: () => getRegistrationsByEvent(eventId!, page, limit),
    enabled: !!eventId,
  });
}

/**
 * Fetch a single registration by ID
 */
export function useRegistrationById(id: number | null) {
  return useQuery({
    queryKey: registrationKeys.detail(id),
    queryFn: () => getRegistrationById(id!),
    enabled: !!id,
  });
}
