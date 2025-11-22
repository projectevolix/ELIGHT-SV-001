import { apiClient } from "@/lib/api/client";
import type {
  TatamiDTO,
  CreateTatamiPayload,
  UpdateTatamiPayload,
} from "@/types/api/tatamis";

const API_BASE = "/tatamis";

/**
 * Create a new tatami
 */
export async function createTatami(
  payload: CreateTatamiPayload
): Promise<TatamiDTO> {
  const response = await apiClient.post<any>(`${API_BASE}`, payload);
  return response.data;
}

/**
 * Get all tatamis
 */
export async function fetchAllTatamis(): Promise<TatamiDTO[]> {
  const response = await apiClient.get<TatamiDTO[]>(API_BASE);
  return response;
}

/**
 * Get tatamis by tournament
 */
export async function fetchTatamisByTournament(
  tournamentId: number
): Promise<TatamiDTO[]> {
  const response = await apiClient.get<TatamiDTO[]>(
    `${API_BASE}/tournament/${tournamentId}`
  );
  return response;
}

/**
 * Get tatami by ID
 */
export async function fetchTatamiById(id: number): Promise<TatamiDTO> {
  const response = await apiClient.get<any>(`${API_BASE}/${id}`);
  return response.data;
}

/**
 * Update tatami
 */
export async function updateTatami(
  id: number,
  payload: UpdateTatamiPayload
): Promise<TatamiDTO> {
  const response = await apiClient.put<any>(`${API_BASE}/${id}`, payload);
  return response.data;
}

/**
 * Update tatami availability status
 */
export async function updateTatamiAvailability(
  id: number,
  status: string
): Promise<TatamiDTO> {
  const response = await apiClient.put<any>(
    `${API_BASE}/${id}/availability?status=${status}`,
    {}
  );
  return response.data;
}

/**
 * Delete tatami
 */
export async function deleteTatami(id: number): Promise<void> {
  await apiClient.delete(`${API_BASE}/${id}`);
}

/**
 * Get tatamis by availability status
 */
export async function fetchTatamisByAvailability(
  status: string,
  tournamentId?: number
): Promise<TatamiDTO[]> {
  const url = new URL(`${API_BASE}/availability/${status}`, "http://localhost");
  if (tournamentId) {
    url.searchParams.append("tournamentId", tournamentId.toString());
  }
  const response = await apiClient.get<TatamiDTO[]>(
    `${API_BASE}/availability/${status}${
      tournamentId ? `?tournamentId=${tournamentId}` : ""
    }`
  );
  return response;
}
