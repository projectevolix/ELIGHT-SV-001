import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTatami,
  fetchAllTatamis,
  fetchTatamisByTournament,
  fetchTatamiById,
  updateTatami,
  updateTatamiAvailability,
  deleteTatami,
  fetchTatamisByAvailability,
} from "@/services/tatamis.service";
import type {
  TatamiDTO,
  CreateTatamiPayload,
  UpdateTatamiPayload,
} from "@/types/api/tatamis";
import { useToast } from "@/hooks/use-toast";

const QUERY_KEYS = {
  all: ["tatamis"] as const,
  allTatamis: () => [...QUERY_KEYS.all, "all"] as const,
  byTournament: (tournamentId: number) =>
    [...QUERY_KEYS.all, "tournament", tournamentId] as const,
  byId: (id: number) => [...QUERY_KEYS.all, "id", id] as const,
  byStatus: (status: string, tournamentId?: number) =>
    [...QUERY_KEYS.all, "status", status, tournamentId] as const,
};

/**
 * Fetch all tatamis
 */
export function useAllTatamis() {
  return useQuery({
    queryKey: QUERY_KEYS.allTatamis(),
    queryFn: fetchAllTatamis,
  });
}

/**
 * Fetch tatamis by tournament
 */
export function useTatamisByTournament(tournamentId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.byTournament(tournamentId || 0),
    queryFn: () => fetchTatamisByTournament(tournamentId!),
    enabled: !!tournamentId,
  });
}

/**
 * Fetch tatami by ID
 */
export function useTatamiById(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.byId(id || 0),
    queryFn: () => fetchTatamiById(id!),
    enabled: !!id,
  });
}

/**
 * Fetch tatamis by availability status
 */
export function useTatamisByStatus(status: string, tournamentId?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.byStatus(status, tournamentId),
    queryFn: () => fetchTatamisByAvailability(status, tournamentId),
  });
}

/**
 * Create tatami mutation
 */
export function useCreateTatami() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateTatamiPayload) => createTatami(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byTournament(data.tournamentId),
      });
      toast({
        title: "Success",
        description: "Tatami created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create tatami",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update tatami mutation
 */
export function useUpdateTatami() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTatamiPayload;
    }) => updateTatami(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byTournament(data.tournamentId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byId(data.id) });
      toast({
        title: "Success",
        description: "Tatami updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update tatami",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update tatami availability mutation
 */
export function useUpdateTatamiAvailability() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateTatamiAvailability(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.byTournament(data.tournamentId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byId(data.id) });
      toast({
        title: "Success",
        description: "Tatami availability updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to update tatami availability",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete tatami mutation
 */
export function useDeleteTatami() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => deleteTatami(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      toast({
        title: "Success",
        description: "Tatami deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete tatami",
        variant: "destructive",
      });
    },
  });
}
