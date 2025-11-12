/**
 * Association query hooks
 * React Query hooks for fetching association data
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAssociations,
  searchAssociations,
  fetchAssociation,
  fetchAssociationsByProvince,
} from "@/services/associations.service";
import { associationKeys } from "@/lib/query-keys";
import type {
  Association,
  SearchAssociationsParams,
} from "@/types/api/associations";

interface UseAssociationsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch all associations
 * Uses React Query for caching and automatic refetching
 */
export function useAssociations(options?: UseAssociationsOptions) {
  return useQuery({
    queryKey: associationKeys.list(),
    queryFn: () => fetchAssociations(),
    enabled: options?.enabled ?? true,
  });
}

interface UseAssociationOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch a single association by ID
 */
export function useAssociation(
  id: string | number | null | undefined,
  options?: UseAssociationOptions
) {
  return useQuery({
    queryKey: associationKeys.detail(id ?? "unknown"),
    queryFn: () => {
      if (!id) throw new Error("Association ID is required");
      return fetchAssociation(id);
    },
    enabled: (options?.enabled ?? true) && !!id,
  });
}

interface UseSearchAssociationsOptions {
  enabled?: boolean;
}

/**
 * Hook to search associations by name
 */
export function useSearchAssociations(
  params: SearchAssociationsParams | null,
  options?: UseSearchAssociationsOptions
) {
  return useQuery({
    queryKey: params
      ? associationKeys.search(params.name)
      : associationKeys.searches(),
    queryFn: () => {
      if (!params) throw new Error("Search parameters are required");
      return searchAssociations(params);
    },
    enabled: (options?.enabled ?? true) && !!params,
  });
}

interface UseFetchAssociationsByProvinceOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch associations by province
 */
export function useAssociationsByProvince(
  province: string | null,
  options?: UseFetchAssociationsByProvinceOptions
) {
  return useQuery({
    queryKey: associationKeys.province(province ?? "unknown"),
    queryFn: () => {
      if (!province) throw new Error("Province is required");
      return fetchAssociationsByProvince(province);
    },
    enabled: (options?.enabled ?? true) && !!province,
  });
}
