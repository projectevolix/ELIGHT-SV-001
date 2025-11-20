"use client";

import { useQuery } from "@tanstack/react-query";
import { coachKeys } from "@/lib/query-keys";
import {
  fetchAllCoaches,
  fetchCoachById,
  fetchCoachesByAssociation,
} from "@/services/coaches.service";
import { CoachDTO } from "@/types/api/coaches";
import type { EntityId } from "@/types/api/common";

/**
 * Fetch all coaches with pagination
 */
export function useAllCoaches(page: number = 1, limit: number = 10) {
  return useQuery<CoachDTO[]>({
    queryKey: coachKeys.list(page, limit),
    queryFn: () => fetchAllCoaches(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single coach by ID
 */
export function useCoachById(id: EntityId | null | undefined) {
  return useQuery<CoachDTO>({
    queryKey: coachKeys.detail(id as number),
    queryFn: () => fetchCoachById(id as number),
    enabled: id !== null && id !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch coaches for a specific association
 */
export function useCoachesByAssociation(
  associationId: EntityId | null | undefined,
  page: number = 1,
  limit: number = 10
) {
  return useQuery<CoachDTO[]>({
    queryKey: coachKeys.byAssociationList(associationId as number, page, limit),
    queryFn: () =>
      fetchCoachesByAssociation(associationId as number, page, limit),
    enabled: associationId !== null && associationId !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
