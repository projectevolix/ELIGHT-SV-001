"use client";

import { useQuery } from "@tanstack/react-query";
import { playerKeys } from "@/lib/query-keys";
import {
  getPlayers,
  getPlayersByAssociation,
  getPlayerById,
} from "@/services/players.service";
import type { PlayerDTO } from "@/types/api/players";

/**
 * Fetch all players with pagination
 */
export function usePlayers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: playerKeys.list(page, limit),
    queryFn: () => getPlayers(page, limit),
  });
}

/**
 * Fetch players for a specific association
 */
export function usePlayersByAssociation(
  associationId: number | null,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: playerKeys.byAssociationList(associationId!, page, limit),
    queryFn: () => getPlayersByAssociation(associationId!, page, limit),
    enabled: !!associationId,
  });
}

/**
 * Fetch a single player by ID
 */
export function usePlayerById(id: number | null) {
  return useQuery({
    queryKey: playerKeys.detail(id),
    queryFn: () => getPlayerById(id!),
    enabled: !!id,
  });
}
